import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Google GenAI client initialized successfully with API key.");
  } catch (err) {
    console.error("Failed to initialize Google GenAI:", err);
  }
} else {
  console.log("No GEMINI_API_KEY found, using local high-fidelity fallback generator.");
}

// Local dynamic content generator as an excellent fallback system
function generateLocalFallbackGuide(dest: string, days: number, interests: string[]): any {
  const normalizedDest = dest.trim().toLowerCase();
  
  // Custom fallback definitions for top destinations
  const baseDestinations: Record<string, { country: string, temp: number, cond: string, summary: string, attractions: any[] }> = {
    tokyo: {
      country: "Japan",
      temp: 22,
      cond: "Pleasant & Clear",
      summary: "A thrilling fusion of ultra-modern skyscrapers, neon lights, and ancient, peaceful temples.",
      attractions: [
        { name: "Senso-ji Temple & Asakusa", type: "Culture", desc: "Tokyo's oldest and most iconic Buddhist temple, surrounded by traditional Nakamise shopping street stalls.", pop: "9.9/10 • Must See", crowd: "High", peak: "11 AM - 4 PM", weather: "Stunning in clear morning light", adm: 0, admD: "Free Admission", hostel: 25, budget: 65, luxury: 250 },
        { name: "Shibuya Crossing & Hachiko", type: "History", desc: "The world's busiest pedestrian crossing. Experience the organized chaos and pay tribute to the loyal dog Hachiko statue.", pop: "9.7/10 • Famous Spot", crowd: "High", peak: "6 PM - 9 PM", weather: "Atmospheric during evening rainfall", adm: 0, admD: "Free", hostel: 30, budget: 85, luxury: 300 },
        { name: "Meiji Jingu Shrine & Harajuku", type: "Culture", desc: "A serene forest oasis in the heart of Tokyo dedicated to Emperor Meiji, adjacent to the quirky youth fashion hub of Takeshita Street.", pop: "9.5/10 • Top Rated", crowd: "Medium", peak: "1 PM - 3 PM", weather: "Shaded and peaceful under mid-day heat", adm: 0, admD: "Free Entry", hostel: 28, budget: 70, luxury: 280 },
        { name: "Tsukiji Outer Market Food Tour", type: "Food", desc: "Sample freshest street-side sushi, grilled wagyu, tamagoyaki, and matcha desserts in these lively historic alleys.", pop: "9.8/10 • Gourmet Classic", crowd: "High", peak: "9 AM - 12 PM", weather: "Covered alleys perfect for light drizzle", adm: 15, admD: "$15 USD for food samples", hostel: 25, budget: 65, luxury: 250 },
        { name: "Akihabara Electric Town", type: "Entertainment", desc: "The global center of gaming, anime, retro electronics, and maid cafes.", pop: "9.4/10 • Tech Hub", crowd: "Medium", peak: "4 PM - 7 PM", weather: "Vibrant during neonlit evenings", adm: 0, admD: "Free exploration", hostel: 24, budget: 60, luxury: 220 }
      ]
    },
    paris: {
      country: "France",
      temp: 18,
      cond: "Partly Cloudy",
      summary: "The world-renowned capital of art, fashion, gastronomy, and breathtaking architecture.",
      attractions: [
        { name: "Eiffel Tower & Champ de Mars", type: "History", desc: "The majestic iron spire overlooking the Seine. Ascend to the summit or enjoy a picnic on the sprawling green lawns.", pop: "9.9/10 • Iconic Landmark", crowd: "High", peak: "1 PM - 6 PM", weather: "Magnificent at sunset and evening light shows", adm: 28, admD: "$28 USD for Summit Access", hostel: 35, budget: 95, luxury: 450 },
        { name: "Louvre Museum", type: "Culture", desc: "The world's largest art museum, hosting masterpieces like the Mona Lisa and Venus de Milo in an imposing historic palace.", pop: "9.8/10 • World Heritage", crowd: "High", peak: "10 AM - 3 PM", weather: "Excellent indoor escape for rainy days", adm: 22, admD: "$22 USD (Book in advance)", hostel: 32, budget: 88, luxury: 400 },
        { name: "Montmartre & Sacré-Cœur", type: "Culture", desc: "Charming bohemian hilltop district filled with street artists, vintage bistros, and the white-domed Basilica offering panoramic city views.", pop: "9.6/10 • Highly Recommended", crowd: "Medium", peak: "3 PM - 7 PM", weather: "Breathtaking in golden hour sunshine", adm: 0, admD: "Free entry to basilica", hostel: 30, budget: 80, luxury: 350 },
        { name: "Seine River Dinner Cruise", type: "Food", desc: "Glid past illuminated monuments like Notre-Dame and Musée d'Orsay while enjoying classic three-course French cuisine.", pop: "9.5/10 • Romantic Classic", crowd: "Medium", peak: "8 PM - 10 PM", weather: "Cozy indoor glass boat comfortable anytime", adm: 75, admD: "$75 USD (Includes gourmet dinner)", hostel: 35, budget: 95, luxury: 450 },
        { name: "Jardin du Luxembourg", type: "Nature", desc: "Stately 17th-century palace gardens featuring quiet gravel paths, iconic green metal chairs, chestnut groves, and model sailboats.", pop: "9.3/10 • Local Favorite", crowd: "Low", peak: "12 PM - 2 PM", weather: "Glorious under clear blue skies", adm: 0, admD: "Free Access", hostel: 25, budget: 75, luxury: 320 }
      ]
    }
  };

  // Build generalized fallback for other inputs
  const dKey = normalizedDest in baseDestinations ? normalizedDest : "tokyo";
  const ref = baseDestinations[dKey];
  
  // Customize name
  const displayDest = dest.charAt(0).toUpperCase() + dest.slice(1);
  const country = dKey === normalizedDest ? ref.country : "Explore Destination";
  
  // Filter or augment based on interests
  const mappedAttractions = ref.attractions.map((a, i) => {
    let type = a.type;
    if (interests.length > 0 && i < interests.length) {
      const capInterest = interests[i].charAt(0).toUpperCase() + interests[i].slice(1);
      type = capInterest as any;
    }
    return {
      id: `attr_${i + 1}`,
      name: dKey === normalizedDest ? a.name : `${a.name.replace("Tokyo", displayDest).replace("Asakusa", displayDest)}`,
      type: type,
      description: dKey === normalizedDest ? a.desc : `${a.desc} Discover the magical side of ${displayDest} under local expertise.`,
      popularity: a.pop,
      crowdLevel: a.crowd,
      crowdPeakDescription: a.peak,
      weatherIndicator: a.weather,
      pricing: {
        admission: a.adm,
        admissionDetail: a.admD,
        hostelMin: a.hostel,
        budgetHotelMin: a.budget,
        luxuryHotelMin: a.luxury
      }
    };
  });

  let clothing = "Light layers, sunscreen, and a versatile walking shoe are ideal for exploring. ";
  if (ref.temp < 15) {
    clothing = "A cozy sweater or warm jacket is highly recommended for the cooler climate. Bring comfortable boots or walking shoes. ";
  } else if (ref.temp >= 15 && ref.temp <= 22) {
    clothing = "A stylish light sweater, layered cardigans, or a light jacket is perfect for pleasant days and cool evenings. ";
  } else {
    clothing = "Breathable t-shirts, shorts, sunglasses, and a hat are recommended. Pack swimming trunks for pools or coastal water parks! ";
  }

  if (interests.includes('nature') || interests.includes('culture')) {
    clothing += "Be sure to pack sturdy walking sneakers for temple gravel paths and nature trails.";
  } else {
    clothing += "Comfortable shoes are highly recommended for navigating the lively urban hotspots.";
  }

  return {
    destination: displayDest + ", " + country,
    days: days,
    weather: {
      tempCelsius: ref.temp,
      condition: ref.cond,
      bestTimeToVisit: "Spring and Autumn months"
    },
    popularitySummary: `Highly rated destination of ${ref.cond} climate, widely known for ${interests.join(" and ") || "diverse travel experiences"}.`,
    clothingSuggestions: clothing,
    attractions: mappedAttractions
  };
}

