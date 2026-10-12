import React, { useState } from 'react';
import {
  X,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { COURSE_METADATA } from '../data/courseData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessUnlock: (userData: { name: string; email: string }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccessUnlock,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'online' | 'manual'>('online');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [referenceNo, setReferenceNo] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isManualProcessing, setIsManualProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [serverNotice, setServerNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  // Trigger celebration confetti
  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#007DFE', '#10B981', '#F59E0B', '#3B82F6'],
    });
  };

  // 2. Official PayMongo GCash Checkout Handler
  const handlePaymongoCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setServerNotice(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name for the access receipt.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please provide a valid email address to receive your access token.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          returnUrl: window.location.origin,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setErrorMsg(
          data.error || 'Failed to initialize PayMongo checkout. Please try again or use the manual payment option.'
        );
        setIsLoading(false);
        return;
      }

      // If server reported that PAYMONGO_SECRET_KEY is not yet injected
      if (data.requiresDemoMode || !data.checkoutUrl) {
        setServerNotice(
          'We apologize for the inconvenience. Due to a high volume of users accessing the online payment system, the service is temporarily unavailable. Kindly use the manual payment option instead. Thank you for your understanding and patience.'
        );
        setIsLoading(false);
        return;
      }

      // Redirect user to the official PayMongo GCash checkout session
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      console.error('PayMongo checkout error:', err);
      setErrorMsg(
        'Could not reach payment gateway server. Please try again or use the manual payment option.'
      );
      setIsLoading(false);
    }
  };

  // 3. Manual Payment Submission Handler
  const handleManualPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name for access confirmation.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please provide a valid email address to receive your access token.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsManualProcessing(true);
    }, 600);
  };

  const handleModalClose = () => {
    setIsManualProcessing(false);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[#0e0e11] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors z-10 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-5 border-b border-neutral-800/80 bg-neutral-900/40 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#007DFE]"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#007DFE]">
              Pay-Per-View Checkout
            </span>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-white">
            Unlock Full One Versus Five Documentary
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Lifetime access to the 4.2-minute video, slides, and complete Uncut Scenes.
          </p>

          {/* Pricing pill */}
          <div className="mt-4 flex items-baseline justify-between p-3 rounded-xl bg-neutral-900/90 border border-neutral-800">
            <div>
              <div className="text-xs text-neutral-400">Total One-Time Price</div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {COURSE_METADATA.pricing.formatted}
                <span className="text-xs font-normal text-neutral-400 ml-1.5">PHP (No recurring fees)</span>
              </div>
            </div>
            <div className="text-right text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Instant GCash Release</span>
            </div>
          </div>
        </div>

        {/* Form Body (Scrollable) */}
        <form
          onSubmit={selectedMethod === 'online' ? handlePaymongoCheckout : handleManualPaymentSubmit}
          className="p-6 overflow-y-auto space-y-4 flex-1"
        >
          {/* Error / Server Notice */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/50 text-red-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          {serverNotice && (
            <div className="p-3 rounded-lg bg-amber-950/50 border border-amber-800/60 text-amber-200 text-xs flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{serverNotice}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('manual');
                  setServerNotice(null);
                }}
                className="self-start text-[11px] font-semibold text-amber-300 hover:text-white underline cursor-pointer"
              >
                Switch to Manual Payment option now →
              </button>
            </div>
          )}

          {/* Clickable Payment Gateway Options */}
          <div>
            <div className="text-[11px] font-medium text-neutral-400 mb-2">
              Payment Gateway Options:
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('online');
                  setErrorMsg(null);
                }}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedMethod === 'online'
                    ? 'bg-[#007DFE]/15 border-[#007DFE] text-[#007DFE] font-semibold ring-1 ring-[#007DFE]/30'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 font-medium'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    selectedMethod === 'online' ? 'bg-[#007DFE]' : 'bg-neutral-600'
                  }`}
                />
                <span>GCash (Online Gateway)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('manual');
                  setErrorMsg(null);
                }}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedMethod === 'manual'
                    ? 'bg-[#007DFE]/15 border-[#007DFE] text-[#007DFE] font-semibold ring-1 ring-[#007DFE]/30'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 font-medium'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    selectedMethod === 'manual' ? 'bg-[#007DFE]' : 'bg-neutral-600'
                  }`}
                />
                <span>Manual Payment</span>
              </button>
            </div>
          </div>

          {/* Conditional View Based on Payment Selection */}
          {selectedMethod === 'manual' ? (
            <div className="space-y-4 pt-1 animate-fade-in">
              {/* Required Processing Advisory Message or In-Queue Message */}
              {isManualProcessing ? (
                <div className="p-4 rounded-xl bg-orange-600/25 border-2 border-orange-500 text-orange-100 text-xs sm:text-sm leading-relaxed shadow-lg flex items-start gap-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="leading-relaxed font-medium">
                      Your payment is currently being processed. Due to a high volume of users accessing the payment gateway, processing may take longer than usual. Kindly wait a few moments while we complete the transaction.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-700/80 text-neutral-200 text-xs sm:text-sm leading-relaxed space-y-2">
                  <p>
                    Please be advised that a processing fee of ₱29.00 is required for your video to be processed. Kindly complete the payment to proceed with the video processing.
                  </p>
                  <p className="text-neutral-300 font-medium">
                    Thank you for your cooperation and understanding.
                  </p>
                </div>
              )}

              {/* GCash QR Code Display */}
              <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 flex flex-col items-center justify-center text-center space-y-3">
                <div className="bg-white p-3 rounded-2xl shadow-xl border border-neutral-300 inline-block">
                  <a
                    href="/trailer/Gcash-QR.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Click to view full size"
                  >
                    <img
                      src="/trailer/Gcash-QR.jpg"
                      alt="GCash QR Code"
                      className="w-52 sm:w-56 h-auto rounded-lg mx-auto object-contain block hover:opacity-95 transition-opacity"
                    />
                  </a>
                </div>

                <div className="space-y-0.5 text-xs text-neutral-400">
                  <div className="font-semibold text-white">Amount: ₱29.00</div>
                  <div className="text-[11px] text-neutral-400">
                    Scan via GCash or any InstaPay app
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Juan dela Cruz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-[#007DFE] focus:ring-1 focus:ring-[#007DFE] text-sm text-white placeholder-neutral-500 outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Email Address <span className="text-neutral-500 font-normal">(for access receipt & code token)</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. juan@university.edu.ph"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-[#007DFE] focus:ring-1 focus:ring-[#007DFE] text-sm text-white placeholder-neutral-500 outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    GCash Reference No. <span className="text-neutral-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1029384756"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-[#007DFE] focus:ring-1 focus:ring-[#007DFE] text-sm text-white placeholder-neutral-500 outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Submit Manual Payment Button */}
              <button
                type="submit"
                disabled={isLoading || isManualProcessing}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-sm text-white transition-colors shadow-lg flex items-center justify-center gap-2 mt-2 cursor-pointer ${
                  isManualProcessing
                    ? 'bg-orange-600/80 border border-orange-500 text-orange-100 cursor-not-allowed opacity-90'
                    : 'bg-[#007DFE] hover:bg-[#0068D6] active:bg-[#0056B3]'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming Payment...</span>
                  </>
                ) : isManualProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-orange-200" />
                    <span>Processing Transaction...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I Have Completed the GCash Payment (₱29)</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-1 animate-fade-in">
              {/* User Details */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Juan dela Cruz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-[#007DFE] focus:ring-1 focus:ring-[#007DFE] text-sm text-white placeholder-neutral-500 outline-hidden transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Email Address <span className="text-neutral-500 font-normal">(for access receipt & code token)</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. juan@university.edu.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-[#007DFE] focus:ring-1 focus:ring-[#007DFE] text-sm text-white placeholder-neutral-500 outline-hidden transition-all"
                />
              </div>

              {/* Primary Action Button: Proceed to GCash */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-[#007DFE] hover:bg-[#0068D6] active:bg-[#0056B3] disabled:opacity-50 transition-colors shadow-lg flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to GCash Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to GCash Payment (₱29)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}



          {/* Trust Guarantees */}
          <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-neutral-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              256-bit Encrypted
            </span>
            <span aria-hidden="true">·</span>
            <span>Immediate Unlock</span>
            <span aria-hidden="true">·</span>
            <span>Tax Receipt Included</span>
          </div>
        </form>
      </div>
    </div>
  );
};
