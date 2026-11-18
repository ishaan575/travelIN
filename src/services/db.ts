import { 
  User, 
  Post, 
  Trip, 
  CompanionIntent, 
  NotificationItem, 
  ReportedItem, 
  Connection, 
  Message, 
  Conversation,
  ConnectionStatus,
  TravelStyle
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_POSTS, 
  INITIAL_TRIPS, 
  INITIAL_COMPANIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_REPORTS 
} from '../data/initialData';

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'wayfarer_current_user_id',
  USERS: 'wayfarer_users_v1',
  POSTS: 'wayfarer_posts_v1',
  TRIPS: 'wayfarer_trips_v1',
  COMPANIONS: 'wayfarer_companions_v1',
  CONNECTIONS: 'wayfarer_connections_v1',
  MESSAGES: 'wayfarer_messages_v1',
  NOTIFICATIONS: 'wayfarer_notifications_v1',
  REPORTS: 'wayfarer_reports_v1',
};

// Initial connections seeded
const INITIAL_CONNECTIONS: Connection[] = [
  { id: 'conn_1', requesterId: 'user_alex', receiverId: 'user_elena', status: 'pending', createdAt: '10 mins ago' },
  { id: 'conn_2', requesterId: 'user_elena', receiverId: 'user_marcus', status: 'accepted', createdAt: '2 weeks ago' },
  { id: 'conn_3', requesterId: 'user_priya', receiverId: 'user_marcus', status: 'accepted', createdAt: '1 month ago' },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    conversationId: 'user_elena_user_marcus',
    senderId: 'user_marcus',
    receiverId: 'user_elena',
    content: 'Hi Elena! Saw your summit notes on Fitz Roy. Are you bringing 60m half ropes or single rope for the Alta Via 1 traverse in June?',
    createdAt: '10:45 AM',
    read: true,
  },
  {
    id: 'msg_2',
    conversationId: 'user_elena_user_marcus',
    senderId: 'user_elena',
    receiverId: 'user_marcus',
    content: 'Hi Marcus! For Alta Via 1 we are mostly sticking to via ferrata sets and a light 30m alpine hyperstatic line for emergency crevasse/scramble bails. Very light pack weight is the priority.',
    createdAt: '10:52 AM',
    read: true,
  },
  {
    id: 'msg_3',
    conversationId: 'user_elena_user_alex',
    senderId: 'user_alex',
    receiverId: 'user_elena',
    content: 'Elena, congratulations on the IFMGA accreditation! Would love to compare notes on Patagonia route logistics when you have a moment.',
    createdAt: 'Yesterday',
    read: false,
  }
];

