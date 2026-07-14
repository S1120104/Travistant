import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Navigation, Send, RefreshCw, Sparkles, Check, Download, AlertTriangle, Users, Utensils, HelpCircle, ArrowRight, CheckCircle2, CloudRain, ShieldCheck } from 'lucide-react';
import { FullItinerary, TimelineItem, DayItinerary, Message, UserPreferences } from '../types';

interface ProTierViewProps {
  itinerary: FullItinerary | null;
  loading: boolean;
  onGenerateItinerary: (destination: string, days: number, interests: string[], preferences: UserPreferences) => void;
  onUpdateItinerary: (updated: FullItinerary, message: string) => void;
}

export default function ProTierView({ itinerary, loading, onGenerateItinerary, onUpdateItinerary }: ProTierViewProps) {
  // Personalization settings
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  
  const [travellerType, setTravellerType] = useState('culture'); // culture, adventure, food, family, relaxed
  const [withKids, setWithKids] = useState(false);
  const [prefersWalking, setPrefersWalking] = useState(false);
  const [diet, setDiet] = useState('None'); // None, Vegetarian, Vegan, Halal, Kosher

  const interestOptions = ['food', 'culture', 'history', 'nature', 'shopping', 'entertainment'];
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['culture', 'food', 'history']);
  
  // Day tab index
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  // Live Chat Panel state
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: "Welcome to your Live Pro AI Concierge. I am continuously syncing with weather grids, subway lines, and local crowd logs. Any adjustments you want? Ask me to 'Move dinner later', 'Make Day 2 child-friendly', or 'Switch to vegan spots'. My context retention holds your profile settings securely!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleToggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    const prefs: UserPreferences = {
      travellerType,
      withKids,
      prefersWalking,
      diet
    };

    onGenerateItinerary(destination, days, selectedInterests, prefs);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !itinerary) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}_user`,
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentPrompt = chatInput;
    setChatInput('');
    setChatLoading(true);

    try {
      const prefs: UserPreferences = {
        travellerType,
        withKids,
        prefersWalking,
        diet
      };

      const response = await fetch('/api/travel/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: itinerary.destination,
          currentItinerary: itinerary,
          messages: [...messages, userMsg],
          userPrompt: currentPrompt,
          preferences: prefs
        })
      });

      const data = await response.json();
      if (data.itinerary) {
        onUpdateItinerary(data.itinerary, currentPrompt);
        
        const assistantMsg: Message = {
          id: `msg_${Date.now()}_assistant`,
          sender: 'assistant',
          text: data.explanation || "I've successfully updated your itinerary and optimized the travel connections according to your preferences!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error("Failed to post chat update:", err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg_${Date.now()}_err`,
          sender: 'assistant',
          text: "Oops, I faced a minor connection issue while re-optimizing. Let's try that prompt again shortly!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Offline itinerary down-loader
  const handleDownloadOffline = () => {
    if (!itinerary) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(itinerary, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${itinerary.destination.split(',')[0].trim()}_Pro_Itinerary_Offline.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="pro-tier-view" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* LEFT COLUMN: Setup Form or Live Concierge Chatbot */}
      <div className="lg:col-span-4 space-y-6 animate-fade-in">
        
        {/* If no itinerary exists, show the Premium/Pro personalized builder */}
        {!itinerary ? (
          <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
              <h2 className="font-display font-bold text-base text-zinc-900">Pro Continuous Optimizer</h2>
            </div>
            
            <form onSubmit={handleSetupSubmit} className="space-y-4">
              {/* Destination */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                  <input
                    id="pro-destination-input"
                    type="text"
                    placeholder="e.g. London, Tokyo, Paris..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-2xl text-sm outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Days count */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Duration</label>
                  <input
                    id="pro-days-input"
                    type="number"
                    min={1}
                    max={10}
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-2xl text-sm outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Traveler Type</label>
                  <select
                    id="pro-traveller-select"
                    value={travellerType}
                    onChange={(e) => setTravellerType(e.target.value)}
                    className="w-full px-3 py-3 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-2xl text-sm outline-none transition-all h-[46px]"
                  >
                    <option value="culture">Culture & Sights</option>
                    <option value="adventure">High Adventure</option>
                    <option value="food">Gourmet Foodie</option>
                    <option value="family">Family/Kids Style</option>
                    <option value="relaxed">Slow & Relaxed</option>
                  </select>
                </div>
              </div>

              {/* Dietary requirements */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Dietary Profile</label>
                <select
                  id="pro-diet-select"
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-full px-3.5 py-3 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-2xl text-sm outline-none transition-all h-[46px]"
                >
                  <option value="None">No Restrictions (Any Cuisines)</option>
                  <option value="Vegetarian">Vegetarian (No meat/fish)</option>
                  <option value="Vegan">Vegan (Plant-based)</option>
                  <option value="Halal">Halal Certified Options</option>
                  <option value="Kosher">Kosher Dining</option>
                </select>
              </div>

              {/* Binary preferences toggles */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  id="pro-toggle-kids"
                  onClick={() => setWithKids(!withKids)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    withKids 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                      : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${withKids ? 'opacity-100' : 'opacity-0'}`} />
                  <span>With Kids</span>
                </button>

                <button
                  type="button"
                  id="pro-toggle-walking"
                  onClick={() => setPrefersWalking(!prefersWalking)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    prefersWalking 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                      : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${prefersWalking ? 'opacity-100' : 'opacity-0'}`} />
                  <span>Prefers Walking</span>
                </button>
              </div>

              {/* Interests Multi-Select */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Activities Focus</label>
                <div className="flex flex-wrap gap-1.5">
                  {interestOptions.map((opt) => {
                    const isSelected = selectedInterests.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        id={`pro-interest-btn-${opt}`}
                        onClick={() => handleToggleInterest(opt)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border capitalize transition-all cursor-pointer ${
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

              <button
                id="generate-pro-itinerary-btn"
                type="submit"
                disabled={loading || !destination.trim()}
                className="w-full bg-zinc-900 hover:bg-black text-white py-3.5 rounded-2xl text-xs font-bold shadow-sm transition-all cursor-pointer mt-2"
              >
                {loading ? 'Assembling OS Flow...' : 'Build Pro Optimized Itinerary'}
              </button>
            </form>
          </div>
        ) : (
          /* Live AI Chatbot Panel with active context memory indicator */
          <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm flex flex-col h-[560px] overflow-hidden">
            
            {/* Memory Header banner */}
            <div className="p-4 border-b border-zinc-200 bg-zinc-50">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
                <div>
                  <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">Live Pro Concierge</h3>
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Memory Active • Continuous Travel OS
                  </p>
                </div>
              </div>
              
              {/* Profile Memory Context Badges */}
              <div className="flex flex-wrap gap-1 mt-3 pt-2.5 border-t border-zinc-200/60 text-[9px] font-mono text-zinc-500">
                <span className="bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200/30">Style: {travellerType}</span>
                {diet !== 'None' && <span className="bg-amber-50 text-amber-800 border border-amber-100/50 px-2 py-0.5 rounded">Diet: {diet}</span>}
                {withKids && <span className="bg-indigo-50 text-indigo-800 border border-indigo-100/30 px-2 py-0.5 rounded">Kids: Yes</span>}
                {prefersWalking && <span className="bg-emerald-50 text-emerald-800 border border-emerald-100/30 px-2 py-0.5 rounded">Walk: Prefers</span>}
              </div>
            </div>

            {/* Chats Messages Display Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-zinc-50/30">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[85%] ${m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <span className="text-[9px] text-zinc-400 font-mono mb-0.5 px-1">{m.timestamp}</span>
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-zinc-950 text-white rounded-tr-none'
                        : 'bg-white text-zinc-800 border border-zinc-200 shadow-sm rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center gap-2 bg-white text-zinc-500 rounded-2xl px-4 py-2.5 w-fit border border-zinc-200 shadow-sm">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span className="text-xs font-mono">Syncing traveler context & schedules...</span>
                </div>
              )}
            </div>

            {/* Chat prompt input form */}
            <form onSubmit={handleChatSubmit} className="p-3.5 border-t border-zinc-100 bg-zinc-50 flex gap-2">
              <input
                id="pro-chat-input"
                type="text"
                placeholder="Ask me to adapt restaurants or reschedule..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-white border border-zinc-200 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all shadow-inner font-medium"
                disabled={chatLoading}
                required
              />
              <button
                id="submit-pro-chat-btn"
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="bg-zinc-900 hover:bg-black text-white p-2.5 rounded-xl transition-all cursor-pointer border border-zinc-800 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Informative Bento Help Card */}
        <div className="bg-zinc-900 text-white p-6 rounded-[32px] border border-zinc-800 flex items-start gap-3 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-zinc-100 font-mono">Continuous Travel OS active</h4>
            <p className="text-zinc-400 leading-relaxed mt-1">Our system updates schedules on-the-go. Download details below to access exact times and transport routes even when offline!</p>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Chronological Timeline Tracks */}
      <div className="lg:col-span-8 space-y-6">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[32px] border border-zinc-200 shadow-sm space-y-5">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <Sparkles className="w-5 h-5 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-zinc-800">Calculating Pro Continuous Travel Matrix</p>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Re-structuring schedules with kids safety checkpoints, dietary restaurant reviews, weather forecast overlays, and crowd logs...
              </p>
            </div>
          </div>
        )}

        {!loading && !itinerary && (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[32px] border border-dashed border-zinc-300 p-8 text-center">
            <div className="bg-indigo-50 p-4 rounded-full text-indigo-600 mb-4 animate-pulse border border-indigo-100">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-zinc-800 font-display">Pro Optimizer Workspace</h3>
            <p className="text-xs text-zinc-500 mt-2 max-w-md mx-auto leading-relaxed">
              Complete the Traveler Preferences setup to build a fully structured, hourly routing flow enriched with crowd prediction bento modules, personalized bistros, and transit times!
            </p>
          </div>
        )}

        {!loading && itinerary && (
          <div className="space-y-6 animate-fade-in">
            {/* Header with Title & Day Tab buttons */}
            <div className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase font-mono">Pro Active Itinerary</span>
                  <h3 className="text-lg font-display font-bold text-zinc-900 mt-0.5">{itinerary.destination}</h3>
                </div>
                
                {/* Actions: Exporter & Toggles */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    id="pro-download-itinerary"
                    onClick={handleDownloadOffline}
                    className="flex items-center gap-1.5 border border-zinc-200 hover:border-indigo-300 text-zinc-700 hover:bg-zinc-50 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-zinc-400" />
                    Offline Download
                  </button>
                  <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-200/50 text-xs font-bold">
                    <Calendar className="w-4 h-4" />
                    <span>{itinerary.daysCount} Days Optimized</span>
                  </div>
                </div>
              </div>

              {/* Day Selection Slider Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {itinerary.dayPlans.map((dp, i) => (
                  <button
                    key={dp.dayNumber}
                    id={`pro-day-tab-${dp.dayNumber}`}
                    onClick={() => setSelectedDayIdx(i)}
                    className={`px-4.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                      selectedDayIdx === i
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-zinc-50 border-zinc-200/60 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                  >
                    Day {dp.dayNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time Weather Disruption alerts bento bar */}
            <div className="bg-amber-50 border border-amber-200/60 p-4.5 rounded-[24px] shadow-sm flex items-start gap-3">
              <CloudRain className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[10px] font-bold text-amber-800 uppercase tracking-widest font-mono">Real-time Weather & Disruption Sync</h4>
                <p className="text-xs text-zinc-700 leading-normal mt-1 font-medium">
                  Outdoor attractions are fully matched with sun periods. Safe indoor museums are queued should temporary drizzle occur!
                </p>
              </div>
            </div>

            {/* VERTICAL TIMELINE TRACK */}
            <div className="relative border-l border-zinc-200 ml-4 pl-6 space-y-8 pb-4">
              {itinerary.dayPlans[selectedDayIdx]?.items.map((item, index) => (
                <div key={item.id || index} className="relative">
                  {/* Circle Time Clock Node */}
                  <span className="absolute -left-[35px] top-1.5 flex items-center justify-center w-6.5 h-6.5 rounded-full bg-indigo-100 border-2 border-white shadow-md">
                    <Clock className="w-3 h-3 text-indigo-700" />
                  </span>

                  {/* Complete timeline item card */}
                  <div className="bg-white p-6 rounded-[32px] border border-zinc-200 hover:border-indigo-200/60 shadow-sm hover:shadow-md transition-all space-y-4">
                    
                    {/* Item header line */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-zinc-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-600 px-2.5 py-0.5 bg-indigo-50 rounded-lg border border-indigo-200/30">
                          {item.time}
                        </span>
                        <span className="text-xs text-zinc-400 font-bold font-mono">{item.location}</span>
                      </div>
                      {item.admission.isRequired && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/50 px-2.5 py-0.5 rounded-lg">
                          Admission: ${item.admission.price}
                        </span>
                      )}
                    </div>

                    {/* Activity Text */}
                    <div>
                      <h5 className="text-sm font-bold text-zinc-900">{item.activity}</h5>
                      <p className="text-xs text-zinc-500 leading-relaxed mt-1 font-medium">{item.description}</p>
                    </div>

                    {/* 1. Subway / Transit Planning Guidance Block */}
                    <div className="bg-zinc-50 border border-zinc-200/50 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center md:justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <div className="bg-indigo-50 text-indigo-700 p-1.5 rounded-lg shrink-0 mt-0.5 border border-indigo-100">
                          <Navigation className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-zinc-800 block leading-tight">
                            Transit: {item.transport.optimalMethod} ({item.transport.durationMins} mins)
                          </span>
                          <span className="text-[11px] text-zinc-500 block mt-1 leading-normal font-medium">
                            {item.transport.instruction}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0 text-right">
                        <span className="text-[10px] font-mono font-bold text-zinc-900">
                          {item.transport.price === 0 ? 'Free Passage' : `$${item.transport.price} Fare`}
                        </span>
                        <span className="text-[9px] text-zinc-400 block mt-0.5 font-medium">
                          {item.transport.ticketLink}
                        </span>
                      </div>
                    </div>

                    {/* 2. Crowd Prediction Bento Widget */}
                    {item.crowdPrediction && (
                      <div className="bg-red-50/20 border border-red-100 p-4 rounded-2xl text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-red-800 font-bold">
                          <Users className="w-3.5 h-3.5 text-red-600" />
                          <span className="font-mono uppercase tracking-wider text-[10px]">Crowd Prediction Alert</span>
                        </div>
                        <p className="text-zinc-600 leading-relaxed font-medium">
                          Expected Density: <span className="font-bold text-red-700 font-mono">{item.crowdPrediction.expectedCapacityPercentage}% capacity</span>. Peak hours: {item.crowdPrediction.peakHours}.
                        </p>
                        <p className="text-[11px] text-zinc-500 italic">
                          Advice: {item.crowdPrediction.advice}
                        </p>
                      </div>
                    )}

                    {/* 3. Personalized Restaurant Recommendation Bento Widget */}
                    {item.recommendedRestaurant && (
                      <div className="bg-emerald-50/20 border border-emerald-100 p-4 rounded-2xl text-xs space-y-1.5">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                          <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-mono uppercase tracking-wider text-[10px]">Pro Dining Recommendation ({diet !== 'None' ? diet : 'Dietary Safe'})</span>
                        </div>
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="font-bold text-zinc-800 text-[12px]">{item.recommendedRestaurant.name}</span>
                            <span className="text-[11px] text-zinc-500 block mt-0.5">{item.recommendedRestaurant.cuisine} Cuisine • {item.recommendedRestaurant.priceRange}</span>
                          </div>
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[9px] font-mono shrink-0">
                            Custom Selected
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-600 italic">
                          Specialty: {item.recommendedRestaurant.specialty}
                        </p>
                      </div>
                    )}

                    {/* Card Footer ticket purchases helper */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-zinc-400 pt-3 border-t border-zinc-100 font-medium">
                      <span>Admission details: {item.admission.isRequired ? `Acquire at ${item.admission.buyLocation}` : 'No tickets required.'}</span>
                      <span className="text-indigo-600 font-bold font-mono">Continuous Travel OS Sync active</span>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
