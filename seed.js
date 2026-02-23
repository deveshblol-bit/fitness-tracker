const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

async function seed() {
  console.log('Seeding data from fitness log...');

  // Seed runs
  const runs = [
    {
      date: '2026-02-17',
      distance_km: 5.02,
      time_seconds: 37 * 60 + 22,
      pace_per_km: '7:26',
      calories: 345,
      achievements: { '2nd_fastest_2_mile': '2nd fastest 2-mile time!' }
    },
    {
      date: '2026-02-19',
      distance_km: 3.24,
      time_seconds: 22 * 60 + 9,
      pace_per_km: '6:50',
      calories: 193,
      achievements: {
        '2nd_fastest_1_mile': '2nd fastest 1 mile',
        '2nd_fastest_2_mile': '2nd fastest 2 mile (lifetime!)'
      }
    },
    {
      date: '2026-02-22',
      distance_km: 6.69,
      time_seconds: 47 * 60 + 4,
      pace_per_km: '7:02',
      calories: 456,
      elevation_gain_m: 11,
      achievements: {
        '2nd_fastest_1_mile': '2nd fastest 1-mile lifetime',
        'pr_eastern_northern_2k': 'Personal record: Eastern to Northern 2K',
        '2nd_fastest_2_mile': '2nd fastest 2-mile time'
      },
      notes: 'Inner calf pain at start — minor, pushed through. Longest run so far!'
    }
  ];

  const { error: runsError } = await supabase.from('runs').insert(runs);
  if (runsError) console.error('Error seeding runs:', runsError);
  else console.log('✓ Seeded', runs.length, 'runs');

  // Seed workouts
  const workouts = [
    { date: '2026-02-16', workout_type: 'Push + Core', notes: 'Good pump 💪' },
    { date: '2026-02-18', workout_type: 'Pull', notes: null },
    { date: '2026-02-23', workout_type: 'Push + Core', notes: 'Building gym - bodyweight focused' }
  ];

  const { data: workoutData, error: workoutsError } = await supabase.from('workouts').insert(workouts).select();
  if (workoutsError) console.error('Error seeding workouts:', workoutsError);
  else console.log('✓ Seeded', workouts.length, 'workouts');

  // Seed sample nutrition
  const nutrition = [
    { date: '2026-02-18', meal_type: 'Breakfast', food_description: '75g poha + 2 eggs + 1 egg white', protein_g: 19, calories: 350 },
    { date: '2026-02-18', meal_type: 'Lunch', food_description: '190g rice + 273g bone-in chicken + 155g boneless chicken', protein_g: 74, calories: 850 },
    { date: '2026-02-18', meal_type: 'Shake', food_description: '60g whey (1.5 scoops) + 275ml milk', protein_g: 45, calories: 280 },
    { date: '2026-02-18', meal_type: 'Dinner', food_description: '100g rice + 120g chicken', protein_g: 31, calories: 400 },
    { date: '2026-02-19', meal_type: 'Breakfast', food_description: '160g upma + peanut chutney', protein_g: 10, calories: 280 },
    { date: '2026-02-19', meal_type: 'Lunch', food_description: '300g matki sprouts + 140g rice + 150ml dal', protein_g: 35, calories: 450 },
    { date: '2026-02-19', meal_type: 'Shake', food_description: '2 scoops whey + 180ml milk', protein_g: 54, calories: 300 }
  ];

  const { error: nutritionError } = await supabase.from('nutrition').insert(nutrition);
  if (nutritionError) console.error('Error seeding nutrition:', nutritionError);
  else console.log('✓ Seeded', nutrition.length, 'nutrition entries');

  // Seed goals
  const goals = [
    {
      goal_type: 'half_marathon',
      target_value: '21 km',
      target_date: '2026-07-14',
      current_value: '6.69 km (longest run)',
      status: 'active'
    },
    {
      goal_type: 'body_weight',
      target_value: '67-68 kg',
      current_value: '72-73 kg',
      status: 'active'
    },
    {
      goal_type: 'body_fat',
      target_value: '11-12%',
      current_value: '~15-16%',
      status: 'active'
    }
  ];

  const { error: goalsError } = await supabase.from('goals').insert(goals);
  if (goalsError) console.error('Error seeding goals:', goalsError);
  else console.log('✓ Seeded', goals.length, 'goals');

  console.log('\n🎉 Seed complete!');
}

seed();
