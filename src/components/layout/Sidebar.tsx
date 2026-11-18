import React from 'react';
import { 
  Compass, 
  Users, 
  Mountain, 
  MessageSquare, 
  Globe, 
  UserCheck, 
  ShieldCheck, 
  User as UserIcon,
  MapPin,
  Award,
  Sparkles
} from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadMessagesCount: number;
  onSelectUser: (user: User) => void;
  allUsers: User[];
  onSwitchUser: (userId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  unreadMessagesCount,
  onSelectUser,
  allUsers,
  onSwitchUser,
}) => {
  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="sticky top-20 flex flex-col gap-5">
        {/* User Travel Identity Card */}
        {currentUser && (
          <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs p-4">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border border-stone-200"
              />
              <div className="min-w-0 flex-1">
                <button
                  onClick={() => onSelectUser(currentUser)}
                  className="font-semibold text-sm text-stone-900 truncate hover:text-[#1B3B2B] text-left block w-full"
                >
                  {currentUser.fullName}
                </button>
                <div className="flex items-center gap-1 text-[11px] text-stone-500">
                  <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                  <span className="truncate">{currentUser.location.city}, {currentUser.location.country}</span>
                </div>
              </div>
            </div>

            {/* Travel Passport Summary */}
            <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-stone-100 text-center">
              <div className="bg-stone-50/80 p-2 rounded-lg">
                <span className="block text-xs font-bold text-stone-800 tabular-nums">
                  {currentUser.stats.countriesVisited}
                </span>
                <span className="text-[10px] text-stone-500 font-medium">Countries</span>
              </div>
              <div className="bg-stone-50/80 p-2 rounded-lg">
                <span className="block text-xs font-bold text-stone-800 tabular-nums">
                  {currentUser.stats.mountainsCompleted}
                </span>
                <span className="text-[10px] text-stone-500 font-medium">Summits</span>
              </div>
              <div className="bg-stone-50/80 p-2 rounded-lg">
                <span className="block text-xs font-bold text-stone-800 tabular-nums">
                  {currentUser.stats.connectionsCount}
                </span>
                <span className="text-[10px] text-stone-500 font-medium">Network</span>
              </div>
            </div>

            <button
              onClick={() => onSelectUser(currentUser)}
              className="mt-3 w-full py-1.5 px-3 text-center text-xs font-medium text-[#1B3B2B] bg-emerald-50/80 hover:bg-emerald-100/70 rounded-lg transition-colors"
            >
              My Travel Passport
            </button>
          </div>
        )}

        {/* Navigation Menu */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-2.5 shadow-xs">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('feed')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'feed'
                  ? 'bg-[#1B3B2B] text-white'
                  : 'text-stone-700 hover:bg-stone-100/70 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4" />
                <span>Travel Social Feed</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('companions')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'companions'
                  ? 'bg-[#1B3B2B] text-white'
                  : 'text-stone-700 hover:bg-stone-100/70 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Find Companions</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                activeTab === 'companions' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                Match
              </span>
            </button>

            <button
              onClick={() => setActiveTab('trips')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'trips'
                  ? 'bg-[#1B3B2B] text-white'
                  : 'text-stone-700 hover:bg-stone-100/70 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mountain className="w-4 h-4" />
                <span>Trips & Expeditions</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'messages'
                  ? 'bg-[#1B3B2B] text-white'
                  : 'text-stone-700 hover:bg-stone-100/70 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Private Messaging</span>
              </div>
              {unreadMessagesCount > 0 && (
                <span className="w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('network')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'network'
                  ? 'bg-[#1B3B2B] text-white'
                  : 'text-stone-700 hover:bg-stone-100/70 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4" />
                <span>Explorer Network</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'admin'
                  ? 'bg-[#1B3B2B] text-white'
                  : 'text-stone-700 hover:bg-stone-100/70 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin & Schema</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Multi-Persona Live Switcher Card */}
        <div className="bg-stone-100/70 border border-stone-200/80 rounded-2xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider">Test Personas</span>
            <span className="text-[10px] text-stone-400">Multi-Role</span>
          </div>
          <div className="space-y-1.5">
            {allUsers.map((u) => {
              const isActive = u.id === currentUser?.id;
              return (
                <button
                  key={u.id}
                  onClick={() => onSwitchUser(u.id)}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all text-xs ${
                    isActive
                      ? 'bg-white shadow-xs border border-stone-200 font-semibold text-[#1B3B2B]'
                      : 'text-stone-600 hover:bg-white/60'
                  }`}
                >
                  <img
                    src={u.avatarUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[11px] leading-tight">{u.fullName}</div>
                    <div className="text-[9px] text-stone-500 truncate">{u.location.country} · {u.travelStyles[0]}</div>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