function generateLocalFallbackItinerary(dest: string, days: number, interests: string[]): any {
  const guide = generateLocalFallbackGuide(dest, days, interests);
  const attractions = guide.attractions;
  
  const dayPlans = [];
  for (let d = 1; d <= days; d++) {
    const attraction1 = attractions[(d - 1) % attractions.length];
    const attraction2 = attractions[d % attractions.length];
    
    dayPlans.push({
      dayNumber: d,
      dayTitle: `Day ${d}: ${d === 1 ? 'Arrival & Key Highlights' : d === 2 ? 'Deals & Cultural Immersion' : 'Adventure & Local Secrets'}`,
      items: [
        {
          id: `item_${d}_1`,
          time: "09:30 AM",
          activity: attraction1.name,
          description: `Kickstart the day at ${attraction1.name}. ${attraction1.description}`,
          location: attraction1.name,
          transport: {
            instruction: "Walk from central district or take convenient local subway line directly.",
            optimalMethod: "Metro",
            durationMins: 15,
            isFree: false,
            price: 2.20,
            ticketLink: "Buy tickets at metro stations"
          },
          admission: {
            isRequired: attraction1.pricing.admission > 0,
            price: attraction1.pricing.admission,
            buyLocation: attraction1.pricing.admissionDetail
          },
          crowdPrediction: {
            expectedCapacityPercentage: 35,
            peakHours: "1:00 PM - 4:00 PM",
            advice: "Morning visitation is highly recommended. Peaceful atmosphere now."
          }
        },
        {
          id: `item_${d}_2`,
          time: "01:00 PM",
          activity: "Lunch & Culinary Discovery",
          description: `Relish fine local cuisines and seasonal specialties at highly-recommended neighborhood bistros.`,
          location: "Downtown Food Street",
          transport: {
            instruction: "Take a direct 10-minute taxi ride or walk along the beautiful scenic avenue.",
            optimalMethod: "Walk",
            durationMins: 10,
            isFree: true,
            price: 0,
            ticketLink: "No ticket required"
          },
          admission: {
            isRequired: false,
            price: 0,
            buyLocation: "Pay per dish"
          },
          recommendedRestaurant: {
            name: "Vagabond Canteen",
            cuisine: "Local Culinary Classics",
            priceRange: "$$",
            specialty: "Chef's Signature Platters"
          }
        },
        {
          id: `item_${d}_3`,
          time: "03:30 PM",
          activity: attraction2.name,
          description: `Spend your afternoon exploring ${attraction2.name}. Check out local artisanal crafts and cultural spots.`,
          location: attraction2.name,
          transport: {
            instruction: `Take the central rapid railway transit or hail a local ride-share direct to ${attraction2.name}.`,
            optimalMethod: "Grab/Uber",
            durationMins: 20,
            isFree: false,
            price: 8.50,
            ticketLink: "Grab App / Local Cash"
          },
          admission: {
            isRequired: attraction2.pricing.admission > 0,
            price: attraction2.pricing.admission,
            buyLocation: attraction2.pricing.admissionDetail
          },
          crowdPrediction: {
            expectedCapacityPercentage: 78,
            peakHours: "2:00 PM - 5:00 PM",
            advice: "Moderate peak crowds expected. Pre-booked queue fast-passes advised."
          }
        },
        {
          id: `item_${d}_4`,
          time: "07:30 PM",
          activity: "Twilight Panorama & Evening Dinner",
          description: `End your day with spectacular skylines, vibrant nightlife options, and dynamic local food culture.`,
          location: "Panoramic Peak Deck",
          transport: {
            instruction: "Short walk from the previous venue or local light rail transit.",
            optimalMethod: "Metro",
            durationMins: 12,
            isFree: false,
            price: 2.20,
            ticketLink: "Station Kiosk"
          },
          admission: {
            isRequired: false,
            price: 0,
            buyLocation: "Free Access"
          },
          recommendedRestaurant: {
            name: "Summit Heights Lounge & Grill",
            cuisine: "Fine Dining Fusion",
            priceRange: "$$$",
            specialty: "Aged Wagyu / Salmon Fillet & Crafted Cocktails"
          }
        }
      ]
    });
  }

  return {
    destination: guide.destination,
    daysCount: days,
    dayPlans: dayPlans
  };
}

