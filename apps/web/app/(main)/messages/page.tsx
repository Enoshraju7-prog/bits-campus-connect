'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { useAuthStore } from '../../../stores/auth';

interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string | null;
  participants: { id: string; username: string; name: string; profilePhotoUrl: string | null }[];
  lastMessage: { content: string; senderId: string; createdAt: string } | null;
  unreadCount: number;
}

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Conversation[]>('/conversations')
      .then(setConversations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function getDisplayName(conv: Conversation) {
    if (conv.name) return conv.name;
    const other = conv.participants.find((p) => p.id !== user?.id);
    return other?.name || 'Unknown';
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading conversations...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No conversations yet. Connect with BITSians to start chatting.
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/messages/${conv.id}`}
              className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-400">
                {getDisplayName(conv).charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">{getDisplayName(conv)}</p>
                  {conv.lastMessage && (
                    <span className="text-xs text-gray-400">
                      {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {conv.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage.content}</p>
                )}
              </div>
              {conv.unreadCount > 0 && (
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">
                  {conv.unreadCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
