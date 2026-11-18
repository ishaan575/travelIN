import React, { useState } from 'react';
import { X, Calendar, Mountain, DollarSign, Users, Plus, Trash2 } from 'lucide-react';
import { TravelStyle } from '../../types';
import { useToast } from '../common/Toast';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    destination: string;
    country: string;
    coverUrl?: string;
    startDate: string;
    endDate: string;
    budgetTier: '$' | '$$' | '$$$';
    estimatedBudget: string;
    travelStyle: TravelStyle;
    difficulty: 'Relaxed' | 'Moderate' | 'Challenging' | 'Expedition Grade';
    maxSpots: number;
    description: string;
    itinerary: { day: number; title: string; description: string }[];
    gearRequirements: string[];
  }) => void;
}

const TRIP_COVERS = [
  { label: 'Dolomites Peaks', url: '/src/assets/images/expedition_dolomites_1793636634749.jpg' },
  { label: 'Patagonia Glacial Lake', url: '/src/assets/images/hero_patagonia_peaks_1793636634337.jpg' },
  { label: 'Swiss Alps Ridges', url: '/src/assets/images/traveler_cover_alps_1793636634695.jpg' },
  { label: 'Kyoto Cedar Paths', url: '/src/assets/images/traveler_cover_kyoto_1793636635826.jpg' },
];

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [country, setCountry] = useState('');
  const [selectedCover, setSelectedCover] = useState(TRIP_COVERS[0].url);
  const [startDate, setStartDate] = useState('2026-07-15');
  const [endDate, setEndDate] = useState('2026-07-25');
  const [budgetTier, setBudgetTier] = useState<'$' | '$$' | '$$$'>('$$');
  const [estimatedBudget, setEstimatedBudget] = useState('$1,200 / person (Refugios + trail permits)');
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('trekking');
  const [difficulty, setDifficulty] = useState<'Relaxed' | 'Moderate' | 'Challenging' | 'Expedition Grade'>('Challenging');
  const [maxSpots, setMaxSpots] = useState(6);
  const [description, setDescription] = useState('');
  const [gearText, setGearText] = useState('45L Backpack, Gore-Tex shell, Trekking poles, Crampons');

  // Itinerary
  const [itinerary, setItinerary] = useState<{ day: number; title: string; description: string }[]>([
    { day: 1, title: 'Base Camp Arrival & Safety Briefing', description: 'Rendezvous at mountain lodge, gear inspection, and acclimatization walk.' },
    { day: 2, title: 'Pass Crossing & Alpine Ridge Walk', description: 'Early departure over high pass with 360 degree panoramic mountain views.' }
  ]);

  if (!isOpen) return null;

  const addItineraryDay = () => {
    setItinerary([
      ...itinerary,
      { day: itinerary.length + 1, title: '', description: '' }
    ]);
  };

  const updateDay = (index: number, field: 'title' | 'description', val: string) => {
    const next = [...itinerary];
    next[index][field] = val;
    setItinerary(next);
  };

  const removeDay = (index: number) => {
    if (itinerary.length <= 1) return;
    const next = itinerary.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }));
    setItinerary(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !destination.trim() || !country.trim() || !description.trim()) {
      showToast('Please fill in title, destination, country, and description', 'error');
      return;
    }

    const gearRequirements = gearText.split(',').map((g) => g.trim()).filter(Boolean);

    onSubmit({
      title: title.trim(),
      destination: destination.trim(),
      country: country.trim(),
      coverUrl: selectedCover,
      startDate,
      endDate,
      budgetTier,
      estimatedBudget: estimatedBudget.trim(),
      travelStyle,
      difficulty,
      maxSpots: Number(maxSpots),
      description: description.trim(),
      itinerary,
      gearRequirements,
    });

    onClose();
    showToast('Expedition group organized and published!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold font-display text-stone-900">
              Create Upcoming Expedition or Adventure Group
            </h2>
            <p className="text-xs text-stone-500">Organize a shared journey, invite peers, and manage applicants</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Expedition Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Haute Route Alpine Ski Traverse & Hut Expedition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Destination / Range *</label>
              <input
                type="text"
                required
                placeholder="e.g. Chamonix to Zermatt"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Country *</label>
              <input
                type="text"
                required
                placeholder="e.g. France / Switzerland"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Budget Tier</label>
              <select
                value={budgetTier}
                onChange={(e: any) => setBudgetTier(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-white"
              >
                <option value="$">$ (Budget / Hostels)</option>
                <option value="$$">$$ (Moderate / Refugios)</option>
                <option value="$$$">$$$ (Premium / Guided)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Travel Style</label>
              <select
                value={travelStyle}
                onChange={(e: any) => setTravelStyle(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-white capitalize"
              >
                <option value="trekking">Trekking</option>
                <option value="backpacking">Backpacking</option>
                <option value="adventure">Adventure</option>
                <option value="road trips">Road Trips</option>
                <option value="solo">Solo Group</option>
                <option value="cultural">Cultural</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e: any) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-white"
              >
                <option value="Relaxed">Relaxed</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
                <option value="Expedition Grade">Expedition Grade</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Estimated Budget Details</label>
              <input
                type="text"
                value={estimatedBudget}
                onChange={(e) => setEstimatedBudget(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Max Available Spots</label>
              <input
                type="number"
                min={2}
                max={20}
                value={maxSpots}
                onChange={(e) => setMaxSpots(Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Expedition Overview & Objectives *</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the route terrain, pace, physical prerequisites, and vibe..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Itinerary Builder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-stone-700">Day-by-Day Itinerary</label>
              <button
                type="button"
                onClick={addItineraryDay}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B3B2B] hover:underline"
              >
                <Plus className="w-3 h-3" />
                <span>Add Day</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {itinerary.map((d, index) => (
                <div key={index} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80 flex items-start gap-2">
                  <span className="font-mono font-bold text-stone-500 text-xs shrink-0 mt-1">D{d.day}</span>
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      placeholder="Title (e.g. Ridge ascent)"
                      value={d.title}
                      onChange={(e) => updateDay(index, 'title', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-stone-200 rounded text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Summary description..."
                      value={d.description}
                      onChange={(e) => updateDay(index, 'description', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-stone-200 rounded text-xs"
                    />
                  </div>
                  {itinerary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDay(index)}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Gear Requirements */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Mandatory Gear Requirements (comma separated)</label>
            <input
              type="text"
              value={gearText}
              onChange={(e) => setGearText(e.target.value)}
              placeholder="e.g. 4-season tent, Ice axe, Crampons, Satellite beacon"
              className="w-full px-3 py-2 border border-stone-200 rounded-xl"
            />
          </div>

          {/* Cover Selector */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Expedition Banner Photography</label>
            <div className="grid grid-cols-4 gap-2">
              {TRIP_COVERS.map((cov) => (
                <button
                  key={cov.url}
                  type="button"
                  onClick={() => setSelectedCover(cov.url)}
                  className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all ${
                    selectedCover === cov.url ? 'border-emerald-700 ring-2 ring-emerald-700/30' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={cov.url} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] p-0.5 truncate block">
                    {cov.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

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
              className="px-5 py-2 bg-[#1B3B2B] hover:bg-[#142B20] text-white rounded-xl font-semibold shadow-xs"
            >
              Publish Expedition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
