import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Heart, Calendar, Sparkles, Navigation, Maximize2 } from 'lucide-react';
import firstDateImg from '@/assets/date.jpeg';

// Fix for Leaflet's default marker asset URLs in React / bundler environments
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom Pink Heart Marker Icon using L.divIcon
const createHeartIcon = (isSelected = false) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${isSelected ? '38px' : '32px'};
        height: ${isSelected ? '38px' : '32px'};
        background: linear-gradient(135deg, #ec4899, #f43f5e);
        border: 2.5px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 4px 15px rgba(236, 72, 153, ${isSelected ? '0.7' : '0.45'});
        transform: translate(-50%, -50%) ${isSelected ? 'scale(1.15)' : 'scale(1)'};
        transition: all 0.3s ease;
        cursor: pointer;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${isSelected ? '18' : '15'}" height="${isSelected ? '18' : '15'}" fill="#ffffff">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        ${isSelected ? '<span style="position: absolute; inset: -4px; border-radius: 50%; border: 2px solid #ec4899; opacity: 0.75; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>' : ''}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Helper component to smoothly animate pan/zoom when a location is clicked
function MapController({ selectedCoords }) {
  const map = useMap();
  if (selectedCoords) {
    map.flyTo(selectedCoords, 14, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }
  return null;
}

const INITIAL_DATING_SPOTS = [
  {
    id: 1,
    name: 'Our First Date - KOSAN Bar Thamine Branch',
    category: 'First Date',
    date: '1 Nov 2026 • 3:30 PM',
    location: 'KOSAN Bar Thamine Branch',
    lat: 16.865138701282937,
    lng: 96.12054777131578,
    imageUrl: firstDateImg,
    story: 'Where our story began... KOSAN Bar Thamine Branch on 1 Nov 2026 at 3:30 PM. Sweet smiles, nervous butterflies, and our very first romantic memory together.',
    tag: 'First Date 💖',
  },
];

export default function DatingMapWidget({ onSelectMemory }) {
  const [spots] = useState(INITIAL_DATING_SPOTS);
  const [selectedSpot, setSelectedSpot] = useState(spots[0]);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'First Date', 'Cafe & Food', 'Sunset Stroll', 'Special Trip'];

  const filteredSpots =
    activeCategory === 'All'
      ? spots
      : spots.filter((s) => s.category === activeCategory);

  const handleSpotClick = (spot) => {
    setSelectedSpot(spot);
  };

  return (
    <section className="rounded-3xl bg-white p-5 sm:p-7 border border-pink-200/90 shadow-xl shadow-pink-200/40 relative overflow-hidden transition-all">
      {/* Background Soft Pink Glow Orbs */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-pink-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-rose-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-rose-500/20 text-pink-600 border border-pink-400/40 shadow-sm shadow-pink-500/20">
            <MapPin className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                Where We Dated <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" />
              </h3>
            </div>
            <p className="text-xs text-pink-700/70 font-medium">
              Interactive map of Pan Pan & ZMH's romantic places and memories
            </p>
          </div>
        </div>

        {/* Stats Badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-200 text-xs font-semibold text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>{spots.length} Dated Spots Mapped</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeCategory === cat
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30 scale-105'
                : 'bg-pink-50/80 border border-pink-200 text-slate-700 hover:border-pink-400 hover:text-pink-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Leaflet Map Container (Left/Center) & Selected Spot Preview Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Leaflet Map (lg:col-span-8) */}
        <div className="lg:col-span-8 rounded-2xl overflow-hidden border-2 border-pink-200/90 shadow-inner relative min-h-[380px] sm:min-h-[440px]">
          <MapContainer
            center={[selectedSpot ? selectedSpot.lat : 16.8651, selectedSpot ? selectedSpot.lng : 96.1205]}
            zoom={15}
            scrollWheelZoom={false}
            className="w-full h-full min-h-[380px] sm:min-h-[440px] z-10"
          >
            {/* 100% Free OpenStreetMap standard tile layer (No API key required) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {/* Smooth animated flyer */}
            {selectedSpot && (
              <MapController selectedCoords={[selectedSpot.lat, selectedSpot.lng]} />
            )}

            {/* Markers for each dating location */}
            {filteredSpots.map((spot) => {
              const isSelected = selectedSpot?.id === spot.id;
              return (
                <Marker
                  key={spot.id}
                  position={[spot.lat, spot.lng]}
                  icon={createHeartIcon(isSelected)}
                  eventHandlers={{
                    click: () => handleSpotClick(spot),
                  }}
                >
                  <Popup className="custom-romantic-popup">
                    <div className="p-1 max-w-[220px] text-slate-800">
                      {spot.imageUrl && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-pink-100 mb-2 border border-pink-200/80 shadow-xs">
                          <img
                            src={spot.imageUrl}
                            alt={spot.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-[10px] font-bold text-pink-600 mb-1">
                        <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                        <span>{spot.category}</span>
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-900 leading-tight">
                        {spot.name}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                        {spot.story}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-pink-600 font-semibold border-t border-pink-100 pt-1">
                        <span>{spot.date}</span>
                        <span className="font-bold underline cursor-pointer" onClick={() => handleSpotClick(spot)}>View Details</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Floating Map Overlay Badge */}
          <div className="absolute top-3 left-3 z-[400] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-pink-300 text-xs font-bold text-pink-600 shadow-md">
            <Navigation className="w-3.5 h-3.5 text-pink-500" />
            <span>Interactive Heart Pins</span>
          </div>
        </div>

        {/* Selected Spot Details Card & Quick Navigator (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          
          {/* Active Spot Detail Box */}
          {selectedSpot && (
            <div className="rounded-2xl bg-pink-50/80 p-4 border border-pink-200/90 shadow-sm flex flex-col justify-between flex-1">
              <div>
                {/* Photo Thumbnail */}
                <div
                  onClick={() => {
                    if (onSelectMemory) {
                      onSelectMemory({
                        id: selectedSpot.id,
                        title: selectedSpot.name,
                        date: selectedSpot.date,
                        location: selectedSpot.location,
                        tag: selectedSpot.tag,
                        imageUrl: selectedSpot.imageUrl,
                        description: selectedSpot.story,
                        quote: 'Every date with you is an unforgettable chapter in our love story.',
                        likes: 99,
                      });
                    }
                  }}
                  className="group relative aspect-video w-full overflow-hidden rounded-xl bg-pink-100 mb-3 ring-1 ring-pink-200 cursor-pointer hover:ring-pink-400 transition-all shadow-xs"
                  title="Click to expand memory"
                >
                  <img
                    src={selectedSpot.imageUrl}
                    alt={selectedSpot.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Hover expand overlay */}
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1 text-white text-xs font-semibold backdrop-blur-[1px]">
                    <Maximize2 className="w-4 h-4 text-pink-300" />
                    <span>Click to expand</span>
                  </div>

                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm border border-pink-300 text-[10px] font-bold text-pink-600 flex items-center gap-1 shadow-sm pointer-events-none">
                    <Sparkles className="w-3 h-3 text-pink-500" />
                    <span>{selectedSpot.tag}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-pink-600 font-semibold mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedSpot.date}</span>
                  <span>•</span>
                  <span>{selectedSpot.category}</span>
                </div>

                <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                  {selectedSpot.name}
                </h4>

                <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                  "{selectedSpot.story}"
                </p>
              </div>

              {/* Coordinates & Button */}
              <div className="mt-4 pt-3 border-t border-pink-200/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-pink-600 font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-pink-500" />
                  <span>KOSAN Bar Thamine</span>
                </span>

                <button
                  onClick={() => onSelectMemory && onSelectMemory({
                    id: selectedSpot.id,
                    title: selectedSpot.name,
                    date: selectedSpot.date,
                    location: selectedSpot.name,
                    imageUrl: selectedSpot.imageUrl,
                    description: selectedSpot.story,
                    tag: selectedSpot.category,
                    likes: 88,
                    quote: `Remembering this wonderful date with Pan Pan forever.`,
                  })}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-pink-100 border border-pink-300 text-pink-600 font-bold text-xs cursor-pointer shadow-sm transition-all"
                >
                  Open in Lightbox 📸
                </button>
              </div>
            </div>
          )}

          {/* Quick List of Dating Locations */}
          <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
            <p className="text-[11px] font-bold text-slate-700 px-1">
              Tap any date to fly there:
            </p>
            {filteredSpots.map((spot) => {
              const isSelected = selectedSpot?.id === spot.id;
              return (
                <div
                  key={spot.id}
                  onClick={() => handleSpotClick(spot)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-500/25 scale-[1.02]'
                      : 'bg-white hover:bg-pink-50/80 border-pink-200/80 text-slate-700 hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Heart className={`w-3 h-3 shrink-0 ${isSelected ? 'fill-white text-white' : 'fill-pink-500 text-pink-500'}`} />
                    <span className="truncate">{spot.name}</span>
                  </div>
                  <span className={`text-[10px] shrink-0 ml-2 ${isSelected ? 'text-pink-100' : 'text-pink-600 font-bold'}`}>
                    {spot.date}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
