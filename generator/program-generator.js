// ─── SPLIT SELECTION ──────────────────────────────────────────

function selectSplit(profile) {
  if (profile.splitPreference !== 'auto') {
    return profile.splitPreference;
  }
  const days = profile.daysPerWeek;
  if (days <= 3) return 'full_body';
  if (days === 4) return 'upper_lower';
  if (days <= 6) return 'ppl';
  return 'ppl'; // 7 days gets pushed back to 6 + rest in UI
}

function getSplitRule(profile) {
  if (profile.splitPreference !== 'auto') return 'user_split_preference';
  const days = profile.daysPerWeek;
  if (days <= 3) return 'days_2_3_full_body';
  if (days === 4) return 'days_4_upper_lower';
  return 'days_5_6_ppl';
}

// ─── MUSCLE GROUPS PER SPLIT DAY TYPE ─────────────────────────

const SPLIT_MUSCLE_MAP = {
  push:      { anchors: ['chest', 'shoulders'], accessories: ['chest', 'shoulders', 'side_delts', 'triceps'] },
  pull:      { anchors: ['back'],               accessories: ['back', 'rear_delts', 'biceps', 'forearms', 'traps'] },
  legs:      { anchors: ['quads', 'hamstrings'], accessories: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
  upper:     { anchors: ['chest', 'back', 'shoulders'], accessories: ['chest', 'back', 'side_delts', 'rear_delts', 'biceps', 'triceps', 'traps'] },
  lower:     { anchors: ['quads', 'hamstrings'], accessories: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
  full_body: { anchors: ['quads', 'chest', 'back'], accessories: ['shoulders', 'hamstrings', 'biceps', 'triceps', 'abs'] },
};

// ─── DAY LAYOUTS BY SPLIT ─────────────────────────────────────

const SPLIT_LAYOUTS = {
  full_body: {
    2: [
      { label: 'Day 1 · Full Body A', dayType: 'full_body' },
      { label: 'Day 2 · Full Body B', dayType: 'full_body' },
    ],
    3: [
      { label: 'Day 1 · Full Body A', dayType: 'full_body' },
      { label: 'Day 2 · Full Body B', dayType: 'full_body' },
      { label: 'Day 3 · Full Body C', dayType: 'full_body' },
    ],
  },
  upper_lower: {
    4: [
      { label: 'Day 1 · Upper', dayType: 'upper' },
      { label: 'Day 2 · Lower', dayType: 'lower' },
      { label: 'Day 3 · Upper', dayType: 'upper' },
      { label: 'Day 4 · Lower', dayType: 'lower' },
    ],
  },
  ppl: {
    5: [
      { label: 'Day 1 · Push', dayType: 'push' },
      { label: 'Day 2 · Pull', dayType: 'pull' },
      { label: 'Day 3 · Legs', dayType: 'legs' },
      { label: 'Day 4 · Push', dayType: 'push' },
      { label: 'Day 5 · Pull', dayType: 'pull' },
    ],
    6: [
      { label: 'Day 1 · Push', dayType: 'push' },
      { label: 'Day 2 · Pull', dayType: 'pull' },
      { label: 'Day 3 · Legs', dayType: 'legs' },
      { label: 'Day 4 · Push', dayType: 'push' },
      { label: 'Day 5 · Pull', dayType: 'pull' },
      { label: 'Day 6 · Legs', dayType: 'legs' },
    ],
  },
};

// ─── SESSION EXERCISE LIMITS ──────────────────────────────────
// Default limits by session time. Overridden by user's exercisesPerSession if provided.

const SESSION_EXERCISE_DEFAULTS = {
  45: { anchors: 2, accessories: 3 },
  60: { anchors: 2, accessories: 4 },
  75: { anchors: 3, accessories: 5 },
  90: { anchors: 3, accessories: 6 },
};

function getSessionLimits(profile) {
  const defaults = SESSION_EXERCISE_DEFAULTS[profile.sessionMinutes] || SESSION_EXERCISE_DEFAULTS[60];
  if (profile.exercisesPerSession) {
    const total = profile.exercisesPerSession;
    const anchors = Math.min(Math.ceil(total * 0.3), 4);
    const accessories = total - anchors;
    return { anchors, accessories };
  }
  return defaults;
}

function getSetsPerExercise(profile, isAnchor) {
  if (profile.setsPerSession && profile.exercisesPerSession) {
    const avgSets = Math.round(profile.setsPerSession / profile.exercisesPerSession);
    return Math.max(2, Math.min(avgSets, 5));
  }
  return isAnchor ? 3 : 3;
}

// ─── WAVE PERIODIZATION TAG ASSIGNMENT ────────────────────────

function assignWaveTags(dayLayouts, periodization) {
  if (periodization === 'linear') {
    return dayLayouts.map(d => ({
      ...d,
      weekATag: 'heavy',
      weekBTag: 'heavy',
    }));
  }
  // Wave: alternate heavy/volume by day, flip on week B
  return dayLayouts.map((d, i) => ({
    ...d,
    weekATag: i % 2 === 0 ? 'heavy' : 'volume',
    weekBTag: i % 2 === 0 ? 'volume' : 'heavy',
  }));
}

// ─── EXERCISE PICKER ──────────────────────────────────────────

function pickExercisesForDay(dayType, tag, profile, limits) {
  const muscleMap = SPLIT_MUSCLE_MAP[dayType];
  if (!muscleMap) return { anchors: [], accessories: [] };

  const equipment = profile.equipment;
  const goal = profile.goal;
  const usedIds = new Set();
  const anchorSets = getSetsPerExercise(profile, true);
  const accessorySets = getSetsPerExercise(profile, false);
  const techniques = profile.techniques || [];

  // Pick anchors — cycle through anchor muscles, picking multiple per muscle if needed
  const anchors = [];
  let anchorMuscleIdx = 0;
  while (anchors.length < limits.anchors && anchorMuscleIdx < muscleMap.anchors.length * 2) {
    const muscle = muscleMap.anchors[anchorMuscleIdx % muscleMap.anchors.length];
    anchorMuscleIdx++;
    const candidates = getAnchorsForMuscle(muscle, equipment);
    for (const c of candidates) {
      if (!usedIds.has(c.id)) {
        const repRange = getRepRange(goal, tag, true);
        const baseline = profile.baselines[c.id];
        const pct = getWeightPercentage(goal, tag);
        const est1RM = baseline ? epley1RM(baseline.weight, baseline.reps) : 0;
        let wt = est1RM > 0 ? workingWeight(est1RM, pct) : 0;

        // Cap dumbbell exercises to gym's max DB weight
        if (profile.dbMaxWeight > 0 && c.equipment.includes('dumbbells') && wt > profile.dbMaxWeight) {
          wt = profile.dbMaxWeight;
        }

        let note = '';
        if (techniques.includes('slow_eccentrics') && tag === 'heavy') note = '3-sec eccentric on each rep.';
        if (techniques.includes('pause_reps') && tag === 'heavy') note = '1-sec pause at bottom.';

        anchors.push(createProgramExercise({
          id: c.id,
          name: c.name,
          sets: anchorSets,
          setsRule: 'anchor_set_count',
          reps: `${repRange.min}-${repRange.max}`,
          repsRule: 'rep_range_for_goal',
          weight: wt,
          weightRule: est1RM > 0 ? 'percentage_of_1rm' : 'no_baseline',
          anchor: true,
          note,
          equipmentRequired: c.equipment,
        }));
        usedIds.add(c.id);
        break;
      }
    }
  }

  // Pick accessories — cycle through accessory muscles, filling to limit
  const accessories = [];
  let accMuscleIdx = 0;
  while (accessories.length < limits.accessories && accMuscleIdx < muscleMap.accessories.length * 3) {
    const muscle = muscleMap.accessories[accMuscleIdx % muscleMap.accessories.length];
    accMuscleIdx++;
    const candidates = getAccessoriesForMuscle(muscle, equipment);
    for (const c of candidates) {
      if (!usedIds.has(c.id)) {
        const repRange = getRepRange(goal, tag, false);

        let note = '';
        // Apply technique annotations to later accessories
        if (techniques.includes('drop_sets') && accessories.length >= limits.accessories - 2) {
          note = 'Drop set on final set — reduce weight ~20%, rep to failure.';
        } else if (techniques.includes('myo_reps') && tag === 'volume' && accessories.length >= limits.accessories - 2) {
          note = 'Myo-rep set: activation set to near failure, then 3-5 mini-sets of 3-5 reps with short rest.';
        } else if (techniques.includes('rest_pause') && accessories.length >= limits.accessories - 1) {
          note = 'Rest-pause on last set: hit failure, rest 10-15 sec, go again x2.';
        } else if (techniques.includes('partials') && tag === 'volume') {
          note = 'Partials after final set — 5-6 partial reps through the hardest range.';
        }

        accessories.push(createProgramExercise({
          id: c.id,
          name: c.name,
          sets: accessorySets,
          setsRule: 'volume_target',
          reps: `${repRange.min}-${repRange.max}`,
          repsRule: 'rep_range_for_goal',
          weight: 0,
          weightRule: 'no_baseline',
          anchor: false,
          note,
          equipmentRequired: c.equipment,
        }));
        usedIds.add(c.id);
        break;
      }
    }
  }

  // Apply superset pairing if user likes supersets
  if (techniques.includes('supersets') && accessories.length >= 4) {
    for (let i = 0; i < accessories.length - 1; i += 2) {
      accessories[i].note = (accessories[i].note ? accessories[i].note + ' ' : '') + `Superset with ${accessories[i+1].name.value}.`;
      accessories[i+1].note = (accessories[i+1].note ? accessories[i+1].note + ' ' : '') + `Superset with ${accessories[i].name.value}.`;
    }
  }

  return { anchors, accessories };
}

// ─── BUILD FULL PROGRAM ───────────────────────────────────────

function generateProgram(profile) {
  const split = selectSplit(profile);
  const splitRule = getSplitRule(profile);

  // Clamp 7 days to 6 + rest
  const effectiveDays = Math.min(profile.daysPerWeek, 6);
  const layouts = SPLIT_LAYOUTS[split]?.[effectiveDays];
  if (!layouts) {
    const fallbackDays = Object.keys(SPLIT_LAYOUTS[split] || {}).map(Number);
    const closest = fallbackDays.reduce((a, b) => Math.abs(b - effectiveDays) < Math.abs(a - effectiveDays) ? b : a, fallbackDays[0] || 3);
    return generateProgramWithLayouts(profile, split, splitRule, SPLIT_LAYOUTS[split][closest]);
  }

  return generateProgramWithLayouts(profile, split, splitRule, layouts);
}

function generateProgramWithLayouts(profile, split, splitRule, layouts) {
  const limits = getSessionLimits(profile);
  const tagged = assignWaveTags(layouts, profile.periodization);

  const days = tagged.map(layout => {
    const weekAExercises = pickExercisesForDay(layout.dayType, layout.weekATag, profile, limits);
    const weekBExercises = pickExercisesForDay(layout.dayType, layout.weekBTag, profile, limits);

    const buildSections = (exercises) => [
      { label: 'Anchors', exercises: exercises.anchors },
      { label: 'Accessories', exercises: exercises.accessories },
    ];

    return {
      label: layout.label,
      dayType: layout.dayType,
      weekA: {
        tag: trackedValue(layout.weekATag, 'wave_periodization'),
        sections: buildSections(weekAExercises),
      },
      weekB: {
        tag: trackedValue(layout.weekBTag, 'wave_periodization'),
        sections: buildSections(weekBExercises),
      },
    };
  });

  // Add rest day if user asked for 7
  if (profile.daysPerWeek >= 7) {
    days.push({ label: 'Rest Day', dayType: 'rest' });
  }

  // Compute volume targets per muscle
  const volumeTargets = {};
  const allMuscles = Object.keys(VOLUME_TABLE[profile.experience]?.[profile.goal] || {});
  for (const muscle of allMuscles) {
    const target = getVolumeTarget(profile.experience, profile.goal, muscle);
    volumeTargets[muscle] = trackedValue(target.default, 'volume_landmark');
  }

  return createProgram({
    profile,
    split,
    periodization: profile.periodization,
    goal: profile.goal,
    days,
    volumeTargets,
  });
}
