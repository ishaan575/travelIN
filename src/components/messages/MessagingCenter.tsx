import React, { useState, useEffect, useRef } from 'react';
import { 
  Conversation, 
  Message, 
  User 
} from '../../types';
import { 
  Search, 
  Send, 
  CheckCircle2, 
  User as UserIcon, 
  MapPin, 
  MessageSquare,
  Sparkles,
  Mountain
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface MessagingCenterProps {
  currentUser: User | null;
  conversations: Conversation[];
  activePartner: User | null;
  messages: Message[];
  onSelectConversation: (partner: User) => void;
  onSendMessage: (receiverId: string, content: string) => void;
  onSelectUser: (user: User) => void;
  allUsers: User[];
}

export const MessagingCenter: React.FC<MessagingCenterProps> = ({
  currentUser,
  conversations,
  activePartner,
  messages,
  onSelectConversation,
  onSendMessage,
  onSelectUser,
  allUsers,
}) => {
  const { showToast } = useToast();
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePartner) return;
    onSendMessage(activePartner.id, inputText.trim());
    setInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    if (!activePartner) return;
    onSendMessage(activePartner.id, prompt);
  };

  const filteredConversations = conversations.filter((c) =>
    c.participant.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border border-stone-200/90 rounded-3xl shadow-xs overflow-hidden max-w-5xl mx-auto h-[640px] flex">
      {/* 1. LEFT PANE: CONVERSATION LIST */}
      <div className="w-80 border-r border-stone-200/80 flex flex-col bg-stone-50/50 shrink-0">
        <div className="p-4 border-b border-stone-200/80 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold font-display text-stone-900">
              Expedition Direct Messages
            </h2>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-100 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800"
            />
          </div>
        </div>

        {/* List of active conversations */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">
              <MessageSquare className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <span>No conversations found.</span>
              <p className="mt-2 text-[11px] text-stone-500">
                Connect with any explorer from the Feed or Companions tab to initiate a chat.
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = activePartner?.id === conv.participant.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.participant)}
                  className={`w-full p-3.5 flex items-start gap-3 text-left transition-colors ${
                    isSelected ? 'bg-white shadow-xs border-l-4 border-l-[#1B3B2B]' : 'hover:bg-stone-100/60'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.participant.avatarUrl}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-stone-200"
                    />
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center font-mono">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-xs text-stone-900 truncate">
                        {conv.participant.fullName}
                      </span>
                      <span className="text-[10px] text-stone-400 shrink-0 font-mono">
                        {conv.lastMessage.createdAt}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-semibold text-stone-900' : 'text-stone-500'}`}>
                      {conv.lastMessage.content}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Start new chat fast list */}
        <div className="p-3 bg-white border-t border-stone-200">
          <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
            Available Explorers
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {allUsers
              .filter((u) => u.id !== currentUser?.id)
              .map((u) => (
                <button
                  key={u.id}
                  onClick={() => onSelectConversation(u)}
                  className="shrink-0 flex flex-col items-center group"
                  title={`Chat with ${u.fullName}`}
                >
                  <img
                    src={u.avatarUrl}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-stone-200 group-hover:border-[#1B3B2B] transition-colors"
                  />
                  <span className="text-[9px] text-stone-500 max-w-[48px] truncate mt-0.5">
                    {u.fullName.split(' ')[0]}
                  </span>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* 2. RIGHT PANE: ACTIVE MESSAGE THREAD */}
      <div className="flex-1 flex flex-col bg-white">
        {activePartner ? (
          <>
            {/* Thread Header */}
            <div className="p-4 border-b border-stone-200/80 flex items-center justify-between bg-stone-50/40">
              <div className="flex items-center gap-3">
                <button onClick={() => onSelectUser(activePartner)}>
                  <img
                    src={activePartner.avatarUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-stone-200 hover:opacity-90"
                  />
                </button>
                <div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectUser(activePartner)}
                      className="font-bold text-xs sm:text-sm text-stone-900 hover:text-[#1B3B2B] text-left"
                    >
                      {activePartner.fullName}
                    </button>
                    {activePartner.isVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-stone-500">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{activePartner.location.city}, {activePartner.location.country}</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">{activePartner.stats.mountainsCompleted} Summits</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectUser(activePartner)}
                className="px-3 py-1.5 text-xs font-semibold text-[#1B3B2B] bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
              >
                View Passport
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 bg-stone-50/20">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-stone-400">
                  <Mountain className="w-10 h-10 text-stone-300 mb-2" />
                  <p className="text-xs font-medium text-stone-600">
                    Direct channel with {activePartner.fullName}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1 max-w-xs">
                    Discuss route conditions, gear specifications, dates, or split costs for upcoming expeditions.
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-md">
                    <button
                      onClick={() => handleQuickPrompt('Hi! Would love to compare notes on your recent alpine expedition.')}
                      className="px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 hover:bg-stone-50"
                    >
                      Compare route notes
                    </button>
                    <button
                      onClick={() => handleQuickPrompt('Are you looking for expedition partners for your upcoming trip?')}
                      className="px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 hover:bg-stone-50"
                    >
                      Ask about upcoming trip
                    </button>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === currentUser?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                          isMe
                            ? 'bg-[#1B3B2B] text-white rounded-br-xs'
                            : 'bg-stone-100 text-stone-800 rounded-bl-xs border border-stone-200/60'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-stone-400 mt-1 font-mono tabular-nums px-1">
                        {msg.createdAt}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-stone-200 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Message ${activePartner.fullName.split(' ')[0]}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-[#1B3B2B] disabled:opacity-40 hover:bg-[#142B20] text-white rounded-xl transition-colors shadow-xs"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-stone-400">
            <MessageSquare className="w-12 h-12 text-stone-300 mb-3" />
            <h3 className="text-sm font-bold text-stone-700">Select a Conversation</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-xs">
              Choose an explorer from the left panel to begin discussing routes, logistics, and gear.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
