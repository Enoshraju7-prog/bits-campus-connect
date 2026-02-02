'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { CAMPUS_COLORS } from '@bits-campus-connect/shared';

interface UserCard {
  id: string;
  username: string;
  name: string;
  profilePhotoUrl: string | null;
  campus: string;
  batchYear: number;
}

export default function DiscoverPage() {
  const [users, setUsers] = useState<UserCard[]>([]);
  const [query, setQuery] = useState('');
  const [campus, setCampus] = useState('');
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (campus) params.set('campus', campus);
      const data = await api<{ users: UserCard[] }>(`/users/search?${params}`);
      setUsers(data.users);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    search();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Discover BITSians</h1>

      <div className="flex gap-3 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          placeholder="Search by name or username..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={campus}
          onChange={(e) => setCampus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Campuses</option>
          <option value="pilani">Pilani</option>
          <option value="goa">Goa</option>
          <option value="hyderabad">Hyderabad</option>
          <option value="dubai">Dubai</option>
        </select>
        <button
          onClick={search}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Searching...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No users found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => {
            const color = CAMPUS_COLORS[user.campus as keyof typeof CAMPUS_COLORS] || '#2563EB';
            return (
              <Link
                key={user.id}
                href={`/profile/${user.username}`}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-400">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <span className="text-xs px-2 py-1 rounded-full text-white capitalize" style={{ backgroundColor: color }}>
                    {user.campus}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    Batch {user.batchYear}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
