/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from './services/db';
import { 
  User, 
  Post, 
  Trip, 
  CompanionIntent, 
  NotificationItem, 
  ReportedItem, 
  Conversation,
  Message,
  TravelStyle 
} from './types';
import { ToastProvider, useToast } from './components/common/Toast';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { TravelFeed } from './components/feed/TravelFeed';
import { CreatePostModal } from './components/feed/CreatePostModal';
import { CompanionFinder } from './components/companions/CompanionFinder';
import { TripsDiscovery } from './components/trips/TripsDiscovery';
import { CreateTripModal } from './components/trips/CreateTripModal';
import { MessagingCenter } from './components/messages/MessagingCenter';
import { TravelerProfile } from './components/profile/TravelerProfile';
import { ExplorerNetwork } from './components/network/ExplorerNetwork';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NotificationsDrawer } from './components/notifications/NotificationsDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { ReportModal } from './components/common/ReportModal';

function MainApp() {
  const { showToast } = useToast();

  // Primary active states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Collections
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [companions, setCompanions] = useState<CompanionIntent[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [reportedItems, setReportedItems] = useState<ReportedItem[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  // Messaging state
  const [activeMessagePartner, setActiveMessagePartner] = useState<User | null>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<Message[]>([]);

  // Modals
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [reportConfig, setReportConfig] = useState<{
    isOpen: boolean;
    type: 'post' | 'user';
    targetId: string;
    itemPreview: string;
  }>({
    isOpen: false,
    type: 'post',
    targetId: '',
    itemPreview: '',
  });

  // Synchronize state from database service
  const syncState = () => {
    const cur = db.getCurrentUser();
    const allUsers = db.getUsers();
    const allPosts = db.getPosts();
    const allTrips = db.getTrips();
    const allCompanions = db.getCompanions();
    const allReports = db.getReports();

    setCurrentUser(cur);
    setUsers(allUsers);
    setPosts(allPosts);
    setTrips(allTrips);
    setCompanions(allCompanions);
    setReportedItems(allReports);

    if (cur) {
      const userNotifs = db.getNotifications(cur.id);
      const userConvs = db.getConversations(cur.id);
      setNotifications(userNotifs);
      setConversations(userConvs);

      if (activeMessagePartner) {
        setActiveChatMessages(db.getChatMessages(cur.id, activeMessagePartner.id));
      }
    }
  };

  useEffect(() => {
    syncState();
    const unsubscribe = db.subscribe(syncState);
    return () => unsubscribe();
  }, [activeMessagePartner]);

  // Handler: Switch user
  const handleSwitchUser = (userId: string) => {
    db.setCurrentUser(userId);
    const u = db.getUser(userId);
    if (u) {
      setSelectedProfileUser(u);
    }
    showToast(`Active persona switched`, 'info');
  };

  // Handler: Profile selection
  const handleSelectUser = (user: User) => {
    setSelectedProfileUser(user);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Start message with user
  const handleStartMessage = (partnerId: string, initialMessage?: string) => {
    const partner = db.getUser(partnerId);
    if (!partner || !currentUser) return;

    if (initialMessage) {
      db.sendMessage(currentUser.id, partner.id, initialMessage);
    }

    setActiveMessagePartner(partner);
    setActiveChatMessages(db.getChatMessages(currentUser.id, partner.id));
    setActiveTab('messages');
  };

  // Unread counters
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 flex flex-col font-sans">
      {/* 1. TOP BAR */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadNotificationsCount}
        unreadMessagesCount={unreadMessagesCount}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSwitchUser={handleSwitchUser}
        allUsers={users}
        onSelectUser={handleSelectUser}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 2. MAIN VIEWPORT */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-8 flex gap-8">
        {/* Desktop Sidebar */}
        <Sidebar
          currentUser={currentUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadMessagesCount={unreadMessagesCount}
          onSelectUser={handleSelectUser}
          allUsers={users}
          onSwitchUser={handleSwitchUser}
        />

        {/* Content Pane */}
        <main className="flex-1 min-w-0">
          {activeTab === 'feed' && (
            <TravelFeed
              posts={posts}
              currentUser={currentUser}
              onLikePost={(id) => currentUser && db.toggleLikePost(id, currentUser.id)}
              onSavePost={(id) => db.toggleSavePost(id)}
              onSharePost={(id) => db.sharePost(id)}
              onAddComment={(id, content) => currentUser && db.addComment(id, currentUser.id, content)}
              onSelectUser={handleSelectUser}
              onOpenCreatePost={() => setIsCreatePostOpen(true)}
              onReport={(type, id, preview) =>
                setReportConfig({ isOpen: true, type, targetId: id, itemPreview: preview })
              }
              getUserById={(id) => db.getUser(id)}
            />
          )}

          {activeTab === 'companions' && (
            <CompanionFinder
              companions={companions}
              currentUser={currentUser}
              onSendConnection={(toId) => currentUser && db.sendConnectionRequest(currentUser.id, toId)}
              onStartMessage={handleStartMessage}
              onSelectUser={handleSelectUser}
              onCreateIntent={(data) => currentUser && db.createCompanionIntent({ ...data, userId: currentUser.id })}
              getConnectionStatus={(userId) => currentUser ? db.getConnectionStatus(currentUser.id, userId) : 'none'}
            />
          )}

          {activeTab === 'trips' && (
            <TripsDiscovery
              trips={trips}
              currentUser={currentUser}
              onSelectUser={handleSelectUser}
              onRequestJoin={(tripId, msg) => currentUser && db.requestJoinTrip(tripId, currentUser.id, msg)}
              onAcceptRequest={(tripId, userId) => db.acceptTripRequest(tripId, userId)}
              onRejectRequest={(tripId, userId) => db.rejectTripRequest(tripId, userId)}
              onOpenCreateTrip={() => setIsCreateTripOpen(true)}
              getUserById={(id) => db.getUser(id)}
            />
          )}

          {activeTab === 'network' && (
            <ExplorerNetwork
              users={users}
              currentUser={currentUser}
              onSelectUser={handleSelectUser}
              onSendConnection={(toId) => currentUser && db.sendConnectionRequest(currentUser.id, toId)}
              onAcceptConnection={(fromId) => currentUser && db.acceptConnection(currentUser.id, fromId)}
              onStartMessage={(id) => handleStartMessage(id)}
              getConnectionStatus={(userId) => currentUser ? db.getConnectionStatus(currentUser.id, userId) : 'none'}
              getMutualConnections={(userId) => currentUser ? db.getMutualConnections(currentUser.id, userId) : []}
            />
          )}

          {activeTab === 'messages' && (
            <MessagingCenter
              currentUser={currentUser}
              conversations={conversations}
              activePartner={activeMessagePartner}
              messages={activeChatMessages}
              onSelectConversation={(partner) => {
                setActiveMessagePartner(partner);
                if (currentUser) {
                  db.markMessagesAsRead(currentUser.id, partner.id);
                  setActiveChatMessages(db.getChatMessages(currentUser.id, partner.id));
                }
              }}
              onSendMessage={(receiverId, content) => {
                if (currentUser) {
                  db.sendMessage(currentUser.id, receiverId, content);
                  setActiveChatMessages(db.getChatMessages(currentUser.id, receiverId));
                }
              }}
              onSelectUser={handleSelectUser}
              allUsers={users}
            />
          )}

          {activeTab === 'profile' && (selectedProfileUser || currentUser) && (
            <TravelerProfile
              user={selectedProfileUser || currentUser!}
              currentUser={currentUser}
              connectionStatus={
                currentUser && (selectedProfileUser || currentUser)
                  ? db.getConnectionStatus(currentUser.id, (selectedProfileUser || currentUser!).id)
                  : 'none'
              }
              mutualConnections={
                currentUser && (selectedProfileUser || currentUser)
                  ? db.getMutualConnections(currentUser.id, (selectedProfileUser || currentUser!).id)
                  : []
              }
              userPosts={posts.filter((p) => p.authorId === (selectedProfileUser || currentUser!).id)}
              onSendConnection={(toId) => currentUser && db.sendConnectionRequest(currentUser.id, toId)}
              onAcceptConnection={(fromId) => currentUser && db.acceptConnection(currentUser.id, fromId)}
              onStartMessage={(toId) => handleStartMessage(toId)}
              onAddSummit={(summit) => currentUser && db.addMountainTrek(currentUser.id, summit)}
              onAddDestination={(dest) => currentUser && db.addVisitedDestination(currentUser.id, dest)}
              onUpdateProfile={(data) => currentUser && db.updateProfile(currentUser.id, data)}
              onSelectUser={handleSelectUser}
              onReport={(type, id, preview) =>
                setReportConfig({ isOpen: true, type, targetId: id, itemPreview: preview })
              }
            />
          )}

          {activeTab === 'admin' && (
            <AdminDashboard
              users={users}
              reportedItems={reportedItems}
              trips={trips}
              posts={posts}
              onToggleVerification={(id) => db.toggleUserVerification(id)}
              onToggleSuspension={(id) => db.toggleUserSuspension(id)}
              onResolveReport={(id, status) => db.updateReportStatus(id, status)}
              onDeletePost={(id) => db.deletePost(id)}
              onSelectUser={handleSelectUser}
            />
          )}
        </main>
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadMessagesCount={unreadMessagesCount}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
      />

      {/* 4. MODALS */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSubmit={(data) => {
          if (currentUser) {
            db.createPost({
              authorId: currentUser.id,
              ...data,
            });
          }
        }}
      />

      <CreateTripModal
        isOpen={isCreateTripOpen}
        onClose={() => setIsCreateTripOpen(false)}
        onSubmit={(data) => {
          if (currentUser) {
            db.createTrip({
              creatorId: currentUser.id,
              ...data,
            });
          }
        }}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={(id) => db.markNotificationRead(id)}
        onMarkAllRead={() => currentUser && db.markAllNotificationsRead(currentUser.id)}
        onAcceptConnection={(fromId) => currentUser && db.acceptConnection(currentUser.id, fromId)}
        onSelectUser={handleSelectUser}
        getUserById={(id) => db.getUser(id)}
        onOpenTrip={(tripId) => {
          setActiveTab('trips');
          setIsNotificationsOpen(false);
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onRegister={(data) => db.register(data)}
        onSwitchUser={handleSwitchUser}
        allUsers={users}
      />

      <ReportModal
        isOpen={reportConfig.isOpen}
        onClose={() => setReportConfig((prev) => ({ ...prev, isOpen: false }))}
        targetType={reportConfig.type}
        targetId={reportConfig.targetId}
        itemPreview={reportConfig.itemPreview}
        onSubmitReport={(data) => {
          if (currentUser) {
            db.reportContent({
              ...data,
              reportedBy: currentUser.id,
            });
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
