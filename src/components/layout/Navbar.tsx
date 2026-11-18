import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  Bell, 
  MessageSquare, 
  Plus, 
  CheckCircle2, 
  ShieldCheck,
  User as UserIcon,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { User, NotificationItem } from '../../types';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount: number;
  unreadMessagesCount: number;
  onOpenCreatePost: () => void;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onSwitchUser: (userId: string) => void;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  unreadCount,
  unreadMessagesCount,
  onOpenCreatePost,
  onOpenNotifications,
  onOpenAuth,
  onSwitchUser,
  allUsers,
  onSelectUser,
  searchQuery,
  setSearchQuery,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const filteredUsers = searchQuery.trim()
    ? allUsers.filter(
        (u) =>
          u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.location.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5] border-b border-stone-200/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('feed')}
              className="flex items-center gap-2.5 text-stone-900 group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1B3B2B] text-white flex items-center justify-center shadow-xs">
                <Compass className="w-4 h-4 text-emerald-300 transition-transform duration-300 group-hover:rotate-45" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-[#162E22] whitespace-nowrap flex items-center">
                <span>travel</span>
                <span className="text-[#1B3B2B] bg-emerald-100/80 px-1 py-0.2 rounded-md ml-0.5 text-sm font-extrabold tracking-normal uppercase">
                  IN
                </span>
              </span>
            </button>
          </div>

          {/* Search bar & quick results */}
          <div className="hidden lg:flex items-center flex-1 max-w-md relative">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search travellers, peaks, destinations..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-stone-100/80 hover:bg-stone-100 focus:bg-white border border-stone-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#1B3B2B] focus:border-[#1B3B2B] transition-colors"
              />
            </div>

            {showSearchDropdown && searchQuery.trim() && (
              <div 
                className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in"
                onMouseLeave={() => setShowSearchDropdown(false)}
              >
                <div className="p-2 border-b border-stone-100 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  Travellers ({filteredUsers.length})
                </div>
                {filteredUsers.length === 0 ? (
                  <div className="p-4 text-xs text-stone-500 text-center">
                    No matching travellers found for "{searchQuery}"
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto divide-y divide-stone-100">
                    {filteredUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSelectUser(u);
                          setShowSearchDropdown(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-3 p-2.5 text-left hover:bg-stone-50 transition-colors"
                      >
                        <img
                          src={u.avatarUrl}
                          alt={u.fullName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-stone-200"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-stone-900 truncate">{u.fullName}</span>
                            {u.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                          </div>
                          <p className="text-[11px] text-stone-500 truncate">{u.location.city}, {u.location.country}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Zone 2: Navigation Links (single line, clean typography) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => setActiveTab('feed')}
              className={`hover:text-[#162E22] transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'feed' ? 'text-[#162E22] font-semibold border-b-2 border-[#1B3B2B]' : ''
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab('companions')}
              className={`hover:text-[#162E22] transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'companions' ? 'text-[#162E22] font-semibold border-b-2 border-[#1B3B2B]' : ''
              }`}
            >
              Find Companions
            </button>
            <button
              onClick={() => setActiveTab('trips')}
              className={`hover:text-[#162E22] transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'trips' ? 'text-[#162E22] font-semibold border-b-2 border-[#1B3B2B]' : ''
              }`}
            >
              Expeditions
            </button>
            <button
              onClick={() => setActiveTab('network')}
              className={`hover:text-[#162E22] transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'network' ? 'text-[#162E22] font-semibold border-b-2 border-[#1B3B2B]' : ''
              }`}
            >
              Traveller Network
            </button>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`hover:text-[#162E22] transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 ${
                  activeTab === 'admin' ? 'text-[#162E22] font-semibold border-b-2 border-[#1B3B2B]' : ''
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Actions & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Create Post Button */}
            <button
              onClick={onOpenCreatePost}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1B3B2B] hover:bg-[#142B20] rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Share Journey</span>
            </button>

            {/* Messages Quick Icon */}
            <button
              onClick={() => setActiveTab('messages')}
              className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Messages"
            >
              <MessageSquare className="w-4 h-4" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Dropdown / Switcher */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-stone-200 hover:border-stone-300 bg-white transition-all text-left"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-stone-200"
                  />
                  <span className="hidden xl:inline text-xs font-medium text-stone-800 max-w-[100px] truncate">
                    {currentUser.fullName.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {showUserMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-xl shadow-xl py-2 z-50 text-xs animate-in fade-in"
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <div className="px-4 py-2 border-b border-stone-100">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-stone-900 truncate">{currentUser.fullName}</span>
                        {currentUser.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                      </div>
                      <div className="text-stone-500 text-[11px]">@{currentUser.username}</div>
                      <div className="mt-1 text-stone-600 text-[11px] font-mono tabular-nums">
                        {currentUser.stats.countriesVisited} Countries · {currentUser.stats.mountainsCompleted} Summits
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          onSelectUser(currentUser);
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left flex items-center gap-2 text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-stone-400" />
                        <span>View Travel Passport & Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('admin');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left flex items-center gap-2 text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                        <span>Platform Admin & Schema</span>
                      </button>
                    </div>

                    {/* Switch Persona quickly */}
                    <div className="px-4 pt-2 pb-1 border-t border-stone-100 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                      Switch Explorer Persona
                    </div>
                    <div className="py-1 max-h-36 overflow-y-auto">
                      {allUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u.id);
                            setShowUserMenu(false);
                          }}
                          className={`w-full px-4 py-1.5 text-left flex items-center justify-between hover:bg-stone-50 ${
                            u.id === currentUser.id ? 'bg-stone-50 font-medium text-emerald-900' : 'text-stone-600'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <img src={u.avatarUrl} alt="" className="w-4 h-4 rounded-full object-cover" />
                            <span className="truncate">{u.fullName}</span>
                          </div>
                          {u.id === currentUser.id && <span className="text-[10px] text-emerald-700">Active</span>}
                        </button>
                      ))}
                    </div>

                    <div className="pt-1 border-t border-stone-100">
                      <button
                        onClick={() => {
                          onOpenAuth();
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left flex items-center gap-2 text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                      >
                        <LogOut className="w-3.5 h-3.5 text-stone-400" />
                        <span>Create New Explorer Account</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#1B3B2B] hover:bg-[#142B20] rounded-lg transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
