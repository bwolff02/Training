// ─── PROVENANCE-TRACKED VALUE ─────────────────────────────────
// Every generated value carries its origin, rule, reasoning, and edit history.

function trackedValue(value, rule, opts = {}) {
  return {
    value,
    source: 'generated',
    rule,
    reasoning: opts.reasoning || '',
    history: []
  };
}

function overrideValue(tracked, newValue) {
  const updated = { ...tracked };
  updated.history = [...tracked.history, { value: tracked.value, source: tracked.source, timestamp: Date.now() }];
  updated.value = newValue;
  updated.source = 'user_override';
  updated.reasoning = 'You set this manually.';
  return updated;
}

// ─── PROFILE SCHEMA ───────────────────────────────────────────
// Output of the questionnaire — input to the generator.

function createProfile(answers) {
  return {
    experience: answers.experience,           // 'beginner' | 'intermediate' | 'advanced'
    goal: answers.goal,                        // 'hypertrophy' | 'strength' | 'recomp' | 'general'
    strengthLifts: answers.strengthLifts || [],// e.g. ['squat','bench','deadlift'] — only if goal=strength
    daysPerWeek: answers.daysPerWeek,          // 2-7
    sessionMinutes: answers.sessionMinutes,    // 45 | 60 | 90
    equipment: answers.equipment,              // string[] from equipment list
    baselines: answers.baselines || {},        // { exerciseId: { weight, reps, estimated1RM } }
    injuries: {
      flags: answers.injuryFlags || [],        // ['shoulders','lower_back','knees']
      notes: answers.injuryNotes || ''         // free text
    },
    splitPreference: answers.splitPreference,  // 'full_body' | 'upper_lower' | 'ppl' | 'auto'
    periodization: answers.periodization,      // 'wave' | 'linear'
    createdAt: Date.now()
  };
}

// ─── PROGRAM SCHEMA ───────────────────────────────────────────
// Output of the generator — consumed by the tracker.

function createProgramExercise(opts) {
  return {
    id: opts.id,
    name: trackedValue(opts.name, 'exercise_selection'),
    sets: trackedValue(opts.sets, opts.setsRule || 'volume_target'),
    reps: trackedValue(opts.reps, opts.repsRule || 'rep_range_for_goal'),
    weight: trackedValue(opts.weight, opts.weightRule || 'percentage_of_1rm'),
    anchor: opts.anchor || false,
    note: opts.note || '',
    equipmentRequired: opts.equipmentRequired || []
  };
}

function createProgramDay(opts) {
  return {
    label: opts.label,
    dayType: opts.dayType,                     // 'push' | 'pull' | 'legs' | 'upper' | 'lower' | 'full_body' | 'rest'
    tag: trackedValue(opts.tag, 'wave_periodization'), // 'heavy' | 'volume'
    sections: opts.sections || []              // [{ label, exercises: [ProgramExercise] }]
  };
}

function createProgram(opts) {
  return {
    id: 'program_' + Date.now(),
    profile: opts.profile,
    split: trackedValue(opts.split, 'split_selection'),
    periodization: trackedValue(opts.periodization, 'periodization_choice'),
    goal: trackedValue(opts.goal, 'user_goal'),
    days: opts.days,                           // [ProgramDay] — weekA and weekB variants per day
    volumeTargets: opts.volumeTargets || {},   // { muscleGroup: trackedValue(setsPerWeek) }
    createdAt: Date.now(),
    version: 1
  };
}

// ─── CONVERT TO EXISTING APP FORMAT ───────────────────────────
// Transforms a generated Program into the PROGRAM[] shape the tracker expects.

function programToLegacyFormat(program) {
  const legacyDays = [];
  const days = program.days;

  for (const day of days) {
    if (day.dayType === 'rest') {
      legacyDays.push({ label: day.label, rest: true });
      continue;
    }

    const toVariant = (variant, tag) => {
      const id = day.label.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + tag;
      const sections = variant.sections.map(sec => ({
        label: sec.label,
        exercises: sec.exercises.map(ex => ({
          id: ex.id,
          name: ex.name.value,
          note: ex.note || '',
          target: `${ex.sets.value} × ${ex.reps.value}`,
          anchor: ex.anchor,
          defaultSets: ex.sets.value,
          anchorVol: tag === 'volume' && ex.anchor ? true : undefined
        }))
      }));
      return {
        id,
        title: day.dayType.toUpperCase(),
        subtitle: day.label + ' — ' + (tag === 'heavy' ? 'Heavy' : 'Volume'),
        tag,
        sections
      };
    };

    if (day.weekA && day.weekB) {
      legacyDays.push({
        label: day.label,
        weekA: toVariant(day.weekA, day.weekA.tag?.value || 'heavy'),
        weekB: toVariant(day.weekB, day.weekB.tag?.value || 'volume')
      });
    } else {
      const variant = day.weekA || day;
      const tag = variant.tag?.value || 'heavy';
      legacyDays.push({
        label: day.label,
        weekA: toVariant(variant, tag),
        weekB: toVariant(variant, tag)
      });
    }
  }

  return legacyDays;
}

// ─── EPLEY 1RM ────────────────────────────────────────────────
function epley1RM(weight, reps) {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

function workingWeight(estimated1RM, percentage) {
  return Math.round((estimated1RM * percentage) / 5) * 5;
}
