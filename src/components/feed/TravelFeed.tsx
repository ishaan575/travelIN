import React, { useState } from 'react';
import { 
  Post, 
  User 
} from '../../types';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  Send, 
  Flag,
  Mountain,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface TravelFeedProps {
  posts: Post[];
  currentUser: User | null;
  onLikePost: (postId: string) => void;
  onSavePost: (postId: string) => void;
  onSharePost: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onSelectUser: (user: User) => void;
  onOpenCreatePost: () => void;
  onReport: (type: 'post', targetId: string, preview: string) => void;
  getUserById: (id: string) => User | undefined;
}

export const TravelFeed: React.FC<TravelFeedProps> = ({
  posts,
  currentUser,
  onLikePost,
  onSavePost,
  onSharePost,
  onAddComment,
  onSelectUser,
  onOpenCreatePost,
  onReport,
  getUserById,
}) => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'expedition' | 'guide' | 'story'>('all');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({});

  const filteredPosts = posts.filter((p) => {
    if (filter === 'all') return true;
    return p.type === filter;
  });

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const content = (commentInputs[postId] || '').trim();
    if (!content) return;
    onAddComment(postId, content);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
    showToast('Comment published', 'success');
  };

  const handleShare = (postId: string) => {
    onSharePost(postId);
    navigator.clipboard?.writeText(window.location.href);
    showToast('Expedition story link copied', 'info');
  };

  const nextImage = (postId: string, total: number) => {
    setActiveImageIndices((prev) => ({
      ...prev,
      [postId]: ((prev[postId] || 0) + 1) % total,
    }));
  };

  const prevImage = (postId: string, total: number) => {
    setActiveImageIndices((prev) => ({
      ...prev,
      [postId]: ((prev[postId] || 0) - 1 + total) % total,
    }));
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* 1. COMPOSER PROMPT CARD */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-3">
          {currentUser && (
            <img
              src={currentUser.avatarUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-stone-200"
            />
          )}
          <button
            onClick={onOpenCreatePost}
            className="flex-1 text-left px-4 py-2.5 bg-stone-100/80 hover:bg-stone-100 text-stone-500 hover:text-stone-700 text-xs rounded-full transition-colors font-medium border border-stone-200/50"
          >
            Document an expedition, trail guide, or high pass...
          </button>
          <button
            onClick={onOpenCreatePost}
            className="p-2.5 bg-[#1B3B2B] hover:bg-[#142B20] text-white rounded-full transition-colors shadow-xs"
            title="Create Post"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. FEED SEGMENTED FILTER CONTROLS */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            filter === 'all'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          All Field Logs
        </button>
        <button
          onClick={() => setFilter('expedition')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            filter === 'expedition'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Expedition Logs
        </button>
        <button
          onClick={() => setFilter('guide')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            filter === 'guide'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Destination Guides
        </button>
        <button
          onClick={() => setFilter('story')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            filter === 'story'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Travel Stories
        </button>
      </div>

      {/* 3. POSTS STREAM */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center">
            <Mountain className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-stone-800">No logs found in this category</h3>
            <p className="text-xs text-stone-500 mt-1">Be the first explorer to publish a journey here.</p>
            <button
              onClick={onOpenCreatePost}
              className="mt-4 px-4 py-2 bg-[#1B3B2B] text-white text-xs font-semibold rounded-xl"
            >
              Share First Log
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const author = getUserById(post.authorId) || post.author;
            const currentImgIndex = activeImageIndices[post.id] || 0;
            const totalImages = post.mediaUrls.length;
            const isCommentsOpen = !!expandedComments[post.id];

            return (
              <article
                key={post.id}
                className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs hover:border-stone-300 transition-all duration-200"
              >
                {/* Author Header */}
                <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => onSelectUser(author as User)}
                      className="shrink-0 focus:outline-none"
                    >
                      <img
                        src={author.avatarUrl}
                        alt={author.fullName}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-stone-200 hover:opacity-90 transition-opacity"
                      />
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectUser(author as User)}
                          className="font-semibold text-xs sm:text-sm text-stone-900 hover:text-[#1B3B2B] truncate text-left"
                        >
                          {author.fullName}
                        </button>
                        {author.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                        )}
                        <span className="text-[11px] text-stone-400">@{author.username}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate">{post.location.name}, {post.location.country}</span>
                        <span aria-hidden="true">·</span>
                        <span>{post.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {post.type}
                    </span>
                    <button
                      onClick={() => onReport('post', post.id, post.title || post.content.slice(0, 40))}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Report content"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Post Title & Text */}
                <div className="px-4 sm:px-5 pb-3">
                  {post.title && (
                    <h3 className="text-base sm:text-lg font-bold font-display text-stone-900 mb-2 leading-snug">
                      {post.title}
                    </h3>
                  )}
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Technical Specifications Bar (National Geographic style) */}
                {post.specs && (
                  <div className="mx-4 sm:mx-5 mb-3 px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200/70 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    {post.specs.elevation && (
                      <div>
                        <span className="text-stone-400 block text-[10px]">Elevation</span>
                        <span className="font-semibold text-stone-800 font-mono tabular-nums">{post.specs.elevation}</span>
                      </div>
                    )}
                    {post.specs.distance && (
                      <div>
                        <span className="text-stone-400 block text-[10px]">Distance</span>
                        <span className="font-semibold text-stone-800 font-mono tabular-nums">{post.specs.distance}</span>
                      </div>
                    )}
                    {post.specs.duration && (
                      <div>
                        <span className="text-stone-400 block text-[10px]">Duration</span>
                        <span className="font-semibold text-stone-800 font-mono tabular-nums">{post.specs.duration}</span>
                      </div>
                    )}
                    {post.specs.difficulty && (
                      <div>
                        <span className="text-stone-400 block text-[10px]">Grade</span>
                        <span className="font-semibold text-stone-800">{post.specs.difficulty}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Imagery Carousel / Presentation */}
                {totalImages > 0 && (
                  <div className="relative bg-stone-900 overflow-hidden group">
                    <img
                      src={post.mediaUrls[currentImgIndex]}
                      alt="Expedition Photo"
                      referrerPolicy="no-referrer"
                      className="w-full h-80 sm:h-96 object-cover transition-opacity duration-300"
                    />

                    {totalImages > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(post.id, totalImages)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Previous photo"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => nextImage(post.id, totalImages)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Next photo"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-xs rounded-full">
                          {post.mediaUrls.map((_, idx) => (
                            <span
                              key={idx}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${
                                idx === currentImgIndex ? 'bg-white w-3' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Tags Strip */}
                {post.tags.length > 0 && (
                  <div className="px-4 sm:px-5 pt-3 flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                    {post.tags.map((tag) => (
                      <span key={tag} className="hover:text-stone-800 transition-colors">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Engagement & Action Row */}
                <div className="px-4 sm:px-5 py-3 border-t border-stone-100 flex items-center justify-between text-stone-600 mt-2">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onLikePost(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                        post.isLiked ? 'text-rose-600' : 'hover:text-stone-900'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                      <span className="font-mono tabular-nums">{post.likesCount}</span>
                    </button>

                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-1.5 text-xs font-medium hover:text-stone-900 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-mono tabular-nums">{post.commentsCount}</span>
                    </button>

                    <button
                      onClick={() => handleShare(post.id)}
                      className="flex items-center gap-1.5 text-xs font-medium hover:text-stone-900 transition-colors"
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="font-mono tabular-nums">{post.sharesCount}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onSavePost(post.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      post.isSaved ? 'text-[#1B3B2B] bg-emerald-50' : 'hover:text-stone-900'
                    }`}
                    title={post.isSaved ? 'Saved in bookmarks' : 'Save post'}
                  >
                    <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-[#1B3B2B]' : ''}`} />
                  </button>
                </div>

                {/* Working Comments Section */}
                {isCommentsOpen && (
                  <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-stone-100 bg-stone-50/60 space-y-3">
                    {/* Add Comment Input */}
                    <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add a field observation or reply..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-800"
                      />
                      <button
                        type="submit"
                        disabled={!(commentInputs[post.id] || '').trim()}
                        className="p-1.5 bg-[#1B3B2B] disabled:opacity-40 text-white rounded-lg transition-colors"
                        title="Post Comment"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-2 pt-1">
                      {post.comments.length === 0 ? (
                        <p className="text-[11px] text-stone-400 italic">No comments yet. Start the conversation!</p>
                      ) : (
                        post.comments.map((comm) => (
                          <div key={comm.id} className="flex items-start gap-2.5 text-xs">
                            <img
                              src={comm.author.avatarUrl}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                            />
                            <div className="bg-white p-2.5 rounded-xl border border-stone-200/80 flex-1">
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="font-semibold text-stone-900">{comm.author.fullName}</span>
                                <span className="text-[10px] text-stone-400">{comm.createdAt}</span>
                              </div>
                              <p className="text-stone-700 leading-relaxed text-[11px]">{comm.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
