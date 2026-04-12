import './style.css';

// ─── Dummy Data ───────────────────────────────────────────────
const USER = {
  name: 'Sarah Miller',
  tier: 'Elite Member • Premium Coaching',
  weight: 72.5,
  weightUnit: 'kg',
  tdee: 2800,
  calorieGoal: 2400,
  consumed: 1840,
  protein: { current: 180, goal: 200 },
  carbs: { current: 240, goal: 280 },
  fats: { current: 60, goal: 75 },
};

const WEIGHT_DATA_7D = [73.1, 72.9, 73.0, 72.7, 72.6, 72.8, 72.5];
const WEIGHT_LABELS_7D = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEIGHT_DATA_30D = [74.0, 73.8, 73.9, 73.5, 73.6, 73.2, 73.4, 73.1, 73.0, 73.2, 72.9, 72.8, 73.0, 72.7, 72.6, 72.8, 72.5, 72.4, 72.6, 72.3, 72.5, 72.2, 72.4, 72.1, 72.3, 72.0, 72.2, 71.9, 72.0, 71.8];

const FOODS = [
  { name: 'Greek Yogurt', portion: '200g • Plain', cals: 120, p: 18, c: 8, f: 2, icon: '🥛' },
  { name: 'Chicken Breast', portion: '100g • Grilled', cals: 165, p: 31, c: 0, f: 3.6, icon: '🍗' },
  { name: 'Brown Rice', portion: '1 cup • Steamed', cals: 216, p: 5, c: 45, f: 1.8, icon: '🍚' },
  { name: 'Avocado', portion: '0.5 fruit • Raw', cals: 160, p: 2, c: 8.5, f: 15, icon: '🥑' },
  { name: 'Salmon Fillet', portion: '150g • Baked', cals: 280, p: 36, c: 0, f: 14, icon: '🐟' },
  { name: 'Boiled Egg', portion: '2 large', cals: 156, p: 12.6, c: 1.1, f: 10.6, icon: '🥚' },
  { name: 'Almonds', portion: '30g • Raw', cals: 164, p: 6, c: 6, f: 14, icon: '🌰' },
  { name: 'Oatmeal', portion: '1 cup • Cooked', cals: 158, p: 6, c: 27, f: 3, icon: '🥣' },
];

const EXERCISES = [
  {
    name: 'Bench Press', muscle: 'Chest', hasPR: true,
    sets: [
      { reps: 8, weight: 80, rpe: 7, done: true },
      { reps: 8, weight: 85, rpe: 8, done: true },
      { reps: 6, weight: 90, rpe: 9, done: true },
      { reps: 5, weight: 92.5, rpe: 10, done: true },
    ],
  },
  {
    name: 'Incline Dumbbell Press', muscle: 'Upper Chest', hasPR: false,
    sets: [
      { reps: 10, weight: 30, rpe: 7, done: true },
      { reps: 10, weight: 32, rpe: 8, done: true },
      { reps: 8, weight: 34, rpe: 9, done: true },
    ],
  },
  {
    name: 'Overhead Press', muscle: 'Shoulders', hasPR: false,
    sets: [
      { reps: 8, weight: 50, rpe: 7, done: true },
      { reps: 8, weight: 52.5, rpe: 8, done: true },
      { reps: 6, weight: 55, rpe: 9, done: false },
    ],
  },
];

const INSIGHTS = [
  { icon: 'hotel', color: '#7B61FF', bg: 'rgba(123,97,255,0.12)', title: 'Recovery Depth', text: 'Deep sleep cycles increased by 15% this week. This is likely driving improved training intensity.' },
  { icon: 'water_drop', color: '#3498DB', bg: 'rgba(52,152,219,0.12)', title: 'Hydration Timing', text: 'Increasing water intake by 500ml during your mid-day fast will help curb the 3 PM cravings.' },
  { icon: 'psychology', color: '#FF8C42', bg: 'rgba(255,140,66,0.12)', title: 'Mental Load', text: 'Fatigue markers are rising slightly. Consider a de-load week for heavy compound lifts starting Monday.' },
];

// ─── Helper ───────────────────────────────────────────────────
function pct(current: number, goal: number) {
  return Math.min(Math.round((current / goal) * 100), 100);
}

