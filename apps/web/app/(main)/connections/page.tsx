'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';

interface ConnectionUser {
  id: string;
  username: string;
  name: string;
  profilePhotoUrl: string | null;
  campus: string;
}

interface PendingRequest {
  id: string;
  requester?: ConnectionUser;
  addressee?: ConnectionUser;
}

export default function ConnectionsPage() {
  const [tab, setTab] = useState<'connections' | 'pending'>('connections');
  const [connections, setConnections] = useState<{ connectionId: string; user: ConnectionUser }[]>([]);
  const [pending, setPending] = useState<{ received: PendingRequest[]; sent: PendingRequest[] }>({ received: [], sent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [connData, pendingData] = await Promise.all([
        api<{ connections: { connectionId: string; user: ConnectionUser }[] }>('/connections'),
        api<{ received: PendingRequest[]; sent: PendingRequest[] }>('/connections/pending'),
      ]);
      setConnections(connData.connections);
      setPending(pendingData);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept(id: string) {
    await api(`/connections/${id}/accept`, { method: 'POST' });
    loadData();
  }

  async function handleReject(id: string) {
    await api(`/connections/${id}/reject`, { method: 'POST' });
    loadData();
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Connections</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('connections')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            tab === 'connections' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          My Connections ({connections.length})
        </button>
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            tab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Pending ({pending.received.length})
        </button>
      </div>

      {tab === 'connections' ? (
        connections.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No connections yet.{' '}
            <Link href="/discover" className="text-blue-600 hover:underline">
              Discover BITSians
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {connections.map((c) => (
              <Link
                key={c.connectionId}
                href={`/profile/${c.user.username}`}
                className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-400">
                  {c.user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{c.user.name}</p>
                  <p className="text-sm text-gray-500">@{c.user.username} · {c.user.campus}</p>
                </div>
              </Link>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-6">
          {pending.received.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Received Requests</h3>
              <div className="space-y-3">
                {pending.received.map((req) => (
                  <div key={req.id} className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-400">
                        {req.requester?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{req.requester?.name}</p>
                        <p className="text-sm text-gray-500">@{req.requester?.username}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(req.id)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pending.sent.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Sent Requests</h3>
              <div className="space-y-3">
                {pending.sent.map((req) => (
                  <div key={req.id} className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-400">
                      {req.addressee?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{req.addressee?.name}</p>
                      <p className="text-sm text-gray-500">Pending</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pending.received.length === 0 && pending.sent.length === 0 && (
            <div className="text-center py-12 text-gray-500">No pending requests</div>
          )}
        </div>
      )}
    </div>
  );
}
