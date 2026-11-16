import React, { useState, useEffect, useMemo } from 'react';
import { macroService, weightService } from '../services/macroService';
import { useNavigate } from 'react-router-dom';
import { useDate } from '../context/DateContext';

const LOCAL_WEIGHTS_KEY = 'macro.weightLogs';

const getStoredWeights = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_WEIGHTS_KEY) || '[]');
  } catch {
    return [];
  }
};

const storeWeightLog = (weight, date) => {
  const existing = getStoredWeights().filter(w => w.date !== date);
  const updated = [...existing, { date, weight: parseFloat(weight) }].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  localStorage.setItem(LOCAL_WEIGHTS_KEY, JSON.stringify(updated));
  return updated;
};

export default function Dashboard() {
  const [macros, setMacros] = useState(null);
  const [weightTrend, setWeightTrend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingWeight, setIsLoggingWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const navigate = useNavigate();
  const { selectedDate } = useDate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [macroData, weightData] = await Promise.allSettled([
          macroService.getTodayTotals(selectedDate),
          weightService.getTrend(30),
        ]);
        
        if (macroData.status === 'fulfilled') setMacros(macroData.value);
        
        let wt = null;
        if (weightData.status === 'fulfilled' && weightData.value && weightData.value.history?.length > 0) {
          wt = weightData.value;
        } else {
          // Check local stored weights fallback
          const localLogs = getStoredWeights();
          if (localLogs.length > 0) {
            const weights = localLogs.map(l => l.weight);
            const current = weights[weights.length - 1];
            const start = weights[0];
            const change = Math.round((current - start) * 10) / 10;
            wt = {
              currentWeight: current,
              change,
              trend: change < -0.3 ? 'losing' : change > 0.3 ? 'gaining' : 'stable',
              history: localLogs,
              dataPoints: localLogs.length
            };
          }
        }
        setWeightTrend(wt);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate]);

  const handleLogWeight = async () => {
    if (!newWeight) return;
    const val = parseFloat(newWeight);
    if (isNaN(val)) return;

    // Optimistically store locally
    const updatedLocal = storeWeightLog(val, selectedDate);
    const weights = updatedLocal.map(l => l.weight);
    const current = weights[weights.length - 1];
    const start = weights[0];
    const change = Math.round((current - start) * 10) / 10;
    const optimisticTrend = {
      currentWeight: current,
      change,
      trend: change < -0.3 ? 'losing' : change > 0.3 ? 'gaining' : 'stable',
      history: updatedLocal,
      dataPoints: updatedLocal.length
    };
    setWeightTrend(optimisticTrend);
    setIsLoggingWeight(false);
    setNewWeight('');

    // Sync to backend if available
    try {
      await weightService.logWeight(val, selectedDate, null, '');
      const serverData = await weightService.getTrend(30);
      if (serverData && serverData.history?.length > 0) {
        setWeightTrend(serverData);
      }
    } catch (err) {
      console.warn('Backend weight log sync note:', err);
    }
  };

  // Weight data & SVG geometry hooks (MUST be defined before any conditional return)
  const weightHistory = weightTrend?.history || [];

  const chartPoints = useMemo(() => {
    if (!weightHistory || weightHistory.length === 0) return [];
    if (weightHistory.length === 1) {
      return [{
        x: 200,
        y: 50,
        weight: weightHistory[0].weight,
        date: weightHistory[0].date
      }];
    }
    const weights = weightHistory.map(h => h.weight);
    let min = Math.min(...weights);
    let max = Math.max(...weights);
    if (min === max) {
      min -= 1;
      max += 1;
    }
    const range = max - min || 1;
    return weightHistory.map((h, i) => {
      const x = 20 + (i / (weightHistory.length - 1)) * 360;
      const y = 80 - ((h.weight - min) / range) * 60;
      return { x, y, weight: h.weight, date: h.date };
    });
  }, [weightHistory]);

  const { linePath, areaPath } = useMemo(() => {
    if (chartPoints.length < 2) return { linePath: '', areaPath: '' };
    let d = `M ${chartPoints[0].x} ${chartPoints[0].y}`;
    for (let i = 0; i < chartPoints.length - 1; i++) {
      const p0 = chartPoints[i];
      const p1 = chartPoints[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    const firstX = chartPoints[0].x;
    const lastX = chartPoints[chartPoints.length - 1].x;
    const area = `${d} L ${lastX} 100 L ${firstX} 100 Z`;
    return { linePath: d, areaPath: area };
  }, [chartPoints]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', border: '3px solid var(--outline-variant)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <p className="font-inter mt-4" style={{ color: '#71717a', fontSize: '0.875rem' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Defaults when there's no data yet (new user)
  const goals = macros?.goals || { calories: 2000, protein: 150, carbs: 225, fat: 65 };
  const consumed = macros?.consumed || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const remaining = macros?.remaining || goals;
  const pct = macros?.percentComplete || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const kcalLeft = Math.max(remaining.calories, 0);
  const progressPercent = Math.min(pct.calories, 100);
  const dashOffset = 628 - (628 * progressPercent) / 100;

  // Weight metrics
  const currentWeight = weightTrend?.currentWeight ?? '--';
  const weightChange = weightTrend?.change ?? 0;
  const trend = weightTrend?.trend || 'stable';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Daily Summary Ring */}
        <div className="md:col-span-5 glass-card rounded-custom shadow-premium relative overflow-hidden" style={{ padding: '2rem' }}>
          <div className="flex flex-col items-center justify-center" style={{ gap: '1.5rem' }}>
            <div style={{ position: 'relative', width: '14rem', height: '14rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ position: 'absolute', width: '100%', height: '100%', transform: 'rotate(-90deg)', overflow: 'visible' }}>
                <circle cx="112" cy="112" r="100" fill="transparent" stroke="var(--surface-container-highest)" strokeWidth="12" opacity="0.4" />
                <circle cx="112" cy="112" r="100" fill="transparent" stroke="var(--primary)" strokeDasharray="628" strokeDashoffset={dashOffset} strokeLinecap="round" strokeWidth="12" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
              </svg>
              <div style={{ textAlign: 'center' }}>
                <p className="font-manrope font-bold" style={{ fontSize: '3rem', lineHeight: 1, letterSpacing: '-0.025em' }}>{kcalLeft.toLocaleString()}</p>
                <p className="font-inter" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: '#71717a', marginTop: '0.25rem' }}>kcal left</p>
              </div>
            </div>
            
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="flex justify-between" style={{ alignItems: 'flex-end' }}>
                <h2 className="font-manrope font-semibold" style={{ fontSize: '1.125rem' }}>Daily Goal</h2>
                <span className="font-inter font-bold" style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{goals.calories.toLocaleString()} KCAL</span>
              </div>
              <div style={{ height: '0.375rem', width: '100%', background: 'rgba(231,225,226,0.4)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--primary)', width: `${progressPercent}%`, borderRadius: '9999px', boxShadow: '0 0 8px rgba(183,16,42,0.4)', transition: 'width 1s ease-out' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Side Stats Bento */}
        <div className="md:col-span-7 grid sm:grid-cols-2 gap-6">
          {/* Weight */}
          <div className="glass-card rounded-custom shadow-premium flex flex-col justify-between relative" style={{ padding: '1.5rem' }}>
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="font-inter font-bold" style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717a' }}>Current Weight</p>
                <button onClick={() => setIsLoggingWeight(!isLoggingWeight)} className="text-primary hover:bg-primary/10 rounded-full p-1 transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-[1rem]">{isLoggingWeight ? 'close' : 'edit'}</span>
                </button>
              </div>
              
              {!isLoggingWeight ? (
                <h3 className="font-manrope font-bold text-4xl" style={{ letterSpacing: '-0.025em' }}>
                  {currentWeight}<span style={{ fontSize: '1.125rem', fontWeight: 500, color: '#a1a1aa', marginLeft: '0.25rem' }}>kg</span>
                </h3>
              ) : (
                <div className="flex gap-2 items-center">
                  <input 
                    type="number" 
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder={currentWeight !== '--' ? currentWeight : '0.0'}
                    className="w-20 bg-surface border border-outline-variant rounded-xl px-2 py-1 text-2xl font-manrope font-bold focus:outline-none focus:border-primary text-on-surface"
                    step="0.1"
                    autoFocus
                  />
                  <span style={{ fontSize: '1.125rem', fontWeight: 500, color: '#a1a1aa' }}>kg</span>
                  <button 
                    onClick={handleLogWeight}
                    className="ml-auto bg-primary text-white p-2 rounded-xl hover:bg-primary/90 flex items-center justify-center transition-transform active:scale-95"
                    disabled={!newWeight}
                  >
                    <span className="material-symbols-outlined text-[1rem]">check</span>
                  </button>
                </div>
              )}
            </div>
            <div className="mt-6 flex items-center gap-1" style={{ color: weightChange < 0 ? '#10b981' : weightChange > 0 ? '#e11d48' : '#71717a' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>{weightChange < 0 ? 'trending_down' : weightChange > 0 ? 'trending_up' : 'horizontal_rule'}</span>
              <span className="font-semibold" style={{ fontSize: '0.75rem' }}>
                {weightChange < 0 ? `${Math.abs(weightChange)}kg reduced` : weightChange > 0 ? `${weightChange}kg gained` : '0kg changed'} this month
              </span>
            </div>
          </div>

          {/* Protein */}
          <div className="glass-card rounded-custom shadow-premium flex flex-col justify-between" style={{ padding: '1.5rem' }}>
            <div>
              <p className="font-inter font-bold mb-4" style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717a' }}>Protein Intake</p>
              <h3 className="font-manrope font-bold text-4xl" style={{ letterSpacing: '-0.025em' }}>
                {consumed.protein}<span style={{ fontSize: '1.125rem', fontWeight: 500, color: '#a1a1aa', marginLeft: '0.25rem' }}>g</span>
              </h3>
            </div>
            <div className="mt-6">
              <div style={{ height: '0.25rem', width: '100%', background: 'rgba(231,225,226,0.4)', borderRadius: '9999px' }}>
                <div style={{ height: '100%', background: 'var(--secondary)', width: `${Math.min(pct.protein, 100)}%`, borderRadius: '9999px', transition: 'width 0.8s ease-out' }} />
              </div>
              <p style={{ fontSize: '0.625rem', color: '#71717a', marginTop: '0.5rem' }}>Goal: {goals.protein}g</p>
            </div>
          </div>

          {/* Weight Trend Chart */}
          <div className="sm:col-span-2 glass-card rounded-custom shadow-premium flex flex-col justify-between relative" style={{ padding: '1.5rem', minHeight: '190px' }}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-inter font-bold" style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717a' }}>30-Day Trend</p>
                <p className="font-inter font-semibold" style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '2px' }}>
                  {weightHistory.length >= 2 
                    ? `${weightHistory.length} logs • ${weightHistory[0].weight}kg → ${weightHistory[weightHistory.length - 1].weight}kg`
                    : weightHistory.length === 1 
                      ? `1 log recorded (${weightHistory[0].weight}kg)` 
                      : 'No logs recorded yet'}
                </p>
              </div>
              <span className="font-bold flex items-center gap-1" style={{ 
                fontSize: '0.65rem', 
                background: trend === 'losing' ? 'rgba(16,185,129,0.15)' : trend === 'gaining' ? 'rgba(255,228,230,0.6)' : 'rgba(244,244,245,0.8)', 
                color: trend === 'losing' ? '#059669' : trend === 'gaining' ? '#e11d48' : '#71717a', 
                padding: '0.3rem 0.65rem', 
                borderRadius: '9999px',
                border: '1px solid rgba(0,0,0,0.04)'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>
                  {trend === 'losing' ? 'trending_down' : trend === 'gaining' ? 'trending_up' : 'horizontal_rule'}
                </span>
                {trend === 'losing' 
                  ? `LOSING (${Math.abs(weightChange)}kg)` 
                  : trend === 'gaining' 
                    ? `GAINING (+${weightChange}kg)` 
                    : weightHistory.length > 0 ? 'STABLE' : 'READY TO TRACK'}
              </span>
            </div>

            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div style={{
                position: 'absolute',
                top: '4.5rem',
                left: `${Math.min(Math.max((hoveredPoint.x / 400) * 100, 15), 85)}%`,
                transform: 'translateX(-50%)',
                background: 'rgba(24, 24, 27, 0.92)',
                color: 'white',
                padding: '0.3rem 0.6rem',
                borderRadius: '0.5rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                pointerEvents: 'none',
                zIndex: 20,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                whiteSpace: 'nowrap'
              }}>
                {hoveredPoint.weight} kg • {hoveredPoint.date}
              </div>
            )}

            {/* Chart Area */}
            <div style={{ position: 'relative', width: '100%', height: '6.5rem', marginTop: '0.5rem' }}>
              {weightHistory.length === 0 ? (
                /* Empty state when no logs */
                <div style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed rgba(0,0,0,0.1)',
                  borderRadius: '1rem',
                  background: 'rgba(255,255,255,0.4)',
                  padding: '1rem'
                }}>
                  <p className="font-inter font-medium text-xs text-zinc-500 mb-2">
                    Log your daily weight to visualize your 30-day trajectory
                  </p>
                  <button
                    onClick={() => setIsLoggingWeight(true)}
                    className="font-inter font-semibold text-xs text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Log Today's Weight
                  </button>
                </div>
              ) : weightHistory.length === 1 ? (
                /* Single entry state */
                <div style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '0 1rem',
                  position: 'relative'
                }}>
                  <div style={{ height: '2px', background: 'rgba(183,16,42,0.2)', width: '100%', position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      boxShadow: '0 0 0 4px rgba(183,16,42,0.2)'
                    }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-400 mt-4 font-semibold">
                    <span>{weightHistory[0].date} ({weightHistory[0].weight} kg)</span>
                    <span className="text-primary cursor-pointer hover:underline" onClick={() => setIsLoggingWeight(true)}>
                      + Log another day to build curve
                    </span>
                  </div>
                </div>
              ) : (
                /* Full Interactive Multi-point Curve */
                <svg
                  style={{ width: '100%', height: '100%', overflow: 'visible' }}
                  viewBox="0 0 400 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Gradient Area */}
                  {areaPath && (
                    <path d={areaPath} fill="url(#trendGradient)" />
                  )}

                  {/* Connecting Bezier Curve */}
                  {linePath && (
                    <path
                      d={linePath}
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Interactive Point Markers */}
                  {chartPoints.map((pt, idx) => {
                    const isHovered = hoveredPoint && hoveredPoint.date === pt.date;
                    return (
                      <g key={idx}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? 6 : 4}
                          fill="white"
                          stroke="var(--primary)"
                          strokeWidth={isHovered ? 3 : 2}
                          style={{ transition: 'all 0.15s ease', cursor: 'pointer' }}
                          onMouseEnter={() => setHoveredPoint(pt)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>

            {/* Bottom Axis Labels when data exists */}
            {weightHistory.length >= 2 && (
              <div className="flex justify-between text-[10px] text-zinc-400 font-semibold mt-2 px-1">
                <span>{weightHistory[0].date}</span>
                <span>{weightHistory[weightHistory.length - 1].date}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Macro Breakdown */}
      <div>
        <h2 className="font-manrope font-bold text-2xl mb-6" style={{ letterSpacing: '-0.025em' }}>Macro Balance</h2>
        <div className="macro-balance-grid">
          {[
            { label: 'Protein', grams: consumed.protein, goal: goals.protein, calsPerG: 4, icon: 'egg', iconColor: '#e11d48', bgColor: 'rgba(255,228,230,0.5)' },
            { label: 'Carbs', grams: consumed.carbs, goal: goals.carbs, calsPerG: 4, icon: 'bakery_dining', iconColor: '#d97706', bgColor: 'rgba(254,243,199,0.5)' },
            { label: 'Fats', grams: consumed.fat, goal: goals.fat, calsPerG: 9, icon: 'opacity', iconColor: '#2563eb', bgColor: 'rgba(219,234,254,0.5)' },
          ].map((macro) => {
            const cals = macro.grams * macro.calsPerG;
            const totalCals = consumed.calories || 1;
            const pctOfTotal = Math.round((cals / totalCals) * 100) || 0;
            return (
              <div key={macro.label} className="glass-card shadow-premium" style={{ padding: '1.5rem', borderRadius: '1rem', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div className="flex items-center gap-3 mb-4">
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: macro.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: macro.iconColor }}>{macro.icon}</span>
                  </div>
                  <p className="font-semibold text-base">{macro.label}</p>
                </div>
                <p className="font-manrope font-bold text-2xl">{macro.grams}g <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#a1a1aa' }}>/ {macro.goal}g</span></p>
                <div style={{ height: '0.25rem', width: '100%', background: 'rgba(231,225,226,0.4)', borderRadius: '9999px', marginTop: '0.75rem' }}>
                  <div style={{ height: '100%', background: macro.iconColor, width: `${Math.min((macro.grams / macro.goal) * 100, 100)}%`, borderRadius: '9999px', transition: 'width 0.8s ease-out' }} />
                </div>
                <p className="font-inter mt-1" style={{ fontSize: '0.75rem', color: '#71717a' }}>{cals} kcal • {pctOfTotal}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meal CTA */}
      <div className="glass-card rounded-custom shadow-premium flex flex-col md:flex-row items-center justify-between gap-6" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.6)' }}>
        <div style={{ textAlign: 'left', flex: 1 }}>
          <h3 className="font-manrope font-bold text-xl" style={{ letterSpacing: '-0.025em' }}>
            {consumed.calories === 0 ? 'Start tracking today!' : `Log your next meal?`}
          </h3>
          <p className="font-inter mt-1" style={{ fontSize: '0.875rem', color: '#71717a' }}>
            {consumed.calories === 0 ? 'Add your first food entry to get started.' : `You're ${kcalLeft.toLocaleString()} kcal behind your daily target.`}
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/food')}>
          Open Food Diary
        </button>
      </div>
    </div>
  );
}
