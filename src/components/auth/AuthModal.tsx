import React, { useState } from 'react';
import { X, Compass, CheckCircle2, ShieldCheck, User as UserIcon } from 'lucide-react';
import { TravelStyle, User } from '../../types';
import { useToast } from '../common/Toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: {
    fullName: string;
    username: string;
    email: string;
    city: string;
    country: string;
    bio: string;
    travelStyles: TravelStyle[];
    travelInterests: string[];
    avatarUrl?: string;
  }) => void;
  onSwitchUser: (userId: string) => void;
  allUsers: User[];
}

const ALL_TRAVEL_STYLES: TravelStyle[] = [
  'solo',
  'trekking',
  'backpacking',
  'luxury',
  'road trips',
  'adventure',
  'cultural'
];

const SUGGESTED_INTERESTS = [
  'Alpine Mountaineering',
  'Glacier Hydrology',
  'Expedition Photography',
  'Overland Rail',
  'Cultural Heritage',
  'Sea Kayaking',
  'Wilderness Camping',
  'High Altitude Passes'
];

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  onSwitchUser,
  allUsers,
}) => {
  const { showToast } = useToast();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');

  // Sign up state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<TravelStyle[]>(['trekking', 'solo']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Alpine Mountaineering', 'Expedition Photography']);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[4]);

  if (!isOpen) return null;

  const toggleStyle = (style: TravelStyle) => {
    if (selectedStyles.includes(style)) {
      if (selectedStyles.length > 1) {
        setSelectedStyles(selectedStyles.filter((s) => s !== style));
      }
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !email.trim() || !city.trim() || !country.trim()) {
      showToast('Please fill in all required profile fields', 'error');
      return;
    }

    try {
      onRegister({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        city: city.trim(),
        country: country.trim(),
        bio: bio.trim(),
        travelStyles: selectedStyles,
        travelInterests: selectedInterests,
        avatarUrl: selectedAvatar,
      });
      onClose();
      showToast(`Welcome to travelIN, ${fullName}! Your travel passport is active.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl my-8 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1B3B2B] text-emerald-300 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-stone-900 flex items-center gap-1">
                <span>travelIN</span>
                <span className="text-xs font-normal text-stone-400">Identity</span>
              </h2>
              <p className="text-xs text-stone-500">The Professional Network for Travellers</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl my-4">
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'signup' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Create Explorer Account
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'login' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Quick Sign In / Switch
          </button>
        </div>

        {mode === 'signup' ? (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kai Sterling"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Username *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. kai_alpine"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="kai@expedition.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Home City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Seattle"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Home Country *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Travel Bio & Ethos</label>
              <textarea
                rows={2}
                placeholder="What drives your journeys? Favourite mountain range or travel philosophy..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:outline-none"
              />
            </div>

            {/* Travel Styles Multi-Select */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">
                Preferred Travel Styles (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TRAVEL_STYLES.map((st) => {
                  const isSelected = selectedStyles.includes(st);
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => toggleStyle(st)}
                      className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors ${
                        isSelected
                          ? 'bg-[#1B3B2B] text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Travel Interests Chips */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">
                Travel Interests
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        isSelected
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-stone-50 border border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">Select Profile Portrait</label>
              <div className="flex items-center gap-2">
                {AVATAR_OPTIONS.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`rounded-full overflow-hidden border-2 transition-all p-0.5 ${
                      selectedAvatar === av ? 'border-emerald-700 ring-2 ring-emerald-700/30' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={av} alt="" className="w-9 h-9 rounded-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1B3B2B] hover:bg-[#142B20] text-white rounded-xl font-semibold shadow-xs"
              >
                Create Travel Identity
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 pt-2 text-xs">
            <p className="text-stone-500 mb-2">
              Select one of the verified explorer personas to test authentic multi-user networking:
            </p>
            <div className="space-y-2">
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    onSwitchUser(u.id);
                    onClose();
                    showToast(`Signed in as ${u.fullName}`, 'info');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl border border-stone-200 hover:bg-stone-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <img src={u.avatarUrl} alt="" className="w-10 h-10 rounded-xl object-cover border border-stone-200" />
                    <div>
                      <div className="font-bold text-stone-900 flex items-center gap-1.5">
                        <span>{u.fullName}</span>
                        {u.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />}
                      </div>
                      <span className="text-[11px] text-stone-500">{u.location.city}, {u.location.country}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#1B3B2B]">Sign in &rarr;</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
