import React, { useState } from 'react';
import { 
  CompanionIntent, 
  User, 
  TravelStyle, 
  ConnectionStatus 
} from '../../types';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  MessageSquare, 
  UserPlus, 
  Plus, 
  Filter, 
  Sparkles,
  Compass,
  X
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface CompanionFinderProps {
  companions: CompanionIntent[];
  currentUser: User | null;
  onSendConnection: (userId: string) => void;
  onStartMessage: (userId: string, initialMessage?: string) => void;
  onSelectUser: (user: User) => void;
  onCreateIntent: (data: {
    destination: string;
    country: string;
    dateRange: string;
    travelStyle: TravelStyle;
    budgetTier: '$' | '$$' | '$$$';
    groupSizePreference: string;
    description: string;
    interests: string[];
  }) => void;
  getConnectionStatus: (userId: string) => ConnectionStatus;
}

export const CompanionFinder: React.FC<CompanionFinderProps> = ({
  companions,
  currentUser,
  onSendConnection,
  onStartMessage,
  onSelectUser,
  onCreateIntent,
  getConnectionStatus,
}) => {
  const { showToast } = useToast();
  const [searchDestination, setSearchDestination] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create intent form state
  const [dest, setDest] = useState('');
  const [country, setCountry] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [style, setStyle] = useState<TravelStyle>('trekking');
  const [budget, setBudget] = useState<'$' | '$$' | '$$$'>('$$');
  const [groupSize, setGroupSize] = useState('2 - 4 explorers');
  const [desc, setDesc] = useState('');
  const [interestsStr, setInterestsStr] = useState('Alpine Scrambling, Photography, Wild Camp');

  const filteredCompanions = companions.filter((c) => {
    if (
      searchDestination.trim() &&
      !c.destination.toLowerCase().includes(searchDestination.toLowerCase()) &&
      !c.country.toLowerCase().includes(searchDestination.toLowerCase())
    ) {
      return false;
    }
    if (selectedStyle !== 'all' && c.travelStyle !== selectedStyle) {
      return false;
    }
    if (selectedBudget !== 'all' && c.budgetTier !== selectedBudget) {
      return false;
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dest.trim() || !country.trim() || !dateRange.trim() || !desc.trim()) {
      showToast('Please fill in destination, country, dates and description', 'error');
      return;
    }
    const interests = interestsStr.split(',').map((s) => s.trim()).filter(Boolean);
    onCreateIntent({
      destination: dest.trim(),
      country: country.trim(),
      dateRange: dateRange.trim(),
      travelStyle: style,
      budgetTier: budget,
      groupSizePreference: groupSize,
      description: desc.trim(),
      interests,
    });
    setShowCreateModal(false);
    showToast('Your travel companion search is now active!', 'success');
  };

  const handleExpressInterest = (c: CompanionIntent) => {
    const msg = `Hi ${c.user.fullName}! I saw your companion request for ${c.destination} (${c.dateRange}). I have similar travel style and would love to connect about traveling together.`;
    onStartMessage(c.userId, msg);
    showToast(`Expressed interest to ${c.user.fullName}`, 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#1B3B2B] text-white rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-semibold text-emerald-300 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Compatibility Matching Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">
            Find Compatible Travel Companions
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 mt-2 leading-relaxed">
            Connect with verified mountaineers, solo nomads, and cultural adventurers planning journeys to the same destinations with matching budgets and pace.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-[#1B3B2B] hover:bg-stone-100 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Post Your Destination Intent</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-emerald-900/40 to-transparent pointer-events-none" />
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Destination Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by destination or country..."
              value={searchDestination}
              onChange={(e) => setSearchDestination(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800"
            />
          </div>

          {/* Style Selector */}
          <div>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800 capitalize"
            >
              <option value="all">All Travel Styles</option>
              <option value="solo">Solo Travel</option>
              <option value="trekking">Trekking & Hiking</option>
              <option value="backpacking">Backpacking</option>
              <option value="luxury">Luxury / Boutique</option>
              <option value="road trips">Road Trips & 4x4</option>
              <option value="adventure">Adventure & Expeditions</option>
              <option value="cultural">Cultural Heritage</option>
            </select>
          </div>

          {/* Budget Range */}
          <div>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800"
            >
              <option value="all">Any Budget Tier</option>
              <option value="$">$ Budget / Hostels & Wild Camp</option>
              <option value="$$">$$ Moderate / Refugios & Local Stays</option>
              <option value="$$$">$$$ Premium / Guided & Expedition</option>
            </select>
          </div>
        </div>
      </div>

      {/* Companion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCompanions.length === 0 ? (
          <div className="col-span-full bg-white border border-stone-200 rounded-2xl p-12 text-center">
            <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-stone-800">No companion requests match your filters</h3>
            <p className="text-xs text-stone-500 mt-1">Try expanding your destination search or post your own intent.</p>
          </div>
        ) : (
          filteredCompanions.map((intent) => {
            const connStatus = getConnectionStatus(intent.userId);
            const isMe = currentUser?.id === intent.userId;

            return (
              <div
                key={intent.id}
                className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Explorer Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onSelectUser(intent.user)}
                        className="shrink-0"
                      >
                        <img
                          src={intent.user.avatarUrl}
                          alt={intent.user.fullName}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-xl object-cover border border-stone-200"
                        />
                      </button>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onSelectUser(intent.user)}
                            className="font-bold text-xs sm:text-sm text-stone-900 hover:text-[#1B3B2B] text-left"
                          >
                            {intent.user.fullName}
                          </button>
                          {intent.user.isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 truncate max-w-[200px]">
                          {intent.user.location.city}, {intent.user.location.country}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 text-emerald-900 rounded-lg text-[11px] font-bold font-mono">
                        <Sparkles className="w-3 h-3 text-emerald-700" />
                        <span>{intent.compatibilityScore}% Match</span>
                      </span>
                    </div>
                  </div>

                  {/* Destination & Target Dates */}
                  <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-100 space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                      <MapPin className="w-4 h-4 text-[#1B3B2B] shrink-0" />
                      <span>{intent.destination}, {intent.country}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-stone-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>{intent.dateRange}</span>
                      </span>
                      <span>·</span>
                      <span className="capitalize">{intent.travelStyle}</span>
                      <span>·</span>
                      <span className="font-mono font-semibold text-stone-700">{intent.budgetTier} Budget</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-stone-600 leading-relaxed mb-3">
                    "{intent.description}"
                  </p>

                  {/* Interests */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {intent.interests.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-stone-400 font-medium">
                    Group: {intent.groupSizePreference}
                  </span>

                  {!isMe && (
                    <div className="flex items-center gap-2">
                      {connStatus === 'none' && (
                        <button
                          onClick={() => onSendConnection(intent.userId)}
                          className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1"
                          title="Send Connection Request"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Connect</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleExpressInterest(intent)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1B3B2B] hover:bg-[#142B20] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Express Interest</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE INTENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold font-display text-stone-900">
                  Broadcast Travel Companion Request
                </h3>
                <p className="text-xs text-stone-500">Discover compatible explorers heading to your destination</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Destination / Region *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Annapurna Circuit"
                    value={dest}
                    onChange={(e) => setDest(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nepal"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Target Dates / Season *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oct 2026 (18 Days)"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Travel Style</label>
                  <select
                    value={style}
                    onChange={(e: any) => setStyle(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none bg-white capitalize"
                  >
                    <option value="trekking">Trekking & Hiking</option>
                    <option value="solo">Solo Travel Companion</option>
                    <option value="backpacking">Backpacking</option>
                    <option value="adventure">Adventure Expedition</option>
                    <option value="road trips">Road Trips</option>
                    <option value="cultural">Cultural Travel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Budget Tier</label>
                  <select
                    value={budget}
                    onChange={(e: any) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none bg-white"
                  >
                    <option value="$">$ (Budget / Backpacker)</option>
                    <option value="$$">$$ (Moderate / Refugios)</option>
                    <option value="$$$">$$$ (Premium / Full Service)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Group Size Preference</label>
                  <input
                    type="text"
                    value={groupSize}
                    onChange={(e) => setGroupSize(e.target.value)}
                    placeholder="e.g. 2 - 3 companions"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description & Requirements *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your planned route, physical pace, required mountain skills, or logistics..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Interests (comma separated)</label>
                <input
                  type="text"
                  value={interestsStr}
                  onChange={(e) => setInterestsStr(e.target.value)}
                  placeholder="e.g. Glaciers, High Passes, Photography"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1B3B2B] hover:bg-[#142B20] text-white rounded-xl font-semibold shadow-xs"
                >
                  Post Intent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
