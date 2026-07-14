import { useState, useEffect } from 'react';
import Header from './components/Header';
import FreeTierView from './components/FreeTierView';
import ProTierView from './components/ProTierView';
import BookingView from './components/BookingView';
import { SubscriptionTier, TravelGuide, FullItinerary, UserPreferences } from './types';
import { Sparkles, ArrowRight, Compass, Plane } from 'lucide-react';

export default function App() {
  // Current active tier
  const [tier, setTier] = useState<SubscriptionTier>('free');

  // Active view tab ('planner' or 'bookings')
  const [viewMode, setViewMode] = useState<'planner' | 'bookings'>('planner');

  // Free Tries limit
  const [freeTries, setFreeTries] = useState<number>(() => {
    const stored = localStorage.getItem('travel_assistant_tries');
    return stored !== null ? Number(stored) : 3;
  });

  // Main data states
  const [guide, setGuide] = useState<TravelGuide | null>(null);
  const [itinerary, setItinerary] = useState<FullItinerary | null>(null);
  const [loading, setLoading] = useState(false);

  // Track tries in local storage
  useEffect(() => {
    localStorage.setItem('travel_assistant_tries', String(freeTries));
  }, [freeTries]);

  // Handlers
  const handleRefillTries = () => {
    setFreeTries(3);
  };

  const handleUpgradeTrigger = () => {
    setTier('pro');
    alert("✨ Welcome to Vagabond Pro! S$39.99 for your first month (S$49.99/mo regular). Continuous travel OS optimizations, flight & hotel booking portal, and Live AI chatbot are now active!");
  };

  // Generate Attractions for Free Tier
  const handleGenerateFreeGuide = async (dest: string, daysCount: number, interests: string[]) => {
    if (freeTries <= 0) {
      setTier('pro');
      return;
    }

    setLoading(true);
    setGuide(null);

    try {
      const response = await fetch('/api/travel/attractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: dest, days: daysCount, interests })
      });
      const data = await response.json();
      setGuide(data);
      setFreeTries(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Attractions fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Generate Itinerary with User Profile Preferences for Pro Tier
  const handleGenerateProItinerary = async (dest: string, daysCount: number, interests: string[], preferences: UserPreferences) => {
    setLoading(true);
    setItinerary(null);
    setGuide(null);

    try {
      // Run both calls in parallel for high performance and matching state contexts
      const [itineraryRes, attractionsRes] = await Promise.all([
        fetch('/api/travel/itinerary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destination: dest, days: daysCount, interests, preferences })
        }),
        fetch('/api/travel/attractions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destination: dest, days: daysCount, interests, preferences })
        })
      ]);

      const itineraryData = await itineraryRes.json();
      const attractionsData = await attractionsRes.json();

      setItinerary(itineraryData);
      setGuide(attractionsData);
    } catch (err) {
      console.error("Pro Itinerary build failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update Itinerary (used when tailoring with the AI Prompt Chat)
  const handleUpdateItinerary = (updated: FullItinerary, customPrompt: string) => {
    setItinerary(updated);
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Dynamic Header */}
      <Header
        currentTier={tier}
        setTier={setTier}
        freeTriesRemaining={freeTries}
        onResetTries={handleRefillTries}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Tier Specific Visual Introductions */}
        <div className="mb-6 animate-fade-in">
          {tier === 'free' && (
            <div className="bg-white p-5 rounded-[32px] border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-sm">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-indigo-600 animate-spin-slow" />
                <span className="font-bold text-zinc-800">Currently operating under the Free Tier travel planner.</span>
              </div>
              <button
                id="upgrade-intro-cta"
                onClick={handleUpgradeTrigger}
                className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 transition-all text-left"
              >
                Upgrade to Pro (S$39.99 Promo) for continuous travel OS, flights & hotels booking <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
              </button>
            </div>
          )}

          {tier === 'pro' && (
            <div className="bg-indigo-950 p-5 rounded-[32px] border border-indigo-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-md text-white">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                <span className="font-bold font-mono">Pro Continuous Travel OS Mode Unlocked • Live AI Customizer & Booking Engines active</span>
              </div>
              <div className="text-[11px] text-zinc-300 font-medium">
                Syncing weather grids, flights inventory, subway hubs & culinary indices
              </div>
            </div>
          )}
        </div>

        {/* Global Tab Selector for Planner vs Flight/Hotel Booking */}
        <div className="flex items-center gap-2 mb-8 bg-zinc-200/60 border border-zinc-300/40 p-1.5 rounded-2xl w-full sm:w-fit shadow-sm">
          <button
            id="switch-planner-tab"
            onClick={() => setViewMode('planner')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              viewMode === 'planner'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            <Compass className="w-4 h-4 text-indigo-500" />
            <span>Interactive Itinerary Planner</span>
          </button>
          
          <button
            id="switch-bookings-tab"
            onClick={() => setViewMode('bookings')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              viewMode === 'bookings'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            <Plane className="w-4 h-4 text-indigo-500" />
            <span>Flight & Hotel Booking Portal</span>
          </button>
        </div>

        {/* Conditional Rendering of active Tier Views or Booking View */}
        <div className="transition-all duration-300">
          {viewMode === 'planner' ? (
            <>
              {tier === 'free' && (
                <FreeTierView
                  guide={guide}
                  loading={loading}
                  onGenerate={handleGenerateFreeGuide}
                  triesRemaining={freeTries}
                  onUpgrade={handleUpgradeTrigger}
                />
              )}

              {tier === 'pro' && (
                <ProTierView
                  itinerary={itinerary}
                  loading={loading}
                  onGenerateItinerary={handleGenerateProItinerary}
                  onUpdateItinerary={handleUpdateItinerary}
                />
              )}
            </>
          ) : (
            <BookingView
              currentItinerary={itinerary}
              currentTier={tier}
              onUpgrade={handleUpgradeTrigger}
            />
          )}
        </div>

      </main>

      {/* Aesthetic human footer - zero telemetry, pure design */}
      <footer className="border-t border-gray-100 bg-white py-6 mt-12 text-center text-xs text-gray-400">
        <p className="font-medium">© 2026 Vagabond Travel AI. All travel bookings are simulated for educational evaluation.</p>
      </footer>

    </div>
  );
}
