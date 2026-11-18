import React, { useState } from 'react';
import { X, Image as ImageIcon, MapPin, Mountain, Plus, Sparkles, Check } from 'lucide-react';
import { useToast } from '../common/Toast';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: 'story' | 'guide' | 'expedition' | 'tip';
    title?: string;
    content: string;
    locationName: string;
    country: string;
    mediaUrls: string[];
    tags: string[];
    specs?: {
      elevation?: string;
      distance?: string;
      duration?: string;
      season?: string;
      difficulty?: string;
    };
  }) => void;
}

const PHOTO_PRESETS = [
  { label: 'Patagonia Fitz Roy Lake', url: '/src/assets/images/hero_patagonia_peaks_1793636634337.jpg' },
  { label: 'Swiss Alps Ridge', url: '/src/assets/images/traveler_cover_alps_1793636634695.jpg' },
  { label: 'Kyoto Cedar Forest Path', url: '/src/assets/images/traveler_cover_kyoto_1793636635826.jpg' },
  { label: 'Dolomites Tre Cime Sunset', url: '/src/assets/images/expedition_dolomites_1793636634749.jpg' },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { showToast } = useToast();
  const [type, setType] = useState<'story' | 'guide' | 'expedition' | 'tip'>('expedition');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [locationName, setLocationName] = useState('');
  const [country, setCountry] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([PHOTO_PRESETS[0].url]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('Trekking, Alpine, Adventure');
  
  // Optional specs
  const [elevation, setElevation] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState('Moderate');

  if (!isOpen) return null;

  const togglePresetPhoto = (url: string) => {
    if (selectedPhotos.includes(url)) {
      if (selectedPhotos.length > 1) {
        setSelectedPhotos(selectedPhotos.filter((u) => u !== url));
      }
    } else {
      setSelectedPhotos([...selectedPhotos, url]);
    }
  };

  const addCustomPhoto = () => {
    if (!customPhotoUrl.trim()) return;
    setSelectedPhotos([...selectedPhotos, customPhotoUrl.trim()]);
    setCustomPhotoUrl('');
    showToast('Photo added to post', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !locationName.trim() || !country.trim()) {
      showToast('Please provide your travel story, location, and country', 'error');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const specs = (elevation || distance || duration || difficulty) ? {
      elevation: elevation ? `${elevation} m` : undefined,
      distance: distance ? `${distance} km` : undefined,
      duration: duration || undefined,
      difficulty: difficulty || undefined,
    } : undefined;

    onSubmit({
      type,
      title: title.trim() || undefined,
      content: content.trim(),
      locationName: locationName.trim(),
      country: country.trim(),
      mediaUrls: selectedPhotos,
      tags,
      specs,
    });

    onClose();
    showToast('Journey documented to the global travel network!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl my-8 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-display text-stone-900">
              Share Travel Journey & Intelligence
            </h2>
            <p className="text-xs text-stone-500">Contribute verified expedition logs, routes, and tips</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          {/* Post Type Selector */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1.5">Log Type</label>
            <div className="grid grid-cols-4 gap-2">
              {(['expedition', 'guide', 'story', 'tip'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 px-2.5 rounded-xl font-semibold capitalize transition-all text-center ${
                    type === t
                      ? 'bg-[#1B3B2B] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Headline / Route Name</label>
            <input
              type="text"
              placeholder="e.g. Navigating the Wind Corridor above Laguna de los Tres"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
            />
          </div>

          {/* Location & Country */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Destination / Landmark *</label>
              <input
                type="text"
                required
                placeholder="e.g. Fitz Roy Glacier"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Country *</label>
              <input
                type="text"
                required
                placeholder="e.g. Argentina"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Narrative Content */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Story & Practical Insights *</label>
            <textarea
              required
              rows={4}
              placeholder="Share route conditions, gear performance, campsites, water sources, or local customs..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Technical Specs (for expedition/guide) */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
            <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-emerald-800" />
              <span>Technical Trail Specifications (Optional)</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Elevation (e.g. 3,405m)"
                value={elevation}
                onChange={(e) => setElevation(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="Distance (e.g. 21 km)"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="Duration (e.g. 8h 30m)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
              />
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
              >
                <option value="Gentle">Gentle</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
                <option value="Expedition Grade">Expedition Grade</option>
              </select>
            </div>
          </div>

          {/* High-Fidelity Photo Selector */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
              <span>Attached Photographs ({selectedPhotos.length} selected)</span>
              <span className="text-[10px] text-stone-400">Verified editorial library</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {PHOTO_PRESETS.map((photo) => {
                const isSelected = selectedPhotos.includes(photo.url);
                return (
                  <button
                    key={photo.url}
                    type="button"
                    onClick={() => togglePresetPhoto(photo.url)}
                    className={`relative rounded-xl overflow-hidden h-20 border-2 transition-all ${
                      isSelected ? 'border-emerald-700 ring-2 ring-emerald-700/30' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-emerald-700 text-white rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] p-1 truncate block text-left">
                      {photo.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom URL Option */}
            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="Or paste custom image URL..."
                value={customPhotoUrl}
                onChange={(e) => setCustomPhotoUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-stone-200 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={addCustomPhoto}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-medium"
              >
                Add URL
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Patagonia, AlpineClimbing, Bivouac"
              className="w-full px-3.5 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1B3B2B] hover:bg-[#142B20] text-white rounded-xl font-semibold shadow-xs transition-colors"
            >
              Publish Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
