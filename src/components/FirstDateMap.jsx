import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Sparkles, Maximize2 } from 'lucide-react';
import ImageExpandModal from './ImageExpandModal';

// Fix for Leaflet's default marker asset URLs in React / bundler environments (Vite / Webpack)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// --- ASSET CONFIGURATION (Update your first date photo directly here in code) ---
import defaultFirstDateImg from '@/assets/date.jpeg';
const FIRST_DATE_IMAGE_SRC = defaultFirstDateImg;

// Thamine, Insein Township, Yangon, Myanmar coordinates (First Date Location)
const FIRST_DATE_COORDS = [16.865138701282937, 96.12054777131578];
const ZOOM_LEVEL = 15;

// Custom Romantic Heart Marker Icon
const firstDateHeartIcon = L.divIcon({
  className: 'custom-first-date-marker',
  html: `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
      <!-- Glowing animated pulse ring -->
      <span style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background-color: rgba(236, 72, 153, 0.4); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
      
      <!-- Heart Icon Pin Bubble -->
      <div style="
        position: relative;
        z-index: 10;
        width: 42px;
        height: 42px;
        background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
        border: 2.5px solid #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 20px -3px rgba(236, 72, 153, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
        transform: translateY(0);
        transition: transform 0.2s ease;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="#ffffff">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      <!-- Marker bottom point pointer -->
      <div style="
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid #f43f5e;
        margin-top: -2px;
        filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
      "></div>
    </div>
  `,
  iconSize: [42, 50],
  iconAnchor: [21, 48],
  popupAnchor: [0, -48],
});

// Helper component to center map back to the first date location
function RecenterController({ triggerRecenter }) {
  const map = useMap();

  useEffect(() => {
    if (triggerRecenter) {
      map.flyTo(FIRST_DATE_COORDS, ZOOM_LEVEL, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [triggerRecenter, map]);

  return null;
}

/**
 * FirstDateMap Component
 */
export default function FirstDateMap({
  height = '480px',
  className = '',
  autoOpenPopup = true,
  imageSrc = FIRST_DATE_IMAGE_SRC,
}) {
  const markerRef = useRef(null);
  const [recenterCount, setRecenterCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Automatically open the styled popup once the marker mounts
  useEffect(() => {
    if (autoOpenPopup && markerRef.current) {
      const timer = setTimeout(() => {
        markerRef.current?.openPopup();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [autoOpenPopup]);

  const handleRecenter = () => {
    setRecenterCount((prev) => prev + 1);
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  };

  return (
    <div
      className={`relative w-full rounded-3xl border-2 sm:border-3 border-slate-800 bg-slate-900 shadow-2xl overflow-hidden transition-all duration-300 ${className}`}
      style={{ height }}
    >
      {/* Top Floating Header Badge */}
      <div className="absolute top-4 left-4 z-[450] flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white shadow-lg pointer-events-auto">
        <div className="p-1 rounded-full bg-pink-500/20 text-pink-400">
          <MapPin className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-bold tracking-wide">
          First Date Spot
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
        <span className="text-[11px] text-pink-300 font-medium hidden sm:inline">
          KOSAN Bar Thamine Branch • 1 Nov 2026, 3:30 PM
        </span>
      </div>

      {/* Recenter Button Overlay */}
      <button
        type="button"
        onClick={handleRecenter}
        className="absolute top-4 right-4 z-[450] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-800 text-xs font-bold shadow-lg border border-slate-300 hover:border-pink-400 hover:text-pink-600 transition-all cursor-pointer active:scale-95 pointer-events-auto"
        title="Recenter Map to First Date"
      >
        <Navigation className="w-3.5 h-3.5 text-pink-500" />
        <span className="hidden sm:inline">Recenter Spot</span>
      </button>

      {/* OpenStreetMap via React-Leaflet */}
      <MapContainer
        center={FIRST_DATE_COORDS}
        zoom={ZOOM_LEVEL}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        style={{ height: '100%', width: '100%' }}
      >
        {/* Free OpenStreetMap standard tile layer (No API key required) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Recenter flight controller */}
        <RecenterController triggerRecenter={recenterCount} />

        {/* First Date Custom Heart Marker */}
        <Marker
          ref={markerRef}
          position={FIRST_DATE_COORDS}
          icon={firstDateHeartIcon}
        >
          {/* Custom Styled Popup with Image */}
          <Popup
            className="first-date-romantic-popup"
            closeButton={true}
            autoPan={true}
            offset={[0, -20]}
          >
            <div className="p-1.5 sm:p-2 text-center min-w-[210px] max-w-[240px] select-none">
              
              {/* Romantic Picture inside Popup */}
              <div
                onClick={() => setIsExpanded(true)}
                className="group relative aspect-video w-full overflow-hidden rounded-xl bg-pink-100 mb-2 border border-pink-200/90 shadow-sm cursor-pointer hover:border-pink-400 transition-all"
                title="Click to expand photo"
              >
                <img
                  src={imageSrc}
                  alt="Our First Date Memory"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1 text-white text-[10px] font-semibold backdrop-blur-[1px]">
                  <Maximize2 className="w-3.5 h-3.5 text-pink-300" />
                  <span>Expand</span>
                </div>

                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm border border-pink-200 text-[9px] font-bold text-pink-600 flex items-center gap-1 shadow-xs pointer-events-none">
                  <Sparkles className="w-2.5 h-2.5 text-pink-500" />
                  <span>Special Moment</span>
                </div>
              </div>

              {/* Title: Our First Date 💖 */}
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center justify-center gap-1">
                Our First Date <span className="text-pink-500">💖</span>
              </h3>

              {/* Subtitle: KOSAN Bar Thamine Branch */}
              <p className="text-xs font-bold text-pink-600 mt-0.5 flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3 text-pink-500 inline shrink-0" />
                <span className="truncate">KOSAN Bar Thamine Branch</span>
              </p>

              {/* Date & Time: 1 Nov 2026 3:30PM */}
              <div className="mt-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-700 bg-pink-50/80 rounded-md py-0.5 px-2 border border-pink-200/60">
                <span>🗓️ 1 Nov 2026 • 3:30 PM</span>
              </div>

              {/* Caption: Where our story began... */}
              <div className="mt-2 pt-1.5 border-t border-pink-100">
                <p className="text-xs italic text-slate-600 font-medium">
                  "Where our story began... KOSAN Bar"
                </p>
              </div>

            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Subtle bottom gradient glow */}
      <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none z-[400]" />

      {/* Expanded Image Modal */}
      <ImageExpandModal
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        src={imageSrc}
        alt="Our First Date Memory"
        title="Our First Date 💖"
        caption="1 Nov 2026 • 3:30 PM — KOSAN Bar Thamine Branch"
      />
    </div>
  );
}
