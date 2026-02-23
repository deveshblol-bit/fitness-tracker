'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Workout = {
  id: string;
  date: string;
  workout_type: string;
  notes: string | null;
};

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  async function fetchWorkouts() {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('date', { ascending: false })
      .limit(20);

    if (error) console.error('Error fetching workouts:', error);
    else setWorkouts(data || []);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-gray-300 hover:text-white mb-2 inline-block">← Back</Link>
            <h1 className="text-4xl font-bold text-white">💪 Workouts</h1>
          </div>
        </div>

        {loading ? (
          <div className="text-white text-center py-12">Loading...</div>
        ) : workouts.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
            <p className="text-gray-300 text-lg">No workouts logged yet.</p>
            <p className="text-gray-400 mt-2">Start tracking your strength training!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <div key={workout.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-300 text-sm">{new Date(workout.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <h3 className="text-xl font-bold text-white mt-1">{workout.workout_type}</h3>
                    {workout.notes && <p className="text-gray-400 mt-2">{workout.notes}</p>}
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
