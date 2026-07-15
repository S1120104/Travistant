import React, { useState } from 'react';
import { MapPin, Calendar, Compass, CloudSun, AlertTriangle, Users, DollarSign, Download, Sparkles, Shirt, ArrowRight } from 'lucide-react';
import { TravelGuide, Attraction } from '../types';

interface FreeTierViewProps {
  guide: TravelGuide | null;
  loading: boolean;
  onGenerate: (destination: string, days: number, interests: string[]) => void;
  triesRemaining: number;
  onUpgrade: () => void;
}

export default function FreeTierView({ guide, loading, onGenerate, triesRemaining, onUpgrade }: FreeTierViewProps) {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [fromDate, setFromDate] = useState('2026-08-15');
  const [toDate, setToDate] = useState('2026-08-18');
  
  const interestOptions = ['food', 'culture', 'history', 'nature', 'shopping', 'entertainment'];
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['culture', 'food']);
  const [activeDay, setActiveDay] = useState(1);

  // Distribute the 5 attractions across the requested days
  const getAttractionsForDay = (dayNum: number) => {
    const attractions = guide?.attractions || [];
    if (attractions.length === 0) return [];

    const totalDays = guide?.days || 3;
    if (totalDays <= 1) {
      return attractions.map((a, i) => ({
        ...a,
        slot: i === 0 ? '09:00 AM' : i === 1 ? '11:30 AM' : i === 2 ? '02:00 PM' : i === 3 ? '04:30 PM' : '07:30 PM'
      }));
    }

    const items: any[] = [];
    attractions.forEach((a, index) => {
      const assignedDay = (index % totalDays) + 1;
      if (assignedDay === dayNum) {
        const dayCount = items.length;
        const slot = dayCount === 0 ? '10:00 AM' : dayCount === 1 ? '03:00 PM' : '06:30 PM';
        items.push({ ...a, slot });
      }
    });

    if (items.length === 0 && attractions.length > 0) {
      const fallbackAttr = attractions[(dayNum - 1) % attractions.length];
      items.push({ ...fallbackAttr, slot: '10:00 AM' });
    }

    return items;
  };

  const inspirations = [
    { name: "Tokyo, Japan", days: 4, tag: "Neon & Culture", interests: ["culture", "food", "entertainment"] },
    { name: "Paris, France", days: 3, tag: "Art & Romance", interests: ["culture", "history", "food"] },
    { name: "Rome, Italy", days: 5, tag: "Imperial History", interests: ["history", "culture", "food"] }
  ];

  const handleApplyInspiration = (ins: typeof inspirations[0]) => {
    setDestination(ins.name);
    setDays(ins.days);
    setSelectedInterests(ins.interests);
  };

  const handleToggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    if (triesRemaining <= 0) {
      onUpgrade();
      return;
    }
    onGenerate(destination, days, selectedInterests);
  };

  // Triggers browser download of generated guide
  const handleDownload = () => {
    if (!guide) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(guide, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${guide.destination.split(',')[0].trim()}_Travel_Guide.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="free-tier-view" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Config Panel - Bento styled */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Destination Setup Card */}
        <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm h-fit">
          <div className="flex items-center gap-2.5 mb-5">
            <Compass className="w-5 h-5 text-indigo-600" />
            <h2 className="font-display font-bold text-base text-zinc-900">Destination Setup</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Destination */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Where to?
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                <input
                  id="destination-input"
                  type="text"
                  placeholder="e.g. Tokyo, Paris, Rome..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-2xl text-sm outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Duration & Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  How many days?
                </label>
                <input
                  id="days-input"
                  type="number"
                  min={1}
                  max={14}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-2xl text-sm outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Date Range
                </label>
                <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-3 text-xs text-zinc-500 font-medium">
                  <Calendar className="w-4 h-4 text-zinc-400 mr-1.5 shrink-0" />
                  <span className="truncate">Aug 15 - Aug 18</span>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                What do you want to do?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {interestOptions.map((opt) => {
                  const isSelected = selectedInterests.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      id={`interest-btn-${opt}`}
                      onClick={() => handleToggleInterest(opt)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border capitalize transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            {triesRemaining > 0 ? (
              <button
                id="generate-guide-btn"
                type="submit"
                disabled={loading || !destination.trim()}
                className="w-full bg-zinc-900 hover:bg-black text-white py-3.5 rounded-2xl text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Analyzing Destination...' : `Explore Destination (${triesRemaining} tries left)`}
              </button>
            ) : (
              <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-4 text-center">
                <AlertTriangle className="w-5 h-5 text-amber-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-zinc-800">Free generations exhausted!</p>
                <p className="text-[10px] text-zinc-500 mt-1 mb-3">Upgrade to Pro for unlimited optimized travel OS timelines, dynamic crowd prediction and live chat support.</p>
                <button
                  id="upgrade-from-paywall-btn"
                  type="button"
                  onClick={onUpgrade}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Upgrade to Pro
                </button>
              </div>
            )}
          </form>
        </div>

        {/* AI Destination Inspiration Widget - Bento Style */}
        <div className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">AI Destination Inspiration</h3>
          </div>
          <p className="text-[11px] text-zinc-400 mb-4 leading-normal">
            Need travel ideas? Click any hand-picked destination block below to instantly load its layout and interests.
          </p>
          <div className="space-y-2.5">
            {inspirations.map((ins, idx) => (
              <button
                key={idx}
                type="button"
                id={`inspiration-item-${idx}`}
                onClick={() => handleApplyInspiration(ins)}
                className="w-full text-left p-3 rounded-2xl border border-zinc-100 hover:border-indigo-200 hover:bg-indigo-50/20 flex items-center justify-between transition-all group cursor-pointer"
              >
                <div>
                  <span className="text-xs font-bold text-zinc-800 group-hover:text-indigo-600 block">{ins.name}</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">{ins.tag} • {ins.days} Days</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Results / Display area - Bento styled */}
      <div className="lg:col-span-8 space-y-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[32px] border border-zinc-200 shadow-sm space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <Compass className="w-5 h-5 text-indigo-600 absolute animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-zinc-800">Scouting Attractions & Local Hotspots</p>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">Evaluating historic culture, weather patterns, and local lodging comparisons via Gemini AI...</p>
            </div>
          </div>
        )}

        {!loading && !guide && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[32px] border border-dashed border-zinc-300 p-8 text-center">
            <div className="bg-zinc-50 p-4 rounded-full text-zinc-400 mb-4 border border-zinc-200">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-zinc-800">Start Your Adventure</h3>
            <p className="text-xs text-zinc-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
              Enter a destination on the left to instantly unlock structured local attractions, live weather trends, crowd indices, and essential pricing matrices.
            </p>
          </div>
        )}

        {!loading && guide && (
          <div className="space-y-6 animate-fade-in">
            {/* Weather & Location Banner - Bento styled */}
            <div className="bg-zinc-900 text-white rounded-[32px] p-8 shadow-sm border border-zinc-800 relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold">Destination Guide</span>
                  <h2 className="text-3xl font-display font-bold leading-none mt-1.5">{guide.destination}</h2>
                  <p className="text-xs text-zinc-300 mt-2 max-w-xl leading-relaxed">{guide.popularitySummary}</p>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shrink-0 self-start md:self-auto">
                  <CloudSun className="w-8 h-8 text-amber-300 shrink-0" />
                  <div>
                    <span className="text-2xl font-display font-bold block leading-none">{guide.weather.tempCelsius}°C</span>
                    <span className="text-[10px] font-bold text-zinc-300 block mt-1.5 uppercase tracking-wider">{guide.weather.condition}</span>
                  </div>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-0"></div>
            </div>

            {/* Concierge Clothing & Packing Guide - New Bento widget */}
            {guide.clothingSuggestions && (
              <div className="bg-amber-50 border border-amber-200/60 p-6 rounded-[32px] flex items-start gap-4 shadow-sm">
                <div className="bg-amber-100 p-3 rounded-2xl text-amber-800 border border-amber-200/50 shrink-0">
                  <Shirt className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-amber-800 tracking-wider font-mono">Concierge Packing & Clothing Guide</h4>
                  <p className="text-xs text-zinc-700 leading-relaxed mt-1.5 font-medium">{guide.clothingSuggestions}</p>
                </div>
              </div>
            )}

            {/* Visual Route & Location Map - New Bento widget */}
            <div className="bg-white rounded-[32px] border border-zinc-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">Geospatial Attraction Map</h4>
                  <p className="text-[10px] text-zinc-400">Simulated coordinates of your customized travel spots</p>
                </div>
              </div>
              <div className="relative h-48 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/50 to-white/10"></div>
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 60,60 Q 150,110 240,60 T 360,110" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                </svg>
                {guide.attractions.map((a, i) => {
                  const positions = [
                    { top: '25%', left: '15%' },
                    { top: '65%', left: '35%' },
                    { top: '35%', left: '60%' },
                    { top: '75%', left: '80%' },
                    { top: '20%', left: '85%' },
                  ];
                  const pos = positions[i % positions.length];
                  return (
                    <div
                      key={a.id || i}
                      className="absolute flex items-center gap-1.5 transition-all hover:scale-105"
                      style={{ top: pos.top, left: pos.left }}
                    >
                      <div className="w-6 h-6 bg-indigo-600 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                        {i + 1}
                      </div>
                      <span className="hidden sm:inline bg-white/90 backdrop-blur-sm border border-zinc-200 px-1.5 py-0.5 rounded text-[9px] font-bold text-zinc-800 shadow-sm whitespace-nowrap">
                        {a.name.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
                <div className="absolute bottom-2 right-2 bg-zinc-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[9px] font-mono">
                  Vagabond Map Engine v2.1
                </div>
              </div>
            </div>

            {/* Interactive Day-by-Day Route Planner */}
            <div className="bg-white rounded-[32px] border border-zinc-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 pb-4 mb-4">
                <div>
                  <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">Interactive Day-by-Day Route Planner</h4>
                  <p className="text-[10px] text-zinc-400">Sequential chronological flow of attractions per day</p>
                </div>
                {/* Day Tabs */}
                <div className="flex gap-1.5 overflow-x-auto max-w-full">
                  {Array.from({ length: Math.min(guide.days || 3, 7) }, (_, i) => i + 1).map((dayNum) => (
                    <button
                      key={dayNum}
                      type="button"
                      id={`free-day-tab-${dayNum}`}
                      onClick={() => setActiveDay(dayNum)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeDay === dayNum
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      Day {dayNum}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Timeline */}
              <div className="relative border-l border-zinc-100 ml-3.5 pl-5.5 space-y-6 py-2">
                {getAttractionsForDay(activeDay).map((a, i) => (
                  <div key={a.id || i} className="relative group">
                    {/* Time dot */}
                    <span className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-indigo-50 border-2 border-indigo-600 flex items-center justify-center group-hover:scale-110 transition-all shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    </span>

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/50 mr-2">
                          {a.slot}
                        </span>
                        <h5 className="text-xs font-bold text-zinc-800 inline-block mt-1 sm:mt-0">{a.name}</h5>
                        <p className="text-[11px] text-zinc-500 leading-relaxed mt-1 font-medium">{a.description}</p>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 font-mono self-start shrink-0">
                        {a.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attractions Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-800">Recommended Attractions</h3>
                <p className="text-[11px] text-zinc-400">Curated sites matching your specified interests</p>
              </div>
              
              <button
                id="download-guide-btn"
                onClick={handleDownload}
                className="flex items-center gap-1.5 border border-zinc-200 hover:border-zinc-300 text-zinc-700 hover:bg-zinc-50 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Guide
              </button>
            </div>

            {/* Attractions Cards - Bento grid cells */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guide.attractions.map((a, idx) => (
                <div key={a.id || idx} className="bg-white p-6 rounded-[32px] border border-zinc-200 hover:border-indigo-200/60 shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {a.type}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      {a.popularity}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-zinc-900 mb-1.5">{a.name}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-4 flex-1">{a.description}</p>

                  <div className="border-t border-zinc-100 pt-4 mt-auto space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Crowd:</span>
                      </div>
                      <span className={`font-bold px-2.5 py-0.5 rounded-md text-[10px] ${
                        a.crowdLevel === 'High' ? 'bg-red-50 text-red-700' :
                        a.crowdLevel === 'Medium' ? 'bg-amber-50 text-amber-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        {a.crowdLevel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <CloudSun className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Tip:</span>
                      </div>
                      <span className="text-zinc-700 text-[11px] truncate max-w-[160px] font-medium" title={a.weatherIndicator}>
                        {a.weatherIndicator}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Admission:</span>
                      </div>
                      <span className="text-zinc-900 font-bold text-[11px]">
                        {a.pricing.admission === 0 ? 'Free' : a.pricing.admissionDetail}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Comparison Guide - Bento style */}
            <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Accommodation Cost Index (Per Night)</h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">Estimated price ranges compared across different tiers</p>
              </div>

              <div className="p-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200/50">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Hostels</span>
                  <span className="text-lg font-display font-bold text-zinc-800">
                    ${guide.attractions[0]?.pricing.hostelMin || 25} - ${Math.round((guide.attractions[0]?.pricing.hostelMin || 25) * 1.5)}
                  </span>
                  <span className="text-[9px] text-zinc-400 block mt-1.5">Dorms / Shared amenities</span>
                </div>

                <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/30">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase block mb-1">Budget Hotels</span>
                  <span className="text-lg font-display font-bold text-indigo-900">
                    ${guide.attractions[0]?.pricing.budgetHotelMin || 65} - ${Math.round((guide.attractions[0]?.pricing.budgetHotelMin || 65) * 1.4)}
                  </span>
                  <span className="text-[9px] text-indigo-500 block mt-1.5">Private double room</span>
                </div>

                <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/30">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">Luxury Hotels</span>
                  <span className="text-lg font-display font-bold text-emerald-950">
                    ${guide.attractions[0]?.pricing.luxuryHotelMin || 250}+
                  </span>
                  <span className="text-[9px] text-emerald-600 block mt-1.5">4-5 Star Suites & Resorts</span>
                </div>
              </div>
            </div>

            {/* Free Tier Call to Action - Styled as bento row */}
            <div className="bg-indigo-100/80 border border-indigo-200 rounded-[32px] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-200/50 p-2.5 rounded-xl text-indigo-600 shrink-0 border border-indigo-200/50">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-indigo-900">Want a structured hour-by-hour route?</h4>
                  <p className="text-xs text-indigo-700/80 mt-0.5 leading-relaxed">Premium unlocks sequential daily routes, optimized metro/cab directions, and active AI adjustments.</p>
                </div>
              </div>
              <button
                id="free-view-upgrade-cta"
                onClick={onUpgrade}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm shrink-0 cursor-pointer"
              >
                Explore Premium
              </button>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
