'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { WEEKLY_SCHEDULE, DAILY_TARGETS, GOALS } from '@/lib/constants';

type NutritionEntry = {
  id: string;
  protein_g: number | null;
  calories: number | null;
  carbs_g: number | null;
  fat_g: number | null;
};

type Workout = {
  id: string;
  date: string;
  workout_type: string;
  notes: string | null;
};

type Run = {
  id: string;
  date: string;
  distance_km: number;
};

type Goal = {
  id: string;
  goal_type: string;
  target_value: string;
  current_value: string;
  target_date: string | null;
};

function getToday() {
  // IST timezone
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().split('T')[0];
}

function getDayName(day: number) {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day];
}

function ProgressBar({ value, max, color = 'purple' }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const colorMap: Record<string, string> = {
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };
  return (
    <div className="w-full bg-white/10 rounded-full h-2.5 mt-1">
      <div
        className={`${colorMap[color] || colorMap.purple} h-2.5 rounded-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function Home() {
  const [todayNutrition, setTodayNutrition] = useState<NutritionEntry[]>([]);
  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [longestRun, setLongestRun] = useState(0);
  const [loading, setLoading] = useState(true);

  const today = getToday();
  const dayOfWeek = new Date().getDay();
  const scheduledWorkout = WEEKLY_SCHEDULE[dayOfWeek];

  useEffect(() => {
    async function load() {
      const [nutritionRes, workoutRes, goalsRes, runsRes] = await Promise.all([
        supabase.from('nutrition').select('*').eq('date', today),
        supabase.from('workouts').select('*').eq('date', today).limit(1),
        supabase.from('goals').select('*').eq('status', 'active'),
        supabase.from('runs').select('distance_km').order('distance_km', { ascending: false }).limit(1),
      ]);

      setTodayNutrition(nutritionRes.data || []);
      setTodayWorkout(workoutRes.data?.[0] || null);
      setGoals(goalsRes.data || []);
      setLongestRun(runsRes.data?.[0]?.distance_km || 0);
      setLoading(false);
    }
    load();
  }, [today]);

  const totalProtein = todayNutrition.reduce((s, e) => s + (e.protein_g || 0), 0);
  const totalCalories = todayNutrition.reduce((s, e) => s + (e.calories || 0), 0);
  const totalCarbs = todayNutrition.reduce((s, e) => s + (e.carbs_g || 0), 0);
  const totalFat = todayNutrition.reduce((s, e) => s + (e.fat_g || 0), 0);

  const workoutDone = todayWorkout?.notes?.includes('[DONE]') || false;

  // Goal progress calculations
  function getGoalProgress(goal: Goal) {
    switch (goal.goal_type) {
      case 'half_marathon': {
        const pct = Math.round((longestRun / GOALS.half_marathon.target) * 100);
        return { pct, label: `${longestRun} / ${GOALS.half_marathon.target} km`, color: 'blue' };
      }
      case 'body_weight': {
        const current = parseFloat(goal.current_value) || 72.5;
        const lost = GOALS.body_weight.startWeight - current;
        const totalToLose = GOALS.body_weight.startWeight - GOALS.body_weight.target;
        const pct = Math.round((lost / totalToLose) * 100);
        return { pct: Math.max(0, pct), label: `${current} → ${GOALS.body_weight.target} kg`, color: 'green' };
      }
      case 'body_fat': {
        const current = parseFloat(goal.current_value) || 15.5;
        const lost = GOALS.body_fat.startBf - current;
        const totalToLose = GOALS.body_fat.startBf - GOALS.body_fat.target;
        const pct = Math.round((lost / totalToLose) * 100);
        return { pct: Math.max(0, pct), label: `${current} → ${GOALS.body_fat.target}%`, color: 'yellow' };
      }
      default:
        return { pct: 0, label: '', color: 'purple' };
    }
  }

  // Days until half marathon
  const daysUntilRace = Math.ceil(
    (new Date('2026-07-14').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">🗡️ Fitness Tracker</h1>
            <p className="text-gray-400 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {daysUntilRace} days to race</p>
          </div>
        </div>

        {/* Today's Nutrition */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">🍽️ Today&apos;s Nutrition</h2>
            <Link href="/nutrition" className="text-purple-300 hover:text-purple-200 text-sm">View all →</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Protein</span>
                <span className="text-white font-medium">{totalProtein}g / {DAILY_TARGETS.protein}g</span>
              </div>
              <ProgressBar value={totalProtein} max={DAILY_TARGETS.protein} color="green" />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Calories</span>
                <span className="text-white font-medium">{totalCalories} / {DAILY_TARGETS.calories}</span>
              </div>
              <ProgressBar value={totalCalories} max={DAILY_TARGETS.calories} color="purple" />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Carbs</span>
                <span className="text-white font-medium">{totalCarbs}g / {DAILY_TARGETS.carbs}g</span>
              </div>
              <ProgressBar value={totalCarbs} max={DAILY_TARGETS.carbs} color="blue" />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Fat</span>
                <span className="text-white font-medium">{totalFat}g / {DAILY_TARGETS.fat}g</span>
              </div>
              <ProgressBar value={totalFat} max={DAILY_TARGETS.fat} color="yellow" />
            </div>
          </div>

          {todayNutrition.length === 0 && (
            <p className="text-gray-500 text-sm mt-3">No meals logged today yet</p>
          )}
        </div>

        {/* Today's Workout + Weekly Schedule */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Today's Workout */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">💪 Today&apos;s Workout</h2>
              <Link href="/workouts" className="text-purple-300 hover:text-purple-200 text-sm">View all →</Link>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${workoutDone ? 'bg-green-500/20' : 'bg-white/10'}`}>
                {workoutDone ? '✅' : scheduledWorkout === 'Rest' ? '😴' : '🏋️'}
              </div>
              <div>
                <p className="text-white font-bold text-lg">{scheduledWorkout}</p>
                <p className="text-gray-400 text-sm">
                  {workoutDone ? 'Completed!' : todayWorkout ? 'Logged — in progress' : scheduledWorkout === 'Rest' ? 'Recovery day' : 'Not started'}
                </p>
              </div>
            </div>

            {todayWorkout?.notes && (
              <p className="text-gray-400 text-sm mt-3 bg-white/5 rounded-lg p-3">{todayWorkout.notes.replace('[DONE]', '').trim()}</p>
            )}
          </div>

          {/* Weekly Schedule */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">📅 This Week</h2>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                const isToday = day === dayOfWeek;
                return (
                  <div
                    key={day}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg ${isToday ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-white/5'}`}
                  >
                    <span className={`text-sm font-medium ${isToday ? 'text-purple-300' : 'text-gray-400'}`}>
                      {getDayName(day)}
                    </span>
                    <span className={`text-sm ${isToday ? 'text-white font-bold' : 'text-gray-300'}`}>
                      {WEEKLY_SCHEDULE[day]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Goals Progress */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">🎯 Goal Progress</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const { pct, label, color } = getGoalProgress(goal);
              const emoji = goal.goal_type === 'half_marathon' ? '🏃' : goal.goal_type === 'body_weight' ? '⚖️' : '📉';
              return (
                <div key={goal.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">{emoji} {goal.goal_type === 'half_marathon' ? 'Half Marathon' : goal.goal_type === 'body_weight' ? 'Weight' : 'Body Fat'}</span>
                    <span className="text-white font-bold text-lg">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} max={100} color={color} />
                  <p className="text-gray-400 text-xs mt-2">{label}</p>
                  {goal.goal_type === 'half_marathon' && (
                    <p className="text-gray-500 text-xs mt-1">{daysUntilRace} days remaining</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Nav */}
        <div className="grid grid-cols-3 gap-4">
          <Link href="/workouts" className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all text-center">
            <div className="text-2xl mb-1">💪</div>
            <p className="text-white font-medium text-sm">Workouts</p>
          </Link>
          <Link href="/runs" className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all text-center">
            <div className="text-2xl mb-1">🏃</div>
            <p className="text-white font-medium text-sm">Runs</p>
          </Link>
          <Link href="/nutrition" className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all text-center">
            <div className="text-2xl mb-1">🍽️</div>
            <p className="text-white font-medium text-sm">Nutrition</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
