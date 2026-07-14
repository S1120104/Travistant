export type SubscriptionTier = 'free' | 'pro';

export interface UserPreferences {
  travellerType: string;
  withKids: boolean;
  prefersWalking: boolean;
  diet: string;
}

export interface Attraction {
  id: string;
  name: string;
  type: 'Food' | 'Culture' | 'History' | 'Nature' | 'Shopping' | 'Entertainment';
  description: string;
  popularity: string; // e.g. "9.8/10 • Top Rated"
  crowdLevel: 'Low' | 'Medium' | 'High';
  crowdPeakDescription: string; // e.g. "Very crowded 2 PM - 5 PM"
  weatherIndicator: string; // e.g. "Ideal for sunny afternoons"
  pricing: {
    admission: number; // in USD
    admissionDetail: string; // e.g. "Free entry" or "$25 USD"
    hostelMin: number;
    budgetHotelMin: number;
    luxuryHotelMin: number;
  };
}

export interface WeatherInfo {
  tempCelsius: number;
  condition: string; // e.g. "Partly Cloudy"
  bestTimeToVisit: string;
}

export interface TravelGuide {
  destination: string;
  days: number;
  weather: WeatherInfo;
  popularitySummary: string;
  attractions: Attraction[];
  clothingSuggestions?: string;
}

export interface TimelineItem {
  id: string;
  time: string; // e.g. "09:00 AM"
  activity: string;
  description: string;
  location: string;
  transport: {
    instruction: string; // e.g. "Take Metro Line 1 towards Châtelet"
    optimalMethod: string; // e.g. "Metro" or "Grab/Uber" or "Walk"
    durationMins: number;
    isFree: boolean;
    price: number; // in USD
    ticketLink: string; // where to buy
  };
  admission: {
    isRequired: boolean;
    price: number;
    buyLocation: string; // where to buy
  };
  bookingCategory?: 'flight' | 'hotel' | 'transport' | 'activity';
  crowdPrediction?: {
    expectedCapacityPercentage: number;
    peakHours: string;
    advice: string;
  };
  recommendedRestaurant?: {
    name: string;
    cuisine: string;
    priceRange: string;
    specialty: string;
  };
}

export interface DayItinerary {
  dayNumber: number;
  dayTitle: string; // e.g. "Day 1: Royal Legacy"
  items: TimelineItem[];
}

export interface FullItinerary {
  destination: string;
  daysCount: number;
  dayPlans: DayItinerary[];
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

// Elite tier structures
export interface BookableFlight {
  id: string;
  airline: string;
  logo: string;
  outboundTime: string;
  inboundTime: string;
  duration: string;
  stops: number;
  price: number;
  seatClass: 'Economy' | 'Premium Economy' | 'Business';
  selectedSeat?: string;
}

export interface BookableHotel {
  id: string;
  name: string;
  rating: number; // e.g. 4.8
  reviewCount: number;
  pricePerNight: number;
  roomType: string;
  description: string;
  amenities: string[];
}

export interface BookableTransport {
  id: string;
  type: 'RideHailing' | 'CarRental' | 'PrivateShuttle';
  provider: 'Grab' | 'Uber' | 'LocalCab';
  vehicleType: string; // e.g. "Premium Sedan", "Economy Hatchback"
  estimatedDurationMins: number;
  price: number;
}

export interface BookedItem {
  id: string;
  category: 'flight' | 'hotel' | 'transport' | 'activity';
  title: string; // Flight number, Hotel name, Activity name, Transport type
  subtitle: string; // Details
  price: number;
  bookedAt: string;
  cancellationDeadline: string; // Free cancellation until
  status: 'confirmed' | 'cancelled';
}
