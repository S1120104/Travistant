import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Building, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  User, 
  Coffee, 
  ShieldCheck, 
  Ticket, 
  Info, 
  CalendarDays, 
  ChevronRight, 
  Armchair, 
  Bed, 
  X, 
  CreditCard, 
  AlertCircle, 
  TrendingUp,
  Tag
} from 'lucide-react';
import { BookableFlight, BookableHotel, BookedItem, FullItinerary } from '../types';

interface BookingViewProps {
  currentItinerary: FullItinerary | null;
  currentTier: 'free' | 'pro';
  onUpgrade: () => void;
}

export default function BookingView({ currentItinerary, currentTier, onUpgrade }: BookingViewProps) {
  const [destination, setDestination] = useState('');
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'cart' | 'booked'>('flights');
  
  // Search parameters
  const [flightClass, setFlightClass] = useState<'Economy' | 'Premium Economy' | 'Business'>('Economy');
  const [isSearching, setIsSearching] = useState(false);
  const [isBookingConfirming, setIsBookingConfirming] = useState(false);

  // Selections
  const [selectedFlight, setSelectedFlight] = useState<BookableFlight | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  
  const [selectedHotel, setSelectedHotel] = useState<BookableHotel | null>(null);
  const [selectedRoomIdx, setSelectedRoomIdx] = useState<number>(0);
  const [breakfastIncluded, setBreakfastIncluded] = useState(false);
  const [airportTransfer, setAirportTransfer] = useState(false);

  // Active bookings list (persisted in local storage)
  const [bookedItems, setBookedItems] = useState<BookedItem[]>(() => {
    const stored = localStorage.getItem('vagabond_booked_items');
    return stored ? JSON.parse(stored) : [];
  });

  // Prefill destination from active itinerary if available
  useEffect(() => {
    if (currentItinerary?.destination) {
      // Extract city name, e.g., "Tokyo" from "Tokyo, Japan"
      const city = currentItinerary.destination.split(',')[0].trim();
      setDestination(city);
    } else {
      setDestination('Tokyo');
    }
  }, [currentItinerary]);

  // Persist booked items
  useEffect(() => {
    localStorage.setItem('vagabond_booked_items', JSON.stringify(bookedItems));
  }, [bookedItems]);

  // Generate mock flights based on selected city
  const getFlights = (): BookableFlight[] => {
    const city = destination || 'Tokyo';
    return [
      {
        id: 'f_sq_1',
        airline: 'Singapore Airlines',
        logo: 'SQ',
        outboundTime: '08:00 AM',
        inboundTime: '04:15 PM',
        duration: '6h 15m',
        stops: 0,
        price: flightClass === 'Business' ? 2450 : flightClass === 'Premium Economy' ? 1250 : 680,
        seatClass: flightClass
      },
      {
        id: 'f_jl_2',
        airline: 'Japan Airlines',
        logo: 'JL',
        outboundTime: '11:55 PM',
        inboundTime: '08:05 AM (+1)',
        duration: '7h 10m',
        stops: 0,
        price: flightClass === 'Business' ? 2280 : flightClass === 'Premium Economy' ? 1150 : 620,
        seatClass: flightClass
      },
      {
        id: 'f_sco_3',
        airline: 'Scoot Airlines',
        logo: 'TR',
        outboundTime: '06:30 AM',
        inboundTime: '02:45 PM',
        duration: '8h 15m',
        stops: 1,
        price: flightClass === 'Business' ? 1100 : flightClass === 'Premium Economy' ? 690 : 380,
        seatClass: flightClass
      }
    ];
  };

  // Generate mock hotels based on selected city
  const getHotels = (): BookableHotel[] => {
    const city = destination || 'Tokyo';
    return [
      {
        id: 'h_lux_1',
        name: `The Grand Royal ${city} Oasis`,
        rating: 4.9,
        reviewCount: 320,
        pricePerNight: 280,
        roomType: 'Deluxe Executive King Suite',
        description: 'Immersive skyline vistas, custom marble fixtures, private high-speed Wi-Fi, and personalized concierge access.',
        amenities: ['Skyline View', 'Infinity Pool', 'Complimentary Spa', 'Full Aircon', 'Rain Shower']
      },
      {
        id: 'h_mid_2',
        name: `${city} Central Boutique Hotel`,
        rating: 4.6,
        reviewCount: 185,
        pricePerNight: 160,
        roomType: 'Standard Garden View Queen',
        description: 'Located in the heartbeat of the cultural district. Cozy, minimalist layout designed for local urban explorers.',
        amenities: ['Central Location', 'Free Superfast Wi-Fi', 'Complimentary Coffee', 'Gym Access']
      },
      {
        id: 'h_bud_3',
        name: `Nomad Station Hostel ${city}`,
        rating: 4.3,
        reviewCount: 512,
        pricePerNight: 55,
        roomType: 'Compact Superior Pod Cabin',
        description: 'Chic social spaces, high-density charging hubs, private lockers, and steps away from the main train and subway terminals.',
        amenities: ['Near Subway Station', 'Private Lockers', 'Co-working Spaces', 'Free Laundry Pods']
      }
    ];
  };

  // Handle Seat Selection
  const handleSeatClick = (seatCode: string) => {
    setSelectedSeat(seatCode);
  };

  // Seats Grid Mock Layout
  const renderSeatSelector = () => {
    const rows = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
    const takenSeats = ['2B', '3D', '4A', '5E', '5F', '1C', '7B'];

    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <div className="text-center mb-4">
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest font-mono">Interactive Cabin Map</span>
          <h4 className="text-xs font-bold text-zinc-800 mt-1">Select Seat for {selectedFlight?.airline} ({selectedFlight?.seatClass})</h4>
        </div>

        {/* Plane Cabin Frame */}
        <div className="max-w-[280px] mx-auto bg-white border border-zinc-200/60 rounded-t-[100px] rounded-b-2xl p-6 shadow-sm">
          {/* Cockpit */}
          <div className="h-10 border-b border-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-6">
            Cockpit Front
          </div>

          {/* Seats layout */}
          <div className="space-y-3.5">
            {rows.map((row) => (
              <div key={row} className="flex items-center justify-between gap-1">
                {/* Left seats */}
                <div className="flex gap-2">
                  {cols.slice(0, 3).map((col) => {
                    const code = `${row}${col}`;
                    const isTaken = takenSeats.includes(code);
                    const isSelected = selectedSeat === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        id={`seat-btn-${code}`}
                        disabled={isTaken}
                        onClick={() => handleSeatClick(code)}
                        className={`w-7 h-7 rounded-lg text-[9px] font-mono font-bold flex items-center justify-center transition-all ${
                          isTaken 
                            ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed border border-zinc-200/30' 
                            : isSelected
                            ? 'bg-indigo-600 text-white border border-indigo-700 shadow-sm'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/50 cursor-pointer'
                        }`}
                      >
                        {code}
                      </button>
                    );
                  })}
                </div>

                {/* Aisle */}
                <div className="text-[9px] font-mono font-bold text-zinc-300 px-1 select-none">
                  |
                </div>

                {/* Right seats */}
                <div className="flex gap-2">
                  {cols.slice(3, 6).map((col) => {
                    const code = `${row}${col}`;
                    const isTaken = takenSeats.includes(code);
                    const isSelected = selectedSeat === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        id={`seat-btn-${code}`}
                        disabled={isTaken}
                        onClick={() => handleSeatClick(code)}
                        className={`w-7 h-7 rounded-lg text-[9px] font-mono font-bold flex items-center justify-center transition-all ${
                          isTaken 
                            ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed border border-zinc-200/30' 
                            : isSelected
                            ? 'bg-indigo-600 text-white border border-indigo-700 shadow-sm'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/50 cursor-pointer'
                        }`}
                      >
                        {code}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Cabin Legend */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-zinc-100 text-[10px] text-zinc-400">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-indigo-50 border border-indigo-200/50 rounded-sm"></span>
              <span>Open</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-indigo-600 rounded-sm"></span>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-zinc-100 border border-zinc-200/30 rounded-sm"></span>
              <span>Booked</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Calculated totals
  const numNights = currentItinerary?.daysCount ? Math.max(1, currentItinerary.daysCount - 1) : 3;
  const flightCost = selectedFlight ? selectedFlight.price : 0;
  const hotelCost = selectedHotel ? selectedHotel.pricePerNight * numNights : 0;
  const seatFee = selectedSeat ? (flightClass === 'Business' ? 120 : 35) : 0;
  const breakfastFee = breakfastIncluded ? 20 * numNights : 0;
  const transferFee = airportTransfer ? 45 : 0;

  const totalBeforeDiscount = flightCost + hotelCost + seatFee + breakfastFee + transferFee;
  // S$10 first-timer pro booking voucher discount or pro member tier discount
  const discountAmount = currentTier === 'pro' && totalBeforeDiscount > 0 ? 10.00 : 0;
  const totalAmountSGD = Math.max(0, totalBeforeDiscount - discountAmount);

  // Flight search execution simulation
  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 600);
  };

  // Perform Final Booking Action
  const handleConfirmCheckout = () => {
    if (currentTier === 'free') {
      onUpgrade();
      return;
    }

    setIsBookingConfirming(true);

    // Simulate robust blockchain receipt / operator secure confirmation API
    setTimeout(() => {
      const itemsToAdd: BookedItem[] = [];
      const timestampStr = new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      const deadlineStr = new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric' });

      if (selectedFlight) {
        itemsToAdd.push({
          id: `book_f_${Date.now()}`,
          category: 'flight',
          title: `${selectedFlight.airline} • Flight ${selectedFlight.logo}-${Math.floor(Math.random() * 900 + 100)}`,
          subtitle: `${selectedFlight.seatClass} Class - Selected Seat ${selectedSeat || 'Auto-Assigned'} (${selectedFlight.outboundTime} departure)`,
          price: selectedFlight.price + seatFee,
          bookedAt: timestampStr,
          cancellationDeadline: deadlineStr,
          status: 'confirmed'
        });
      }

      if (selectedHotel) {
        itemsToAdd.push({
          id: `book_h_${Date.now()}`,
          category: 'hotel',
          title: selectedHotel.name,
          subtitle: `${selectedHotel.roomType} (${numNights} Nights) ${breakfastIncluded ? '• Breakfast Included' : ''} ${airportTransfer ? '• VIP Shuttle' : ''}`,
          price: hotelCost + breakfastFee + transferFee,
          bookedAt: timestampStr,
          cancellationDeadline: deadlineStr,
          status: 'confirmed'
        });
      }

      setBookedItems(prev => [...itemsToAdd, ...prev]);
      
      // Clear selections
      setSelectedFlight(null);
      setSelectedSeat(null);
      setSelectedHotel(null);
      setBreakfastIncluded(false);
      setAirportTransfer(false);

      setIsBookingConfirming(false);
      setActiveTab('booked');
    }, 2000);
  };

  // Clear or cancel active simulated booked item
  const handleCancelBooking = (bookingId: string) => {
    setBookedItems(prev => prev.map(item => 
      item.id === bookingId ? { ...item, status: 'cancelled' } : item
    ));
  };

  return (
    <div id="booking-portal" className="bg-white rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden animate-fade-in">
      
      {/* Booking Header Banner with Bento Accents */}
      <div className="bg-zinc-950 text-white p-8 border-b border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase">Interactive Flight & Hotel Portal</span>
            <h2 className="text-2xl font-display font-bold">Vagabond Booking Workspace</h2>
            <p className="text-xs text-zinc-400 font-medium">Configure transport routes, secure selected premium hotels, and verify seat reservations in SGD currency.</p>
          </div>

          {/* Tab buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-zinc-900 p-1 rounded-2xl border border-zinc-800 shrink-0">
            <button
              id="tab-flights"
              onClick={() => setActiveTab('flights')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'flights' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>Flights</span>
            </button>
            <button
              id="tab-hotels"
              onClick={() => setActiveTab('hotels')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'hotels' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Hotels</span>
            </button>
            <button
              id="tab-cart"
              onClick={() => setActiveTab('cart')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                activeTab === 'cart' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Checkout Drawer</span>
              {(selectedFlight || selectedHotel) && (
                <span className="absolute -top-1.5 -right-1 bg-red-500 text-white w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold">
                  {(selectedFlight ? 1 : 0) + (selectedHotel ? 1 : 0)}
                </span>
              )}
            </button>
            <button
              id="tab-booked"
              onClick={() => setActiveTab('booked')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                activeTab === 'booked' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>My Bookings</span>
              {bookedItems.filter(b => b.status === 'confirmed').length > 0 && (
                <span className="absolute -top-1.5 -right-1 bg-emerald-500 text-white w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold">
                  {bookedItems.filter(b => b.status === 'confirmed').length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sync Profile Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-zinc-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-md font-mono">
              CURRENCY: SGD ($S)
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">
              Active Destination: <strong className="text-white">{destination}</strong>
            </span>
          </div>

          {currentTier === 'pro' ? (
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Pro Membership S$39.99 First Month Applied (Regular S$49.99)</span>
            </div>
          ) : (
            <button
              id="upgrade-promo-btn"
              onClick={onUpgrade}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unlock Pro to Book Hotels & Flights (S$39.99 First-Time Promo)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="p-8">
        
        {/* TAB 1: FLIGHTS INTERACTIVE SEARCH & SELECT */}
        {activeTab === 'flights' && (
          <div className="space-y-6">
            
            {/* Search filter panel */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-zinc-50 border border-zinc-200 p-5 rounded-2xl">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 font-mono">Origin</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    id="flight-origin"
                    type="text"
                    value="Singapore (SIN)"
                    disabled
                    className="w-full pl-9 pr-3 py-2 bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 font-mono">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-3.5 h-3.5 text-indigo-500" />
                  <input
                    id="flight-dest-input"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 focus:border-indigo-500 rounded-xl text-xs font-semibold text-zinc-800 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 font-mono">Cabin Class</label>
                <select
                  id="flight-class-select"
                  value={flightClass}
                  onChange={(e) => setFlightClass(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-zinc-200 focus:border-indigo-500 rounded-xl text-xs font-semibold text-zinc-800 outline-none transition-all h-[38px]"
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business Class</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  id="search-flights-btn"
                  onClick={handleSearch}
                  className="w-full bg-zinc-900 hover:bg-black text-white py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Update Flight Timings</span>
                </button>
              </div>
            </div>

            {/* Flights List and Seat Selector Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Flights available */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-zinc-700">Recommended Flights to {destination}</span>
                </div>

                {isSearching ? (
                  <div className="p-12 text-center bg-zinc-50 border border-dashed border-zinc-300 rounded-2xl">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <span className="text-xs font-mono text-zinc-400">Syncing live seat inventory...</span>
                  </div>
                ) : (
                  getFlights().map((f) => {
                    const isSelected = selectedFlight?.id === f.id;
                    return (
                      <div
                        key={f.id}
                        id={`flight-card-${f.id}`}
                        onClick={() => {
                          setSelectedFlight(f);
                          setSelectedSeat(null); // reset seat on flight change
                        }}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/10 ring-1 ring-indigo-500/10 shadow-sm'
                            : 'border-zinc-200 hover:border-zinc-300 bg-white'
                        }`}
                      >
                        {/* Premium Tag if SQ */}
                        {f.airline === 'Singapore Airlines' && (
                          <span className="absolute -top-2.5 left-4 bg-amber-50 text-amber-800 border border-amber-200/50 text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                            Top Rated Carrier
                          </span>
                        )}

                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="space-y-2">
                            {/* Airline brand */}
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-extrabold text-zinc-700 bg-zinc-100 border border-zinc-200/50 px-2 py-0.5 rounded">
                                {f.logo}
                              </span>
                              <h5 className="text-xs font-bold text-zinc-900">{f.airline}</h5>
                            </div>

                            {/* Timing & stops */}
                            <div className="flex items-center gap-6 pt-1">
                              <div>
                                <span className="text-[10px] text-zinc-400 block uppercase font-mono font-bold">Departure</span>
                                <span className="text-xs font-bold text-zinc-800">{f.outboundTime}</span>
                              </div>
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-[9px] text-zinc-400 font-bold font-mono">{f.duration}</span>
                                <div className="w-16 h-0.5 bg-zinc-200 relative my-0.5">
                                  {f.stops > 0 && <span className="w-1.5 h-1.5 bg-zinc-400 absolute inset-0 m-auto rounded-full"></span>}
                                </div>
                                <span className="text-[9px] font-mono text-zinc-400">{f.stops === 0 ? 'Non-Stop' : `${f.stops} stop via transit`}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-zinc-400 block uppercase font-mono font-bold">Arrival</span>
                                <span className="text-xs font-bold text-zinc-800">{f.inboundTime}</span>
                              </div>
                            </div>
                          </div>

                          {/* Price & selection button */}
                          <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 border-zinc-100 pt-3 sm:pt-0 shrink-0">
                            <div className="text-right">
                              <span className="text-[9px] text-zinc-400 block uppercase font-mono font-bold">{f.seatClass} Fare</span>
                              <span className="text-base font-bold font-display text-zinc-900">S$ {f.price}</span>
                            </div>
                            
                            <button
                              type="button"
                              id={`select-flight-btn-${f.id}`}
                              className={`mt-2 px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                isSelected
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                              }`}
                            >
                              {isSelected ? 'Active Selection' : 'Select Flight'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Cabin Seat Selector */}
              <div className="lg:col-span-5">
                {selectedFlight ? (
                  renderSeatSelector()
                ) : (
                  <div className="border border-dashed border-zinc-200 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center bg-zinc-50">
                    <Armchair className="w-8 h-8 text-zinc-300 mb-2" />
                    <h5 className="text-xs font-bold text-zinc-700">Select a Flight First</h5>
                    <p className="text-[10px] text-zinc-400 mt-1 max-w-[200px]">Choose from the recommended departures to unlock the interactive cabin seat selector.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Navigation to Hotels */}
            <div className="flex items-center justify-end pt-4">
              <button
                id="next-to-hotels"
                onClick={() => {
                  setActiveTab('hotels');
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <span>Proceed to Hotel Selection</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: HOTELS SELECTION & ROOM REVIEW */}
        {activeTab === 'hotels' && (
          <div className="space-y-6">
            
            {/* Search indicators */}
            <div className="bg-zinc-50 border border-zinc-200 px-6 py-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <CalendarDays className="w-4 h-4 text-indigo-500" />
                <span className="text-zinc-500 font-semibold">
                  Accommodation window pre-synchronized with itinerary: <strong className="text-zinc-800">{numNights} Nights</strong>
                </span>
              </div>
              <span className="text-[10px] bg-zinc-200 px-3 py-1 rounded font-mono font-bold text-zinc-600">
                Aug 15 - Aug 18
              </span>
            </div>

            {/* Hotels Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Hotel listings */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bed className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-zinc-700">Recommended Stays in {destination} ({numNights} Nights)</span>
                </div>

                {getHotels().map((h) => {
                  const isSelected = selectedHotel?.id === h.id;
                  return (
                    <div
                      key={h.id}
                      id={`hotel-card-${h.id}`}
                      onClick={() => {
                        setSelectedHotel(h);
                        setSelectedRoomIdx(0); // Reset room index
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/10 ring-1 ring-indigo-500/10 shadow-sm'
                          : 'border-zinc-200 hover:border-zinc-300 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                              ★ {h.rating}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-bold font-mono">({h.reviewCount} Reviews)</span>
                          </div>

                          <h4 className="text-xs font-extrabold text-zinc-900 leading-snug">{h.name}</h4>
                          <p className="text-[11px] text-zinc-500 leading-normal max-w-md font-medium">{h.description}</p>

                          {/* Amenities badges */}
                          <div className="flex flex-wrap gap-1 pt-2">
                            {h.amenities.map((a, idx) => (
                              <span key={idx} className="bg-zinc-50 text-zinc-500 border border-zinc-200/40 text-[9px] font-mono px-2 py-0.5 rounded-md">
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Price & Selection */}
                        <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 border-zinc-100 pt-3 sm:pt-0 shrink-0">
                          <div className="text-right">
                            <span className="text-[9px] text-zinc-400 block font-mono font-bold">RATE / NIGHT</span>
                            <span className="text-base font-bold font-display text-zinc-900">S$ {h.pricePerNight}</span>
                            <span className="text-[9px] text-zinc-400 block mt-0.5 font-semibold">Total: S$ {h.pricePerNight * numNights}</span>
                          </div>

                          <button
                            type="button"
                            id={`select-hotel-btn-${h.id}`}
                            className={`mt-2 px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                            }`}
                          >
                            {isSelected ? 'Active Stay' : 'Select Hotel'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Room custom reviewer bento widget */}
              <div className="lg:col-span-5">
                {selectedHotel ? (
                  <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-5">
                    <div className="text-center pb-2 border-b border-zinc-200/60">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest font-mono">Boutique Room Selection</span>
                      <h4 className="text-xs font-bold text-zinc-800 mt-1">{selectedHotel.name}</h4>
                    </div>

                    {/* Room Category Toggles */}
                    <div className="space-y-2.5">
                      {[
                        { title: selectedHotel.roomType, priceMod: 0, desc: 'Luxury linens, private air filtration, smart temperature dashboard, high floor.' },
                        { title: 'Panoramic Ocean/City Horizon Suite', priceMod: 45, desc: 'Enlarged double glazing windows, fully stocked complementary minibar, premium bath salts.' },
                        { title: 'Ultra-Comfort Soundproof Loft Cabin', priceMod: -20, desc: 'Heavy acoustic dampening paneling, high-density focus light array, automated curtains.' }
                      ].map((room, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedRoomIdx(idx)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left space-y-1.5 bg-white ${
                            selectedRoomIdx === idx
                              ? 'border-indigo-500 ring-2 ring-indigo-500/10'
                              : 'border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[11px] font-bold text-zinc-800 leading-tight block">{room.title}</span>
                            <span className="text-[10px] font-mono font-bold text-indigo-600 shrink-0">
                              {room.priceMod >= 0 ? `+$${room.priceMod} SGD` : `-$${Math.abs(room.priceMod)} SGD`}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-500 leading-normal font-medium">{room.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add-on amenities checkboxes */}
                    <div className="space-y-3 bg-white p-4 rounded-xl border border-zinc-200/50">
                      <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 tracking-wider">Hotel Perks & Add-ons</span>
                      
                      <label className="flex items-center gap-3 text-xs text-zinc-600 cursor-pointer">
                        <input
                          id="breakfast-check"
                          type="checkbox"
                          checked={breakfastIncluded}
                          onChange={(e) => setBreakfastIncluded(e.target.checked)}
                          className="w-4 h-4 rounded text-indigo-600 border-zinc-300 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div>
                          <span className="font-bold text-zinc-800">Gourmet Breakfast Buffet</span>
                          <span className="text-[9px] text-zinc-400 block">+S$ 20.00 / night • Healthy organic local cuisines</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 text-xs text-zinc-600 cursor-pointer pt-1 border-t border-zinc-100">
                        <input
                          id="transfer-check"
                          type="checkbox"
                          checked={airportTransfer}
                          onChange={(e) => setAirportTransfer(e.target.checked)}
                          className="w-4 h-4 rounded text-indigo-600 border-zinc-300 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div>
                          <span className="font-bold text-zinc-800">VIP Airport Shuttle Express</span>
                          <span className="text-[9px] text-zinc-400 block">+S$ 45.00 flat rate • Fast passage directly to terminal door</span>
                        </div>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-zinc-200 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center bg-zinc-50">
                    <Building className="w-8 h-8 text-zinc-300 mb-2" />
                    <h5 className="text-xs font-bold text-zinc-700">Select a Stay First</h5>
                    <p className="text-[10px] text-zinc-400 mt-1 max-w-[200px]">Choose an hotel card to unlock the premium room selection panel and customize extra perks.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Navigation to Checkout */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-6">
              <button
                id="back-to-flights"
                onClick={() => setActiveTab('flights')}
                className="text-xs text-zinc-500 hover:text-zinc-800 font-bold cursor-pointer"
              >
                ← Back to Flights
              </button>
              
              <button
                id="next-to-checkout"
                onClick={() => {
                  setActiveTab('cart');
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <span>Proceed to Checkout Summary</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* TAB 3: CHECKOUT DRAWER */}
        {activeTab === 'cart' && (
          <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="text-center mb-4">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest font-mono">Simulated Cart Checkout</span>
              <h3 className="text-lg font-display font-bold text-zinc-900 mt-0.5">Review & Confirm Selections</h3>
            </div>

            {/* If empty cart */}
            {!selectedFlight && !selectedHotel ? (
              <div className="border border-dashed border-zinc-200 rounded-[24px] p-12 text-center bg-zinc-50 space-y-3">
                <AlertCircle className="w-8 h-8 text-zinc-300 mx-auto" />
                <h4 className="text-xs font-bold text-zinc-700">Your Booking Drawer is Empty</h4>
                <p className="text-[10px] text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Go back to the Flights or Hotels tabs and make selections to see live pricing summaries, customizable seating options, and submit secure booking vouchers.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    id="back-flights-empty"
                    onClick={() => setActiveTab('flights')}
                    className="px-4 py-2 border border-zinc-200 hover:bg-zinc-100 text-zinc-700 rounded-xl text-[10px] font-bold cursor-pointer"
                  >
                    Select Flight
                  </button>
                  <button
                    id="back-hotels-empty"
                    onClick={() => setActiveTab('hotels')}
                    className="px-4 py-2 border border-zinc-200 hover:bg-zinc-100 text-zinc-700 rounded-xl text-[10px] font-bold cursor-pointer"
                  >
                    Select Hotel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                
                {/* 1. Selected Flight Card */}
                {selectedFlight && (
                  <div className="bg-white border border-zinc-200 p-5 rounded-2xl space-y-3.5 relative">
                    <span className="absolute right-4 top-4 text-[9px] font-mono text-zinc-400 bg-zinc-100 px-2.5 py-0.5 rounded-md">Flight Node</span>
                    <div className="flex items-center gap-2.5">
                      <Plane className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-extrabold text-zinc-800">Flight Confirmation</h4>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-zinc-50">
                      <div>
                        <strong className="text-zinc-800 block">{selectedFlight.airline}</strong>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">Route: Singapore (SIN) to {destination}</span>
                        <span className="text-[10px] text-zinc-400 block">Class: {selectedFlight.seatClass} • Seat: {selectedSeat || 'Auto-assigned'}</span>
                      </div>
                      <span className="text-xs font-bold font-mono text-zinc-950">S$ {selectedFlight.price + seatFee}</span>
                    </div>

                    {selectedSeat && (
                      <p className="text-[10px] text-indigo-600 font-mono font-bold">
                        ✓ Seat {selectedSeat} Reserved Successfully (+S$ {seatFee} seating fee included)
                      </p>
                    )}
                  </div>
                )}

                {/* 2. Selected Hotel Card */}
                {selectedHotel && (
                  <div className="bg-white border border-zinc-200 p-5 rounded-2xl space-y-3.5 relative">
                    <span className="absolute right-4 top-4 text-[9px] font-mono text-zinc-400 bg-zinc-100 px-2.5 py-0.5 rounded-md font-bold">Hotel Node</span>
                    <div className="flex items-center gap-2.5">
                      <Building className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-extrabold text-zinc-800">Stay Confirmation</h4>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-zinc-50">
                      <div>
                        <strong className="text-zinc-800 block">{selectedHotel.name}</strong>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">Room Style: {selectedRoomIdx === 0 ? selectedHotel.roomType : selectedRoomIdx === 1 ? 'Panoramic Ocean Suite' : 'Soundproof Loft'}</span>
                        <span className="text-[10px] text-zinc-400 block">Duration: {numNights} Nights • Date: Aug 15 - Aug 18</span>
                        {(breakfastIncluded || airportTransfer) && (
                          <span className="text-[10px] text-emerald-600 block font-semibold mt-0.5">
                            Perks: {breakfastIncluded ? 'Breakfast buffet' : ''} {airportTransfer ? '• VIP Shuttle' : ''}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold font-mono text-zinc-950">S$ {hotelCost + breakfastFee + transferFee}</span>
                    </div>
                  </div>
                )}

                {/* 3. Pricing Invoice Breakdown */}
                <div className="bg-slate-50 border border-slate-200 rounded-[24px] p-6 space-y-3.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 tracking-wider block">Billing Matrix Invoice</span>
                  
                  <div className="space-y-2 text-xs border-b border-zinc-200/60 pb-3">
                    {selectedFlight && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-semibold">{selectedFlight.airline} ticket ({selectedFlight.seatClass})</span>
                        <span className="font-mono text-zinc-700">S$ {selectedFlight.price}</span>
                      </div>
                    )}
                    {selectedSeat && (
                      <div className="flex justify-between text-[11px]">
                        <span className="text-zinc-400">Seat selection surcharge ({selectedSeat})</span>
                        <span className="font-mono text-zinc-500">S$ {seatFee}</span>
                      </div>
                    )}
                    {selectedHotel && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-semibold">{selectedHotel.name} ({numNights} Nights)</span>
                        <span className="font-mono text-zinc-700">S$ {hotelCost}</span>
                      </div>
                    )}
                    {breakfastIncluded && (
                      <div className="flex justify-between text-[11px]">
                        <span className="text-zinc-400">Complementary organic buffet package</span>
                        <span className="font-mono text-zinc-500">S$ {breakfastFee}</span>
                      </div>
                    )}
                    {airportTransfer && (
                      <div className="flex justify-between text-[11px]">
                        <span className="text-zinc-400">VIP express airport shuttle</span>
                        <span className="font-mono text-zinc-500">S$ {transferFee}</span>
                      </div>
                    )}
                  </div>

                  {/* Pro Member Promo Savings Code */}
                  {currentTier === 'pro' && (
                    <div className="flex items-center justify-between text-xs bg-emerald-50 border border-emerald-200/60 p-3.5 rounded-xl text-emerald-800">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>First-Timer Pro Subscription Active</span>
                      </div>
                      <span className="font-bold font-mono">-S$ 10.00 SGD</span>
                    </div>
                  )}

                  {/* Total line */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-zinc-900 uppercase font-mono">Invoice Grand Total (SGD)</span>
                    <span className="text-xl font-display font-extrabold text-zinc-950">S$ {totalAmountSGD.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Checkout button */}
                {currentTier === 'pro' ? (
                  <button
                    id="submit-confirm-booking-btn"
                    onClick={handleConfirmCheckout}
                    disabled={isBookingConfirming}
                    className="w-full bg-zinc-950 hover:bg-black text-white py-4 rounded-2xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isBookingConfirming ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Securing reservations with local airline & hotel operators...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4.5 h-4.5 text-indigo-400" />
                        <span>Confirm Booking & Charge S$ {totalAmountSGD.toFixed(2)} SGD</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="bg-amber-50 border border-amber-200/50 p-5 rounded-2xl text-center space-y-3.5">
                    <div className="flex justify-center text-amber-600">
                      <Info className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-zinc-700 leading-normal font-medium">
                      Booking flights and seating selections requires a premium license. Save over 15% booking fees and gain first-timer benefits now!
                    </p>
                    <button
                      id="upgrade-from-cart-paywall"
                      onClick={onUpgrade}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      Unlock Pro Tier (S$39.99 First-Month Promo)
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* TAB 4: MY BOOKINGS / PASSES */}
        {activeTab === 'booked' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            
            <div className="text-center">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest font-mono">Simulated Secure Receipts</span>
              <h3 className="text-lg font-display font-bold text-zinc-900 mt-0.5">My Travel Vouchers & Boarding Passes</h3>
              <p className="text-xs text-zinc-400 mt-1">Access boarding passes, hotel key codes and cancellation schedules even when offline.</p>
            </div>

            {bookedItems.length === 0 ? (
              <div className="border border-dashed border-zinc-200 rounded-[24px] p-12 text-center bg-zinc-50 space-y-2">
                <Ticket className="w-8 h-8 text-zinc-300 mx-auto" />
                <h4 className="text-xs font-bold text-zinc-700">No Bookings Recorded Yet</h4>
                <p className="text-[10px] text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Navigate to the Checkout tab once you have chosen flights and hotels to execute secure mock confirmations.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {bookedItems.map((item) => {
                  const isCancelled = item.status === 'cancelled';
                  return (
                    <div
                      key={item.id}
                      id={`booked-item-${item.id}`}
                      className={`border rounded-[24px] overflow-hidden transition-all bg-white ${
                        isCancelled ? 'border-zinc-200/50 opacity-60' : 'border-zinc-200 shadow-sm'
                      }`}
                    >
                      {/* Ticket Header status line */}
                      <div className={`px-5 py-3.5 flex items-center justify-between ${
                        isCancelled ? 'bg-zinc-100 text-zinc-400' : 'bg-zinc-50 text-zinc-800'
                      }`}>
                        <div className="flex items-center gap-2">
                          {item.category === 'flight' ? (
                            <Plane className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Building className="w-4 h-4 text-indigo-600" />
                          )}
                          <span className="text-xs font-mono font-extrabold uppercase tracking-wider">
                            {item.category === 'flight' ? 'Boarding Pass & Seating' : 'Hotel Stay Voucher'}
                          </span>
                        </div>

                        <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded uppercase ${
                          isCancelled 
                            ? 'bg-zinc-200 text-zinc-500' 
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200/40'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      {/* Ticket Body details */}
                      <div className="p-5 space-y-4">
                        <div className="flex justify-between gap-4">
                          <div>
                            <h4 className="text-sm font-extrabold text-zinc-900">{item.title}</h4>
                            <p className="text-[11px] text-zinc-500 mt-1 font-medium">{item.subtitle}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-zinc-400 block font-mono font-bold">CHARGED AMOUNT</span>
                            <span className="text-xs font-extrabold font-mono text-zinc-800">S$ {item.price}</span>
                          </div>
                        </div>

                        {/* Barcode representation for aesthetic realism */}
                        {!isCancelled && (
                          <div className="bg-zinc-50 border border-zinc-200/60 p-4 rounded-xl flex items-center justify-between gap-4 flex-col sm:flex-row">
                            <div className="space-y-1 text-left">
                              <span className="text-[9px] text-zinc-400 block uppercase font-mono font-bold">Booking Reference</span>
                              <span className="text-xs font-bold font-mono text-indigo-600">{item.id.toUpperCase()}</span>
                              <span className="text-[10px] text-zinc-500 block">Secured at: {item.bookedAt}</span>
                            </div>
                            
                            {/* Visual Barcode pattern */}
                            <div className="flex flex-col items-center shrink-0">
                              <div className="h-7 w-48 bg-zinc-900 flex gap-0.5 p-0.5 overflow-hidden">
                                {Array.from({ length: 42 }).map((_, idx) => (
                                  <div
                                    key={idx}
                                    className="h-full bg-white shrink-0"
                                    style={{ width: `${(idx % 3 === 0 || idx % 7 === 0) ? 4 : 1}px` }}
                                  ></div>
                                ))}
                              </div>
                              <span className="text-[8px] font-mono text-zinc-400 mt-1 uppercase">Vagabond Sync ID - {item.id.slice(10)}</span>
                            </div>
                          </div>
                        )}

                        {/* Cancellation panel */}
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-100 pt-3 font-medium">
                          <span>
                            {isCancelled 
                              ? 'Booking has been refunded to your wallet.' 
                              : `Cancellation deadline: Free until ${item.cancellationDeadline}`}
                          </span>
                          
                          {!isCancelled && (
                            <button
                              type="button"
                              id={`cancel-booking-${item.id}`}
                              onClick={() => handleCancelBooking(item.id)}
                              className="text-red-500 hover:text-red-700 underline font-bold transition-colors cursor-pointer"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
