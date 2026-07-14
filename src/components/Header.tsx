import { useState } from 'react';
import { Compass, Sparkles, CreditCard, Shield, Menu, X, Check, Gift } from 'lucide-react';
import { SubscriptionTier } from '../types';

interface HeaderProps {
  currentTier: SubscriptionTier;
  setTier: (tier: SubscriptionTier) => void;
  freeTriesRemaining: number;
  onResetTries: () => void;
}

export default function Header({ currentTier, setTier, freeTriesRemaining, onResetTries }: HeaderProps) {
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  const tiersInfo = [
    {
      id: 'free' as SubscriptionTier,
      name: 'Free Tier',
      price: '$0',
      period: 'forever',
      color: 'bg-slate-100 text-slate-800 border-slate-200',
      badgeColor: 'bg-slate-500',
      icon: Compass,
      features: [
        'AI destination inspiration',
        '1 custom travel itinerary',
        'Basic map & attractions guide',
        'Tailored clothing recommendations',
        'Limited to 3 free generations'
      ]
    },
    {
      id: 'pro' as SubscriptionTier,
      name: 'Pro Tier',
      price: 'S$39.99',
      period: 'first month (S$49.99/mo regular)',
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      badgeColor: 'bg-indigo-600',
      icon: Sparkles,
      features: [
        'Everything in Free Tier',
        'Integrated Flight & Hotel Booking Center',
        'Continuous travel OS optimizations',
        'Unlimited itinerary optimization',
        'Live AI Chatbot with memory context',
        'Hour-by-hour crowd predictions',
        'Detailed transport & subway timing',
        'Targeted dining recommendations',
        'Offline itinerary downloads',
        'Real-time weather adjustments'
      ]
    }
  ];

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand Logo and Title in Bento style */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold font-display shadow-sm">
            V
          </div>
          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-indigo-600 font-bold block leading-none">Vagabond AI</span>
            <h1 className="text-lg font-display font-bold text-zinc-900 tracking-tight leading-none mt-1">
              Travel Assistant
            </h1>
          </div>
        </div>

        {/* Dynamic Tier Switcher Control Center in Bento style */}
        <div className="flex flex-wrap items-center gap-2 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200 self-start md:self-auto">
          {tiersInfo.map((t) => {
            const Icon = t.icon;
            const isActive = currentTier === t.id;
            return (
              <button
                key={t.id}
                id={`tier-select-${t.id}`}
                onClick={() => setTier(t.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-zinc-400'}`} />
                <span className="capitalize">{t.name.split(' ')[0]}</span>
                {isActive && (
                  <span className={`w-1.5 h-1.5 rounded-full ${t.badgeColor} animate-pulse`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Subscription Status & Actions */}
        <div className="flex items-center gap-4">
          {currentTier === 'free' ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 font-semibold">
                Tries remaining: <span className={`font-bold font-mono px-2 py-0.5 rounded-md ${freeTriesRemaining > 0 ? 'bg-amber-100 text-amber-800 border border-amber-200/50' : 'bg-red-100 text-red-800'}`}>{freeTriesRemaining}</span>
              </span>
              {freeTriesRemaining <= 0 && (
                <button
                  id="reset-tries-btn"
                  onClick={onResetTries}
                  className="text-[10px] text-indigo-600 underline hover:text-indigo-800 font-bold cursor-pointer"
                  title="Simulate adding more tries for testing"
                >
                  Refill Tries
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200/60 px-3 py-1.5 rounded-xl font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="capitalize">{currentTier} Mode Unlocked</span>
            </div>
          )}

          <button
            id="view-pricing-btn"
            onClick={() => setIsPricingOpen(true)}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-zinc-800 shadow-sm"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Pricing Plans
          </button>
        </div>

      </div>

      {/* Pricing Modal Backdrop */}
      {isPricingOpen && (
        <div id="pricing-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
          <div className="relative bg-white w-full max-w-4xl rounded-[32px] shadow-xl border border-zinc-200 overflow-hidden max-h-[90vh] flex flex-col animate-fade-in">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
              <div>
                <h3 className="text-xl font-display font-bold text-zinc-900">Choose Your Travel Companion</h3>
                <p className="text-xs text-zinc-500 mt-1">Select the subscription model that fits your journey's speed and depth.</p>
              </div>
              <button
                id="close-pricing-modal"
                onClick={() => setIsPricingOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
              {tiersInfo.map((t) => {
                const Icon = t.icon;
                const isCurrent = currentTier === t.id;
                
                return (
                  <div
                    key={t.id}
                    className={`flex flex-col rounded-2xl p-5 border transition-all ${
                      isCurrent
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/10'
                        : 'border-zinc-200 hover:border-zinc-300 hover:shadow-sm bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-2 rounded-lg ${t.color.split(' ')[0]} ${t.color.split(' ')[1]} border border-current/10`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-display font-bold text-sm text-zinc-900">{t.name}</span>
                    </div>

                    <div className="mb-4">
                      <span className="text-3xl font-display font-bold text-zinc-900">{t.price}</span>
                      <span className="text-xs text-zinc-500 font-medium"> / {t.period}</span>
                    </div>

                    <ul className="space-y-2.5 mb-6 flex-1">
                      {t.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-zinc-600 leading-tight">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      id={`pricing-upgrade-btn-${t.id}`}
                      onClick={() => {
                        setTier(t.id);
                        setIsPricingOpen(false);
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-zinc-100 text-zinc-500 cursor-default'
                          : t.id === 'pro'
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                          : 'bg-zinc-900 hover:bg-black text-white'
                      }`}
                      disabled={isCurrent}
                    >
                      {isCurrent ? 'Active Plan' : `Unlock ${t.id === 'free' ? 'Free Plan' : 'Pro Plan'}`}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-center gap-2 text-xs text-zinc-500 font-medium">
              <Gift className="w-4 h-4 text-indigo-500" />
              <span>Simulated payment environment. You can toggle tiers at any time to test features!</span>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
