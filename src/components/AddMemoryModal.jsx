import { useState, useEffect } from 'react';
import { X, Image, Calendar, MapPin, Tag, Sparkles, Heart } from 'lucide-react';

const PRESET_PHOTOS = [
  {
    name: 'Sunset Beach 🌅',
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'Cozy Cafe ☕',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'Stargazing Night ✨',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'City Twilight 🌆',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sweet Picnic 🌸',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&auto=format&fit=crop&q=80',
  },
];

export default function AddMemoryModal({ isOpen, onClose, onAddMemory }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() =>
    new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  );
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_PHOTOS[0].url);
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('Date Night');
  const [rotationAngle, setRotationAngle] = useState('rotate-2');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const newMemory = {
      id: Date.now(),
      title: title.trim(),
      date,
      location: location.trim() || 'Our Secret Spot',
      imageUrl: imageUrl.trim(),
      description: description.trim() || 'A magical day filled with warm laughs and memories to keep forever.',
      tag: tag || 'Adventure',
      likes: 1,
      rotationClass: rotationAngle,
      quote: `Cherishing this sweet moment with Pan Pan forever.`,
      partnerNote: 'Pan Pan & ZMH',
    };

    onAddMemory(newMemory);
    onClose();

    // Reset form
    setTitle('');
    setLocation('');
    setDescription('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white border border-pink-300 rounded-3xl shadow-2xl p-6 sm:p-7 overflow-y-auto max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-pink-100 hover:bg-pink-200 text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2.5 rounded-2xl bg-pink-500/15 text-pink-600 border border-pink-400/30">
            <Heart className="w-5 h-5 fill-pink-500/30" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Capture a New Love Memory 🌸
            </h2>
            <p className="text-xs text-pink-700/70 font-medium">Add a tilted polaroid to our Ditto Storybook</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Memory Title <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunset gelato walk by the harbour"
              className="w-full text-sm bg-pink-50/50 text-slate-900 rounded-xl px-3.5 py-2.5 border border-pink-300 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-pink-400/50 font-medium"
            />
          </div>

          {/* Date & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-pink-500" /> Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Oct 27, 2024"
                className="w-full text-xs bg-pink-50/50 text-slate-900 rounded-xl px-3 py-2.5 border border-pink-300 focus:outline-none focus:border-pink-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Kyoto Garden, Pier 39"
                className="w-full text-xs bg-pink-50/50 text-slate-900 rounded-xl px-3 py-2.5 border border-pink-300 focus:outline-none focus:border-pink-500 font-medium"
              />
            </div>
          </div>

          {/* Image URL & Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Image className="w-3.5 h-3.5 text-pink-500" /> Photo URL <span className="text-pink-500">*</span>
              </span>
              <span className="text-[11px] text-pink-600 font-semibold">Or choose a preset below:</span>
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-xs bg-pink-50/50 text-slate-900 rounded-xl px-3.5 py-2.5 border border-pink-300 focus:outline-none focus:border-pink-500 font-medium"
            />

            {/* Quick Photo Presets */}
            <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
              {PRESET_PHOTOS.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => setImageUrl(preset.url)}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-xl border whitespace-nowrap cursor-pointer transition-all ${
                    imageUrl === preset.url
                      ? 'bg-pink-500 text-white border-pink-500 shadow-sm shadow-pink-500/30'
                      : 'bg-pink-50 border-pink-200 text-slate-700 hover:border-pink-400'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tag & Tilt Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-pink-500" /> Category Tag
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full text-xs bg-pink-50/50 text-slate-900 rounded-xl px-3 py-2.5 border border-pink-300 focus:outline-none focus:border-pink-500 cursor-pointer font-medium"
              >
                <option value="Date Night">Date Night 🍷</option>
                <option value="Road Trip">Road Trip 🚗</option>
                <option value="First Time">First Time ✨</option>
                <option value="Cozy Home">Cozy Home ☕</option>
                <option value="Nature Walk">Nature Walk 🌿</option>
                <option value="Celebration">Celebration 🎂</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Polaroid Tilt Angle
              </label>
              <select
                value={rotationAngle}
                onChange={(e) => setRotationAngle(e.target.value)}
                className="w-full text-xs bg-pink-50/50 text-slate-900 rounded-xl px-3 py-2.5 border border-pink-300 focus:outline-none focus:border-pink-500 cursor-pointer font-medium"
              >
                <option value="rotate-2">Tilt Right (+2°)</option>
                <option value="-rotate-3">Tilt Left (-3°)</option>
                <option value="rotate-6">Playful Right (+6°)</option>
                <option value="-rotate-6">Playful Left (-6°)</option>
                <option value="rotate-0">Straight (0°)</option>
              </select>
            </div>
          </div>

          {/* Story / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Sweet Story / Note 💖
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What made this moment unforgettable with Pan Pan? Write your warm thoughts..."
              className="w-full text-xs bg-pink-50/50 text-slate-900 rounded-xl px-3.5 py-2.5 border border-pink-300 focus:outline-none focus:border-pink-500 transition-all placeholder:text-pink-400/50 font-medium"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 hover:from-pink-400 hover:to-rose-400 shadow-lg shadow-pink-500/25 cursor-pointer active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pin to Storybook 🌸</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
