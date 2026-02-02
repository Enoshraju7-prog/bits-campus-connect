import { CAMPUS_COLORS } from '@bits-campus-connect/shared';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">BITS Campus Connect</h1>
      <p className="text-lg text-gray-600 mb-8">
        Connecting BITSians across all campuses
      </p>
      <div className="flex gap-4">
        {(Object.entries(CAMPUS_COLORS) as [string, string][]).map(([campus, color]) => (
          <div
            key={campus}
            className="px-4 py-2 rounded-full text-white font-medium capitalize"
            style={{ backgroundColor: color }}
          >
            {campus}
          </div>
        ))}
      </div>
    </main>
  );
}
