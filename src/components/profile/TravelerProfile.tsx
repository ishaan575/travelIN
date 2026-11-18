import React, { useState } from 'react';
import { 
  User, 
  Post, 
  ConnectionStatus 
} from '../../types';
import { 
  MapPin, 
  Mountain, 
  Globe, 
  CheckCircle2, 
  Calendar, 
  Award, 
  ShieldCheck, 
  MessageSquare, 
  UserPlus, 
  UserCheck, 
  Clock, 
  Plus, 
  Edit3, 
  Share2, 
  Compass,
  Footprints,
  ExternalLink,
  Flag,
  X
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface TravelerProfileProps {
  user: User;
  currentUser: User | null;
  connectionStatus: ConnectionStatus;
  mutualConnections: User[];
  userPosts: Post[];
  onSendConnection: (userId: string) => void;
  onAcceptConnection: (userId: string) => void;
  onStartMessage: (userId: string) => void;
  onAddSummit: (summit: { name: string; elevationMeters: number; region: string; country: string; completedYear: number; difficulty: 'Moderate' | 'Challenging' | 'Extreme' | 'Alpine Expedition' }) => void;
  onAddDestination: (dest: { name: string; country: string; year: number; type: 'city' | 'mountain' | 'park' | 'coastal'; notes?: string }) => void;
  onUpdateProfile: (data: Partial<User>) => void;
  onSelectUser: (user: User) => void;
  onReport: (type: 'user', targetId: string, preview: string) => void;
}

export const TravelerProfile: React.FC<TravelerProfileProps> = ({
  user,
  currentUser,
  connectionStatus,
  mutualConnections,
  userPosts,
  onSendConnection,
  onAcceptConnection,
  onStartMessage,
  onAddSummit,
  onAddDestination,
  onUpdateProfile,
  onSelectUser,
  onReport,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'passport' | 'posts' | 'upcoming' | 'network'>('passport');
  const [showAddSummitModal, setShowAddSummitModal] = useState(false);
  const [showAddDestModal, setShowAddDestModal] = useState(false);
  const [showEditBioModal, setShowEditBioModal] = useState(false);

  const isOwnProfile = currentUser?.id === user.id;

  // New Summit Form State
  const [summitName, setSummitName] = useState('');
  const [summitElevation, setSummitElevation] = useState(3000);
  const [summitRegion, setSummitRegion] = useState('');
  const [summitCountry, setSummitCountry] = useState(user.location.country);
  const [summitYear, setSummitYear] = useState(2025);
  const [summitDiff, setSummitDiff] = useState<'Moderate' | 'Challenging' | 'Extreme' | 'Alpine Expedition'>('Challenging');

  // New Destination Form State
  const [destName, setDestName] = useState('');
  const [destCountry, setDestCountry] = useState('');
  const [destYear, setDestYear] = useState(2025);
  const [destType, setDestType] = useState<'city' | 'mountain' | 'park' | 'coastal'>('mountain');
  const [destNotes, setDestNotes] = useState('');

  // Edit Bio Form State
  const [editHeadline, setEditHeadline] = useState(user.headline);
  const [editBio, setEditBio] = useState(user.bio);
  const [editCity, setEditCity] = useState(user.location.city);
  const [editCountry, setEditCountry] = useState(user.location.country);

  const handleCreateSummit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summitName.trim() || !summitCountry.trim()) {
      showToast('Please provide a summit name and country', 'error');
      return;
    }
    onAddSummit({
      name: summitName.trim(),
      elevationMeters: Number(summitElevation),
      region: summitRegion.trim() || 'Alpine Massif',
      country: summitCountry.trim(),
      completedYear: Number(summitYear),
      difficulty: summitDiff,
    });
    setShowAddSummitModal(false);
    setSummitName('');
    showToast(`Added ${summitName} to your verified summit log!`, 'success');
  };

  const handleCreateDest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destName.trim() || !destCountry.trim()) {
      showToast('Please enter destination name and country', 'error');
      return;
    }
    onAddDestination({
      name: destName.trim(),
      country: destCountry.trim(),
      year: Number(destYear),
      type: destType,
      notes: destNotes.trim(),
    });
    setShowAddDestModal(false);
    setDestName('');
    setDestCountry('');
    showToast(`Added ${destName} to your travel stamps!`, 'success');
  };

  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      headline: editHeadline,
      bio: editBio,
      location: { city: editCity, country: editCountry },
    });
    setShowEditBioModal(false);
    showToast('Travel profile updated successfully', 'success');
  };

  const copyProfileLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Travel passport link copied to clipboard', 'info');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. HERO IDENTITY CARD (LinkedIn meets National Geographic) */}
      <div className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-xs">
        {/* Cover Photo */}
        <div className="relative h-60 sm:h-72 w-full bg-stone-800 overflow-hidden">
          <img
            src={user.coverUrl || '/src/assets/images/traveler_cover_alps_1793636634695.jpg'}
            alt="Travel Cover"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={copyProfileLink}
              className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full transition-colors"
              title="Share Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {!isOwnProfile && (
              <button
                onClick={() => onReport('user', user.id, `@${user.username} (${user.fullName})`)}
                className="p-2 bg-white/20 hover:bg-rose-500/80 backdrop-blur-md text-white rounded-full transition-colors"
                title="Report User"
              >
                <Flag className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Profile Main Details Strip */}
        <div className="px-6 sm:px-8 pb-6 relative">
          {/* Avatar & Floating Badges */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                referrerPolicy="no-referrer"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white shadow-md bg-stone-100"
              />
              {user.isVerified && (
                <div 
                  className="absolute bottom-1 right-1 bg-[#1B3B2B] text-emerald-300 p-1 rounded-lg border-2 border-white shadow-xs"
                  title="Verified High-Altitude Explorer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={() => setShowEditBioModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Identity</span>
                  </button>
                  <button
                    onClick={() => setShowAddSummitModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1B3B2B] hover:bg-[#142B20] rounded-xl transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Summit</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Connection Button */}
                  {connectionStatus === 'connected' ? (
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Connected</span>
                    </div>
                  ) : connectionStatus === 'pending' ? (
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Request Sent</span>
                    </div>
                  ) : connectionStatus === 'received' ? (
                    <button
                      onClick={() => onAcceptConnection(user.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Accept Request</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onSendConnection(user.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1B3B2B] hover:bg-[#142B20] rounded-xl transition-colors shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </button>
                  )}

                  {/* Message Button */}
                  <button
                    onClick={() => onStartMessage(user.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Name & Headline */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-display text-stone-900">{user.fullName}</h1>
              <span className="text-stone-400 text-sm">@{user.username}</span>
            </div>
            <p className="text-sm font-medium text-stone-700 mt-1 max-w-2xl leading-relaxed">
              {user.headline}
            </p>
          </div>

          {/* Location & Metadata (Zero-pill discipline per rule 1.A) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mt-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>{user.location.city}, {user.location.country}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{user.stats.connectionsCount} Connections</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{user.stats.followersCount} Followers</span>
            <span aria-hidden="true">·</span>
            <span>Joined {user.joinedAt}</span>
          </div>

          {/* Mutual Connections notice */}
          {!isOwnProfile && mutualConnections.length > 0 && (
            <div className="mt-3.5 flex items-center gap-2 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <div className="flex -space-x-1.5 overflow-hidden">
                {mutualConnections.slice(0, 3).map((mc) => (
                  <img
                    key={mc.id}
                    src={mc.avatarUrl}
                    alt={mc.fullName}
                    className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
                  />
                ))}
              </div>
              <span>
                Mutual connections with{' '}
                <strong className="text-stone-900 font-semibold">{mutualConnections[0].fullName}</strong>
                {mutualConnections.length > 1 && ` and ${mutualConnections.length - 1} others you know`}
              </span>
            </div>
          )}

          {/* Bio prose */}
          <div className="mt-4 pt-4 border-t border-stone-100">
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl whitespace-pre-line">
              {user.bio}
            </p>
          </div>

          {/* Travel Styles & Interests (Interactive tags / clean metadata) */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-stone-700 mr-1">Travel Styles:</span>
            {user.travelStyles.map((style) => (
              <span
                key={style}
                className="text-xs px-2.5 py-1 bg-stone-100 text-stone-700 rounded-md font-medium capitalize"
              >
                {style}
              </span>
            ))}
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-stone-700 mr-1">Interests:</span>
            {user.travelInterests.map((interest) => (
              <span
                key={interest}
                className="text-xs px-2.5 py-1 bg-emerald-50/70 text-emerald-900 rounded-md font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* 2. TRAVEL PASSPORT METRICS BANNER */}
        <div className="bg-[#181B1A] text-white px-6 sm:px-8 py-5 border-t border-stone-800">
          <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Verified Travel Passport Log</span>
            <span className="text-emerald-400 font-mono text-[10px]">Tier 1 · Verified Explorer</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-stone-900/80 p-3.5 rounded-xl border border-stone-800/80">
              <div className="flex items-center gap-2 text-stone-400 text-xs mb-1">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Countries</span>
              </div>
              <div className="text-2xl font-bold font-display tabular-nums text-white">
                {user.stats.countriesVisited}
              </div>
              <div className="text-[10px] text-stone-400 mt-1">across 4 continents</div>
            </div>

            <div className="bg-stone-900/80 p-3.5 rounded-xl border border-stone-800/80">
              <div className="flex items-center gap-2 text-stone-400 text-xs mb-1">
                <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                <span>Summits Completed</span>
              </div>
              <div className="text-2xl font-bold font-display tabular-nums text-white">
                {user.stats.mountainsCompleted}
              </div>
              <div className="text-[10px] text-stone-400 mt-1">High alpine & passes</div>
            </div>

            <div className="bg-stone-900/80 p-3.5 rounded-xl border border-stone-800/80">
              <div className="flex items-center gap-2 text-stone-400 text-xs mb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Destinations</span>
              </div>
              <div className="text-2xl font-bold font-display tabular-nums text-white">
                {user.stats.citiesVisited}
              </div>
              <div className="text-[10px] text-stone-400 mt-1">Cities & wilderness</div>
            </div>

            <div className="bg-stone-900/80 p-3.5 rounded-xl border border-stone-800/80">
              <div className="flex items-center gap-2 text-stone-400 text-xs mb-1">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Expeditions Led</span>
              </div>
              <div className="text-2xl font-bold font-display tabular-nums text-white">
                {user.stats.tripsCount}
              </div>
              <div className="text-[10px] text-stone-400 mt-1">Independent & group</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PROFILE TABS & NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('passport')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'passport'
              ? 'text-[#1B3B2B] border-b-2 border-[#1B3B2B]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Summits & Badges</span>
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'posts'
              ? 'text-[#1B3B2B] border-b-2 border-[#1B3B2B]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Expedition Logs ({userPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'text-[#1B3B2B] border-b-2 border-[#1B3B2B]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Upcoming Plans ({user.upcomingPlans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('network')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'network'
              ? 'text-[#1B3B2B] border-b-2 border-[#1B3B2B]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Visited Countries</span>
        </button>
      </div>

      {/* TAB CONTENT 1: SUMMITS & BADGES */}
      {activeTab === 'passport' && (
        <div className="space-y-6">
          {/* Achievements & Badges */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 mb-3">Travel Achievements & Accreditations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {user.badges.map((b) => (
                <div key={b.id} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60">
                  <div className="flex items-center gap-2 text-[#1B3B2B] mb-1">
                    <Award className="w-4 h-4 text-emerald-800" />
                    <span className="font-semibold text-xs text-stone-900">{b.name}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">{b.description}</p>
                  <div className="mt-2 text-[10px] text-stone-400 font-mono">Issued {b.issuedAt} · {b.category}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mountains & Treks Completed */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Mountains & Treks Completed</h3>
                <p className="text-xs text-stone-500">Documented technical summits, high passes, and traverses</p>
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => setShowAddSummitModal(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Summit</span>
                </button>
              )}
            </div>

            <div className="divide-y divide-stone-100">
              {user.mountainsTreks.map((trek) => (
                <div key={trek.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-stone-100 text-[#1B3B2B] shrink-0 mt-0.5">
                      <Mountain className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{trek.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                        <span>{trek.region}, {trek.country}</span>
                        <span aria-hidden="true">·</span>
                        <span>Completed {trek.completedYear}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-xs font-mono font-bold text-stone-800 tabular-nums">
                      {trek.elevationMeters.toLocaleString()} m
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">{trek.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visited Destinations Log */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Destinations & Expeditions Log</h3>
                <p className="text-xs text-stone-500">Detailed travel geography with field notes</p>
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => setShowAddDestModal(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Place</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {user.visitedDestinations.map((dest) => (
                <div key={dest.id} className="p-3.5 rounded-xl border border-stone-100 bg-stone-50/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-stone-900">{dest.name}</span>
                    <span className="text-[10px] text-stone-400 font-mono">{dest.year}</span>
                  </div>
                  <div className="text-[11px] text-stone-500 mb-1.5">{dest.country} · {dest.type}</div>
                  {dest.notes && (
                    <p className="text-[11px] text-stone-600 italic">"{dest.notes}"</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: USER'S POSTS */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center">
              <Compass className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-xs font-medium text-stone-600">No expedition logs published yet.</p>
            </div>
          ) : (
            userPosts.map((post) => (
              <div key={post.id} className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-semibold text-stone-900">{post.location.name}, {post.location.country}</span>
                    <span>·</span>
                    <span>{post.createdAt}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-stone-100 rounded text-stone-700 font-semibold uppercase tracking-wider">
                    {post.type}
                  </span>
                </div>

                {post.title && (
                  <h4 className="text-base font-bold text-stone-900">{post.title}</h4>
                )}

                <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {post.mediaUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden mt-2">
                    {post.mediaUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="Expedition"
                        referrerPolicy="no-referrer"
                        className="h-48 w-full object-cover"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-2 text-xs text-stone-500 font-mono tabular-nums">
                  <span>{post.likesCount} Likes</span>
                  <span>{post.commentsCount} Comments</span>
                  <span>{post.sharesCount} Shares</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT 3: UPCOMING PLANS */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {user.upcomingPlans.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center text-xs text-stone-500">
              No upcoming expeditions announced yet.
            </div>
          ) : (
            user.upcomingPlans.map((plan) => (
              <div key={plan.id} className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-stone-900">{plan.title}</h4>
                    {plan.status === 'open_for_companions' && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                        Looking for Companions
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{plan.destination}, {plan.country}</span>
                    <span aria-hidden="true">·</span>
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{plan.dateRange}</span>
                  </div>
                </div>

                {!isOwnProfile && (
                  <button
                    onClick={() => onStartMessage(user.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                  >
                    Discuss Trip
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT 4: VISITED COUNTRIES */}
      {activeTab === 'network' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-stone-900 mb-2">Sovereign Nations Visited ({user.visitedCountries.length})</h3>
          <p className="text-xs text-stone-500 mb-4">Countries stamped in explorer passport</p>

          <div className="flex flex-wrap gap-2">
            {user.visitedCountries.map((country) => (
              <div
                key={country}
                className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                <span>{country}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD SUMMIT */}
      {showAddSummitModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Mountain className="w-5 h-5 text-emerald-800" />
                <span>Log Completed Summit / Trek</span>
              </h3>
              <button onClick={() => setShowAddSummitModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSummit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Mountain / Pass / Route Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Matterhorn Hörnli Ridge"
                  value={summitName}
                  onChange={(e) => setSummitName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Elevation (meters) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    max={8848}
                    value={summitElevation}
                    onChange={(e) => setSummitElevation(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Completed Year *</label>
                  <input
                    type="number"
                    required
                    value={summitYear}
                    onChange={(e) => setSummitYear(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Region / Mountain Range</label>
                  <input
                    type="text"
                    placeholder="e.g. Pennine Alps"
                    value={summitRegion}
                    onChange={(e) => setSummitRegion(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Switzerland"
                    value={summitCountry}
                    onChange={(e) => setSummitCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Difficulty Classification</label>
                <select
                  value={summitDiff}
                  onChange={(e: any) => setSummitDiff(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-none bg-white"
                >
                  <option value="Moderate">Moderate (Alpine Hiking)</option>
                  <option value="Challenging">Challenging (Scramble / Scree)</option>
                  <option value="Extreme">Extreme (Technical Rock / Ice)</option>
                  <option value="Alpine Expedition">Alpine Expedition (Glaciated)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSummitModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1B3B2B] hover:bg-[#142B20] text-white rounded-lg font-semibold shadow-xs"
                >
                  Save to Passport
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD DESTINATION */}
      {showAddDestModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-800" />
                <span>Add Visited Destination</span>
              </h3>
              <button onClick={() => setShowAddDestModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDest} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Place / City / Park Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kyoto Ancient Bamboo Paths"
                  value={destName}
                  onChange={(e) => setDestName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Japan"
                    value={destCountry}
                    onChange={(e) => setDestCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Year Visited *</label>
                  <input
                    type="number"
                    required
                    value={destYear}
                    onChange={(e) => setDestYear(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Type</label>
                <select
                  value={destType}
                  onChange={(e: any) => setDestType(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-none bg-white"
                >
                  <option value="city">City / Historical Center</option>
                  <option value="mountain">Mountain / Alpine</option>
                  <option value="park">National Park / Nature Reserve</option>
                  <option value="coastal">Coastal / Fjord / Archipelago</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Explorer Field Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Key observations or recommended trails..."
                  value={destNotes}
                  onChange={(e) => setDestNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDestModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1B3B2B] hover:bg-[#142B20] text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT PROFILE */}
      {showEditBioModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-800" />
                <span>Edit Traveler Identity</span>
              </h3>
              <button onClick={() => setShowEditBioModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBio} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Headline (Professional Travel Summary)</label>
                <input
                  type="text"
                  required
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Home City</label>
                  <input
                    type="text"
                    required
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Home Country</label>
                  <input
                    type="text"
                    required
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Personal Introduction & Bio</label>
                <textarea
                  rows={4}
                  required
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditBioModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1B3B2B] hover:bg-[#142B20] text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
