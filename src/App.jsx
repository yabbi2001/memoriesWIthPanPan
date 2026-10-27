import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroFeaturedCard from './components/HeroFeaturedCard';
import ConversationCounterWidget from './components/ConversationCounterWidget';
import FirstPhoneCallWidget from './components/FirstPhoneCallWidget';
import RecentAdventureCard from './components/RecentAdventureCard';
import DatingMapWidget from './components/DatingMapWidget';
import FirstDateMap from './components/FirstDateMap';
import LightboxModal from './components/LightboxModal';
import { Heart, Compass, Sparkles, MapPin } from 'lucide-react';
import featuredChapterDateImg from '@/assets/date.jpeg';

const INITIAL_MEMORIES = [
  {
    id: 1,
    title: 'Our First Date at KOSAN Bar',
    date: '1 Nov 2026 • 3:30 PM',
    location: 'KOSAN Bar Thamine Branch',
    tag: 'First Date 💖',
    likes: 142,
    imageUrl: featuredChapterDateImg,
    description: 'Where our story officially began! Meeting at KOSAN Bar Thamine Branch on 1 Nov 2026 at 3:30 PM. Nervous laughter, sparkling eyes, and every sweet moment that started our journey together.',
    quote: 'In your eyes, I found my favorite place in the whole universe.',
    partnerNote: 'Pan Pan & ZMH',
  },
  {
    id: 2,
    title: 'Sunset Beach Walk & Seashell Collecting',
    location: 'Golden Coast Sands & Shoreline',
    tag: 'Beach',
    likes: 94,
    rotationClass: 'rotate-2',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    description: 'Walking barefoot along the warm tide, collecting pretty pink seashells, and dipping our toes in the water as the ocean turns into shades of violet and peach.',
    quote: 'Our love is as infinite as the ocean tide.',
    partnerNote: 'Beach dream date',
  },
  {
    id: 3,
    title: 'Moonlight Seaside Picnic & Star Watching',
    location: 'Silver Sands Cove',
    tag: 'Beach',
    likes: 82,
    rotationClass: '-rotate-2',
    imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80',
    description: 'Laying out a big cozy blanket on the sand with cold drinks and fresh strawberries, listening to the gentle rhythm of the night waves beneath a sky full of stars.',
    quote: 'Salt in the air, stars in your eyes.',
    partnerNote: 'Strawberries & ocean breeze',
  },
  {
    id: 4,
    title: 'Coastal Kayaking in Turquoise Waters',
    location: 'Crystal Lagoon Bay',
    tag: 'Beach',
    likes: 76,
    rotationClass: 'rotate-3',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
    description: 'Paddling a tandem kayak across crystal-clear turquoise waters together, exploring secret sea caves and swimming alongside colorful tropical fish.',
    quote: 'Drifting into paradise with you.',
    partnerNote: 'Tandem kayak adventure',
  },
  {
    id: 5,
    title: 'Scenic Mountain Sunrise & Hiking Trail',
    location: 'Pine Ridge Hilltop Trail',
    tag: 'Hiking',
    likes: 89,
    rotationClass: '-rotate-3',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    description: 'Hiking together up to the scenic ridge, catching the crisp morning breeze and watching the golden sunrise unfold above the rolling hills and misty clouds.',
    quote: 'Reaching new peaks hand in hand with you.',
    partnerNote: 'Mountain hike together',
  },
  {
    id: 6,
    title: 'Misty Pine Forest Trail & Hidden Waterfall',
    location: 'Cascade Canyon & Pine Valley',
    tag: 'Hiking',
    likes: 85,
    rotationClass: 'rotate-2',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    description: 'Trekking through towering evergreen pines to discover a secluded cascade waterfall, stopping to snap sweet polaroids surrounded by cool mountain mist.',
    quote: 'Lost in the forest, found in your love.',
    partnerNote: 'Waterfall picnic plan',
  },
  {
    id: 7,
    title: 'Golden Sunset Ridge & Panoramic Lookout',
    location: 'Eagle Peak Summit Viewpoint',
    tag: 'Hiking',
    likes: 91,
    rotationClass: '-rotate-2',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
    description: 'An afternoon summit hike up to the 360-degree overlook just in time for golden hour, sipping warm thermos hot cocoa while the horizon catches fire.',
    quote: 'The highest summit with my favorite person.',
    partnerNote: 'Sunset summit goal',
  },
  {
    id: 8,
    title: 'Rainy Afternoon Latte & Warm Pastries',
    location: 'Little Bean Corner Cafe',
    tag: 'Cozy Date',
    likes: 58,
    rotationClass: 'rotate-1',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    description: 'Sharing cinnamon buns while the rain beat softly against the cafe glass. You had cinnamon sugar on your nose and we giggled for ten minutes straight.',
    quote: 'Simple coffees, eternal warmth.',
    partnerNote: "Pan Pan's favorite cafe",
  },
  {
    id: 9,
    title: 'Cherry Blossoms in Kyoto & Mount Fuji Trip',
    location: 'Kyoto & Tokyo, Japan 🇯🇵',
    tag: 'Touring Countries',
    likes: 112,
    rotationClass: '-rotate-2',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
    description: 'Walking hand-in-hand under pink sakura petals through traditional historic alleys, tasting matcha treats, and gazing at majestic Mount Fuji together.',
    quote: 'Touring the world, one dream at a time with you.',
    partnerNote: 'Japan dream vacation',
  },
  {
    id: 10,
    title: 'Venice Gondola Ride & Rome Sunset Gelato',
    location: 'Venice & Rome, Italy 🇮🇹',
    tag: 'Touring Countries',
    likes: 98,
    rotationClass: 'rotate-2',
    imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&auto=format&fit=crop&q=80',
    description: 'Drifting along ancient emerald canals on a romantic gondola, tossing coins into the Trevi fountain, and sharing authentic Italian pistachio gelato.',
    quote: 'All roads lead to you, no matter how far we travel.',
    partnerNote: 'Italian romance tour',
  },
  {
    id: 11,
    title: 'Midnight Eiffel Tower Sparkles & Seine Cruise',
    location: 'Paris, France 🇫🇷',
    tag: 'Touring Countries',
    likes: 105,
    rotationClass: '-rotate-1',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
    description: 'Watching the Eiffel Tower light up with sparkling lights across the midnight sky, eating warm bakery croissants in Montmartre, and holding hands along the Seine.',
    quote: 'Paris is magical, but especially when I am with you.',
    partnerNote: 'Parisian love story',
  },
];

