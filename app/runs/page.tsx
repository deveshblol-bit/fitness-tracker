'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Run = {
  id: string;
  date: string;
  distance_km: number;
  time_seconds: number;
  pace_per_km: string | null;
  calories: number | null;
  elevation_gain_m: number | null;
  achievements: any;
  notes: string | null;
};

export default function RunsPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRuns();
  }, []);

  async function fetchRuns() {
    const { data, error } = await supabase
      .from('runs')
      .select('*')
      .order('date', { ascending: false })
      .limit(20);

    if (error) console.error('Error fetching runs:', error);
    else setRuns(data || []);
    setLoading(false);
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-gray-300 hover:text-white mb-2 inline-block">← Back</Link>
            <h1 className="text-4xl font-bold text-white">🏃 Runs</h1>
          </div>
        </div>

        {loading ? (
          <div className="text-white text-center py-12">Loading...</div>
        ) : runs.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
            <p className="text-gray-300 text-lg">No runs logged yet.</p>
            <p className="text-gray-400 mt-2">Start tracking your running progress!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {runs.map((run) => (
              <div key={run.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm">{new Date(run.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-gray-400 text-xs">Distance</p>
                        <p className="text-white text-xl font-bold">{run.distance_km} km</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Time</p>
                        <p className="text-white text-xl font-bold">{formatTime(run.time_seconds)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Pace</p>
                        <p className="text-white text-xl font-bold">{run.pace_per_km || 'N/A'}/km</p>
                      </div>
                      {run.calories && (
                        <div>
                          <p className="text-gray-400 text-xs">Calories</p>
                          <p className="text-white text-xl font-bold">{run.calories}</p>
                        </div>
                      )}
                    </div>
                    {run.achievements && Object.keys(run.achievements).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(run.achievements).map(([key, value]) => (
                          <span key={key} className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">
                            🏆 {value}
                          </span>
                        ))}
                      </div>
                    )}
                    {run.notes && <p className="text-gray-400 mt-3">{run.notes}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
