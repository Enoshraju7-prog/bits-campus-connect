'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { useAuthStore } from '../../../stores/auth';
import { CAMPUS_COLORS } from '@bits-campus-connect/shared';

interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  bio: string | null;
  profilePhotoUrl: string | null;
  coverPhotoUrl: string | null;
  campus: string;
  batchYear: number;
  currentFocus: string | null;
  interests: { interest: { id: string; name: string; category: string } }[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', currentFocus: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    api<UserProfile>('/users/me').then((data) => {
      setProfile(data);
      setForm({ name: data.name, bio: data.bio || '', currentFocus: data.currentFocus || '' });
      setLoading(false);
    }).catch(() => {
      router.push('/login');
    });
  }, [isAuthenticated, router]);

  async function handleSave() {
    const updated = await api<UserProfile>('/users/me', {
      method: 'PUT',
      body: form,
    });
    setProfile(updated);
    setEditing(false);
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading profile...</div>;
  if (!profile) return null;

  const campusColor = CAMPUS_COLORS[profile.campus as keyof typeof CAMPUS_COLORS] || '#2563EB';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600" />
        <div className="px-6 pb-6">
          <div className="-mt-12 mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center text-3xl font-bold text-gray-400">
              {profile.name.charAt(0)}
            </div>
          </div>

          {editing ? (
            <div className="space-y-4">
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Name"
              />
              <textarea
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Bio"
                rows={3}
              />
              <input
                value={form.currentFocus}
                onChange={(e) => setForm((f) => ({ ...f, currentFocus: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Current focus (e.g., Studying for exams)"
              />
              <div className="flex gap-2">
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Save
                </button>
                <button onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <p className="text-gray-500">@{profile.username}</p>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                  Edit Profile
                </button>
              </div>

              <div className="flex gap-2 mb-3">
                <span
                  className="text-xs px-2 py-1 rounded-full text-white font-medium capitalize"
                  style={{ backgroundColor: campusColor }}
                >
                  {profile.campus}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  Batch {profile.batchYear}
                </span>
              </div>

              {profile.bio && <p className="text-gray-700 mb-3">{profile.bio}</p>}
              {profile.currentFocus && (
                <p className="text-sm text-gray-500 mb-4">Currently: {profile.currentFocus}</p>
              )}

              {profile.interests.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((i) => (
                      <span key={i.interest.id} className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                        {i.interest.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
