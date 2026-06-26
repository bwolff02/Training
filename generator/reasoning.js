// ─── REASONING STRING GENERATION ──────────────────────────────
// Calls claude-haiku-4-5 to generate one plain-language sentence per field.
// Falls back to deterministic templates if API is unavailable.

const REASONING_API_URL = null; // Set to your API endpoint when ready

async function generateReasoning(rule, context) {
  if (REASONING_API_URL) {
    try {
      const response = await fetch(REASONING_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 100,
          messages: [{
            role: 'user',
            content: `You are a knowledgeable strength coach. In ONE short sentence (under 20 words), explain this training recommendation in plain language a gym-goer would understand. Be specific to their situation.\n\nRule: ${rule}\nContext: ${JSON.stringify(context)}\n\nRespond with just the sentence, no quotes.`
          }]
        })
      });
      const data = await response.json();
      if (data.content?.[0]?.text) return data.content[0].text;
    } catch (e) {
      // Fall through to template
    }
  }
  return getTemplateReasoning(rule, context);
}

function getTemplateReasoning(rule, context) {
  const templates = {
    volume_landmark: () => {
      const muscle = context.muscle || 'this muscle';
      const sets = context.value || '?';
      const exp = context.experience || 'your';
      return `${sets} sets/week for ${muscle} is the research-backed sweet spot for ${exp}-level ${context.goal || 'training'}.`;
    },
    volume_target: () => {
      const sets = context.value || 3;
      return `${sets} sets here contributes to your weekly volume target for ${context.muscle || 'this muscle group'}.`;
    },
    rep_range_for_goal: () => {
      const reps = context.value || '8-12';
      const goal = context.goal || 'your goal';
      const tag = context.tag || 'this phase';
      const goalLabels = {
        hypertrophy: 'muscle growth',
        strength: 'strength gains',
        recomp: 'body recomposition',
        general: 'general fitness'
      };
      return `${reps} reps on ${tag} days optimizes for ${goalLabels[goal] || goal}.`;
    },
    percentage_of_1rm: () => {
      const pct = context.percentage ? Math.round(context.percentage * 100) : '?';
      return `${context.value || '?'}lbs is ~${pct}% of your estimated 1RM, a good working weight for ${context.tag || 'this phase'}.`;
    },
    no_baseline: () => 'Start light and build up — no baseline entered for this exercise.',
    anchor_set_count: () => `${context.value || 3} working sets for anchor lifts — enough stimulus without excess fatigue.`,
    exercise_selection: () => `${context.value || 'This exercise'} was selected as the top-priority option for your available equipment.`,
    split_selection: () => {
      const splitLabels = { full_body: 'Full Body', upper_lower: 'Upper/Lower', ppl: 'Push/Pull/Legs' };
      return `${splitLabels[context.value] || context.value} is the best fit for ${context.days || '?'} training days per week.`;
    },
    user_split_preference: () => 'You chose this split — your preference is always respected.',
    wave_periodization: () => {
      if (context.periodization === 'linear') return 'Linear periodization — consistent intensity each week, great for steady progress.';
      return 'Wave periodization alternates heavy and volume weeks to manage fatigue while driving adaptation.';
    },
    periodization_choice: () => {
      if (context.value === 'linear') return 'Linear periodization builds strength steadily — a great fit for your experience level.';
      return 'Wave periodization alternates intensity to prevent plateaus — recommended for intermediate+ lifters.';
    },
    user_goal: () => {
      const goalLabels = { hypertrophy: 'building muscle', strength: 'getting stronger', recomp: 'losing fat while maintaining muscle', general: 'general fitness' };
      return `Program optimized for ${goalLabels[context.value] || context.value}.`;
    },
    days_2_3_full_body: () => `With ${context.days || '2-3'} days/week, full body sessions hit every muscle group each workout.`,
    days_4_upper_lower: () => 'Four days fits naturally into an Upper/Lower split — two sessions per half.',
    days_5_6_ppl: () => `${context.days || '5-6'} days/week allows Push/Pull/Legs with each muscle hit twice.`,
  };

  const fn = templates[rule];
  return fn ? fn() : `Generated based on the "${rule}" rule.`;
}

async function attachReasoningToProgram(program) {
  const profile = program.profile;

  // Program-level reasoning
  const programFields = [
    { tracked: program.split, context: { value: program.split.value, days: profile.daysPerWeek } },
    { tracked: program.periodization, context: { value: program.periodization.value, experience: profile.experience } },
    { tracked: program.goal, context: { value: program.goal.value } },
  ];

  for (const { tracked, context } of programFields) {
    if (tracked.source === 'generated') {
      tracked.reasoning = await generateReasoning(tracked.rule, context);
    }
  }

  // Volume target reasoning
  for (const [muscle, tracked] of Object.entries(program.volumeTargets)) {
    if (tracked.source === 'generated') {
      tracked.reasoning = await generateReasoning(tracked.rule, {
        muscle, value: tracked.value, experience: profile.experience, goal: profile.goal
      });
    }
  }

  // Exercise-level reasoning
  for (const day of program.days) {
    if (day.dayType === 'rest') continue;
    for (const variant of [day.weekA, day.weekB]) {
      if (!variant) continue;
      for (const section of variant.sections) {
        for (const ex of section.exercises) {
          for (const field of ['sets', 'reps', 'weight', 'name']) {
            const tracked = ex[field];
            if (tracked && tracked.source === 'generated') {
              const context = {
                value: tracked.value,
                exercise: ex.name.value,
                muscle: ex.anchor ? 'anchor' : 'accessory',
                goal: profile.goal,
                experience: profile.experience,
                tag: variant.tag?.value || 'heavy',
              };
              if (field === 'weight' && tracked.rule === 'percentage_of_1rm') {
                context.percentage = getWeightPercentage(profile.goal, variant.tag?.value || 'heavy');
              }
              tracked.reasoning = await generateReasoning(tracked.rule, context);
            }
          }
        }
      }
    }
  }

  return program;
}
