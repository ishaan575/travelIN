import React, { useState } from 'react';
import { 
  Trip, 
  User, 
  TravelStyle 
} from '../../types';
import { 
  Mountain, 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  DollarSign, 
  Plus, 
  Search, 
  ShieldCheck, 
  Check, 
  X, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface TripsDiscoveryProps {
  trips: Trip[];
  currentUser: User | null;
  onSelectUser: (user: User) => void;
  onRequestJoin: (tripId: string, message?: string) => void;
  onAcceptRequest: (tripId: string, userId: string) => void;
  onRejectRequest: (tripId: string, userId: string) => void;
  onOpenCreateTrip: () => void;
  getUserById: (id: string) => User | undefined;
}

export const TripsDiscovery: React.FC<TripsDiscoveryProps> = ({
  trips,
  currentUser,
  onSelectUser,
  onRequestJoin,
  onAcceptRequest,
  onRejectRequest,
  onOpenCreateTrip,
  getUserById,
}) => {
  const { showToast } = useToast();
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [joinMessage, setJoinMessage] = useState('');

  const filteredTrips = trips.filter((t) => {
    if (selectedStyle !== 'all' && t.travelStyle !== selectedStyle) return false;
    if (
      searchQuery.trim() &&
      !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.destination.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.country.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleSendJoinRequest = (trip: Trip) => {
    if (!currentUser) return;
    onRequestJoin(trip.id, joinMessage.trim() || undefined);
    setJoinMessage('');
    showToast('Your request to join this expedition has been sent to the organizer!', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#181B1A] text-white rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-semibold text-emerald-400 mb-3">
            <Mountain className="w-3.5 h-3.5" />
            <span>Community Expeditions & Small Groups</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">
            Upcoming Expeditions & Adventure Groups
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
            Join vetted high-altitude traverses, wilderness kayak treks, and overland road trips organized by experienced community expedition leaders.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={onOpenCreateTrip}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-stone-900 hover:bg-stone-100 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 text-emerald-800" />
              <span>Organize an Expedition</span>
            </button>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-[#2D5A47]/40 to-transparent pointer-events-none" />
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search trips, peaks, ranges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'trekking', 'adventure', 'backpacking'].map((styleKey) => (
            <button
              key={styleKey}
              onClick={() => setSelectedStyle(styleKey)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize whitespace-nowrap shrink-0 ${
                selectedStyle === styleKey
                  ? 'bg-[#1B3B2B] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {styleKey === 'all' ? 'All Expeditions' : styleKey}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.length === 0 ? (
          <div className="col-span-full bg-white border border-stone-200 rounded-2xl p-12 text-center">
            <Mountain className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-stone-800">No trips found matching your criteria</h3>
            <p className="text-xs text-stone-500 mt-1">Organize your own upcoming journey and invite explorers.</p>
          </div>
        ) : (
          filteredTrips.map((trip) => {
            const organizer = getUserById(trip.creatorId) || trip.creator;
            const openSpots = Math.max(0, trip.maxSpots - trip.participants.length);
            const isParticipant = trip.participants.some((p) => p.id === currentUser?.id);
            const hasRequested = trip.pendingRequests.some((r) => r.userId === currentUser?.id);

            return (
              <div
                key={trip.id}
                className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Trip Cover Image */}
                  <div className="relative h-48 w-full bg-stone-800 overflow-hidden">
                    <img
                      src={trip.coverUrl}
                      alt={trip.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-black/60 backdrop-blur-md text-white rounded-md uppercase tracking-wider">
                        {trip.difficulty}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-800/90 backdrop-blur-md text-white rounded-md font-mono">
                        {openSpots > 0 ? `${openSpots} spots left` : 'Expedition Full'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-1.5 text-xs text-stone-200">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-semibold truncate">{trip.destination}, {trip.country}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trip Body */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <h3 className="font-bold text-sm sm:text-base text-stone-900 line-clamp-2 leading-snug">
                      {trip.title}
                    </h3>

                    {/* Organizer Mini Snippet */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onSelectUser(organizer as User)}
                        className="shrink-0"
                      >
                        <img
                          src={organizer.avatarUrl}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover border border-stone-200"
                        />
                      </button>
                      <div className="min-w-0 text-xs">
                        <span className="text-stone-500">Led by </span>
                        <button
                          onClick={() => onSelectUser(organizer as User)}
                          className="font-semibold text-stone-900 hover:text-emerald-800 truncate"
                        >
                          {organizer.fullName}
                        </button>
                      </div>
                    </div>

                    {/* Metadata Strip */}
                    <div className="space-y-1.5 text-xs text-stone-600 bg-stone-50/80 p-3 rounded-xl border border-stone-100">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-stone-500 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>Dates</span>
                        </span>
                        <span className="font-mono text-[11px] font-semibold text-stone-800">
                          {trip.startDate}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-stone-500 text-[11px]">
                          <DollarSign className="w-3.5 h-3.5 text-stone-400" />
                          <span>Est. Budget</span>
                        </span>
                        <span className="font-mono text-[11px] font-semibold text-stone-800 truncate max-w-[150px]">
                          {trip.budgetTier} · {trip.estimatedBudget}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {trip.description}
                    </p>
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
                  {/* Confirmed Participants Stack */}
                  <div className="flex items-center">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {trip.participants.slice(0, 3).map((p) => (
                        <img
                          key={p.id}
                          src={p.avatarUrl}
                          alt={p.fullName}
                          referrerPolicy="no-referrer"
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                          title={p.fullName}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-400 ml-1.5 font-mono">
                      {trip.participants.length}/{trip.maxSpots} team
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTrip(trip)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-[#1B3B2B] bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <span>View Itinerary</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* TRIP DETAIL & ITINERARY MODAL / DRAWER */}
      {activeTrip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 animate-in zoom-in-95 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded uppercase tracking-wider">
                  {activeTrip.difficulty} · {activeTrip.travelStyle}
                </span>
                <h2 className="text-xl font-bold font-display text-stone-900 mt-1">
                  {activeTrip.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{activeTrip.destination}, {activeTrip.country}</span>
                  <span>·</span>
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>{activeTrip.startDate} to {activeTrip.endDate}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTrip(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {activeTrip.description}
            </p>

            {/* Itinerary */}
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                Detailed Expedition Itinerary
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {activeTrip.itinerary.map((day) => (
                  <div key={day.day} className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.5 bg-[#1B3B2B] text-white rounded text-[10px] font-mono font-bold">
                        Day {day.day}
                      </span>
                      <span className="text-xs font-bold text-stone-900">{day.title}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed pl-1">{day.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory Gear */}
            {activeTrip.gearRequirements.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                  Mandatory Gear Checklist
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeTrip.gearRequirements.map((gear) => (
                    <span
                      key={gear}
                      className="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs rounded-lg font-medium flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-emerald-700" />
                      <span>{gear}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Team Members */}
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                Confirmed Team ({activeTrip.participants.length}/{activeTrip.maxSpots})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activeTrip.participants.map((p) => (
                  <div key={p.id} className="p-2 bg-stone-50 rounded-xl border border-stone-100 flex items-center gap-2">
                    <img src={p.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-stone-900 truncate">{p.fullName}</div>
                      <div className="text-[10px] text-stone-400 capitalize">{p.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Organizer Manage Requests Section (if current user is creator) */}
            {currentUser?.id === activeTrip.creatorId && activeTrip.pendingRequests.length > 0 && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Pending Join Requests ({activeTrip.pendingRequests.length})
                </h4>
                <div className="space-y-2">
                  {activeTrip.pendingRequests.map((req) => (
                    <div key={req.userId} className="p-2.5 bg-white rounded-xl border border-emerald-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={req.user.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                        <div className="min-w-0 text-xs">
                          <span className="font-semibold text-stone-900 block truncate">{req.user.fullName}</span>
                          <span className="text-[11px] text-stone-500 italic truncate block">"{req.message}"</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            onAcceptRequest(activeTrip.id, req.userId);
                            showToast(`Accepted ${req.user.fullName} to expedition!`, 'success');
                          }}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            onRejectRequest(activeTrip.id, req.userId);
                            showToast(`Declined request`, 'info');
                          }}
                          className="p-1 text-stone-400 hover:text-stone-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="block text-xs font-semibold text-stone-900 font-mono">
                  {activeTrip.budgetTier} · {activeTrip.estimatedBudget}
                </span>
                <span className="text-[10px] text-stone-400">Excludes international flights</span>
              </div>

              {currentUser?.id !== activeTrip.creatorId && (
                <div>
                  {activeTrip.participants.some((p) => p.id === currentUser?.id) ? (
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold inline-flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      <span>You are Confirmed</span>
                    </span>
                  ) : activeTrip.pendingRequests.some((r) => r.userId === currentUser?.id) ? (
                    <span className="px-4 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold">
                      Request Pending Review
                    </span>
                  ) : activeTrip.status === 'full' ? (
                    <span className="px-4 py-2 bg-stone-100 text-stone-400 rounded-xl text-xs font-semibold">
                      Expedition Full
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSendJoinRequest(activeTrip)}
                      className="px-5 py-2.5 bg-[#1B3B2B] hover:bg-[#142B20] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                      Request to Join Expedition
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