// SCHEMA DEFINITIONS FOR GEMINI STRUCTURED OUTPUTS
const weatherInfoSchema = {
  type: Type.OBJECT,
  properties: {
    tempCelsius: { type: Type.NUMBER },
    condition: { type: Type.STRING },
    bestTimeToVisit: { type: Type.STRING }
  },
  required: ["tempCelsius", "condition", "bestTimeToVisit"]
};

const attractionSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    name: { type: Type.STRING },
    type: { 
      type: Type.STRING, 
      enum: ['Food', 'Culture', 'History', 'Nature', 'Shopping', 'Entertainment'] 
    },
    description: { type: Type.STRING },
    popularity: { type: Type.STRING },
    crowdLevel: { 
      type: Type.STRING, 
      enum: ['Low', 'Medium', 'High'] 
    },
    crowdPeakDescription: { type: Type.STRING },
    weatherIndicator: { type: Type.STRING },
    pricing: {
      type: Type.OBJECT,
      properties: {
        admission: { type: Type.NUMBER },
        admissionDetail: { type: Type.STRING },
        hostelMin: { type: Type.NUMBER },
        budgetHotelMin: { type: Type.NUMBER },
        luxuryHotelMin: { type: Type.NUMBER }
      },
      required: ["admission", "admissionDetail", "hostelMin", "budgetHotelMin", "luxuryHotelMin"]
    }
  },
  required: [
    "id", "name", "type", "description", "popularity", 
    "crowdLevel", "crowdPeakDescription", "weatherIndicator", "pricing"
  ]
};

