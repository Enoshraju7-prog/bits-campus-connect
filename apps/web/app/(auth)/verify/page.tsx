'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '../../../lib/api';
import { useAuthStore } from '../../../stores/auth';

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const setUser = useAuthStore((s) => s.setUser);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api<{ user: { id: string; email: string; username: string; campus: string } }>(
        '/auth/verify-email',
        { method: 'POST', body: { email, otp } },
      );
      setUser(data.user);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError('');
    try {
      await api('/auth/resend-otp', { method: 'POST', body: { email } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-semibold mb-2">Verify your email</h2>
      <p className="text-gray-500 text-sm mb-6">
        We sent a 6-digit code to <strong>{email}</strong>
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
            Verification Code
          </label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Didn&apos;t receive the code?{' '}
        <button
          onClick={handleResend}
          disabled={resending}
          className="text-blue-600 hover:underline font-medium disabled:opacity-50"
        >
          {resending ? 'Sending...' : 'Resend'}
        </button>
      </p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
      <VerifyForm />
    </Suspense>
  );
}
