'use client';

import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Check if user has already dismissed it this session
      const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install');
    } else {
      console.log('User dismissed the PWA install');
    }

    // We used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-[calc(7.5rem+env(safe-area-inset-bottom,0px))] left-4 right-4 md:bottom-10 md:left-1/2 md:-translate-x-1/2 md:w-[420px] z-[60] animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700 ease-out">
      <div className="bg-white/90 backdrop-blur-2xl border border-[#E8DCC4] rounded-[24px] shadow-[0_30px_60px_rgba(108,82,54,0.15)] p-5 relative overflow-hidden group">
        {/* Decorative gradient */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-[#8B5E3C]/20 to-[#C9A24E]/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 ease-in-out" />
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#8B5E3C]/10 rounded-full blur-2xl" />
        
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 text-[#A0937D] hover:text-[#8B5E3C] hover:bg-[#8B5E3C]/10 rounded-full transition-all z-10"
          aria-label="Tutup"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#6c5236] flex items-center justify-center flex-shrink-0 shadow-[0_8px_16px_rgba(139,94,60,0.3)] animate-pulse" style={{ animationDuration: '3s' }}>
            <Download className="text-white" size={26} strokeWidth={2.5} />
          </div>
          
          <div className="flex-1 pr-6">
            <h4 className="text-[#6c5236] font-extrabold text-base mb-1 tracking-tight">Pasang Aplikasi Qur'anan</h4>
            <p className="text-[#8B5E3C]/80 text-[12px] leading-relaxed mb-3">
              Tambahkan ke layar utama untuk akses instan dan pengalaman membaca offline yang mulus.
            </p>
            
            <button
              onClick={handleInstall}
              className="w-full py-2.5 bg-gradient-to-r from-[#8B5E3C] to-[#6c5236] hover:from-[#7A5031] hover:to-[#5a432b] text-white text-sm font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_12px_rgba(139,94,60,0.25)] flex items-center justify-center gap-2"
            >
              Pasang Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