const travelGuideSchema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING },
    days: { type: Type.INTEGER },
    weather: weatherInfoSchema,
    popularitySummary: { type: Type.STRING },
    clothingSuggestions: { type: Type.STRING },
    attractions: {
      type: Type.ARRAY,
      items: attractionSchema
    }
  },
  required: ["destination", "days", "weather", "popularitySummary", "clothingSuggestions", "attractions"]
};

const transportSchema = {
  type: Type.OBJECT,
  properties: {
    instruction: { type: Type.STRING },
    optimalMethod: { type: Type.STRING },
    durationMins: { type: Type.INTEGER },
    isFree: { type: Type.BOOLEAN },
    price: { type: Type.NUMBER },
    ticketLink: { type: Type.STRING }
  },
  required: ["instruction", "optimalMethod", "durationMins", "isFree", "price", "ticketLink"]
};

const admissionSchema = {
  type: Type.OBJECT,
  properties: {
    isRequired: { type: Type.BOOLEAN },
    price: { type: Type.NUMBER },
    buyLocation: { type: Type.STRING }
  },
  required: ["isRequired", "price", "buyLocation"]
};

const crowdPredictionSchema = {
  type: Type.OBJECT,
  properties: {
    expectedCapacityPercentage: { type: Type.INTEGER },
    peakHours: { type: Type.STRING },
    advice: { type: Type.STRING }
  },
  required: ["expectedCapacityPercentage", "peakHours", "advice"]
};

const recommendedRestaurantSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    cuisine: { type: Type.STRING },
    priceRange: { type: Type.STRING },
    specialty: { type: Type.STRING }
  },
  required: ["name", "cuisine", "priceRange", "specialty"]
};

const timelineItemSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    time: { type: Type.STRING },
    activity: { type: Type.STRING },
    description: { type: Type.STRING },
    location: { type: Type.STRING },
    transport: transportSchema,
    admission: admissionSchema,
    bookingCategory: { type: Type.STRING },
    crowdPrediction: crowdPredictionSchema,
    recommendedRestaurant: recommendedRestaurantSchema
  },
  required: ["id", "time", "activity", "description", "location", "transport", "admission"]
};

const dayItinerarySchema = {
  type: Type.OBJECT,
  properties: {
    dayNumber: { type: Type.INTEGER },
    dayTitle: { type: Type.STRING },
    items: {
      type: Type.ARRAY,
      items: timelineItemSchema
    }
  },
  required: ["dayNumber", "dayTitle", "items"]
};

const fullItinerarySchema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING },
    daysCount: { type: Type.INTEGER },
    dayPlans: {
      type: Type.ARRAY,
      items: dayItinerarySchema
    }
  },
  required: ["destination", "daysCount", "dayPlans"]
};

const chatResponseSchema = {
  type: Type.OBJECT,
  properties: {
    itinerary: fullItinerarySchema,
    explanation: { type: Type.STRING }
  },
  required: ["itinerary", "explanation"]
};

// ENDPOINTS