// ─── App Shell ────────────────────────────────────────────────
const app = document.getElementById('app')!;

app.innerHTML = `
  <!-- SVG Defs for gradient -->
  <svg width="0" height="0" style="position:absolute">
    <defs>
      <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E63946"/>
        <stop offset="100%" stop-color="#FF4D6D"/>
      </linearGradient>
    </defs>
  </svg>

  <!-- ===== DASHBOARD ===== -->
  <section id="screen-home" class="screen active">
    <div class="screen-header animate-in">
      <h1>Macros</h1>
      <button class="header-icon" aria-label="Notifications">
        <span class="material-icons-round">notifications_none</span>
      </button>
    </div>

    <!-- Calorie Ring -->
    <div class="card card-hero animate-in delay-1" id="calorie-hero">
      <div style="display:flex;align-items:center;gap:var(--space-xl)">
        <div class="progress-ring-wrap" style="width:130px;height:130px;flex-shrink:0">
          <svg viewBox="0 0 130 130" width="130" height="130">
            <circle class="ring-bg" cx="65" cy="65" r="56"/>
            <circle class="ring-fill" cx="65" cy="65" r="56"
              stroke-dasharray="${2 * Math.PI * 56}"
              stroke-dashoffset="${2 * Math.PI * 56 * (1 - USER.consumed / USER.calorieGoal)}"/>
          </svg>
          <div class="progress-ring-center" style="color:#fff">
            <div class="ring-value">${USER.calorieGoal - USER.consumed}</div>
            <div class="ring-label" style="color:rgba(255,255,255,.7)">kcal left</div>
          </div>
        </div>
        <div>
          <div class="card-title">Daily Goal</div>
          <div style="font-family:var(--font-headline);font-size:1.5rem;font-weight:800">${USER.consumed}<span style="font-weight:400;font-size:.875rem;opacity:.7"> / ${USER.calorieGoal}</span></div>
          <div style="font-size:.75rem;opacity:.7;margin-top:4px">${pct(USER.consumed, USER.calorieGoal)}% of daily target</div>
        </div>
      </div>
    </div>

    <!-- Weight + Protein -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md)">
      <div class="card animate-in delay-2" style="text-align:center">
        <div class="card-title">Current Weight</div>
        <div style="font-family:var(--font-headline);font-size:1.75rem;font-weight:800">${USER.weight}<span style="font-size:.875rem;font-weight:500;color:var(--text-muted)"> ${USER.weightUnit}</span></div>
        <div class="weight-trend-badge" style="color:var(--success);margin-top:var(--space-sm);justify-content:center">
          <span class="material-icons-round">trending_down</span> -0.6
        </div>
      </div>
      <div class="card animate-in delay-3" style="text-align:center">
        <div class="card-title">Protein Intake</div>
        <div style="font-family:var(--font-headline);font-size:1.75rem;font-weight:800;color:var(--protein)">${USER.protein.current}<span style="font-size:.875rem;font-weight:500;color:var(--text-muted)">g</span></div>
        <div style="font-size:.75rem;color:var(--text-muted);margin-top:2px">Goal: ${USER.protein.goal}g</div>
        <div class="progress-bar-linear" style="margin-top:var(--space-sm)">
          <div class="fill" style="width:${pct(USER.protein.current, USER.protein.goal)}%"></div>
        </div>
      </div>
    </div>

    <!-- Weight Trend Chart -->
    <div class="card animate-in delay-4">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div class="card-title" style="margin-bottom:0">7-Day Trend</div>
        <span class="pill pill--success"><span class="material-icons-round" style="font-size:14px">trending_down</span> -0.6 kg</span>
      </div>
      <div class="chart-container chart-container-sm">
        <canvas id="chart-weight-7d"></canvas>
      </div>
    </div>

    <!-- Macro Breakdown -->
    <div class="card animate-in delay-5">
      <div class="card-title">Macro Balance</div>
      ${buildMacroRow('Protein', USER.protein.current, USER.protein.goal, 'var(--protein)', `${USER.protein.current * 4} kcal • ${pct(USER.protein.current * 4, USER.consumed)}%`)}
      ${buildMacroRow('Carbohydrates', USER.carbs.current, USER.carbs.goal, 'var(--carbs)', `${USER.carbs.current * 4} kcal • ${pct(USER.carbs.current * 4, USER.consumed)}%`)}
      ${buildMacroRow('Fats', USER.fats.current, USER.fats.goal, 'var(--fats)', `${USER.fats.current * 9} kcal • ${pct(USER.fats.current * 9, USER.consumed)}%`)}
    </div>

    <!-- Nudge -->
    <div class="card animate-in delay-6" style="display:flex;gap:var(--space-lg);align-items:center">
      <div style="width:40px;height:40px;border-radius:var(--radius-md);background:var(--primary-glow);display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <span class="material-icons-round" style="color:var(--primary);font-size:20px">restaurant</span>
      </div>
      <div style="flex:1">
        <div style="font-family:var(--font-headline);font-weight:700;font-size:.9375rem">Log your lunch?</div>
        <div style="font-size:.75rem;color:var(--text-muted);margin-top:2px">You're 560 kcal behind your optimal trajectory for today.</div>
      </div>
      <span class="material-icons-round" style="color:var(--primary)">chevron_right</span>
    </div>
  </section>

  <!-- ===== FOOD LOGGING ===== -->
  <section id="screen-food" class="screen">
    <div class="screen-header animate-in">
      <h1>Food</h1>
      <button class="header-icon" aria-label="Scan barcode">
        <span class="material-icons-round">qr_code_scanner</span>
      </button>
    </div>

    <div class="search-bar animate-in delay-1">
      <span class="material-icons-round">search</span>
      <input type="text" id="food-search" placeholder="Search food..." autocomplete="off"/>
      <button aria-label="Mic"><span class="material-icons-round" style="font-size:20px">mic</span></button>
    </div>

    <!-- Quick Add -->
    <div class="animate-in delay-2">
      <div class="label-md" style="color:var(--text-muted);margin-bottom:var(--space-sm)">Quick Add</div>
      <div class="quick-add-row">
        <button class="quick-pill">🥛 Greek Yogurt <span class="cals">120</span></button>
        <button class="quick-pill">🥚 Boiled Egg <span class="cals">78</span></button>
        <button class="quick-pill">🌰 Almonds <span class="cals">164</span></button>
        <button class="quick-pill">🥣 Oatmeal <span class="cals">158</span></button>
      </div>
    </div>

    <!-- Food List -->
    <div class="section-title animate-in delay-3">Today's Suggestions</div>
    <div id="food-list">
      ${FOODS.map((f, i) => buildFoodItem(f, i)).join('')}
    </div>

    <!-- FAB -->
    <button class="fab" aria-label="Add food" id="fab-food">
      <span class="material-icons-round">add</span>
    </button>
  </section>

  <!-- ===== WORKOUT ===== -->
  <section id="screen-workout" class="screen">
    <div class="screen-header animate-in">
      <h1>Workout</h1>
      <button class="header-icon" aria-label="History">
        <span class="material-icons-round">history</span>
      </button>
    </div>

    <!-- Workout Name -->
    <div class="card card-hero animate-in delay-1" style="padding:var(--space-lg) var(--space-xl)">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-family:var(--font-headline);font-size:1.25rem;font-weight:800">Push Day</div>
          <div style="font-size:.75rem;opacity:.7;margin-top:2px">3 exercises • ~45 min</div>
        </div>
        <span class="material-icons-round" style="opacity:.7">timer</span>
      </div>
    </div>

    <!-- Exercises -->
    ${EXERCISES.map((e, i) => buildExercise(e, i)).join('')}
  </section>

  <!-- ===== PROGRESS ===== -->
  <section id="screen-progress" class="screen">
    <div class="screen-header animate-in">
      <h1>Progress</h1>
      <button class="header-icon" aria-label="Filter">
        <span class="material-icons-round">tune</span>
      </button>
    </div>

    <!-- Summary -->
    <div class="card card-hero animate-in delay-1" style="text-align:center">
      <div class="card-title">This Month</div>
      <div style="font-family:var(--font-headline);font-size:2.5rem;font-weight:800;line-height:1">-1.2<span style="font-size:1.25rem">kg</span></div>
      <div style="font-size:.8125rem;opacity:.8;margin-top:var(--space-sm);max-width:260px;margin-left:auto;margin-right:auto">You're 84% through your weight goal phase. Precision pays off.</div>
      <div class="progress-bar-linear" style="margin-top:var(--space-lg);background:rgba(255,255,255,.2)">
        <div class="fill" style="width:84%;background:rgba(255,255,255,.8)"></div>
      </div>
    </div>

    <!-- Weight Trend -->
    <div class="card animate-in delay-2">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div class="card-title" style="margin-bottom:0">Weight Trend</div>
        <span class="pill pill--primary">Last 30 days</span>
      </div>
      <div class="chart-container">
        <canvas id="chart-weight-30d"></canvas>
      </div>
    </div>

    <!-- Macro Pie -->
    <div class="card animate-in delay-3">
      <div class="card-title">Macro Distribution</div>
      <div class="chart-container chart-container-sm">
        <canvas id="chart-macro-pie"></canvas>
      </div>
    </div>

    <!-- Energy Lab -->
    <div class="card animate-in delay-4">
      <div class="card-title">Energy Lab</div>
      <p style="font-size:.8125rem;color:var(--text-muted);margin-bottom:var(--space-lg)">Comparing fuel intake against physical demand across the current cycle.</p>
      <div class="chart-container">
        <canvas id="chart-energy"></canvas>
      </div>
    </div>

    <!-- Stats -->
    <div class="stat-grid animate-in delay-5">
      <div class="stat-item stat-item--accent">
        <div class="stat-value">-4 bpm</div>
        <div class="stat-label">Rest Heart Rate</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">+15%</div>
        <div class="stat-label">Deep Sleep</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">92%</div>
        <div class="stat-label">Adherence</div>
      </div>
      <div class="stat-item stat-item--accent">
        <div class="stat-value">2,840</div>
        <div class="stat-label">Avg Expenditure</div>
      </div>
    </div>
  </section>

  <!-- ===== PROFILE / COACHING ===== -->
  <section id="screen-profile" class="screen">
    <div class="screen-header animate-in">
      <h1>Profile</h1>
      <button class="header-icon" aria-label="Settings">
        <span class="material-icons-round">settings</span>
      </button>
    </div>

    <!-- Avatar -->
    <div class="profile-header animate-in delay-1">
      <div class="profile-avatar">
        <span class="material-icons-round">person</span>
      </div>
      <div class="profile-name">${USER.name}</div>
      <div class="profile-subtitle">${USER.tier}</div>
    </div>

    <!-- TDEE / Goal -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);margin-bottom:var(--space-lg)" class="animate-in delay-2">
      <div class="card" style="text-align:center;margin-bottom:0">
        <div class="card-title">Calorie Goal</div>
        <div style="font-family:var(--font-headline);font-size:1.75rem;font-weight:800;color:var(--primary)">${USER.calorieGoal.toLocaleString()}</div>
        <div style="font-size:.6875rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.04em;margin-top:4px">kcal / day</div>
      </div>
      <div class="card" style="text-align:center;margin-bottom:0">
        <div class="card-title">Est. TDEE</div>
        <div style="font-family:var(--font-headline);font-size:1.75rem;font-weight:800">${USER.tdee.toLocaleString()}</div>
        <div style="font-size:.6875rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.04em;margin-top:4px">kcal / day</div>
      </div>
    </div>

    <!-- Coaching Suggestion -->
    <div class="coaching-suggestion animate-in delay-3">
      <h3>Reduce calories by 150</h3>
      <p>Based on your metabolic data and energy expenditure from the last 7 days, a slight reduction will optimize your fat loss phase while maintaining lean mass.</p>
    </div>

    <!-- Weekly Adherence -->
    <div class="card animate-in delay-4">
      <div class="card-title">Weekly Adherence</div>
      <div class="adherence-section">
        <div class="progress-ring-wrap" style="width:90px;height:90px;flex-shrink:0">
          <svg viewBox="0 0 90 90" width="90" height="90">
            <circle class="ring-bg" cx="45" cy="45" r="38" stroke-width="8"/>
            <circle class="ring-fill" cx="45" cy="45" r="38" stroke-width="8"
              stroke-dasharray="${2 * Math.PI * 38}"
              stroke-dashoffset="${2 * Math.PI * 38 * (1 - 0.92)}"/>
          </svg>
          <div class="progress-ring-center">
            <div style="font-family:var(--font-headline);font-size:1.125rem;font-weight:800">92%</div>
          </div>
        </div>
        <div class="adherence-macros">
          <div class="adherence-macro-item">
            <span style="font-size:.875rem;font-weight:500">Protein</span>
            <span style="font-family:var(--font-headline);font-weight:700;color:var(--protein)">${USER.protein.current}g</span>
          </div>
          <div class="adherence-macro-item">
            <span style="font-size:.875rem;font-weight:500">Carbs</span>
            <span style="font-family:var(--font-headline);font-weight:700;color:var(--carbs)">${USER.carbs.current}g</span>
          </div>
          <div class="adherence-macro-item">
            <span style="font-size:.875rem;font-weight:500">Fats</span>
            <span style="font-family:var(--font-headline);font-weight:700;color:var(--fats)">${USER.fats.current}g</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Coaching Insights -->
    <div class="section-title animate-in delay-5">Coaching Insights</div>
    ${INSIGHTS.map((ins, i) => `
      <div class="insight-card animate-in delay-${Math.min(i + 5, 6)}">
        <div class="insight-icon" style="background:${ins.bg}">
          <span class="material-icons-round" style="color:${ins.color}">${ins.icon}</span>
        </div>
        <div class="insight-content">
          <h4>${ins.title}</h4>
          <p>${ins.text}</p>
        </div>
      </div>
    `).join('')}
  </section>

  <!-- ===== BOTTOM NAV ===== -->
  <nav class="bottom-nav" id="bottom-nav">
    <button class="nav-item active" data-screen="home" aria-label="Dashboard">
      <span class="material-icons-round">grid_view</span>
      <span>Home</span>
    </button>
    <button class="nav-item" data-screen="food" aria-label="Food">
      <span class="material-icons-round">restaurant</span>
      <span>Food</span>
    </button>
    <button class="nav-item" data-screen="workout" aria-label="Workout">
      <span class="material-icons-round">fitness_center</span>
      <span>Workout</span>
    </button>
    <button class="nav-item" data-screen="progress" aria-label="Progress">
      <span class="material-icons-round">analytics</span>
      <span>Progress</span>
      <span class="notif-dot"></span>
    </button>
    <button class="nav-item" data-screen="profile" aria-label="Profile">
      <span class="material-icons-round">person</span>
      <span>Profile</span>
    </button>
  </nav>
`;

