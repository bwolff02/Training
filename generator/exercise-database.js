// ─── EQUIPMENT LIST ───────────────────────────────────────────

const EQUIPMENT_OPTIONS = [
  // Free weights
  { id: 'barbell',         label: 'Barbell + Plates', category: 'free_weights' },
  { id: 'dumbbells',       label: 'Dumbbells', category: 'free_weights' },
  { id: 'ez_bar',          label: 'EZ Curl Bar', category: 'free_weights' },
  { id: 'trap_bar',        label: 'Trap / Hex Bar', category: 'free_weights' },
  { id: 'kettlebells',     label: 'Kettlebells', category: 'free_weights' },
  // Benches & racks
  { id: 'bench',           label: 'Adjustable Bench', category: 'benches' },
  { id: 'squat_rack',      label: 'Squat Rack / Power Rack', category: 'benches' },
  { id: 'smith_machine',   label: 'Smith Machine', category: 'benches' },
  // Cable & pulley
  { id: 'cables',          label: 'Cable Machine', category: 'cables' },
  { id: 'cable_crossover', label: 'Cable Crossover Station', category: 'cables' },
  // Pull & bodyweight
  { id: 'pull_up_bar',     label: 'Pull-Up Bar', category: 'bodyweight' },
  { id: 'dip_station',     label: 'Dip Station', category: 'bodyweight' },
  { id: 'bodyweight',      label: 'Bodyweight Only', category: 'bodyweight' },
  // Leg machines
  { id: 'leg_press',       label: 'Leg Press', category: 'machines' },
  { id: 'hack_squat',      label: 'Hack Squat Machine', category: 'machines' },
  { id: 'leg_curl',        label: 'Leg Curl / Extension', category: 'machines' },
  { id: 'hip_thrust_machine', label: 'Hip Thrust Machine', category: 'machines' },
  { id: 'calf_machine',    label: 'Calf Raise Machine', category: 'machines' },
  { id: 'adductor_abductor', label: 'Adductor / Abductor Machine', category: 'machines' },
  // Upper body machines
  { id: 'lat_pulldown',    label: 'Lat Pulldown', category: 'machines' },
  { id: 'seated_row',      label: 'Seated Row Machine', category: 'machines' },
  { id: 'chest_press',     label: 'Chest Press Machine', category: 'machines' },
  { id: 'shoulder_press_machine', label: 'Shoulder Press Machine', category: 'machines' },
  { id: 'pec_deck',        label: 'Pec Deck / Fly Machine', category: 'machines' },
  { id: 'chest_supported_row', label: 'Chest-Supported Row', category: 'machines' },
  { id: 'rear_delt_machine', label: 'Rear Delt / Reverse Fly Machine', category: 'machines' },
  { id: 'preacher_curl',   label: 'Preacher Curl Bench', category: 'machines' },
  // Cardio / other
  { id: 'bands',           label: 'Resistance Bands', category: 'other' },
];

// ─── EXERCISE DATABASE ────────────────────────────────────────
// Each exercise has: id, name, muscles (primary + secondary), equipment required,
// priority (lower = preferred), and substitution chain.
//
// Priority ordering: when multiple exercises hit the same muscle and all equipment
// is available, lower priority number wins. Substitutions list fallbacks when
// primary equipment is unavailable.