// First Conversation start date: Sep 17, 2026, 8:57 PM
const CONVERSATION_START_DATE = new Date(2026, 8, 17, 20, 57, 0);

const calculateDaysTogether = () => {
  const diff = Date.now() - CONVERSATION_START_DATE.getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

export default function App() {
  const [daysTogether, setDaysTogether] = useState(calculateDaysTogether);
  const [memories, setMemories] = useState(INITIAL_MEMORIES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeLightboxMemory, setActiveLightboxMemory] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setDaysTogether(calculateDaysTogether());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Featured Hero memory is the first item
  const heroMemory = memories[0];
  // Secondary adventure memories
  const adventureMemories = memories.slice(1);

  const categories = ['All', 'Touring Countries', 'Beach', 'Hiking', 'Cozy Date'];

  const filteredAdventures =
    selectedCategory === 'All'
      ? adventureMemories
      : adventureMemories.filter((m) => m.tag === selectedCategory);

  const handleLikeMemory = (memoryId) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === memoryId ? { ...m, likes: (m.likes || 0) + 1 } : m))
    );
  };

  return (
    <div className="min-h-screen bg-[#fff1f5] text-slate-800 flex flex-col font-sans selection:bg-pink-500/25 selection:text-pink-600 transition-colors duration-300 relative overflow-x-hidden">
      
      {/* Dreamy Pink Ambient Aura Glow Orbs in Background */}
      <div className="fixed top-10 left-1/4 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl pointer-events-none -z-10 animate-float" />
      <div className="fixed bottom-20 right-10 w-[450px] h-[450px] bg-rose-400/20 rounded-full blur-3xl pointer-events-none -z-10 animate-float" style={{ animationDelay: '2s' }} />
      <div className="fixed top-1/2 right-1/3 w-80 h-80 bg-fuchsia-300/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Navigation Bar with Lofi Ambient Audio & Couple Status */}
      <Navbar daysTogether={daysTogether} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Row 1: 12-Column Grid (Hero Polaroid on Left, Wave Chart & Mood on Right) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Column Left (col-span-12 lg:col-span-7): Hero Featured Polaroid Card */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping"></span>
                <span className="text-xs uppercase tracking-widest font-bold text-pink-600 flex items-center gap-1">
                  Featured Love Chapter <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                </span>
              </div>
              <span className="text-xs text-pink-700/80 font-medium">
                Tap photo to open lightbox
              </span>
            </div>

            {heroMemory && (
              <HeroFeaturedCard
                memory={heroMemory}
                onSelectMemory={(m) => setActiveLightboxMemory(m)}
              />
            )}
          </div>

          {/* Column Right (col-span-12 lg:col-span-5): Stacked Progress Wave & Pink Mood Widget */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Conversation Elapsed Live Counter Widget */}
            <ConversationCounterWidget />

            {/* First Phone Call Audio Player & Image Widget */}
            <FirstPhoneCallWidget />

          </div>
        </section>

        {/* Row 2: Recent Adventures & Tilted Polaroid Gallery */}
        <section className="space-y-4 pt-2">
          
          {/* Section Header & Category Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/90 p-4 rounded-2xl border border-pink-200/90 shadow-sm transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-pink-500/15 text-pink-600 border border-pink-400/30">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  Adventured Plans with Pan Pan <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                </h3>
                <p className="text-xs text-pink-700/70 font-medium">
                  Tilted polaroid snapshots of our upcoming romantic plans
                </p>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30 scale-105'
                      : 'bg-pink-50 border border-pink-200 text-slate-700 hover:border-pink-400 hover:text-pink-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Tilted Polaroid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 pt-2">
            {filteredAdventures.map((memory, index) => {
              // Alternating natural scattered polaroid rotations
              const rotationAngles = ['rotate-2', '-rotate-3', 'rotate-3', '-rotate-2'];
              const rotationClass = memory.rotationClass || rotationAngles[index % rotationAngles.length];

              return (
                <RecentAdventureCard
                  key={memory.id}
                  memory={memory}
                  rotationClass={rotationClass}
                  onSelectMemory={(m) => setActiveLightboxMemory(m)}
                />
              );
            })}
          </div>

        </section>

        {/* Row 3: First Date Location Map (Thamine, Insein, Yangon) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/90 p-4 rounded-2xl border border-pink-200/90 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-pink-500/15 text-pink-600 border border-pink-400/30">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  Our First Date Location <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                </h3>
                <p className="text-xs text-pink-700/70 font-medium">
                  Where our story began • 1 Nov 2026, 3:30 PM • KOSAN Bar Thamine Branch
                </p>
              </div>
            </div>
          </div>

          <FirstDateMap height="460px" />
        </section>

        {/* Row 4: React Leaflet Dating Map Widget */}
        <DatingMapWidget
          onSelectMemory={(m) => setActiveLightboxMemory(m)}
        />

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-pink-200/80 bg-white/80 py-6 px-4 mt-12 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" />
            <span>Dedicated with eternal love to <strong className="text-pink-600">Pan Pan & ZMH</strong></span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-pink-600 font-bold">
            <span>{daysTogether} Days & Counting 💖</span>
            <span>•</span>
            <span>Thinking Out Loud • Scars Become Art 🎵</span>
          </div>
        </div>
      </footer>

      {/* Interactive Lightbox Modal */}
      {activeLightboxMemory && (
        <LightboxModal
          memory={activeLightboxMemory}
          onClose={() => setActiveLightboxMemory(null)}
          onLike={handleLikeMemory}
        />
      )}

    </div>
  );
}