// ─── Component Builders ───────────────────────────────────────
function buildMacroRow(name: string, current: number, goal: number, color: string, meta: string) {
  return `
    <div class="macro-row">
      <div class="macro-dot" style="background:${color}"></div>
      <div class="macro-info">
        <div class="macro-name">${name}</div>
        <div class="macro-detail">${meta}</div>
      </div>
      <div class="macro-bar-track" style="max-width:80px">
        <div class="macro-bar-fill" style="width:${pct(current, goal)}%;background:${color}"></div>
      </div>
      <div class="macro-value">${current}g</div>
    </div>`;
}

function buildFoodItem(f: typeof FOODS[0], idx: number) {
  const bgColors = [
    'rgba(230,57,70,0.08)', 'rgba(255,140,66,0.08)', 'rgba(123,97,255,0.08)',
    'rgba(52,152,219,0.08)', 'rgba(46,204,113,0.08)', 'rgba(230,57,70,0.08)',
    'rgba(255,140,66,0.08)', 'rgba(123,97,255,0.08)',
  ];
  return `
    <div class="food-item animate-in delay-${Math.min(idx + 3, 6)}">
      <div class="food-icon" style="background:${bgColors[idx % bgColors.length]}">${f.icon}</div>
      <div class="food-details">
        <div class="food-name">${f.name}</div>
        <div class="food-meta">${f.portion} • P:${f.p}g C:${f.c}g F:${f.f}g</div>
      </div>
      <div class="food-cals">${f.cals} <span style="font-weight:400;font-size:.6875rem;color:var(--text-muted)">kcal</span></div>
    </div>`;
}