class DatabaseService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRIPS)) {
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(INITIAL_TRIPS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMPANIONS)) {
      localStorage.setItem(STORAGE_KEYS.COMPANIONS, JSON.stringify(INITIAL_COMPANIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONNECTIONS)) {
      localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(INITIAL_CONNECTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user_elena');
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  // --- AUTH & CURRENT USER ---
  getCurrentUserId(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user_elena';
  }

  getCurrentUser(): User | null {
    const userId = this.getCurrentUserId();
    const users = this.getUsers();
    return users.find((u) => u.id === userId) || users[0] || null;
  }

  setCurrentUser(userId: string) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    this.notify();
  }

  logout() {
    // Return to first user as demo or empty
    const users = this.getUsers();
    if (users.length > 0) {
      this.setCurrentUser(users[0].id);
    }
  }

  register(userData: {
    fullName: string;
    username: string;
    email: string;
    city: string;
    country: string;
    bio: string;
    travelStyles: TravelStyle[];
    travelInterests: string[];
    avatarUrl?: string;
  }): User {
    const users = this.getUsers();
    const existing = users.find((u) => u.username.toLowerCase() === userData.username.toLowerCase());
    if (existing) {
      throw new Error(`Username @${userData.username} is already taken`);
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      username: userData.username.replace(/^@/, '').toLowerCase().trim(),
      fullName: userData.fullName.trim(),
      email: userData.email.trim(),
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      coverUrl: '/src/assets/images/hero_patagonia_peaks_1793636634337.jpg',
      headline: `Global Explorer · ${userData.travelStyles.slice(0, 2).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' & ')} Travel`,
      bio: userData.bio || 'Passionate about exploring remote corners, mountain ridgelines, and authentic cultural exchange.',
      location: {
        city: userData.city,
        country: userData.country,
      },
      travelInterests: userData.travelInterests.length > 0 ? userData.travelInterests : ['Trekking', 'Photography', 'Wilderness'],
      travelStyles: userData.travelStyles.length > 0 ? userData.travelStyles : ['solo', 'adventure'],
      stats: {
        countriesVisited: 4,
        citiesVisited: 9,
        mountainsCompleted: 2,
        tripsCount: 1,
        connectionsCount: 1,
        followersCount: 5,
      },
      visitedCountries: [userData.country, 'Nepal', 'Iceland', 'Norway'],
      visitedDestinations: [
        { id: `vd_${Date.now()}`, name: `${userData.city} & Environs`, country: userData.country, year: 2024, type: 'city' }
      ],
      mountainsTreks: [
        { id: `mt_${Date.now()}`, name: 'Base Alpine Traverse', elevationMeters: 2400, region: 'Regional Massif', country: userData.country, completedYear: 2025, difficulty: 'Moderate' }
      ],
      upcomingPlans: [],
      badges: [
        { id: `b_${Date.now()}`, name: 'First Passport Stamp', description: 'Joined travelIN verified explorer community', iconName: 'Compass', category: 'Exploration', issuedAt: '2026' }
      ],
      isVerified: false,
      role: 'member',
      joinedAt: new Date().toISOString().split('T')[0],
    };

    users.unshift(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newUser.id);
    return newUser;
  }

  // --- USERS & PROFILES ---
  getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  }

  getUser(idOrUsername: string): User | undefined {
    const clean = idOrUsername.replace(/^@/, '').toLowerCase();
    const users = this.getUsers();
    return users.find((u) => u.id === idOrUsername || u.username.toLowerCase() === clean);
  }

  updateProfile(userId: string, data: Partial<User>): User {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');

    const updated = {
      ...users[index],
      ...data,
      stats: {
        ...users[index].stats,
        ...(data.stats || {}),
      },
    };
    users[index] = updated;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.notify();
    return updated;
  }

  addVisitedDestination(userId: string, destination: { name: string; country: string; year: number; type: 'city' | 'mountain' | 'park' | 'coastal'; notes?: string }) {
    const user = this.getUser(userId);
    if (!user) return;
    const newDest = { id: `vd_${Date.now()}`, ...destination };
    const visitedDestinations = [newDest, ...user.visitedDestinations];
    const visitedCountries = Array.from(new Set([...user.visitedCountries, destination.country]));
    this.updateProfile(userId, {
      visitedDestinations,
      visitedCountries,
      stats: {
        ...user.stats,
        citiesVisited: visitedDestinations.length,
        countriesVisited: visitedCountries.length,
      }
    });
  }

  addMountainTrek(userId: string, trek: { name: string; elevationMeters: number; region: string; country: string; completedYear: number; difficulty: 'Moderate' | 'Challenging' | 'Extreme' | 'Alpine Expedition' }) {
    const user = this.getUser(userId);
    if (!user) return;
    const newTrek = { id: `mt_${Date.now()}`, ...trek };
    const mountainsTreks = [newTrek, ...user.mountainsTreks];
    this.updateProfile(userId, {
      mountainsTreks,
      stats: {
        ...user.stats,
        mountainsCompleted: mountainsTreks.length,
      }
    });
  }

  // --- SOCIAL CONNECTIONS & NETWORK ---
  getConnections(): Connection[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
    return raw ? JSON.parse(raw) : INITIAL_CONNECTIONS;
  }

  getUserConnections(userId: string): { user: User; status: 'connected' | 'pending_sent' | 'pending_received' }[] {
    const connections = this.getConnections();
    const users = this.getUsers();
    const results: { user: User; status: 'connected' | 'pending_sent' | 'pending_received' }[] = [];

    connections.forEach((c) => {
      if (c.requesterId === userId) {
        const other = users.find((u) => u.id === c.receiverId);
        if (other) {
          results.push({
            user: other,
            status: c.status === 'accepted' ? 'connected' : 'pending_sent',
          });
        }
      } else if (c.receiverId === userId) {
        const other = users.find((u) => u.id === c.requesterId);
        if (other) {
          results.push({
            user: other,
            status: c.status === 'accepted' ? 'connected' : 'pending_received',
          });
        }
      }
    });

    return results;
  }

  getConnectionStatus(currentUserId: string, otherUserId: string): ConnectionStatus {
    if (currentUserId === otherUserId) return 'none';
    const connections = this.getConnections();
    const conn = connections.find(
      (c) =>
        (c.requesterId === currentUserId && c.receiverId === otherUserId) ||
        (c.requesterId === otherUserId && c.receiverId === currentUserId)
    );
    if (!conn) return 'none';
    if (conn.status === 'accepted') return 'connected';
    if (conn.status === 'pending') {
      return conn.requesterId === currentUserId ? 'pending' : 'received';
    }
    return 'none';
  }

  sendConnectionRequest(fromId: string, toId: string) {
    if (fromId === toId) return;
    const connections = this.getConnections();
    const existing = connections.find(
      (c) =>
        (c.requesterId === fromId && c.receiverId === toId) ||
        (c.requesterId === toId && c.receiverId === fromId)
    );

    if (existing) {
      if (existing.status === 'rejected') {
        existing.status = 'pending';
        existing.requesterId = fromId;
        existing.receiverId = toId;
        localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));
        this.notify();
      }
      return;
    }

    const newConn: Connection = {
      id: `conn_${Date.now()}`,
      requesterId: fromId,
      receiverId: toId,
      status: 'pending',
      createdAt: 'Just now',
    };
    connections.unshift(newConn);
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));

    // Send notification
    const sender = this.getUser(fromId);
    if (sender) {
      this.createNotification({
        userId: toId,
        type: 'connection_request',
        actor: {
          id: sender.id,
          fullName: sender.fullName,
          username: sender.username,
          avatarUrl: sender.avatarUrl,
        },
        title: 'New Connection Request',
        message: `${sender.fullName} invited you to connect on travelIN.`,
        referenceId: sender.id,
      });
    }

    this.notify();
  }

  acceptConnection(userId: string, requesterId: string) {
    const connections = this.getConnections();
    const conn = connections.find(
      (c) => c.requesterId === requesterId && c.receiverId === userId
    );
    if (conn) {
      conn.status = 'accepted';
      localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));

      // Update counters
      const u1 = this.getUser(userId);
      const u2 = this.getUser(requesterId);
      if (u1 && u2) {
        this.updateProfile(u1.id, { stats: { ...u1.stats, connectionsCount: u1.stats.connectionsCount + 1 } });
        this.updateProfile(u2.id, { stats: { ...u2.stats, connectionsCount: u2.stats.connectionsCount + 1 } });
        
        this.createNotification({
          userId: requesterId,
          type: 'connection_accepted',
          actor: {
            id: u1.id,
            fullName: u1.fullName,
            username: u1.username,
            avatarUrl: u1.avatarUrl,
          },
          title: 'Connection Accepted',
          message: `${u1.fullName} accepted your connection request.`,
          referenceId: u1.id,
        });
      }

      this.notify();
    }
  }

  rejectConnection(userId: string, requesterId: string) {
    const connections = this.getConnections().filter(
      (c) => !(c.requesterId === requesterId && c.receiverId === userId)
    );
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));
    this.notify();
  }

  removeConnection(user1Id: string, user2Id: string) {
    const connections = this.getConnections().filter(
      (c) =>
        !(
          (c.requesterId === user1Id && c.receiverId === user2Id) ||
          (c.requesterId === user2Id && c.receiverId === user1Id)
        )
    );
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));
    this.notify();
  }

  getMutualConnections(user1Id: string, user2Id: string): User[] {
    if (user1Id === user2Id) return [];
    const conns1 = new Set(
      this.getUserConnections(user1Id)
        .filter((c) => c.status === 'connected')
        .map((c) => c.user.id)
    );
    const conns2 = this.getUserConnections(user2Id).filter((c) => c.status === 'connected');
    return conns2.filter((c) => conns1.has(c.user.id)).map((c) => c.user);
  }

  // --- POSTS & FEED ---
  getPosts(): Post[] {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    return raw ? JSON.parse(raw) : INITIAL_POSTS;
  }

  createPost(data: {
    authorId: string;
    type: 'story' | 'guide' | 'expedition' | 'tip';
    title?: string;
    content: string;
    locationName: string;
    country: string;
    mediaUrls: string[];
    tags: string[];
    specs?: { elevation?: string; distance?: string; duration?: string; season?: string; difficulty?: string };
  }): Post {
    const author = this.getUser(data.authorId);
    if (!author) throw new Error('Author not found');
    if (author.isSuspended) {
      throw new Error('Security Exception: Your account is currently suspended from publishing content.');
    }

    const posts = this.getPosts();
    const newPost: Post = {
      id: `post_${Date.now()}`,
      authorId: author.id,
      author: {
        id: author.id,
        fullName: author.fullName,
        username: author.username,
        avatarUrl: author.avatarUrl,
        headline: author.headline,
        isVerified: author.isVerified,
      },
      type: data.type,
      title: data.title,
      content: data.content,
      mediaUrls: data.mediaUrls.length > 0 ? data.mediaUrls : ['/src/assets/images/hero_patagonia_peaks_1793636634337.jpg'],
      location: {
        name: data.locationName,
        country: data.country,
      },
      tags: data.tags,
      specs: data.specs,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isSaved: false,
      createdAt: 'Just now',
      comments: [],
    };

    posts.unshift(newPost);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    this.notify();
    return newPost;
  }

  toggleLikePost(postId: string, userId: string) {
    const posts = this.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    post.isLiked = !post.isLiked;
    post.likesCount += post.isLiked ? 1 : -1;
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

    if (post.isLiked && post.authorId !== userId) {
      const actor = this.getUser(userId);
      if (actor) {
        this.createNotification({
          userId: post.authorId,
          type: 'post_like',
          actor: {
            id: actor.id,
            fullName: actor.fullName,
            username: actor.username,
            avatarUrl: actor.avatarUrl,
          },
          title: 'Post Liked',
          message: `${actor.fullName} liked your travel post: ${post.title || post.location.name}`,
          referenceId: post.id,
        });
      }
    }

    this.notify();
  }

  toggleSavePost(postId: string) {
    const posts = this.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    post.isSaved = !post.isSaved;
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    this.notify();
  }

  sharePost(postId: string) {
    const posts = this.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    post.sharesCount += 1;
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    this.notify();
  }

  addComment(postId: string, authorId: string, content: string) {
    const posts = this.getPosts();
    const post = posts.find((p) => p.id === postId);
    const author = this.getUser(authorId);
    if (!post || !author) return;

    const newComment = {
      id: `comm_${Date.now()}`,
      postId,
      authorId,
      author: {
        id: author.id,
        fullName: author.fullName,
        username: author.username,
        avatarUrl: author.avatarUrl,
        isVerified: author.isVerified,
      },
      content: content.trim(),
      createdAt: 'Just now',
    };

    post.comments.push(newComment);
    post.commentsCount = post.comments.length;
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

    if (post.authorId !== authorId) {
      this.createNotification({
        userId: post.authorId,
        type: 'post_comment',
        actor: {
          id: author.id,
          fullName: author.fullName,
          username: author.username,
          avatarUrl: author.avatarUrl,
        },
        title: 'New Comment',
        message: `${author.fullName} commented on your post: "${content.slice(0, 40)}..."`,
        referenceId: post.id,
      });
    }

    this.notify();
  }

  deletePost(postId: string) {
    const posts = this.getPosts().filter((p) => p.id !== postId);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    this.notify();
  }

  // --- TRIPS & EXPEDITION GROUPS ---
  getTrips(): Trip[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRIPS);
    return raw ? JSON.parse(raw) : INITIAL_TRIPS;
  }

  getTrip(tripId: string): Trip | undefined {
    return this.getTrips().find((t) => t.id === tripId);
  }

  createTrip(data: {
    creatorId: string;
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
  }): Trip {
    const creator = this.getUser(data.creatorId);
    if (!creator) throw new Error('Creator not found');

    const trips = this.getTrips();
    const newTrip: Trip = {
      id: `trip_${Date.now()}`,
      creatorId: creator.id,
      creator: {
        id: creator.id,
        fullName: creator.fullName,
        username: creator.username,
        avatarUrl: creator.avatarUrl,
        headline: creator.headline,
        isVerified: creator.isVerified,
      },
      title: data.title,
      destination: data.destination,
      country: data.country,
      coverUrl: data.coverUrl || '/src/assets/images/expedition_dolomites_1793636634749.jpg',
      startDate: data.startDate,
      endDate: data.endDate,
      budgetTier: data.budgetTier,
      estimatedBudget: data.estimatedBudget,
      travelStyle: data.travelStyle,
      difficulty: data.difficulty,
      maxSpots: data.maxSpots,
      participants: [
        {
          id: creator.id,
          fullName: creator.fullName,
          username: creator.username,
          avatarUrl: creator.avatarUrl,
          isVerified: creator.isVerified,
          role: 'organizer',
        }
      ],
      pendingRequests: [],
      description: data.description,
      itinerary: data.itinerary,
      gearRequirements: data.gearRequirements,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
    };

    trips.unshift(newTrip);
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    
    // Add to user upcoming plans
    const updatedPlans = [
      {
        id: `plan_${newTrip.id}`,
        title: newTrip.title,
        destination: newTrip.destination,
        country: newTrip.country,
        dateRange: `${newTrip.startDate} to ${newTrip.endDate}`,
        status: 'confirmed' as const,
      },
      ...creator.upcomingPlans
    ];
    this.updateProfile(creator.id, { upcomingPlans: updatedPlans });

    this.notify();
    return newTrip;
  }

  requestJoinTrip(tripId: string, userId: string, message?: string) {
    const trips = this.getTrips();
    const trip = trips.find((t) => t.id === tripId);
    const applicant = this.getUser(userId);
    if (!trip || !applicant) return;

    const alreadyParticipant = trip.participants.some((p) => p.id === userId);
    const alreadyRequested = trip.pendingRequests.some((r) => r.userId === userId);
    if (alreadyParticipant || alreadyRequested) return;

    trip.pendingRequests.push({
      userId,
      user: {
        id: applicant.id,
        fullName: applicant.fullName,
        username: applicant.username,
        avatarUrl: applicant.avatarUrl,
        headline: applicant.headline,
      },
      requestedAt: 'Just now',
      message: message || 'I would love to join this expedition!',
    });

    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));

    // Notify organizer
    this.createNotification({
      userId: trip.creatorId,
      type: 'trip_join_request',
      actor: {
        id: applicant.id,
        fullName: applicant.fullName,
        username: applicant.username,
        avatarUrl: applicant.avatarUrl,
      },
      title: 'Trip Join Request',
      message: `${applicant.fullName} requested to join "${trip.title}"`,
      referenceId: trip.id,
    });

    this.notify();
  }

  acceptTripRequest(tripId: string, userId: string) {
    const trips = this.getTrips();
    const trip = trips.find((t) => t.id === tripId);
    const applicant = this.getUser(userId);
    if (!trip || !applicant) return;

    trip.pendingRequests = trip.pendingRequests.filter((r) => r.userId !== userId);
    trip.participants.push({
      id: applicant.id,
      fullName: applicant.fullName,
      username: applicant.username,
      avatarUrl: applicant.avatarUrl,
      isVerified: applicant.isVerified,
      role: 'confirmed',
    });

    if (trip.participants.length >= trip.maxSpots) {
      trip.status = 'full';
    }

    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));

    this.createNotification({
      userId,
      type: 'trip_accepted',
      actor: {
        id: trip.creator.id,
        fullName: trip.creator.fullName,
        username: trip.creator.username,
        avatarUrl: trip.creator.avatarUrl,
      },
      title: 'Joined Expedition!',
      message: `You were accepted into the expedition: ${trip.title}`,
      referenceId: trip.id,
    });

    this.notify();
  }

  rejectTripRequest(tripId: string, userId: string) {
    const trips = this.getTrips();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;

    trip.pendingRequests = trip.pendingRequests.filter((r) => r.userId !== userId);
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    this.notify();
  }

  // --- COMPANION FINDER ---
  getCompanions(): CompanionIntent[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPANIONS);
    return raw ? JSON.parse(raw) : INITIAL_COMPANIONS;
  }

  createCompanionIntent(data: {
    userId: string;
    destination: string;
    country: string;
    dateRange: string;
    travelStyle: TravelStyle;
    budgetTier: '$' | '$$' | '$$$';
    groupSizePreference: string;
    description: string;
    interests: string[];
  }): CompanionIntent {
    const user = this.getUser(data.userId);
    if (!user) throw new Error('User not found');

    const companions = this.getCompanions();
    const newIntent: CompanionIntent = {
      id: `ci_${Date.now()}`,
      userId: user.id,
      user,
      destination: data.destination,
      country: data.country,
      dateRange: data.dateRange,
      travelStyle: data.travelStyle,
      budgetTier: data.budgetTier,
      groupSizePreference: data.groupSizePreference,
      description: data.description,
      interests: data.interests,
      compatibilityScore: 90,
    };

    companions.unshift(newIntent);
    localStorage.setItem(STORAGE_KEYS.COMPANIONS, JSON.stringify(companions));
    this.notify();
    return newIntent;
  }

  // --- MESSAGES & CHAT ---
  getMessages(): Message[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return raw ? JSON.parse(raw) : INITIAL_MESSAGES;
  }

  getConversations(currentUserId: string): Conversation[] {
    const messages = this.getMessages();
    const users = this.getUsers();
    const conversationMap = new Map<string, { lastMessage: Message; unreadCount: number; partnerId: string }>();

    messages.forEach((msg) => {
      const isSender = msg.senderId === currentUserId;
      const isReceiver = msg.receiverId === currentUserId;
      if (!isSender && !isReceiver) return;

      const partnerId = isSender ? msg.receiverId : msg.senderId;
      const existing = conversationMap.get(partnerId);

      const isUnread = !isSender && !msg.read;
      if (!existing) {
        conversationMap.set(partnerId, {
          lastMessage: msg,
          unreadCount: isUnread ? 1 : 0,
          partnerId,
        });
      } else {
        if (isUnread) existing.unreadCount += 1;
      }
    });

    const list: Conversation[] = [];
    conversationMap.forEach((conv, partnerId) => {
      const partner = users.find((u) => u.id === partnerId);
      if (partner) {
        list.push({
          id: `conv_${currentUserId}_${partnerId}`,
          participant: partner,
          lastMessage: conv.lastMessage,
          unreadCount: conv.unreadCount,
        });
      }
    });

    return list;
  }

  getChatMessages(user1Id: string, user2Id: string): Message[] {
    const messages = this.getMessages();
    return messages.filter(
      (m) =>
        (m.senderId === user1Id && m.receiverId === user2Id) ||
        (m.senderId === user2Id && m.receiverId === user1Id)
    );
  }

  sendMessage(senderId: string, receiverId: string, content: string): Message {
    if (!content.trim()) throw new Error('Message cannot be empty');
    const sender = this.getUser(senderId);
    if (sender?.isSuspended) {
      throw new Error('Security Exception: Suspended accounts cannot send private messages.');
    }
    const messages = this.getMessages();
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId: `conv_${senderId}_${receiverId}`,
      senderId,
      receiverId,
      content: content.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    messages.push(newMsg);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    this.notify();
    return newMsg;
  }

  markMessagesAsRead(currentUserId: string, partnerId: string) {
    const messages = this.getMessages();
    let changed = false;
    messages.forEach((m) => {
      if (m.senderId === partnerId && m.receiverId === currentUserId && !m.read) {
        m.read = true;
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
      this.notify();
    }
  }

  // --- NOTIFICATIONS ---
  getNotifications(userId: string): NotificationItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const all: NotificationItem[] = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    return all.filter((n) => n.userId === userId);
  }

  createNotification(notif: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>) {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const all: NotificationItem[] = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    const item: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}`,
      read: false,
      createdAt: 'Just now',
    };
    all.unshift(item);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
    this.notify();
  }

  markNotificationRead(id: string) {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const all: NotificationItem[] = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    const target = all.find((n) => n.id === id);
    if (target) {
      target.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
      this.notify();
    }
  }

  markAllNotificationsRead(userId: string) {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const all: NotificationItem[] = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    all.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
    this.notify();
  }

  // --- ADMIN & MODERATION ---
  getReports(): ReportedItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return raw ? JSON.parse(raw) : INITIAL_REPORTS;
  }

  reportContent(data: {
    type: 'post' | 'user';
    targetId: string;
    reportedBy: string;
    reason: string;
    details: string;
    itemPreview: string;
  }) {
    const reports = this.getReports();
    const newReport: ReportedItem = {
      id: `rep_${Date.now()}`,
      type: data.type,
      targetId: data.targetId,
      reportedBy: data.reportedBy,
      reason: data.reason,
      details: data.details,
      itemPreview: data.itemPreview,
      status: 'pending',
      createdAt: 'Just now',
    };
    reports.unshift(newReport);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    this.notify();
  }

  updateReportStatus(reportId: string, status: 'reviewed' | 'resolved') {
    const reports = this.getReports();
    const target = reports.find((r) => r.id === reportId);
    if (target) {
      target.status = status;
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      this.notify();
    }
  }

  toggleUserVerification(userId: string) {
    const user = this.getUser(userId);
    if (!user) return;
    this.updateProfile(userId, { isVerified: !user.isVerified });
  }

  toggleUserSuspension(userId: string) {
    const user = this.getUser(userId);
    if (!user) return;
    this.updateProfile(userId, { isSuspended: !user.isSuspended });
  }
}

export const db = new DatabaseService();
