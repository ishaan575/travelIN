import React, { useState } from 'react';
import { 
  User, 
  ConnectionStatus, 
  TravelStyle 
} from '../../types';
import { 
  Search, 
  MapPin, 
  Mountain, 
  Globe, 
  CheckCircle2, 
  UserPlus, 
  UserCheck, 
  Clock, 
  MessageSquare, 
  Filter,
  Sparkles,
  Users
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface ExplorerNetworkProps {
  users: User[];
  currentUser: User | null;
  onSelectUser: (user: User) => void;
  onSendConnection: (userId: string) => void;
  onAcceptConnection: (userId: string) => void;
  onStartMessage: (userId: string) => void;
  getConnectionStatus: (userId: string) => ConnectionStatus;
  getMutualConnections: (userId: string) => User[];
}

export const ExplorerNetwork: React.FC<ExplorerNetworkProps> = ({
  users,
  currentUser,
  onSelectUser,
  onSendConnection,
  onAcceptConnection,
  onStartMessage,
  getConnectionStatus,
  getMutualConnections,
}) => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [viewFilter, setViewFilter] = useState<'all' | 'connected' | 'requests'>('all');

  const filteredUsers = users.filter((u) => {
    if (currentUser && u.id === currentUser.id) return false;

    const status = getConnectionStatus(u.id);
    if (viewFilter === 'connected' && status !== 'connected') return false;
    if (viewFilter === 'requests' && status !== 'received') return false;

    if (selectedStyle !== 'all' && !u.travelStyles.includes(selectedStyle as TravelStyle)) {
      return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = u.fullName.toLowerCase().includes(q) || u.username.toLowerCase().includes(q);
      const matchLoc = u.location.city.toLowerCase().includes(q) || u.location.country.toLowerCase().includes(q);
      const matchInterests = u.travelInterests.some((i) => i.toLowerCase().includes(q));
      if (!matchName && !matchLoc && !matchInterests) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-stone-900">
            Global Explorer Directory & Connections
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Build your professional travel network, find local guides, and connect across borders.
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setViewFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              viewFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Explorers
          </button>
          <button
            onClick={() => setViewFilter('connected')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              viewFilter === 'connected' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            My Network
          </button>
          <button
            onClick={() => setViewFilter('requests')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              viewFilter === 'requests' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Requests
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, city, country, or interest (e.g. Glacier, Silk Road)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>

        <div>
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800 capitalize"
          >
            <option value="all">All Travel Styles</option>
            <option value="solo">Solo Travel</option>
            <option value="trekking">Trekking</option>
            <option value="backpacking">Backpacking</option>
            <option value="luxury">Luxury</option>
            <option value="road trips">Road Trips</option>
            <option value="adventure">Adventure</option>
            <option value="cultural">Cultural</option>
          </select>
        </div>
      </div>

      {/* Explorers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-400">
            <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-stone-700">No travellers found</h3>
            <p className="text-xs text-stone-500 mt-1">Try refining your search terms or clearing travel style filters.</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const status = getConnectionStatus(user.id);
            const mutuals = getMutualConnections(user.id);

            return (
              <div
                key={user.id}
                className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Cover Snippet */}
                  <div className="h-20 bg-stone-800 relative overflow-hidden">
                    <img
                      src={user.coverUrl || '/src/assets/images/hero_patagonia_peaks_1793636634337.jpg'}
                      alt=""
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Avatar & Header */}
                  <div className="px-4 pb-3 relative">
                    <div className="flex items-end justify-between -mt-9 mb-2">
                      <button onClick={() => onSelectUser(user)} className="relative shrink-0">
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                        />
                        {user.isVerified && (
                          <div className="absolute -bottom-1 -right-1 bg-[#1B3B2B] text-emerald-300 p-0.5 rounded-md border border-white">
                            <CheckCircle2 className="w-3 h-3" />
                          </div>
                        )}
                      </button>

                      {/* Connection Action */}
                      <div>
                        {status === 'connected' ? (
                          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            <span>Connected</span>
                          </span>
                        ) : status === 'pending' ? (
                          <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        ) : status === 'received' ? (
                          <button
                            onClick={() => {
                              onAcceptConnection(user.id);
                              showToast(`Connected with ${user.fullName}`, 'success');
                            }}
                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                          >
                            Accept
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onSendConnection(user.id);
                              showToast(`Connection request sent to ${user.fullName}`, 'success');
                            }}
                            className="px-3 py-1 bg-[#1B3B2B] hover:bg-[#142B20] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>Connect</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Name & Headline */}
                    <button
                      onClick={() => onSelectUser(user)}
                      className="font-bold text-sm text-stone-900 hover:text-[#1B3B2B] text-left block truncate w-full"
                    >
                      {user.fullName}
                    </button>
                    <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="truncate">{user.location.city}, {user.location.country}</span>
                    </div>

                    <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                      {user.headline}
                    </p>

                    {/* Passport Mini Strip */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-stone-100 text-center font-mono">
                      <div className="bg-stone-50 p-1.5 rounded-lg">
                        <span className="block text-xs font-bold text-stone-900 tabular-nums">
                          {user.stats.countriesVisited}
                        </span>
                        <span className="text-[10px] text-stone-500 font-sans">Countries</span>
                      </div>
                      <div className="bg-stone-50 p-1.5 rounded-lg">
                        <span className="block text-xs font-bold text-stone-900 tabular-nums">
                          {user.stats.mountainsCompleted}
                        </span>
                        <span className="text-[10px] text-stone-500 font-sans">Summits</span>
                      </div>
                    </div>

                    {/* Mutual connections snippet */}
                    {mutuals.length > 0 && (
                      <div className="mt-2.5 text-[11px] text-stone-500 truncate flex items-center gap-1">
                        <Users className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{mutuals.length} mutual connection{mutuals.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-4 py-3 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectUser(user)}
                    className="text-xs font-semibold text-stone-700 hover:text-stone-900"
                  >
                    View Passport
                  </button>

                  <button
                    onClick={() => onStartMessage(user.id)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors"
                    title="Send Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
