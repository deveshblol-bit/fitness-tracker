import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-2">🗡️ Fitness Tracker</h1>
        <p className="text-gray-300 mb-12">Track your journey to the half marathon</p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Workouts Card */}
          <Link href="/workouts" className="block group">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <div className="text-4xl mb-4">💪</div>
              <h2 className="text-2xl font-bold text-white mb-2">Workouts</h2>
              <p className="text-gray-300">Track your strength training sessions</p>
            </div>
          </Link>

          {/* Runs Card */}
          <Link href="/runs" className="block group">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <div className="text-4xl mb-4">🏃</div>
              <h2 className="text-2xl font-bold text-white mb-2">Runs</h2>
              <p className="text-gray-300">Log your running progress</p>
            </div>
          </Link>

          {/* Nutrition Card */}
          <Link href="/nutrition" className="block group">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <div className="text-4xl mb-4">🍽️</div>
              <h2 className="text-2xl font-bold text-white mb-2">Nutrition</h2>
              <p className="text-gray-300">Track your protein and calories</p>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-6">🎯 Goals</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-300 text-sm">Half Marathon</p>
              <p className="text-white text-xl font-bold">July 14, 2026</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Target Weight</p>
              <p className="text-white text-xl font-bold">67-68 kg</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Body Fat</p>
              <p className="text-white text-xl font-bold">11-12%</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
