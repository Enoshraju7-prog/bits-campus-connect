'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';

interface Community {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  memberCount: number;
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  async function load(q?: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      const data = await api<{ communities: Community[] }>(`/communities?${params}`);
      setCommunities(data.communities);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Communities</h1>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load(query)}
          placeholder="Search communities..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={() => load(query)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          Search
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading communities...</div>
      ) : communities.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No communities found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {communities.map((community) => (
            <Link
              key={community.id}
              href={`/communities/${community.id}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-lg font-bold text-purple-600">
                  {community.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{community.name}</p>
                  <p className="text-xs text-gray-500">{community.memberCount} members</p>
                </div>
              </div>
              {community.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{community.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