function buildExercise(e: typeof EXERCISES[0], idx: number) {
  return `
    <div class="exercise-card animate-in delay-${Math.min(idx + 2, 6)}">
      <div class="exercise-header">
        <div>
          <div class="exercise-name">${e.name}</div>
          <div class="exercise-muscle">${e.muscle}</div>
        </div>
        ${e.hasPR ? '<span class="pr-badge">🏆 PR</span>' : ''}
      </div>
      <div class="set-table">
        <div class="set-table-header">
          <span>Set</span><span>Weight</span><span>Reps</span><span>RPE</span><span></span>
        </div>
        ${e.sets.map((s, si) => `
          <div class="set-row">
            <div class="set-num">${si + 1}</div>
            <div class="set-value">${s.weight}<span class="set-unit"> kg</span></div>
            <div class="set-value">${s.reps}</div>
            <div class="set-value">${s.rpe}</div>
            <div class="set-check ${s.done ? '' : 'style="opacity:.3"'}">
              <span class="material-icons-round">${s.done ? 'check' : 'remove'}</span>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="add-set-btn">
        <span class="material-icons-round" style="font-size:18px">add</span>
        Add Set
      </button>
    </div>`;
}

// ─── Navigation ───────────────────────────────────────────────
const navItems = document.querySelectorAll<HTMLButtonElement>('.nav-item');
const screens = document.querySelectorAll<HTMLElement>('.screen');
const fab = document.getElementById('fab-food');

let chartsInitialized: Record<string, boolean> = {};

function switchScreen(screenId: string) {
  screens.forEach(s => s.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));

  const target = document.getElementById(`screen-${screenId}`);
  const navBtn = document.querySelector<HTMLButtonElement>(`.nav-item[data-screen="${screenId}"]`);

  if (target) target.classList.add('active');
  if (navBtn) navBtn.classList.add('active');

  // Show/hide FAB
  if (fab) fab.style.display = screenId === 'food' ? 'flex' : 'none';

  // Lazy init charts
  requestAnimationFrame(() => {
    if (screenId === 'home' && !chartsInitialized['home']) {
      initHomeCharts();
      chartsInitialized['home'] = true;
    }
    if (screenId === 'progress' && !chartsInitialized['progress']) {
      initProgressCharts();
      chartsInitialized['progress'] = true;
    }
  });
}

navItems.forEach(btn => {
  btn.addEventListener('click', () => {
    const screen = btn.dataset.screen;
    if (screen) switchScreen(screen);
  });
});

// ─── Food Search ──────────────────────────────────────────────
const foodSearch = document.getElementById('food-search') as HTMLInputElement;
const foodList = document.getElementById('food-list')!;

foodSearch?.addEventListener('input', () => {
  const q = foodSearch.value.toLowerCase().trim();
  const filtered = q ? FOODS.filter(f => f.name.toLowerCase().includes(q)) : FOODS;
  foodList.innerHTML = filtered.map((f, i) => buildFoodItem(f, i)).join('');
});

// ─── Charts ───────────────────────────────────────────────────
declare const Chart: any;

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(29,27,28,0.9)',
      titleFont: { family: 'Inter', size: 12, weight: '600' as any },
      bodyFont: { family: 'Manrope', size: 14, weight: '700' as any },
      padding: 10,
      cornerRadius: 10,
      displayColors: false,
    },
  },
};

function initHomeCharts() {
  const ctx = (document.getElementById('chart-weight-7d') as HTMLCanvasElement)?.getContext('2d');
  if (!ctx) return;

  const gradient = ctx.createLinearGradient(0, 0, 0, 160);
  gradient.addColorStop(0, 'rgba(230,57,70,0.15)');
  gradient.addColorStop(1, 'rgba(230,57,70,0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: WEIGHT_LABELS_7D,
      datasets: [{
        data: WEIGHT_DATA_7D,
        borderColor: '#E63946',
        borderWidth: 2.5,
        backgroundColor: gradient,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#E63946',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      }],
    },
    options: {
      ...chartDefaults,
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Inter', size: 11 }, color: '#8E6F71' },
          border: { display: false },
        },
        y: {
          grid: { color: 'rgba(226,190,192,0.15)' },
          ticks: {
            font: { family: 'Manrope', size: 11, weight: '600' as any },
            color: '#8E6F71',
            callback: (v: number) => v + ' kg',
          },
          border: { display: false },
        },
      },
    },
  });
}

function initProgressCharts() {
  // 30-day weight
  const ctx30 = (document.getElementById('chart-weight-30d') as HTMLCanvasElement)?.getContext('2d');
  if (ctx30) {
    const g = ctx30.createLinearGradient(0, 0, 0, 200);
    g.addColorStop(0, 'rgba(230,57,70,0.12)');
    g.addColorStop(1, 'rgba(230,57,70,0)');

    new Chart(ctx30, {
      type: 'line',
      data: {
        labels: WEIGHT_DATA_30D.map((_, i) => i + 1),
        datasets: [{
          data: WEIGHT_DATA_30D,
          borderColor: '#E63946',
          borderWidth: 2,
          backgroundColor: g,
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#E63946',
        }],
      },
      options: {
        ...chartDefaults,
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Inter', size: 10 }, color: '#8E6F71', maxTicksLimit: 7 },
            border: { display: false },
          },
          y: {
            grid: { color: 'rgba(226,190,192,0.12)' },
            ticks: { font: { family: 'Manrope', size: 11, weight: '600' as any }, color: '#8E6F71', callback: (v: number) => v + ' kg' },
            border: { display: false },
          },
        },
      },
    });
  }

  // Macro Pie
  const ctxPie = (document.getElementById('chart-macro-pie') as HTMLCanvasElement)?.getContext('2d');
  if (ctxPie) {
    new Chart(ctxPie, {
      type: 'doughnut',
      data: {
        labels: ['Protein', 'Carbs', 'Fats'],
        datasets: [{
          data: [USER.protein.current * 4, USER.carbs.current * 4, USER.fats.current * 9],
          backgroundColor: ['#E63946', '#FF8C42', '#7B61FF'],
          borderWidth: 0,
          hoverOffset: 8,
        }],
      },
      options: {
        ...chartDefaults,
        cutout: '68%',
        plugins: {
          ...chartDefaults.plugins,
          legend: {
            display: true,
            position: 'right' as const,
            labels: {
              font: { family: 'Inter', size: 12, weight: '500' as any },
              color: '#1D1B1C',
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 10,
            },
          },
        },
      },
    });
  }

  // Energy comparison
  const ctxEnergy = (document.getElementById('chart-energy') as HTMLCanvasElement)?.getContext('2d');
  if (ctxEnergy) {
    const intakeData = [2350, 2400, 2200, 2500, 2380, 2420, 2300];
    const expendData = [2700, 2850, 2600, 2900, 2750, 2800, 2650];

    new Chart(ctxEnergy, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Intake',
            data: intakeData,
            backgroundColor: 'rgba(230,57,70,0.7)',
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
          },
          {
            label: 'Expenditure',
            data: expendData,
            backgroundColor: 'rgba(123,97,255,0.5)',
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
          },
        ],
      },
      options: {
        ...chartDefaults,
        plugins: {
          ...chartDefaults.plugins,
          legend: {
            display: true,
            position: 'top' as const,
            align: 'end' as const,
            labels: {
              font: { family: 'Inter', size: 11, weight: '500' as any },
              color: '#8E6F71',
              padding: 12,
              usePointStyle: true,
              pointStyleWidth: 8,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Inter', size: 11 }, color: '#8E6F71' },
            border: { display: false },
          },
          y: {
            grid: { color: 'rgba(226,190,192,0.12)' },
            ticks: { font: { family: 'Manrope', size: 11, weight: '600' as any }, color: '#8E6F71' },
            border: { display: false },
          },
        },
      },
    });
  }
}

// ─── Init ─────────────────────────────────────────────────────
if (fab) fab.style.display = 'none'; // hide on initial load (home)
requestAnimationFrame(() => {
  initHomeCharts();
  chartsInitialized['home'] = true;
});