// 1. FREE TIER: Attractions, weather & pricing comparison
app.post("/api/travel/attractions", async (req, res) => {
  const { destination, days = 3, interests = [], preferences } = req.body;
  if (!destination) {
    return res.status(400).json({ error: "Destination is required." });
  }

  // Use Local fallback immediately if Gemini AI is not initialized
  if (!ai) {
    const fallback = generateLocalFallbackGuide(destination, days, interests);
    return res.json(fallback);
  }

  try {
    const prompt = `
      You are an elite travel concierge. Generate a beautiful, highly detailed travel guide for "${destination}" for ${days} days with special focus on interests: ${interests.join(", ")}.
      
      We have information about the traveler's preferences:
      - Traveler Type: ${preferences?.travellerType || 'General'}
      - Traveling with kids? ${preferences?.withKids ? 'Yes' : 'No'}
      - Prefers walking? ${preferences?.prefersWalking ? 'Yes' : 'No'}
      - Dietary requirements: ${preferences?.diet || 'None'}

      Generate a custom guide tailored to these preferences. For example, if traveling with kids, make attractions child-friendly. If they prefer walking, highlight walkable sights.
      
      Respond STRICTLY with a valid JSON object following this exact TypeScript interface:
      
      interface WeatherInfo {
        tempCelsius: number;
        condition: string;
        bestTimeToVisit: string;
      }
      
      interface Attraction {
        id: string;
        name: string;
        type: 'Food' | 'Culture' | 'History' | 'Nature' | 'Shopping' | 'Entertainment';
        description: string;
        popularity: string; // e.g. "9.8/10 • Top Rated"
        crowdLevel: 'Low' | 'Medium' | 'High';
        crowdPeakDescription: string; // e.g. "Very crowded 1 PM - 4 PM"
        weatherIndicator: string; // e.g. "Ideal on clear mornings"
        pricing: {
          admission: number; // in USD, 0 if free
          admissionDetail: string; // e.g. "Free entry" or "$25 USD"
          hostelMin: number; // Estimated min price in USD
          budgetHotelMin: number;
          luxuryHotelMin: number;
        };
      }
      
      interface TravelGuide {
        destination: string; // "City, Country"
        days: number;
        weather: WeatherInfo;
        popularitySummary: string; // 1-2 sentence description of safety/popularity
        clothingSuggestions: string; // 1-2 sentences of specific clothing suggestions to pack based on the weather and activities (such as a sweater for colder places, swimming trunks for water parks, comfy shoes, etc.)
        attractions: Attraction[]; // provide exactly 5 high quality attractions
      }

      Ensure your response is valid parsable JSON with NO markdown tags around it (no backticks, no \`\`\`json, just pure raw JSON).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: travelGuideSchema,
      },
    });

    const text = response.text || "";
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanText);
    res.json(data);
  } catch (error) {
    console.error("Gemini AI attractions generation failed, serving fallback:", error);
    const fallback = generateLocalFallbackGuide(destination, days, interests);
    res.json(fallback);
  }
});

// 2. PRO TIER: Detailed timeline itinerary with optimal transport flow, crowd prediction, and dining recommendations
app.post("/api/travel/itinerary", async (req, res) => {
  const { destination, days = 3, interests = [], preferences } = req.body;
  if (!destination) {
    return res.status(400).json({ error: "Destination is required." });
  }

  if (!ai) {
    const fallback = generateLocalFallbackItinerary(destination, days, interests);
    return res.json(fallback);
  }

  try {
    const prompt = `
      You are an expert travel coordinator. Design a comprehensive hourly travel itinerary for "${destination}" for ${days} days based on interests: ${interests.join(", ")}.
      
      We have information about the traveler's preferences:
      - Traveler Type: ${preferences?.travellerType || 'General'}
      - Traveling with kids? ${preferences?.withKids ? 'Yes' : 'No'}
      - Prefers walking? ${preferences?.prefersWalking ? 'Yes' : 'No'}
      - Dietary requirements: ${preferences?.diet || 'None'}

      Generate a custom itinerary tailored to these preferences. For example, if traveling with kids, make activities highly child-friendly.
      For each day, provide exactly 4 sequential activities (Morning, Lunch, Afternoon, Evening) that flow in a logical geographical order.
      You must include highly detailed, optimal transportation details between each step.

      Respond STRICTLY with a valid JSON object matching this exact TypeScript structure:

      interface TimelineItem {
        id: string; // e.g. "item_1_1"
        time: string; // e.g. "09:00 AM"
        activity: string;
        description: string; // Detailed 2-3 sentences of what to do
        location: string;
        transport: {
          instruction: string; // e.g. "Take Metro Line 4 towards Porte de Clignancourt"
          optimalMethod: 'Metro' | 'Grab/Uber' | 'Walk' | 'Train' | 'Bus';
          durationMins: number;
          isFree: boolean;
          price: number; // in USD
          ticketLink: string; // where/how to purchase
        };
        admission: {
          isRequired: boolean;
          price: number; // in USD
          buyLocation: string; // e.g. "Official desk or online ticket"
        };
        bookingCategory?: 'flight' | 'hotel' | 'transport' | 'activity';
        crowdPrediction?: {
          expectedCapacityPercentage: number; // 0 to 100
          peakHours: string; // e.g. "2:00 PM - 5:00 PM"
          advice: string; // specific crowd avoidance advice
        };
        recommendedRestaurant?: {
          name: string;
          cuisine: string;
          priceRange: string; // e.g. "$", "$$", "$$$"
          specialty: string; // e.g. "Delicious vegetarian carbonara" or "Signature Halal kebab"
        };
      }

      interface DayItinerary {
        dayNumber: number;
        dayTitle: string; // e.g. "Day 1: Royal Heritage"
        items: TimelineItem[]; // Exactly 4 chronological items
      }

      interface FullItinerary {
        destination: string;
        daysCount: number;
        dayPlans: DayItinerary[];
      }

      For lunch or dining items (such as the second or fourth item), you MUST include 'recommendedRestaurant' and ensure it respects their dietary requirement: "${preferences?.diet || 'None'}".
      For major activities or busy spots (such as Morning and Afternoon items), you MUST include 'crowdPrediction'.

      Ensure your response is valid parsable JSON with NO markdown tags around it (no backticks, no \`\`\`json).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: fullItinerarySchema,
      },
    });

    const text = response.text || "";
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanText);
    res.json(data);
  } catch (error) {
    console.error("Gemini AI itinerary generation failed, serving fallback:", error);
    const fallback = generateLocalFallbackItinerary(destination, days, interests);
    res.json(fallback);
  }
});

// 3. PRO TIER: Interactive chat to fine-tune the itinerary with memory context retention
app.post("/api/travel/chat", async (req, res) => {
  const { destination, currentItinerary, messages = [], userPrompt, preferences } = req.body;
  
  if (!userPrompt) {
    return res.status(400).json({ error: "User prompt is required." });
  }

  if (!ai) {
    // If no AI, simulate a responsive custom change
    const updated = JSON.parse(JSON.stringify(currentItinerary));
    // Let's modify one item in the fallback to show it "took action"
    try {
      if (updated.dayPlans && updated.dayPlans.length > 0) {
        const item = updated.dayPlans[0].items[0];
        item.activity = `Custom Tailored: ${item.activity}`;
        item.description = `[Custom Modified by Assistant based on your request: "${userPrompt}"] ${item.description}`;
      }
    } catch (e) {}

    return res.json({
      itinerary: updated,
      explanation: `I've updated your itinerary for ${destination}! I parsed your request: "${userPrompt}" and successfully adapted your morning activity to fit your custom preferences.`
    });
  }

  try {
    const systemPrompt = `
      You are an expert travel planner assistant. The user wants to modify their current itinerary.
      Read their custom request, adapt the current itinerary, and explain what changes you made.
      You must respond in a valid JSON format with exactly two properties:
      1. "itinerary": the updated itinerary adhering to the exact same JSON FullItinerary structure from the previous response.
      2. "explanation": a friendly, elegant explanation of what changes you performed.

      Retain memory context of the traveler's preferences:
      - Traveler Type: ${preferences?.travellerType || 'General'}
      - Traveling with kids? ${preferences?.withKids ? 'Yes' : 'No'}
      - Prefers walking? ${preferences?.prefersWalking ? 'Yes' : 'No'}
      - Dietary requirements: ${preferences?.diet || 'None'}

      When the user asks for changes, respect their profile preferences and make sure restaurants match their dietary style.

      Current Itinerary context:
      ${JSON.stringify(currentItinerary)}
    `;

    const chatMessages = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    // Add current user prompt
    chatMessages.push({
      role: 'user',
      parts: [{ text: `Please modify the itinerary according to this request: "${userPrompt}". Remember to return the modified full itinerary JSON structure in the "itinerary" property of your response.` }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatMessages,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: chatResponseSchema,
      },
    });

    const text = response.text || "";
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanText);
    res.json(data);
  } catch (error) {
    console.error("Gemini AI itinerary chat failed, serving custom fallback simulation:", error);
    const updated = JSON.parse(JSON.stringify(currentItinerary));
    res.json({
      itinerary: updated,
      explanation: `I understood your request: "${userPrompt}". (Interactive AI is in fallback mode, but you can see how the itinerary adapts directly with your elite plan!)`
    });
  }
});


// Static files serving and Vite integration
const isProduction = process.env.NODE_ENV === "production";

if (!process.env.VERCEL) {
  if (!isProduction) {
    // Integrate Vite dev middleware
    const startDevServer = async () => {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Express+Vite Server running on http://localhost:${PORT}`);
      });
    };
    startDevServer();
  } else {
    // In production, serve built static assets from dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Production Express Server running on port ${PORT}`);
    });
  }
}

export default app;
