import React from 'react';
import { 
  NotificationItem, 
  User 
} from '../../types';
import { 
  X, 
  UserPlus, 
  UserCheck, 
  Mountain, 
  Heart, 
  MessageSquare, 
  Check, 
  Bell
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onAcceptConnection: (userId: string) => void;
  onSelectUser: (user: User) => void;
  getUserById: (id: string) => User | undefined;
  onOpenTrip: (tripId: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onAcceptConnection,
  onSelectUser,
  getUserById,
  onOpenTrip,
}) => {
  const { showToast } = useToast();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-800" />
            <h3 className="font-bold font-display text-base text-stone-900">
              Explorer Activity & Alerts
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-xs text-stone-500 hover:text-stone-900 font-medium"
            >
              Mark all read
            </button>
            <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-stone-400 text-xs">
              <Bell className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <span>No notifications at this time.</span>
            </div>
          ) : (
            notifications.map((notif) => {
              const actor = getUserById(notif.actor.id);
              return (
                <div
                  key={notif.id}
                  onClick={() => onMarkRead(notif.id)}
                  className={`p-4 transition-colors flex items-start gap-3 ${
                    notif.read ? 'bg-white' : 'bg-stone-50/80 font-medium'
                  }`}
                >
                  <div className="shrink-0 relative">
                    <img
                      src={notif.actor.avatarUrl}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-stone-200"
                    />
                    <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white shadow-xs">
                      {notif.type.includes('connection') && (
                        <UserPlus className="w-3 h-3 text-emerald-800" />
                      )}
                      {notif.type.includes('trip') && (
                        <Mountain className="w-3 h-3 text-amber-700" />
                      )}
                      {notif.type === 'post_like' && (
                        <Heart className="w-3 h-3 text-rose-600 fill-rose-600" />
                      )}
                      {notif.type === 'post_comment' && (
                        <MessageSquare className="w-3 h-3 text-sky-700" />
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 text-xs">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-stone-900">{notif.title}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{notif.createdAt}</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">{notif.message}</p>

                    {/* Action buttons for connection request */}
                    {notif.type === 'connection_request' && (
                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAcceptConnection(notif.actor.id);
                            onMarkRead(notif.id);
                            showToast(`Connected with ${notif.actor.fullName}`, 'success');
                          }}
                          className="px-3 py-1 bg-[#1B3B2B] hover:bg-[#142B20] text-white rounded-lg text-xs font-semibold shadow-xs"
                        >
                          Accept
                        </button>
                        {actor && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectUser(actor);
                              onClose();
                            }}
                            className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold"
                          >
                            View Passport
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
