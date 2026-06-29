// ─── VOLUME TARGETS (sets/muscle/week) ────────────────────────
// Editable config table — NOT hardcoded in logic.
// Based on RP/Schoenfeld consensus ranges (roughly 10-20 sets/muscle/week).
// Structure: VOLUME_TABLE[experience][goal][muscleGroup] = { min, default, max }
// "default" is what the generator picks; min/max define the editable range.

const VOLUME_TABLE = {
  beginner: {
    hypertrophy: {
      chest:       { min: 8,  default: 10, max: 14 },
      back:        { min: 8,  default: 10, max: 14 },
      shoulders:   { min: 6,  default: 8,  max: 12 },
      quads:       { min: 6,  default: 8,  max: 12 },
      hamstrings:  { min: 4,  default: 6,  max: 10 },
      glutes:      { min: 2,  default: 4,  max: 8 },
      biceps:      { min: 4,  default: 6,  max: 10 },
      triceps:     { min: 4,  default: 6,  max: 10 },
      calves:      { min: 4,  default: 6,  max: 10 },
      abs:         { min: 4,  default: 6,  max: 10 },
      traps:       { min: 2,  default: 4,  max: 6 },
      forearms:    { min: 0,  default: 2,  max: 4 },
      rear_delts:  { min: 4,  default: 6,  max: 10 },
      side_delts:  { min: 4,  default: 6,  max: 10 },
    },
    strength: {
      chest:       { min: 6,  default: 8,  max: 12 },
      back:        { min: 6,  default: 8,  max: 12 },
      shoulders:   { min: 4,  default: 6,  max: 10 },
      quads:       { min: 6,  default: 8,  max: 12 },
      hamstrings:  { min: 4,  default: 6,  max: 10 },
      glutes:      { min: 2,  default: 4,  max: 8 },
      biceps:      { min: 2,  default: 4,  max: 6 },
      triceps:     { min: 4,  default: 6,  max: 8 },
      calves:      { min: 2,  default: 4,  max: 6 },
      abs:         { min: 4,  default: 6,  max: 8 },
      traps:       { min: 2,  default: 4,  max: 6 },
      forearms:    { min: 0,  default: 2,  max: 4 },
      rear_delts:  { min: 4,  default: 6,  max: 8 },
      side_delts:  { min: 2,  default: 4,  max: 6 },
    },
    recomp: {
      chest:       { min: 8,  default: 10, max: 14 },
      back:        { min: 8,  default: 10, max: 14 },
      shoulders:   { min: 6,  default: 8,  max: 12 },
      quads:       { min: 6,  default: 8,  max: 12 },
      hamstrings:  { min: 4,  default: 6,  max: 10 },
      glutes:      { min: 2,  default: 4,  max: 8 },
      biceps:      { min: 4,  default: 6,  max: 8 },
      triceps:     { min: 4,  default: 6,  max: 8 },
      calves:      { min: 4,  default: 6,  max: 8 },
      abs:         { min: 4,  default: 6,  max: 10 },
      traps:       { min: 2,  default: 4,  max: 6 },
      forearms:    { min: 0,  default: 2,  max: 4 },
      rear_delts:  { min: 4,  default: 6,  max: 8 },
      side_delts:  { min: 4,  default: 6,  max: 8 },
    },
    general: {
      chest:       { min: 6,  default: 8,  max: 12 },
      back:        { min: 6,  default: 8,  max: 12 },
      shoulders:   { min: 4,  default: 6,  max: 10 },
      quads:       { min: 6,  default: 8,  max: 10 },
      hamstrings:  { min: 4,  default: 6,  max: 8 },
      glutes:      { min: 2,  default: 4,  max: 6 },
      biceps:      { min: 2,  default: 4,  max: 6 },
      triceps:     { min: 2,  default: 4,  max: 6 },
      calves:      { min: 2,  default: 4,  max: 6 },
      abs:         { min: 4,  default: 6,  max: 8 },
      traps:       { min: 2,  default: 2,  max: 4 },
      forearms:    { min: 0,  default: 0,  max: 4 },
      rear_delts:  { min: 2,  default: 4,  max: 6 },
      side_delts:  { min: 2,  default: 4,  max: 6 },
    },
  },
  intermediate: {
    hypertrophy: {
      chest:       { min: 10, default: 14, max: 20 },
      back:        { min: 10, default: 14, max: 20 },
      shoulders:   { min: 8,  default: 12, max: 16 },
      quads:       { min: 8,  default: 12, max: 16 },
      hamstrings:  { min: 6,  default: 10, max: 14 },
      glutes:      { min: 4,  default: 6,  max: 12 },
      biceps:      { min: 8,  default: 10, max: 14 },
      triceps:     { min: 8,  default: 10, max: 14 },
      calves:      { min: 6,  default: 8,  max: 12 },
      abs:         { min: 6,  default: 8,  max: 12 },
      traps:       { min: 4,  default: 6,  max: 10 },
      forearms:    { min: 2,  default: 4,  max: 6 },
      rear_delts:  { min: 6,  default: 8,  max: 12 },
      side_delts:  { min: 8,  default: 10, max: 14 },
    },
    strength: {
      chest:       { min: 8,  default: 10, max: 14 },
      back:        { min: 8,  default: 10, max: 14 },
      shoulders:   { min: 6,  default: 8,  max: 12 },
      quads:       { min: 8,  default: 12, max: 16 },
      hamstrings:  { min: 6,  default: 8,  max: 12 },
      glutes:      { min: 4,  default: 6,  max: 10 },
      biceps:      { min: 4,  default: 6,  max: 10 },
      triceps:     { min: 6,  default: 8,  max: 12 },
      calves:      { min: 4,  default: 6,  max: 8 },
      abs:         { min: 6,  default: 8,  max: 10 },
      traps:       { min: 4,  default: 6,  max: 8 },
      forearms:    { min: 2,  default: 4,  max: 6 },
      rear_delts:  { min: 6,  default: 8,  max: 10 },
      side_delts:  { min: 4,  default: 6,  max: 10 },
    },
    recomp: {
      chest:       { min: 10, default: 12, max: 18 },
      back:        { min: 10, default: 12, max: 18 },
      shoulders:   { min: 8,  default: 10, max: 14 },
      quads:       { min: 8,  default: 10, max: 14 },
      hamstrings:  { min: 6,  default: 8,  max: 12 },
      glutes:      { min: 4,  default: 6,  max: 10 },
      biceps:      { min: 6,  default: 8,  max: 12 },
      triceps:     { min: 6,  default: 8,  max: 12 },
      calves:      { min: 6,  default: 8,  max: 10 },
      abs:         { min: 6,  default: 8,  max: 12 },
      traps:       { min: 4,  default: 6,  max: 8 },
      forearms:    { min: 2,  default: 4,  max: 6 },
      rear_delts:  { min: 6,  default: 8,  max: 10 },
      side_delts:  { min: 6,  default: 8,  max: 12 },
    },
    general: {
      chest:       { min: 8,  default: 10, max: 14 },
      back:        { min: 8,  default: 10, max: 14 },
      shoulders:   { min: 6,  default: 8,  max: 12 },
      quads:       { min: 6,  default: 8,  max: 12 },
      hamstrings:  { min: 4,  default: 6,  max: 10 },
      glutes:      { min: 2,  default: 4,  max: 8 },
      biceps:      { min: 4,  default: 6,  max: 8 },
      triceps:     { min: 4,  default: 6,  max: 8 },
      calves:      { min: 4,  default: 6,  max: 8 },
      abs:         { min: 4,  default: 6,  max: 10 },
      traps:       { min: 2,  default: 4,  max: 6 },
      forearms:    { min: 0,  default: 2,  max: 4 },
      rear_delts:  { min: 4,  default: 6,  max: 8 },
      side_delts:  { min: 4,  default: 6,  max: 8 },
    },
  },
  advanced: {
    hypertrophy: {
      chest:       { min: 14, default: 18, max: 24 },
      back:        { min: 14, default: 18, max: 24 },
      shoulders:   { min: 10, default: 14, max: 20 },
      quads:       { min: 10, default: 14, max: 20 },
      hamstrings:  { min: 8,  default: 12, max: 16 },
      glutes:      { min: 6,  default: 8,  max: 14 },
      biceps:      { min: 10, default: 14, max: 18 },
      triceps:     { min: 10, default: 14, max: 18 },
      calves:      { min: 8,  default: 10, max: 14 },
      abs:         { min: 8,  default: 10, max: 14 },
      traps:       { min: 6,  default: 8,  max: 12 },
      forearms:    { min: 4,  default: 6,  max: 8 },
      rear_delts:  { min: 8,  default: 12, max: 16 },
      side_delts:  { min: 10, default: 14, max: 18 },
    },
    strength: {
      chest:       { min: 10, default: 12, max: 16 },
      back:        { min: 10, default: 12, max: 16 },
      shoulders:   { min: 6,  default: 10, max: 14 },
      quads:       { min: 10, default: 14, max: 18 },
      hamstrings:  { min: 8,  default: 10, max: 14 },
      glutes:      { min: 6,  default: 8,  max: 12 },
      biceps:      { min: 4,  default: 6,  max: 10 },
      triceps:     { min: 8,  default: 10, max: 14 },
      calves:      { min: 4,  default: 6,  max: 10 },
      abs:         { min: 6,  default: 8,  max: 12 },
      traps:       { min: 4,  default: 6,  max: 10 },
      forearms:    { min: 2,  default: 4,  max: 8 },
      rear_delts:  { min: 6,  default: 8,  max: 12 },
      side_delts:  { min: 4,  default: 8,  max: 12 },
    },
    recomp: {
      chest:       { min: 12, default: 16, max: 22 },
      back:        { min: 12, default: 16, max: 22 },
      shoulders:   { min: 8,  default: 12, max: 16 },
      quads:       { min: 8,  default: 12, max: 16 },
      hamstrings:  { min: 6,  default: 10, max: 14 },
      glutes:      { min: 4,  default: 8,  max: 12 },
      biceps:      { min: 8,  default: 10, max: 14 },
      triceps:     { min: 8,  default: 10, max: 14 },
      calves:      { min: 6,  default: 8,  max: 12 },
      abs:         { min: 8,  default: 10, max: 14 },
      traps:       { min: 4,  default: 6,  max: 10 },
      forearms:    { min: 2,  default: 4,  max: 6 },
      rear_delts:  { min: 6,  default: 10, max: 14 },
      side_delts:  { min: 8,  default: 10, max: 14 },
    },
    general: {
      chest:       { min: 10, default: 12, max: 16 },
      back:        { min: 10, default: 12, max: 16 },
      shoulders:   { min: 8,  default: 10, max: 14 },
      quads:       { min: 8,  default: 10, max: 14 },
      hamstrings:  { min: 6,  default: 8,  max: 12 },
      glutes:      { min: 4,  default: 6,  max: 10 },
      biceps:      { min: 4,  default: 6,  max: 10 },
      triceps:     { min: 4,  default: 6,  max: 10 },
      calves:      { min: 4,  default: 6,  max: 8 },
      abs:         { min: 6,  default: 8,  max: 12 },
      traps:       { min: 4,  default: 6,  max: 8 },
      forearms:    { min: 0,  default: 2,  max: 6 },
      rear_delts:  { min: 4,  default: 6,  max: 10 },
      side_delts:  { min: 4,  default: 6,  max: 10 },
    },
  },
};