const EXERCISE_DB = [
  // ── CHEST ──
  { id: 'barbell_bench',       name: 'Barbell Bench Press',         muscles: { primary: ['chest'], secondary: ['triceps', 'shoulders'] }, equipment: ['barbell', 'bench'], priority: 1, anchor: true,
    substitutions: ['smith_bench', 'db_bench', 'chest_press_machine'] },
  { id: 'smith_bench',         name: 'Smith Machine Bench Press',   muscles: { primary: ['chest'], secondary: ['triceps', 'shoulders'] }, equipment: ['smith_machine', 'bench'], priority: 2, anchor: true,
    substitutions: ['db_bench', 'chest_press_machine'] },
  { id: 'db_bench',            name: 'Dumbbell Bench Press',        muscles: { primary: ['chest'], secondary: ['triceps', 'shoulders'] }, equipment: ['dumbbells', 'bench'], priority: 3, anchor: true,
    substitutions: ['chest_press_machine', 'push_ups'] },
  { id: 'chest_press_machine', name: 'Machine Chest Press',         muscles: { primary: ['chest'], secondary: ['triceps'] }, equipment: ['chest_press'], priority: 4, anchor: false,
    substitutions: ['push_ups'] },
  { id: 'incline_barbell',     name: 'Incline Barbell Bench',       muscles: { primary: ['chest'], secondary: ['shoulders', 'triceps'] }, equipment: ['barbell', 'bench'], priority: 1, anchor: true,
    substitutions: ['incline_smith', 'incline_db'] },
  { id: 'incline_smith',       name: 'Incline Smith Press',         muscles: { primary: ['chest'], secondary: ['shoulders', 'triceps'] }, equipment: ['smith_machine', 'bench'], priority: 2, anchor: true,
    substitutions: ['incline_db'] },
  { id: 'incline_db',          name: 'Incline Dumbbell Press',      muscles: { primary: ['chest'], secondary: ['shoulders', 'triceps'] }, equipment: ['dumbbells', 'bench'], priority: 3, anchor: true,
    substitutions: ['chest_press_machine'] },
  { id: 'cable_fly_htl',       name: 'Cable Fly (High to Low)',     muscles: { primary: ['chest'], secondary: [] }, equipment: ['cables'], priority: 1, anchor: false,
    substitutions: ['db_fly', 'pec_deck_fly'] },
  { id: 'cable_fly_lth',       name: 'Cable Fly (Low to High)',     muscles: { primary: ['chest'], secondary: ['shoulders'] }, equipment: ['cables'], priority: 2, anchor: false,
    substitutions: ['incline_db_fly', 'pec_deck_fly'] },
  { id: 'db_fly',              name: 'Dumbbell Fly',                muscles: { primary: ['chest'], secondary: [] }, equipment: ['dumbbells', 'bench'], priority: 3, anchor: false,
    substitutions: ['pec_deck_fly'] },
  { id: 'incline_db_fly',      name: 'Incline Dumbbell Fly',        muscles: { primary: ['chest'], secondary: [] }, equipment: ['dumbbells', 'bench'], priority: 4, anchor: false,
    substitutions: ['pec_deck_fly'] },
  { id: 'pec_deck_fly',        name: 'Pec Deck Fly',                muscles: { primary: ['chest'], secondary: [] }, equipment: ['pec_deck'], priority: 5, anchor: false,
    substitutions: [] },
  { id: 'hex_press',           name: 'Hex Press',                   muscles: { primary: ['chest'], secondary: ['triceps'] }, equipment: ['dumbbells', 'bench'], priority: 5, anchor: false,
    substitutions: ['db_fly'] },
  { id: 'push_ups',            name: 'Push-Ups',                    muscles: { primary: ['chest'], secondary: ['triceps', 'shoulders'] }, equipment: ['bodyweight'], priority: 10, anchor: false,
    substitutions: [] },

  // ── BACK ──
  { id: 'barbell_row',         name: 'Barbell Row',                 muscles: { primary: ['back'], secondary: ['biceps', 'rear_delts'] }, equipment: ['barbell'], priority: 1, anchor: true,
    substitutions: ['db_row', 'cable_row'] },
  { id: 'db_row',              name: 'Dumbbell Row',                muscles: { primary: ['back'], secondary: ['biceps'] }, equipment: ['dumbbells', 'bench'], priority: 2, anchor: true,
    substitutions: ['cable_row'] },
  { id: 'cable_row',           name: 'Seated Cable Row',            muscles: { primary: ['back'], secondary: ['biceps', 'rear_delts'] }, equipment: ['seated_row'], priority: 3, anchor: true,
    substitutions: ['db_row'] },
  { id: 'cable_row_wide',      name: 'Seated Cable Row (Wide)',     muscles: { primary: ['back', 'rear_delts'], secondary: ['biceps'] }, equipment: ['seated_row'], priority: 4, anchor: true,
    substitutions: ['barbell_row', 'db_row'] },
  { id: 'wtd_pullup',          name: 'Weighted Pull-Up',            muscles: { primary: ['back'], secondary: ['biceps'] }, equipment: ['pull_up_bar'], priority: 1, anchor: true,
    substitutions: ['lat_pulldown_machine', 'bw_pullup'] },
  { id: 'bw_pullup',           name: 'Bodyweight Pull-Up',          muscles: { primary: ['back'], secondary: ['biceps'] }, equipment: ['pull_up_bar'], priority: 3, anchor: false,
    substitutions: ['lat_pulldown_machine'] },
  { id: 'lat_pulldown_machine',name: 'Lat Pulldown',                muscles: { primary: ['back'], secondary: ['biceps'] }, equipment: ['lat_pulldown'], priority: 2, anchor: true,
    substitutions: ['bw_pullup', 'db_row'] },
  { id: 'close_grip_pulldown', name: 'Close Grip Lat Pulldown',     muscles: { primary: ['back'], secondary: ['biceps'] }, equipment: ['lat_pulldown'], priority: 4, anchor: false,
    substitutions: ['bw_pullup'] },
  { id: 'cable_pullover',      name: 'Cable Pullover',              muscles: { primary: ['back'], secondary: [] }, equipment: ['cables'], priority: 3, anchor: false,
    substitutions: ['db_pullover'] },
  { id: 'db_pullover',         name: 'Dumbbell Pullover',           muscles: { primary: ['back', 'chest'], secondary: [] }, equipment: ['dumbbells', 'bench'], priority: 5, anchor: false,
    substitutions: [] },

  // ── SHOULDERS ──
  { id: 'military_press',      name: 'Military Press (Barbell)',    muscles: { primary: ['shoulders'], secondary: ['triceps'] }, equipment: ['barbell'], priority: 1, anchor: true,
    substitutions: ['smith_shoulder_press', 'db_shoulder_press'] },
  { id: 'smith_shoulder_press',name: 'Smith Machine Shoulder Press',muscles: { primary: ['shoulders'], secondary: ['triceps'] }, equipment: ['smith_machine'], priority: 2, anchor: true,
    substitutions: ['db_shoulder_press'] },
  { id: 'db_shoulder_press',   name: 'Dumbbell Shoulder Press',     muscles: { primary: ['shoulders'], secondary: ['triceps'] }, equipment: ['dumbbells', 'bench'], priority: 3, anchor: true,
    substitutions: [] },
  { id: 'cable_lat_raise',     name: 'Cable Lateral Raise',         muscles: { primary: ['side_delts'], secondary: [] }, equipment: ['cables'], priority: 1, anchor: false,
    substitutions: ['db_lat_raise'] },
  { id: 'db_lat_raise',        name: 'Dumbbell Lateral Raise',      muscles: { primary: ['side_delts'], secondary: [] }, equipment: ['dumbbells'], priority: 2, anchor: false,
    substitutions: [] },
  { id: 'face_pull',           name: 'Face Pull',                   muscles: { primary: ['rear_delts'], secondary: ['traps'] }, equipment: ['cables'], priority: 1, anchor: false,
    substitutions: ['band_pull_apart', 'rear_delt_fly'] },
  { id: 'rear_delt_fly',       name: 'Rear Delt Fly (Dumbbell)',    muscles: { primary: ['rear_delts'], secondary: [] }, equipment: ['dumbbells', 'bench'], priority: 2, anchor: false,
    substitutions: [] },
  { id: 'band_pull_apart',     name: 'Band Pull-Apart',             muscles: { primary: ['rear_delts'], secondary: ['traps'] }, equipment: ['bodyweight'], priority: 5, anchor: false,
    substitutions: [] },

  // ── QUADS ──
  { id: 'barbell_squat',       name: 'Barbell Squat',               muscles: { primary: ['quads', 'glutes'], secondary: ['hamstrings'] }, equipment: ['barbell'], priority: 1, anchor: true,
    substitutions: ['smith_squat', 'goblet_squat', 'leg_press_exercise'] },
  { id: 'smith_squat',         name: 'Smith Machine Squat',         muscles: { primary: ['quads', 'glutes'], secondary: ['hamstrings'] }, equipment: ['smith_machine'], priority: 2, anchor: true,
    substitutions: ['goblet_squat', 'leg_press_exercise'] },
  { id: 'goblet_squat',        name: 'Goblet Squat',                muscles: { primary: ['quads'], secondary: ['glutes'] }, equipment: ['dumbbells'], priority: 4, anchor: false,
    substitutions: ['leg_press_exercise', 'bodyweight_squat'] },
  { id: 'leg_press_exercise',  name: 'Leg Press',                   muscles: { primary: ['quads'], secondary: ['glutes'] }, equipment: ['leg_press'], priority: 3, anchor: false,
    substitutions: ['goblet_squat', 'smith_squat'] },
  { id: 'leg_extension',       name: 'Leg Extension',               muscles: { primary: ['quads'], secondary: [] }, equipment: ['leg_curl'], priority: 2, anchor: false,
    substitutions: ['goblet_squat'] },
  { id: 'bulgarian_split',     name: 'Bulgarian Split Squat',       muscles: { primary: ['quads', 'glutes'], secondary: [] }, equipment: ['dumbbells', 'bench'], priority: 2, anchor: true,
    substitutions: ['smith_lunge', 'db_lunge'] },
  { id: 'smith_lunge',         name: 'Smith Machine Lunge',         muscles: { primary: ['quads', 'glutes'], secondary: [] }, equipment: ['smith_machine'], priority: 3, anchor: true,
    substitutions: ['db_lunge'] },
  { id: 'db_lunge',            name: 'Dumbbell Lunge',              muscles: { primary: ['quads', 'glutes'], secondary: [] }, equipment: ['dumbbells'], priority: 4, anchor: true,
    substitutions: ['bodyweight_squat'] },
  { id: 'bodyweight_squat',    name: 'Bodyweight Squat',            muscles: { primary: ['quads'], secondary: ['glutes'] }, equipment: ['bodyweight'], priority: 10, anchor: false,
    substitutions: [] },

  // ── HAMSTRINGS ──
  { id: 'rdl',                 name: 'Romanian Deadlift',           muscles: { primary: ['hamstrings', 'glutes'], secondary: ['back'] }, equipment: ['barbell'], priority: 1, anchor: true,
    substitutions: ['db_rdl', 'good_morning'] },
  { id: 'db_rdl',              name: 'Dumbbell Romanian Deadlift',  muscles: { primary: ['hamstrings', 'glutes'], secondary: [] }, equipment: ['dumbbells'], priority: 2, anchor: true,
    substitutions: ['good_morning'] },
  { id: 'good_morning',        name: 'Good Mornings',               muscles: { primary: ['hamstrings'], secondary: ['back', 'glutes'] }, equipment: ['barbell'], priority: 3, anchor: false,
    substitutions: ['smith_good_morning'] },
  { id: 'smith_good_morning',  name: 'Good Mornings (Smith)',       muscles: { primary: ['hamstrings'], secondary: ['back', 'glutes'] }, equipment: ['smith_machine'], priority: 4, anchor: false,
    substitutions: [] },
  { id: 'prone_leg_curl',      name: 'Prone Leg Curl',              muscles: { primary: ['hamstrings'], secondary: [] }, equipment: ['leg_curl'], priority: 1, anchor: false,
    substitutions: ['seated_leg_curl', 'db_rdl'] },
  { id: 'seated_leg_curl',     name: 'Seated Leg Curl',             muscles: { primary: ['hamstrings'], secondary: [] }, equipment: ['leg_curl'], priority: 2, anchor: false,
    substitutions: ['db_rdl'] },

  // ── GLUTES ──
  { id: 'hip_thrust',          name: 'Barbell Hip Thrust',          muscles: { primary: ['glutes'], secondary: ['hamstrings'] }, equipment: ['barbell', 'bench'], priority: 1, anchor: true,
    substitutions: ['smith_hip_thrust', 'cable_kickback'] },
  { id: 'smith_hip_thrust',    name: 'Smith Machine Hip Thrust',    muscles: { primary: ['glutes'], secondary: ['hamstrings'] }, equipment: ['smith_machine', 'bench'], priority: 2, anchor: true,
    substitutions: ['cable_kickback'] },
  { id: 'cable_kickback',      name: 'Cable Kickback',              muscles: { primary: ['glutes'], secondary: [] }, equipment: ['cables'], priority: 3, anchor: false,
    substitutions: [] },
  { id: 'cable_hip_abduction', name: 'Cable Hip Abduction',         muscles: { primary: ['glutes'], secondary: [] }, equipment: ['cables'], priority: 2, anchor: false,
    substitutions: [] },
  { id: 'cable_hip_adduction', name: 'Cable Hip Adduction',         muscles: { primary: ['glutes'], secondary: [] }, equipment: ['cables'], priority: 4, anchor: false,
    substitutions: [] },

  // ── CALVES ──
  { id: 'standing_calf',       name: 'Standing Calf Raise',         muscles: { primary: ['calves'], secondary: [] }, equipment: ['smith_machine'], priority: 1, anchor: false,
    substitutions: ['seated_calf', 'calf_on_leg_press'] },
  { id: 'seated_calf',         name: 'Seated Calf Raise',           muscles: { primary: ['calves'], secondary: [] }, equipment: ['smith_machine'], priority: 2, anchor: false,
    substitutions: ['calf_on_leg_press'] },
  { id: 'calf_on_leg_press',   name: 'Calf Raise on Leg Press',     muscles: { primary: ['calves'], secondary: [] }, equipment: ['leg_press'], priority: 3, anchor: false,
    substitutions: ['db_calf_raise'] },
  { id: 'db_calf_raise',       name: 'Dumbbell Calf Raise',         muscles: { primary: ['calves'], secondary: [] }, equipment: ['dumbbells'], priority: 5, anchor: false,
    substitutions: [] },

  // ── BICEPS ──
  { id: 'barbell_curl',        name: 'Barbell Curl',                muscles: { primary: ['biceps'], secondary: ['forearms'] }, equipment: ['barbell'], priority: 1, anchor: false,
    substitutions: ['db_curl', 'cable_curl'] },
  { id: 'db_curl',             name: 'Dumbbell Curl',               muscles: { primary: ['biceps'], secondary: [] }, equipment: ['dumbbells'], priority: 2, anchor: false,
    substitutions: ['cable_curl'] },
  { id: 'cable_curl',          name: 'Cable Curl',                  muscles: { primary: ['biceps'], secondary: [] }, equipment: ['cables'], priority: 3, anchor: false,
    substitutions: ['db_curl'] },
  { id: 'incline_db_curl',     name: 'Incline Dumbbell Curl',       muscles: { primary: ['biceps'], secondary: [] }, equipment: ['dumbbells', 'bench'], priority: 2, anchor: false,
    substitutions: ['cable_curl'] },
  { id: 'hammer_curl',         name: 'Hammer Curl',                 muscles: { primary: ['biceps', 'forearms'], secondary: [] }, equipment: ['dumbbells'], priority: 2, anchor: false,
    substitutions: ['cable_curl'] },
  { id: 'reverse_curl',        name: 'Reverse Curl',                muscles: { primary: ['forearms', 'biceps'], secondary: [] }, equipment: ['barbell'], priority: 3, anchor: false,
    substitutions: ['db_curl'] },

  // ── TRICEPS ──
  { id: 'skull_crusher',       name: 'Skull Crusher',               muscles: { primary: ['triceps'], secondary: [] }, equipment: ['barbell', 'bench'], priority: 1, anchor: false,
    substitutions: ['rope_pushdown', 'overhead_tri_ext'] },
  { id: 'rope_pushdown',       name: 'Rope Pushdown',               muscles: { primary: ['triceps'], secondary: [] }, equipment: ['cables'], priority: 2, anchor: false,
    substitutions: ['overhead_tri_ext'] },
  { id: 'overhead_tri_ext',    name: 'Overhead Tricep Extension',   muscles: { primary: ['triceps'], secondary: [] }, equipment: ['cables'], priority: 3, anchor: false,
    substitutions: ['db_overhead_tri'] },
  { id: 'db_overhead_tri',     name: 'DB Overhead Tricep Extension', muscles: { primary: ['triceps'], secondary: [] }, equipment: ['dumbbells'], priority: 4, anchor: false,
    substitutions: [] },
  { id: 'close_grip_bench',    name: 'Close Grip Bench Press',      muscles: { primary: ['triceps'], secondary: ['chest'] }, equipment: ['barbell', 'bench'], priority: 2, anchor: false,
    substitutions: ['rope_pushdown'] },
  { id: 'dips',                name: 'Dips',                        muscles: { primary: ['triceps', 'chest'], secondary: ['shoulders'] }, equipment: ['dip_station'], priority: 2, anchor: false,
    substitutions: ['rope_pushdown'] },

  // ── TRAPS ──
  { id: 'barbell_shrug',       name: 'Barbell Shrug',               muscles: { primary: ['traps'], secondary: [] }, equipment: ['barbell'], priority: 1, anchor: false,
    substitutions: ['db_shrug'] },
  { id: 'db_shrug',            name: 'Dumbbell Shrug',              muscles: { primary: ['traps'], secondary: [] }, equipment: ['dumbbells'], priority: 2, anchor: false,
    substitutions: [] },

  // ── ABS ──
  { id: 'hanging_leg_raise',   name: 'Hanging Leg Raise',           muscles: { primary: ['abs'], secondary: [] }, equipment: ['pull_up_bar'], priority: 1, anchor: false,
    substitutions: ['cable_crunch', 'decline_situp'] },
  { id: 'cable_crunch',        name: 'Cable Crunch',                muscles: { primary: ['abs'], secondary: [] }, equipment: ['cables'], priority: 2, anchor: false,
    substitutions: ['decline_situp'] },
  { id: 'decline_situp',       name: 'Decline Sit-Up',              muscles: { primary: ['abs'], secondary: [] }, equipment: ['bench'], priority: 3, anchor: false,
    substitutions: ['bodyweight_crunch'] },
  { id: 'cable_rotation',      name: 'Cable Rotation (Obliques)',   muscles: { primary: ['abs'], secondary: [] }, equipment: ['cables'], priority: 2, anchor: false,
    substitutions: ['russian_twist'] },
  { id: 'russian_twist',       name: 'Russian Twist',               muscles: { primary: ['abs'], secondary: [] }, equipment: ['bodyweight'], priority: 5, anchor: false,
    substitutions: [] },
  { id: 'bodyweight_crunch',   name: 'Bodyweight Crunch',           muscles: { primary: ['abs'], secondary: [] }, equipment: ['bodyweight'], priority: 10, anchor: false,
    substitutions: [] },
];

// ─── EXERCISE LOOKUP HELPERS ──────────────────────────────────

function getExerciseById(id) {
  return EXERCISE_DB.find(e => e.id === id) || null;
}

function getExercisesForMuscle(muscle, availableEquipment) {
  return EXERCISE_DB
    .filter(e => {
      const hitsMuscle = e.muscles.primary.includes(muscle);
      const hasEquipment = e.equipment.every(eq => availableEquipment.includes(eq));
      return hitsMuscle && hasEquipment;
    })
    .sort((a, b) => a.priority - b.priority);
}

function getAnchorsForMuscle(muscle, availableEquipment) {
  return getExercisesForMuscle(muscle, availableEquipment).filter(e => e.anchor);
}

function getAccessoriesForMuscle(muscle, availableEquipment) {
  return getExercisesForMuscle(muscle, availableEquipment).filter(e => !e.anchor);
}

function findSubstitute(exerciseId, availableEquipment) {
  const ex = getExerciseById(exerciseId);
  if (!ex) return null;
  for (const subId of ex.substitutions) {
    const sub = getExerciseById(subId);
    if (sub && sub.equipment.every(eq => availableEquipment.includes(eq))) {
      return sub;
    }
  }
  return null;
}
