import React from 'react';
import { Compass, Users, Mountain, MessageSquare, User as UserIcon } from 'lucide-react';
import { User } from '../../types';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadMessagesCount: number;
  currentUser: User | null;
  onSelectUser: (user: User) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  unreadMessagesCount,
  currentUser,
  onSelectUser,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 py-2 flex items-center justify-around">
      <button
        onClick={() => setActiveTab('feed')}
        className={`flex flex-col items-center gap-1 p-1 text-xs font-medium transition-colors ${
          activeTab === 'feed' ? 'text-[#1B3B2B]' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px]">Feed</span>
      </button>

      <button
        onClick={() => setActiveTab('companions')}
        className={`flex flex-col items-center gap-1 p-1 text-xs font-medium transition-colors ${
          activeTab === 'companions' ? 'text-[#1B3B2B]' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[10px]">Companions</span>
      </button>

      <button
        onClick={() => setActiveTab('trips')}
        className={`flex flex-col items-center gap-1 p-1 text-xs font-medium transition-colors ${
          activeTab === 'trips' ? 'text-[#1B3B2B]' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <Mountain className="w-5 h-5" />
        <span className="text-[10px]">Expeditions</span>
      </button>

      <button
        onClick={() => setActiveTab('messages')}
        className={`relative flex flex-col items-center gap-1 p-1 text-xs font-medium transition-colors ${
          activeTab === 'messages' ? 'text-[#1B3B2B]' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-[10px]">Messages</span>
        {unreadMessagesCount > 0 && (
          <span className="absolute top-0 right-2 w-4 h-4 bg-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center tabular-nums">
            {unreadMessagesCount}
          </span>
        )}
      </button>

      <button
        onClick={() => {
          if (currentUser) onSelectUser(currentUser);
        }}
        className={`flex flex-col items-center gap-1 p-1 text-xs font-medium transition-colors ${
          activeTab === 'profile' ? 'text-[#1B3B2B]' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        {currentUser?.avatarUrl ? (
          <img
            src={currentUser.avatarUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="w-5 h-5 rounded-full object-cover border border-stone-300"
          />
        ) : (
          <UserIcon className="w-5 h-5" />
        )}
        <span className="text-[10px]">Passport</span>
      </button>
    </nav>
  );
};