// ─── REP RANGES BY GOAL AND TAG ───────────────────────────────
// { goal: { heavy: { anchor, accessory }, volume: { anchor, accessory } } }

const REP_RANGES = {
  hypertrophy: {
    heavy:  { anchor: { min: 6,  max: 8  }, accessory: { min: 8,  max: 12 } },
    volume: { anchor: { min: 8,  max: 12 }, accessory: { min: 12, max: 15 } },
  },
  strength: {
    heavy:  { anchor: { min: 3,  max: 5  }, accessory: { min: 6,  max: 10 } },
    volume: { anchor: { min: 6,  max: 8  }, accessory: { min: 10, max: 12 } },
  },
  recomp: {
    heavy:  { anchor: { min: 6,  max: 8  }, accessory: { min: 10, max: 12 } },
    volume: { anchor: { min: 10, max: 12 }, accessory: { min: 12, max: 15 } },
  },
  general: {
    heavy:  { anchor: { min: 6,  max: 10 }, accessory: { min: 10, max: 12 } },
    volume: { anchor: { min: 8,  max: 12 }, accessory: { min: 12, max: 15 } },
  },
};

// ─── WEIGHT PERCENTAGES OF 1RM ────────────────────────────────
// Used to compute working weight from estimated 1RM.

const WEIGHT_PERCENTAGES = {
  hypertrophy: { heavy: 0.80, volume: 0.70 },
  strength:    { heavy: 0.87, volume: 0.75 },
  recomp:      { heavy: 0.78, volume: 0.68 },
  general:     { heavy: 0.75, volume: 0.65 },
};

function getVolumeTarget(experience, goal, muscle) {
  const table = VOLUME_TABLE[experience]?.[goal]?.[muscle];
  if (!table) return { min: 6, default: 8, max: 14 };
  return table;
}

function getRepRange(goal, tag, isAnchor) {
  const range = REP_RANGES[goal]?.[tag]?.[isAnchor ? 'anchor' : 'accessory'];
  if (!range) return { min: 8, max: 12 };
  return range;
}

function getWeightPercentage(goal, tag) {
  return WEIGHT_PERCENTAGES[goal]?.[tag] || 0.75;
}
