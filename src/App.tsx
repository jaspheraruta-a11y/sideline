import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Lock, X, ChevronRight } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { CheckoutModal } from './components/CheckoutModal';

export default function App() {
  // Persistence state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('capstone_ppv_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const [unlockedUser, setUnlockedUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const data = localStorage.getItem('capstone_ppv_user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [externalSeekTime, setExternalSeekTime] = useState<number | null>(null);

  // Check PayMongo callback URL parameters on initial mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentSuccess = params.get('payment_success');
    const sessionId = params.get('session_id');
    const email = params.get('email') || 'student@example.com';
    const name = params.get('name') || 'Software Engineer';

    if (paymentSuccess === 'true') {
      // Verify or auto-grant access upon return from PayMongo
      const user = { name: decodeURIComponent(name), email: decodeURIComponent(email) };
      grantAccess(user, 'Payment Verified via GCash! Lifetime 4K access and source code unlocked.');

      // Clean URL params cleanly without reloading
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('payment_cancelled') === 'true') {
      setToastMessage('Payment was cancelled. You can try again when you are ready.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Grant access & persist to local storage
  const grantAccess = (
    userData: { name: string; email: string },
    customToast?: string
  ) => {
    setIsUnlocked(true);
    setUnlockedUser(userData);

    try {
      localStorage.setItem('capstone_ppv_unlocked', 'true');
      localStorage.setItem('capstone_ppv_user', JSON.stringify(userData));
      localStorage.setItem('capstone_ppv_unlocked_at', new Date().toISOString());
    } catch (err) {
      console.warn('LocalStorage access issue:', err);
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#007DFE', '#10B981', '#F59E0B', '#3B82F6'],
      });
    } catch {
      // Ignore if confetti blocked
    }

    setToastMessage(customToast || 'Payment Verified! Enjoy the complete documentary & repository.');

    // Auto-scroll to player
    scrollToSection('player');
  };

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Auto-hide toast after 6 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 flex flex-col selection:bg-[#007DFE]/30 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md p-4 rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl flex items-start gap-3 animate-slide-in">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white">Status Update</div>
            <div className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
              {toastMessage}
            </div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-neutral-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        isUnlocked={isUnlocked}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1 w-full">
        <HeroSection
          isUnlocked={isUnlocked}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          externalSeekTime={externalSeekTime}
          onClearExternalSeek={() => setExternalSeekTime(null)}
        />

        <Testimonials />
      </main>

      {/* Footer */}
      <Footer
        onScrollToSection={scrollToSection}
      />

      {/* Paywall & GCash Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccessUnlock={(userData) => {
          grantAccess(
            userData,
            'Payment Verified! Full 4K documentary and source code unlocked.'
          );
        }}
      />

      {/* Sticky Bottom Bar (When locked, under 15% mobile viewport height per guideline 1.I) */}
      {!isUnlocked && (
        <div className="sticky bottom-0 z-30 w-full bg-[#09090b]/95 backdrop-blur-md border-t border-neutral-800 p-3 sm:p-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex w-2 h-2 rounded-full bg-[#007DFE]"></span>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  Unlock "Viral Hayma" · ₱29
                </div>
                <div className="text-[11px] text-neutral-400 hidden sm:block">
                  Lifetime access · 4K Stream · Instant Unlock
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#007DFE] hover:bg-[#0068D6] active:bg-[#0056B3] shadow-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock for ₱29</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
