'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../../lib/api';

interface Post {
  id: string;
  title: string;
  content: string;
  postType: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  userVote: string | null;
  author: { id: string; username: string; name: string };
  createdAt: string;
}

interface CommunityDetail {
  id: string;
  name: string;
  description: string | null;
  rules: string | null;
  memberCount: number;
  isMember: boolean;
  role: string | null;
}

export default function CommunityPage() {
  const params = useParams();
  const communityId = params.id as string;
  const [community, setCommunity] = useState<CommunityDetail | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [sort, setSort] = useState<'hot' | 'new' | 'top'>('hot');
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<CommunityDetail>(`/communities/${communityId}`),
      api<{ posts: Post[] }>(`/communities/${communityId}/posts?sort=${sort}`),
    ])
      .then(([comm, postData]) => {
        setCommunity(comm);
        setPosts(postData.posts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [communityId, sort]);

  async function handleJoin() {
    await api(`/communities/${communityId}/join`, { method: 'POST' });
    setCommunity((c) => c ? { ...c, isMember: true, memberCount: c.memberCount + 1 } : c);
  }

  async function handleVote(postId: string, voteType: 'up' | 'down') {
    const result = await api<{ vote: string | null }>(`/communities/posts/${postId}/vote`, {
      method: 'POST',
      body: { voteType },
    });
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        let { upvotes, downvotes } = p;
        // Undo old vote
        if (p.userVote === 'up') upvotes--;
        if (p.userVote === 'down') downvotes--;
        // Apply new vote
        if (result.vote === 'up') upvotes++;
        if (result.vote === 'down') downvotes++;
        return { ...p, upvotes, downvotes, userVote: result.vote };
      }),
    );
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    const post = await api<Post>(`/communities/${communityId}/posts`, {
      method: 'POST',
      body: newPost,
    });
    setPosts((prev) => [{ ...post, userVote: null, score: 0 } as Post, ...prev]);
    setNewPost({ title: '', content: '' });
    setShowForm(false);
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!community) return <div className="text-center py-12 text-gray-500">Community not found</div>;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{community.name}</h1>
            <p className="text-gray-500 text-sm">{community.memberCount} members</p>
          </div>
          {!community.isMember ? (
            <button onClick={handleJoin} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              Join
            </button>
          ) : (
            <span className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-medium">
              Joined {community.role === 'admin' ? '(Admin)' : community.role === 'moderator' ? '(Mod)' : ''}
            </span>
          )}
        </div>
        {community.description && <p className="text-gray-700 mt-3">{community.description}</p>}
      </div>

      {/* Sort & Post */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {(['hot', 'new', 'top'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
                sort === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {community.isMember && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            New Post
          </button>
        )}
      </div>

      {/* Create Post Form */}
      {showForm && (
        <form onSubmit={handleCreatePost} className="bg-white rounded-xl border border-gray-200 p-4 mb-4 space-y-3">
          <input
            value={newPost.title}
            onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
            placeholder="Post title"
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
            placeholder="Write your post..."
            required
            rows={4}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            Post
          </button>
        </form>
      )}

      {/* Posts */}
      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No posts yet. Be the first to post!</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex gap-3">
                {/* Vote buttons */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handleVote(post.id, 'up')}
                    className={`text-lg ${post.userVote === 'up' ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`}
                  >
                    ▲
                  </button>
                  <span className="text-sm font-medium">{post.upvotes - post.downvotes}</span>
                  <button
                    onClick={() => handleVote(post.id, 'down')}
                    className={`text-lg ${post.userVote === 'down' ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}
                  >
                    ▼
                  </button>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">{post.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>by {post.author.username}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>{post.commentCount} comments</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
