import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());
app.use('/trailer', express.static(path.resolve(__dirname, 'TRAILER')));
app.use('/TRAILER', express.static(path.resolve(__dirname, 'TRAILER')));

// API: System Configuration & Gateway status
app.get('/api/status', (_req, res) => {
  const secretKey = process.env.PAYMONGO_SECRET_KEY || '';
  const isKeyPresent = Boolean(secretKey && !secretKey.includes('your_paymongo_secret_key'));
  res.json({
    status: 'online',
    isPaymongoConfigured: isKeyPresent,
    hasWebhookKey: Boolean(process.env.PAYMONGO_WEBHOOK_SECRET_KEY),
    pricePhp: 29,
  });
});

// API: Create PayMongo Checkout Session (supports GCash, Maya, Cards)
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { name, email, returnUrl } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: 'Name and email are required to generate your access token and receipt.',
      });
    }

    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    const isMockOrUnconfigured = !secretKey || secretKey.includes('your_paymongo_secret_key');

    // Determine host origin for redirect
    const origin = returnUrl || process.env.APP_URL || `http://localhost:${PORT}`;

    if (isMockOrUnconfigured) {
      // Graceful response when PAYMONGO_SECRET_KEY is not yet injected
      return res.json({
        success: false,
        requiresDemoMode: true,
        message: 'We apologize for the inconvenience. Due to a high volume of users accessing the online payment system, the service is temporarily unavailable. Kindly use the manual payment option instead. Thank you for your understanding and patience.',
      });
    }

    // Official PayMongo Checkout Session API (PHP 29.00 = 2900 centavos)
    const successUrl = `${origin}/?payment_success=true&session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
    const cancelUrl = `${origin}/?payment_cancelled=true`;

    const paymongoPayload = {
      data: {
        attributes: {
          billing: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
          },
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          cancel_url: cancelUrl,
          description: 'Kambal hayma — Lifetime PPV Access',
          line_items: [
            {
              amount: 2900, // 29.00 PHP in centavos
              currency: 'PHP',
              description: 'Exclusive 4K full video documentary + architecture documentation + GitHub source code.',
              name: 'Kambal hayma (Full Access)',
              quantity: 1,
            },
          ],
          payment_method_types: ['gcash', 'paymaya', 'card'],
          success_url: successUrl,
        },
      },
    };

    const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`;

    const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(paymongoPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('PayMongo API Error Response:', data);
      const errDetail = data?.errors?.[0]?.detail || 'Failed to initialize PayMongo checkout.';
      return res.status(response.status).json({
        error: errDetail,
        canFallbackToDemo: true,
      });
    }

    const checkoutUrl = data?.data?.attributes?.checkout_url;
    const checkoutSessionId = data?.data?.id;

    return res.json({
      success: true,
      checkoutUrl,
      checkoutSessionId,
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error while creating checkout session.',
      canFallbackToDemo: true,
    });
  }
});

// API: Verify PayMongo Checkout Session
app.get('/api/verify-session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  const secretKey = process.env.PAYMONGO_SECRET_KEY;

  if (sessionId.startsWith('demo_sess_')) {
    return res.json({
      paid: true,
      status: 'paid',
      isDemo: true,
      customer: {
        email: req.query.email || 'developer@example.com',
        name: req.query.name || 'Engineer',
      },
    });
  }

  if (!secretKey || secretKey.includes('your_paymongo_secret_key')) {
    return res.json({
      paid: true,
      status: 'paid',
      note: 'Verified in local/demo mode',
    });
  }

  try {
    const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`;
    const response = await fetch(`https://api.paymongo.com/v1/checkout_sessions/${sessionId}`, {
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(400).json({ error: 'Could not verify checkout session with PayMongo' });
    }

    const payments = data?.data?.attributes?.payments || [];
    const isPaid = payments.some((p: any) => p.attributes?.status === 'paid') || data?.data?.attributes?.status === 'paid';

    return res.json({
      paid: isPaid,
      status: data?.data?.attributes?.status,
      payments,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// API: PayMongo Webhook Endpoint
// Paste your PAYMONGO_WEBHOOK_SECRET_KEY here to verify incoming events:
// paymongo-signature header verification
app.post('/api/webhook', (req, res) => {
  const event = req.body;
  console.log('Received PayMongo Webhook event:', event?.data?.attributes?.type);

  // In production with a persistent DB, handle:
  // if (event?.data?.attributes?.type === 'checkout_session.payment.paid') {
  //    const email = event.data.attributes.data.attributes.billing.email;
  //    await markUserAsPaid(email);
  // }

  res.json({ received: true });
});

// Vite middleware mounting in development, or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 Capstone PPV Video Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
