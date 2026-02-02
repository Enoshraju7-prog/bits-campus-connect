import Link from 'next/link';
import { CAMPUS_COLORS } from '@bits-campus-connect/shared';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-gray-50">
      <h1 className="text-5xl font-bold mb-3 text-gray-900">BITS Campus Connect</h1>
      <p className="text-lg text-gray-500 mb-10 text-center max-w-md">
        The social network exclusively for BITSians across all campuses
      </p>

      <div className="flex gap-3 mb-12">
        {(Object.entries(CAMPUS_COLORS) as [string, string][]).map(([campus, color]) => (
          <div
            key={campus}
            className="px-4 py-2 rounded-full text-white font-medium capitalize text-sm"
            style={{ backgroundColor: color }}
          >
            {campus}
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          Create Account
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl text-center">
        <div>
          <div className="text-2xl mb-2">💬</div>
          <h3 className="font-semibold mb-1">Real-time Messaging</h3>
          <p className="text-sm text-gray-500">Chat with BITSians across campuses</p>
        </div>
        <div>
          <div className="text-2xl mb-2">👥</div>
          <h3 className="font-semibold mb-1">Communities</h3>
          <p className="text-sm text-gray-500">Join interest-based groups</p>
        </div>
        <div>
          <div className="text-2xl mb-2">📸</div>
          <h3 className="font-semibold mb-1">Stories & Feed</h3>
          <p className="text-sm text-gray-500">Share moments with connections</p>
        </div>
      </div>
    </main>
  );
}
