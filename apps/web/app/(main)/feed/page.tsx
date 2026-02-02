'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useAuthStore } from '../../../stores/auth';
import { CAMPUS_COLORS } from '@bits-campus-connect/shared';

interface FeedPost {
  id: string;
  content: string;
  postType: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: string;
  author: { id: string; username: string; name: string; profilePhotoUrl: string | null; campus: string };
  media: { id: string; mediaUrl: string; orderIndex: number }[];
}

interface StoryGroup {
  user: { id: string; username: string; name: string; profilePhotoUrl: string | null };
  hasUnseen: boolean;
}

export default function FeedPage() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [stories, setStories] = useState<StoryGroup[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<{ posts: FeedPost[] }>('/feed').catch(() => ({ posts: [] })),
      api<StoryGroup[]>('/stories').catch(() => []),
    ]).then(([feedData, storyData]) => {
      setPosts(feedData.posts);
      setStories(storyData);
      setLoading(false);
    });
  }, []);

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      const post = await api<FeedPost>('/feed/posts', {
        method: 'POST',
        body: { content: newPostContent },
      });
      setPosts((prev) => [{ ...post, isLiked: false, likeCount: 0, commentCount: 0 }, ...prev]);
      setNewPostContent('');
    } catch {
      // ignore
    }
  }

  async function handleLike(postId: string) {
    const result = await api<{ liked: boolean }>(`/feed/posts/${postId}/like`, { method: 'POST' });
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, isLiked: result.liked, likeCount: p.likeCount + (result.liked ? 1 : -1) }
          : p,
      ),
    );
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading feed...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Story Bar */}
      {stories.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {stories.map((group) => (
            <div key={group.user.id} className="flex flex-col items-center gap-1 min-w-[72px]">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white ${
                  group.hasUnseen ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                }`}
                style={{ backgroundColor: group.user.id === user?.id ? '#2563EB' : '#9CA3AF' }}
              >
                {group.user.name.charAt(0)}
              </div>
              <span className="text-xs text-gray-600 truncate w-16 text-center">
                {group.user.id === user?.id ? 'Your story' : group.user.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Create Post */}
      <form onSubmit={handleCreatePost} className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={!newPostContent.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </form>

      {/* Feed */}
      {posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No posts yet. Connect with BITSians to see their posts.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const campusColor = CAMPUS_COLORS[post.author.campus as keyof typeof CAMPUS_COLORS] || '#2563EB';
            return (
              <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-400">
                    {post.author.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{post.author.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">@{post.author.username}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded text-white capitalize" style={{ backgroundColor: campusColor, fontSize: '10px' }}>
                        {post.author.campus}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 ${post.isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                  >
                    {post.isLiked ? '♥' : '♡'} {post.likeCount}
                  </button>
                  <span>💬 {post.commentCount}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
