'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type NutritionEntry = {
  id: string;
  date: string;
  meal_type: string | null;
  food_description: string;
  protein_g: number | null;
  calories: number | null;
  carbs_g: number | null;
  fat_g: number | null;
};

export default function NutritionPage() {
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNutrition();
  }, []);

  async function fetchNutrition() {
    const { data, error } = await supabase
      .from('nutrition')
      .select('*')
      .order('date', { ascending: false })
      .limit(50);

    if (error) console.error('Error fetching nutrition:', error);
    else setEntries(data || []);
    setLoading(false);
  }

  // Group by date
  const groupedByDate = entries.reduce((acc, entry) => {
    const date = entry.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, NutritionEntry[]>);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-gray-300 hover:text-white mb-2 inline-block">← Back</Link>
            <h1 className="text-4xl font-bold text-white">🍽️ Nutrition</h1>
          </div>
        </div>

        {loading ? (
          <div className="text-white text-center py-12">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
            <p className="text-gray-300 text-lg">No nutrition data logged yet.</p>
            <p className="text-gray-400 mt-2">Start tracking your meals!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDate).map(([date, dayEntries]) => {
              const totalProtein = dayEntries.reduce((sum, e) => sum + (e.protein_g || 0), 0);
              const totalCals = dayEntries.reduce((sum, e) => sum + (e.calories || 0), 0);
              
              return (
                <div key={date} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-gray-300 text-sm">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <div className="flex gap-6 mt-2">
                        <div>
                          <p className="text-gray-400 text-xs">Protein</p>
                          <p className="text-white text-xl font-bold">{totalProtein.toFixed(0)}g</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Calories</p>
                          <p className="text-white text-xl font-bold">{totalCals}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {dayEntries.map((entry) => (
                      <div key={entry.id} className="bg-white/5 rounded-lg p-3">
                        <div className="flex justify-between">
                          <div>
                            {entry.meal_type && <span className="text-purple-300 text-sm font-medium">{entry.meal_type} · </span>}
                            <span className="text-white">{entry.food_description}</span>
                          </div>
                          <div className="text-gray-300 text-sm">
                            {entry.protein_g && <span>{entry.protein_g}g protein</span>}
                            {entry.calories && <span className="ml-3">{entry.calories} cal</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
