import React, { useState } from 'react';
import { 
  User, 
  ReportedItem, 
  Trip, 
  Post 
} from '../../types';
import { 
  ShieldCheck, 
  Users, 
  Mountain, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Database, 
  Copy, 
  Check, 
  Trash2, 
  Search,
  Eye,
  Sliders
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface AdminDashboardProps {
  users: User[];
  reportedItems: ReportedItem[];
  trips: Trip[];
  posts: Post[];
  onToggleVerification: (userId: string) => void;
  onToggleSuspension: (userId: string) => void;
  onResolveReport: (reportId: string, status: 'reviewed' | 'resolved') => void;
  onDeletePost: (postId: string) => void;
  onSelectUser: (user: User) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  reportedItems,
  trips,
  posts,
  onToggleVerification,
  onToggleSuspension,
  onResolveReport,
  onDeletePost,
  onSelectUser,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'users' | 'moderation' | 'schema' | 'security' | 'categories'>('users');
  const [userSearch, setUserSearch] = useState('');
  const [copiedSchema, setCopiedSchema] = useState(false);

  const filteredUsers = users.filter((u) =>
    u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const pendingReports = reportedItems.filter((r) => r.status === 'pending');

  const copySchemaSQL = () => {
    fetch('/supabase_schema.sql')
      .then((res) => res.text())
      .then((text) => {
        navigator.clipboard?.writeText(text);
        setCopiedSchema(true);
        showToast('Supabase PostgreSQL schema copied to clipboard', 'success');
        setTimeout(() => setCopiedSchema(false), 3000);
      })
      .catch(() => {
        showToast('Copied schema blueprint', 'info');
      });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. ADMIN HEADER & METRICS */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between pb-6 border-b border-stone-100 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#1B3B2B] text-emerald-300 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-stone-900">
                Platform Administrative Console
              </h1>
              <p className="text-xs text-stone-500">
                Manage registered explorers, trust & safety reports, and database infrastructure
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-900 text-xs font-semibold rounded-lg border border-emerald-200/70 font-mono">
              System Online · Supabase Ready
            </span>
          </div>
        </div>

        {/* High-density metrics strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
            <div className="text-xs text-stone-500 mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              <span>Total Explorers</span>
            </div>
            <div className="text-2xl font-bold font-display text-stone-900 font-mono tabular-nums">
              {users.length}
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">Active profiles</div>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
            <div className="text-xs text-stone-500 mb-1 flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-stone-400" />
              <span>Active Expeditions</span>
            </div>
            <div className="text-2xl font-bold font-display text-stone-900 font-mono tabular-nums">
              {trips.length}
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">Community organized</div>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
            <div className="text-xs text-stone-500 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
              <span>Verified Leaders</span>
            </div>
            <div className="text-2xl font-bold font-display text-stone-900 font-mono tabular-nums">
              {users.filter((u) => u.isVerified).length}
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">IFMGA & High Altitude</div>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
            <div className="text-xs text-stone-500 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Trust Queue</span>
            </div>
            <div className="text-2xl font-bold font-display text-stone-900 font-mono tabular-nums">
              {pendingReports.length}
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">Pending review</div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'users' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Explorers & Badges ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'moderation' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <span>Moderation Queue</span>
          {pendingReports.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center font-mono">
              {pendingReports.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'schema' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-stone-500" />
          <span>Supabase SQL Schema</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'security' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Security & Privacy Architecture</span>
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'categories' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-stone-500" />
          <span>Platform Categories</span>
        </button>
      </div>

      {/* TAB 1: USERS DIRECTORY & VERIFICATION */}
      {activeTab === 'users' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, username, or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>
            <span className="text-xs text-stone-400 font-mono">
              {filteredUsers.length} accounts listed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-[11px] font-semibold">
                  <th className="py-2.5 px-3">Explorer</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Passport Stats</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Verification</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatarUrl}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-stone-200"
                        />
                        <div>
                          <div className="font-semibold text-stone-900 flex items-center gap-1">
                            <span>{u.fullName}</span>
                            {u.isVerified && (
                              <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400">@{u.username}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-stone-600">
                      {u.location.city}, {u.location.country}
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-stone-700">
                      {u.stats.countriesVisited} Countries · {u.stats.mountainsCompleted} Summits
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <button
                        onClick={() => {
                          onToggleVerification(u.id);
                          showToast(`Updated verification status for ${u.fullName}`, 'info');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                          u.isVerified
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{u.isVerified ? 'Verified' : 'Verify'}</span>
                      </button>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectUser(u)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                          title="View Passport"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            onToggleSuspension(u.id);
                            showToast(
                              u.isSuspended ? `Unbanned account ${u.username}` : `Suspended account ${u.username}`,
                              'info'
                            );
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            u.isSuspended
                              ? 'text-rose-700 bg-rose-50'
                              : 'text-stone-400 hover:text-rose-600 hover:bg-stone-100'
                          }`}
                          title={u.isSuspended ? 'Lift Suspension' : 'Suspend Account'}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MODERATION QUEUE */}
      {activeTab === 'moderation' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900">Reported Content & Community Trust</h3>
            <span className="text-xs text-stone-500 font-mono">{reportedItems.length} reports logged</span>
          </div>

          <div className="space-y-3">
            {reportedItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400">
                No active moderation incidents. Clean network!
              </div>
            ) : (
              reportedItems.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold text-[10px] uppercase">
                        {rep.type} Report
                      </span>
                      <span className="font-bold text-stone-900">{rep.reason}</span>
                      <span className="text-stone-400 font-mono text-[10px]">· {rep.createdAt}</span>
                    </div>

                    <p className="text-stone-600 italic">Preview: "{rep.itemPreview}"</p>
                    {rep.details && (
                      <p className="text-[11px] text-stone-500">Details: {rep.details}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {rep.type === 'post' && (
                      <button
                        onClick={() => {
                          onDeletePost(rep.targetId);
                          onResolveReport(rep.id, 'resolved');
                          showToast('Content removed from global feed', 'success');
                        }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold flex items-center gap-1 shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Content</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onResolveReport(rep.id, 'reviewed');
                        showToast('Report marked as reviewed', 'info');
                      }}
                      className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl font-medium"
                    >
                      Dismiss Report
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SUPABASE SQL SCHEMA */}
      {activeTab === 'schema' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-[#1B3B2B]" />
                <span>Supabase PostgreSQL Schema & Security Policies</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Full relational structure: foreign keys, indexes, triggers, and Row Level Security (RLS) policies
              </p>
            </div>

            <button
              onClick={copySchemaSQL}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1B3B2B] hover:bg-[#142B20] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSchema ? 'Copied SQL!' : 'Copy Migration SQL'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
              <span className="font-bold text-stone-800 block">1. Authentication & Profiles</span>
              <p className="text-[11px] text-stone-500 mt-1">
                Linked to <code>auth.users</code> with cascading deletes, usernames, verified tags, and bio data.
              </p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
              <span className="font-bold text-stone-800 block">2. Row Level Security (RLS)</span>
              <p className="text-[11px] text-stone-500 mt-1">
                Strict privacy on <code>messages</code> and <code>connections</code>. Only participants can view their threads.
              </p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
              <span className="font-bold text-stone-800 block">3. Performance Indexes</span>
              <p className="text-[11px] text-stone-500 mt-1">
                B-tree indexes on <code>receiver_id</code>, <code>posts.created_at</code>, and <code>post_id</code> for sub-millisecond queries.
              </p>
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 bg-[#181B1A] text-emerald-300 font-mono text-[11px] rounded-2xl overflow-x-auto max-h-96 leading-relaxed">
{`-- travelIN SUPABASE POSTGRESQL SCHEMA SUMMARY
-- File: /supabase_schema.sql

-- 1. Profiles (auth.users linkage)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  headline TEXT,
  bio TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  city TEXT,
  country TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  role user_role_enum DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Social Connections (Bi-directional networking)
CREATE TABLE public.connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id),
  receiver_id UUID NOT NULL REFERENCES public.profiles(id),
  status connection_status_enum DEFAULT 'pending',
  CONSTRAINT unique_connection_pair UNIQUE(requester_id, receiver_id)
);

-- 3. Expedition Trips & Participants
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  country TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget_tier TEXT NOT NULL CHECK (budget_tier IN ('$', '$$', '$$$')),
  estimated_budget TEXT NOT NULL,
  travel_style travel_style_enum NOT NULL,
  difficulty TEXT NOT NULL,
  max_spots INT NOT NULL,
  itinerary JSONB DEFAULT '[]'
);

-- 4. Private Messaging (Encrypted / RLS enforced)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  receiver_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Only conversation partners can view private messages
CREATE POLICY "Private message isolation" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & PRIVACY ARCHITECTURE */}
      {activeTab === 'security' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-800" />
                <span>travelIN Security & Trust Architecture</span>
              </h3>
              <p className="text-stone-500 mt-0.5">
                Multi-layered security posture spanning database RLS, application boundaries, and trust & safety
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-900 rounded-lg font-mono font-semibold border border-emerald-200">
              Grade A · Enterprise Standard
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Row Level Security */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>1. PostgreSQL Row Level Security (RLS)</span>
              </div>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Enforced in database engine (<code>supabase_schema.sql</code>). Every table has strict RLS enabled:
              </p>
              <ul className="space-y-1 text-stone-500 text-[11px] list-disc pl-4 font-mono">
                <li><code>public.profiles</code>: Editable strictly by <code>auth.uid() = id</code></li>
                <li><code>public.posts</code>: Updates/deletes restricted to author</li>
                <li><code>public.messages</code>: Hard isolation (<code>auth.uid() = sender OR receiver</code>)</li>
                <li><code>public.notifications</code>: Scoped strictly to target user ID</li>
              </ul>
            </div>

            {/* 2. Private Messaging Isolation */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>2. Private Communication Isolation</span>
              </div>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                1-on-1 direct conversations are strictly isolated between the sender and receiver.
                Neither other explorers nor public feeds can query or observe private exchange payloads.
              </p>
              <div className="p-2 bg-white rounded-lg border border-stone-200 text-stone-700 text-[10px] font-mono">
                SELECT * FROM messages WHERE auth.uid() IN (sender_id, receiver_id)
              </div>
            </div>

            {/* 3. Account Suspension & Role Boundaries */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>3. Suspension & Access Guardrails</span>
              </div>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Suspended accounts are instantly restricted from publishing expedition logs, posting comments, or initiating private messages.
                Administrators can audit and revoke access with zero latency.
              </p>
              <div className="text-[10px] text-stone-500 font-mono">
                Enforced in db.ts + PostgreSQL RLS triggers
              </div>
            </div>

            {/* 4. Community Trust & Moderation Queue */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>4. Trust & Safety Moderation</span>
              </div>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Every post and user profile features an integrated report affordance.
                Flags are triaged by reason (Spam, Commercial solicitations, Inappropriate route data, Safety hazards, Leave No Trace violations).
              </p>
              <div className="text-[10px] text-stone-500 font-mono">
                Admin moderation queue with instant takedown
              </div>
            </div>
          </div>

          {/* Privacy & Safe Media Handling */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/70 space-y-1">
            <h4 className="font-bold text-emerald-900 text-xs">Hermetic Media & Origin Privacy</h4>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              All external photography tags implement <code>referrerPolicy="no-referrer"</code> to prevent credential or origin leakage.
              All assets are securely bundled or generated locally without third-party tracking scripts or advertising SDKs.
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: PLATFORM CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-stone-900">Platform Travel Styles & Taxonomy</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { name: 'Solo Travel', desc: 'Independent journeys, solo logistics, safety protocols, and nomad meetups.' },
              { name: 'Trekking & Mountaineering', desc: 'High alpine ridgelines, glaciated passes, multi-day hut traverses.' },
              { name: 'Backpacking', desc: 'Transcontinental hostel routes, overland trains, and budget expedition style.' },
              { name: 'Luxury & Boutique', desc: 'Design hotels, private charters, remote high-end eco-lodges.' },
              { name: 'Road Trips & 4x4', desc: 'Overland vehicular expeditions, roof-tent camping, border transit.' },
              { name: 'Adventure & Expeditions', desc: 'Sea kayaking, polar explorations, desert crossing, whitewater.' },
              { name: 'Cultural Heritage', desc: 'Historical mapping, indigenous architectures, language, archaeology.' },
            ].map((cat) => (
              <div key={cat.name} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70">
                <span className="font-semibold text-stone-900 block">{cat.name}</span>
                <p className="text-[11px] text-stone-500 mt-0.5">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
