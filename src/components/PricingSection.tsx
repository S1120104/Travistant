import React from 'react';
import { Compass, Sparkles, Check, Tag, Info, Gift, HelpCircle } from 'lucide-react';
import { SubscriptionTier } from '../types';

interface PricingSectionProps {
  currentTier: SubscriptionTier;
  setTier: (tier: SubscriptionTier) => void;
  freeTriesRemaining: number;
  onResetTries: () => void;
}

export default function PricingSection({
  currentTier,
  setTier,
  freeTriesRemaining,
  onResetTries
}: PricingSectionProps) {
  
  const tiers = [
    {
      id: 'free' as SubscriptionTier,
      name: 'Free Tier',
      price: 'S$0',
      period: 'forever',
      color: 'border-zinc-200 bg-white hover:border-zinc-300',
      badgeColor: 'bg-zinc-500 text-white',
      accentColor: 'text-zinc-600',
      icon: Compass,
      description: 'Ideal for casual travelers looking for quick local sightseeing inspiration and basic curated lists.',
      ctaText: 'Active Plan',
      features: [
        'AI destination inspiration and landmark analysis',
        '1 custom travel itinerary template',
        'Basic map coordinates & landmark guide',
        'Tailored weather clothing recommendation engine',
        'Limited to 3 simulation tries total'
      ]
    },
    {
      id: 'pro' as SubscriptionTier,
      name: 'Pro Tier',
      price: 'S$39.99',
      period: 'first month',
      regularPrice: 'S$49.99/mo regular',
      color: 'border-indigo-600 ring-2 ring-indigo-500/10 bg-indigo-50/10',
      badgeColor: 'bg-indigo-600 text-white',
      accentColor: 'text-indigo-600',
      icon: Sparkles,
      description: 'The complete travel operating system. Unlocks continuous optimizations, flight/hotel booking, and real-time AI assistance.',
      ctaText: 'Upgrade to Pro',
      features: [
        'Everything in Free Tier included',
        'Integrated Flight & Hotel Booking Center (SGD)',
        'Continuous travel OS itinerary auto-optimizations',
        'Unlimited real-time itinerary modifications',
        'Live AI Chatbot with memory context retention',
        'Hour-by-hour crowd density forecasts',
        'Detailed transport routes & subway timetables',
        'Targeted local dining and culinary indexing',
        'Offline PDF & itinerary data downloads',
        'Live local weather adjustments & backup activities'
      ]
    }
  ];

  return (
    <section id="pricing-plans-section" className="mt-12 animate-fade-in scroll-mt-24">
      
      {/* Visual Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider">
          <Tag className="w-3.5 h-3.5" />
          <span>Limited Time Introductory Promo</span>
        </div>
        <h2 className="text-2xl font-display font-extrabold text-zinc-950 tracking-tight">
          Vagabond Subscription Plans
        </h2>
        <p className="text-xs text-zinc-500 max-w-lg mx-auto leading-relaxed">
          Unlock maximum travel speed, hourly subway route indicators, live crowd models, and flight booking portals. Change tiers instantly.
        </p>
      </div>

      {/* Grid of Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {tiers.map((t) => {
          const Icon = t.icon;
          const isActive = currentTier === t.id;
          
          return (
            <div
              key={t.id}
              id={`pricing-card-${t.id}`}
              className={`flex flex-col rounded-[32px] border p-8 transition-all relative ${
                isActive 
                  ? 'border-indigo-600 bg-indigo-50/20 shadow-md ring-2 ring-indigo-500/5' 
                  : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm'
              }`}
            >
              {/* Promo Banner on Pro */}
              {t.id === 'pro' && (
                <span className="absolute -top-3.5 right-6 bg-indigo-600 text-white border border-indigo-700 text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Gift className="w-3 h-3" />
                  <span>First Timer Promo: S$39.99</span>
                </span>
              )}

              {/* Active Badge */}
              {isActive && (
                <span className="absolute top-6 right-6 text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2.5 py-1 rounded-md">
                  Active Subscription
                </span>
              )}

              {/* Header Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2.5 rounded-2xl ${t.id === 'pro' ? 'bg-indigo-100 text-indigo-700' : 'bg-zinc-100 text-zinc-600'} border border-zinc-200/20`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-sm text-zinc-900 leading-none">{t.name}</h3>
                    <span className="text-[10px] font-mono text-zinc-400 mt-1 block">Vagabond OS</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  {t.description}
                </p>

                {/* Price Display */}
                <div className="py-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-display font-black text-zinc-950 tracking-tight">{t.price}</span>
                    <span className="text-xs text-zinc-400 font-bold">/ {t.period}</span>
                  </div>
                  {t.id === 'pro' && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md font-mono">
                        Save S$10.00 today
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium">({t.regularPrice})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="my-6">
                <button
                  id={`pricing-select-btn-${t.id}`}
                  onClick={() => {
                    if (t.id === 'pro') {
                      setTier('pro');
                      alert("✨ Welcome to Vagabond Pro! Continuous travel OS optimizations and Live AI chatbot support with context retention are now active.");
                    } else {
                      setTier('free');
                    }
                  }}
                  className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-zinc-100 text-zinc-400 cursor-default border border-zinc-200/50'
                      : t.id === 'pro'
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20'
                      : 'bg-zinc-900 hover:bg-black text-white'
                  }`}
                  disabled={isActive}
                >
                  {isActive ? 'Current Plan' : t.id === 'pro' ? 'Unlock Pro (S$39.99 First Month)' : 'Switch to Free Tier'}
                </button>
              </div>

              {/* Features List */}
              <div className="space-y-3.5 border-t border-zinc-100 pt-6 flex-1">
                <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 tracking-wider block">Included Privileges</span>
                <ul className="space-y-2.5">
                  {t.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-600 leading-normal">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tries Refill Helper for Free Plan */}
              {t.id === 'free' && freeTriesRemaining <= 0 && (
                <div className="mt-4 bg-amber-50 border border-amber-200/60 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-amber-800 font-medium">Out of free simulation tries.</span>
                  </div>
                  <button
                    id="refill-pricing-tries"
                    onClick={onResetTries}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl font-bold font-mono text-[10px] transition-all cursor-pointer whitespace-nowrap"
                  >
                    Refill 3 Tries
                  </button>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Trust Badge and Disclaimer */}
      <div className="max-w-xl mx-auto mt-8 bg-zinc-50 border border-zinc-200/60 rounded-[24px] p-5 flex items-start gap-3 text-xs text-zinc-500">
        <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-zinc-700">Simulated Safe Environment</h5>
          <p className="leading-relaxed font-medium">
            This app operates as a mock environment for evaluation. Toggle between tiers above or click "Pricing Plans" at any point. Upgrade values are billed in Singapore Dollars (SGD) with immediate access.
          </p>
        </div>
      </div>

    </section>
  );
}
