import React, { useState, useEffect } from 'react';

export function EmailCaptureBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('emailBannerDismissed');
    if (saved) setDismissed(true);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('emailBannerDismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:max-w-sm z-50 bg-[#1A1A2E] border border-[#D4FF00] rounded-xl shadow-2xl p-4">
      <button onClick={handleDismiss} className="absolute top-2 right-2 text-gray-400 hover:text-white">✕</button>
      <p className="text-white text-sm font-medium">📊 Get your detailed investor report</p>
      <p className="text-gray-300 text-xs mt-1">Enter your email to receive a full breakdown of your pitch deck score and investor match suggestions.</p>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSfWdpDDyRP1F66yrDOppZR-Z4QfJehq64mEtQkgtYm2d3Z06w/viewform"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block w-full text-center bg-[#D4FF00] text-black font-bold py-2 rounded-lg text-sm hover:bg-[#E6FF66] transition"
      >
        Claim my report →
      </a>
    </div>
  );
}
