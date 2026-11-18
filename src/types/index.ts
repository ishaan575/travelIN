export type TravelStyle = 
  | 'solo' 
  | 'trekking' 
  | 'backpacking' 
  | 'luxury' 
  | 'road trips' 
  | 'adventure' 
  | 'cultural';

export interface UserStats {
  countriesVisited: number;
  citiesVisited: number;
  mountainsCompleted: number;
  tripsCount: number;
  connectionsCount: number;
  followersCount: number;
}

export interface VisitedDestination {
  id: string;
  name: string;
  country: string;
  year: number;
  type: 'city' | 'mountain' | 'park' | 'coastal';
  notes?: string;
}

export interface MountainTrek {
  id: string;
  name: string;
  elevationMeters: number;
  region: string;
  country: string;
  completedYear: number;
  difficulty: 'Moderate' | 'Challenging' | 'Extreme' | 'Alpine Expedition';
}

export interface UpcomingPlan {
  id: string;
  title: string;
  destination: string;
  country: string;
  dateRange: string;
  status: 'confirmed' | 'planning' | 'open_for_companions';
}

export interface TravelBadge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'Elevation' | 'Exploration' | 'Community' | 'Stewardship';
  issuedAt: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  coverUrl: string;
  headline: string;
  bio: string;
  location: {
    city: string;
    country: string;
  };
  travelInterests: string[];
  travelStyles: TravelStyle[];
  stats: UserStats;
  visitedCountries: string[];
  visitedDestinations: VisitedDestination[];
  mountainsTreks: MountainTrek[];
  upcomingPlans: UpcomingPlan[];
  badges: TravelBadge[];
  isVerified: boolean;
  role: 'admin' | 'member';
  isSuspended?: boolean;
  joinedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: Pick<User, 'id' | 'fullName' | 'username' | 'avatarUrl' | 'isVerified'>;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  author: Pick<User, 'id' | 'fullName' | 'username' | 'avatarUrl' | 'headline' | 'isVerified'>;
  type: 'story' | 'guide' | 'expedition' | 'tip';
  title?: string;
  content: string;
  mediaUrls: string[];
  location: {
    name: string;
    country: string;
  };
  tags: string[];
  specs?: {
    elevation?: string;
    distance?: string;
    duration?: string;
    season?: string;
    difficulty?: string;
  };
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  comments: Comment[];
}

export interface TripParticipant {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string;
  isVerified: boolean;
  role: 'organizer' | 'confirmed';
}

export interface TripRequest {
  userId: string;
  user: Pick<User, 'id' | 'fullName' | 'username' | 'avatarUrl' | 'headline'>;
  requestedAt: string;
  message?: string;
}

export interface Trip {
  id: string;
  creatorId: string;
  creator: Pick<User, 'id' | 'fullName' | 'username' | 'avatarUrl' | 'headline' | 'isVerified'>;
  title: string;
  destination: string;
  country: string;
  coverUrl: string;
  startDate: string;
  endDate: string;
  budgetTier: '$' | '$$' | '$$$';
  estimatedBudget: string;
  travelStyle: TravelStyle;
  difficulty: 'Relaxed' | 'Moderate' | 'Challenging' | 'Expedition Grade';
  maxSpots: number;
  participants: TripParticipant[];
  pendingRequests: TripRequest[];
  description: string;
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  gearRequirements: string[];
  status: 'open' | 'full' | 'completed';
  createdAt: string;
}

export interface CompanionIntent {
  id: string;
  userId: string;
  user: User;
  destination: string;
  country: string;
  dateRange: string;
  travelStyle: TravelStyle;
  budgetTier: '$' | '$$' | '$$$';
  groupSizePreference: string;
  description: string;
  interests: string[];
  compatibilityScore: number;
}

export type ConnectionStatus = 'none' | 'pending' | 'connected' | 'received';

export interface Connection {
  id: string;
  requesterId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: Message;
  unreadCount: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 
    | 'connection_request' 
    | 'connection_accepted' 
    | 'trip_join_request' 
    | 'trip_accepted' 
    | 'post_like' 
    | 'post_comment';
  actor: Pick<User, 'id' | 'fullName' | 'username' | 'avatarUrl'>;
  title: string;
  message: string;
  referenceId?: string;
  read: boolean;
  createdAt: string;
}

export interface ReportedItem {
  id: string;
  type: 'post' | 'user';
  targetId: string;
  reportedBy: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
  itemPreview: string;
}
