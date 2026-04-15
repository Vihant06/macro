import React, { useState, useEffect } from 'react';
import { weightService, macroService } from '../services/macroService';

export default function Progress() {
  const [trend, setTrend] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendData, weeklyData] = await Promise.allSettled([
          weightService.getTrend(30),
          macroService.getWeeklySummary(),
        ]);
        if (trendData.status === 'fulfilled') setTrend(trendData.value);
        if (weeklyData.status === 'fulfilled') setWeekly(weeklyData.value);
      } catch (err) {
        console.error('Progress fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', border: '3px solid var(--outline-variant)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <p className="font-inter mt-4" style={{ color: '#71717a', fontSize: '0.875rem' }}>Loading analytics...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const weightChange = trend?.change ?? 0;
  const trendLabel = trend?.trend || 'stable';
  const dataPoints = trend?.dataPoints || 0;

  // Build SVG path
  const history = trend?.history || [];
  let trendPath = 'M0 50 L400 50';
  if (history.length >= 2) {
    const weights = history.map(h => h.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const range = max - min || 1;
    const points = weights.map((w, i) => {
      const x = (i / (weights.length - 1)) * 400;
      const y = 95 - ((w - min) / range) * 80;
      return `${x} ${y}`;
    });
    trendPath = `M${points[0]} ` + points.slice(1).map(p => `L${p}`).join(' ');
  }

  const avgCalories = weekly?.dailyAverages?.calories || 0;
  const goalCalories = weekly?.goals?.calories || 2000;
  const deficit = goalCalories - avgCalories;
  const daysTracked = weekly?.daysTracked || 0;
  const adherence = daysTracked > 0 ? Math.round((daysTracked / 7) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div className="flex justify-between items-end">
        <h1 className="font-manrope font-bold text-3xl" style={{ letterSpacing: '-0.025em' }}>Analytics</h1>
        <span className="font-bold" style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.1)', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
          Last 30 Days
        </span>
      </div>

      {/* Weight Trend Card */}
      <div className="glass-card rounded-custom shadow-premium" style={{ padding: '1.5rem' }}>
        <h2 className="font-inter font-bold" style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717a' }}>Weight Trend</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <h3 className="font-manrope font-bold text-4xl" style={{ letterSpacing: '-0.025em', color: weightChange <= 0 ? '#059669' : 'var(--primary)' }}>
              {weightChange > 0 ? '+' : ''}{weightChange}<span style={{ fontSize: '1.25rem', color: '#a1a1aa' }}>kg</span>
            </h3>
            <p className="font-inter text-xs mt-1" style={{ color: '#71717a' }}>
              {dataPoints > 0 ? `${dataPoints} data points • ${trendLabel}` : 'No weight data recorded yet'}
            </p>
          </div>
        </div>
        
        <div style={{ marginTop: '2rem', height: '12rem', width: '100%', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '10rem', background: 'linear-gradient(to top, rgba(183,16,42,0.1), transparent)', borderRadius: '0.5rem' }}>
            <svg style={{ width: '100%', height: '100%', overflow: 'visible' }} viewBox="0 0 400 100" preserveAspectRatio="none">
              <path d={trendPath} fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="glass-card rounded-custom shadow-premium" style={{ padding: '1.5rem' }}>
          <span className="material-symbols-outlined mb-2" style={{ color: 'var(--secondary)' }}>local_fire_department</span>
          <p className="font-inter font-bold" style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717a' }}>Avg. Daily Intake</p>
          <p className="font-manrope font-bold text-2xl mt-1">{avgCalories.toLocaleString()} kcal</p>
          {deficit > 0 && <p className="font-inter mt-1" style={{ fontSize: '0.75rem', color: '#059669' }}>~{deficit} kcal deficit</p>}
        </div>
        <div className="glass-card rounded-custom shadow-premium" style={{ padding: '1.5rem' }}>
          <span className="material-symbols-outlined mb-2" style={{ color: '#059669' }}>check_circle</span>
          <p className="font-inter font-bold" style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717a' }}>Tracking Adherence</p>
          <p className="font-manrope font-bold text-2xl mt-1">{adherence}%</p>
          <p className="font-inter mt-1" style={{ fontSize: '0.75rem', color: '#71717a' }}>{daysTracked}/7 days tracked</p>
        </div>
      </div>

      {/* Weekly Macro Averages */}
      {weekly && (
        <div className="glass-card rounded-custom shadow-premium" style={{ padding: '1.5rem' }}>
          <h2 className="font-inter font-bold mb-4" style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717a' }}>Weekly Macro Averages</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { label: 'Protein', value: weekly.dailyAverages.protein, goal: weekly.goals.protein, color: '#e11d48' },
              { label: 'Carbs', value: weekly.dailyAverages.carbs, goal: weekly.goals.carbs, color: '#d97706' },
              { label: 'Fat', value: weekly.dailyAverages.fat, goal: weekly.goals.fat, color: '#2563eb' },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <p className="font-inter font-bold" style={{ fontSize: '0.625rem', textTransform: 'uppercase', color: '#a1a1aa', marginBottom: '0.5rem' }}>{m.label}</p>
                <p className="font-manrope font-bold text-xl">{m.value}g</p>
                <div style={{ height: '0.25rem', width: '100%', background: 'rgba(231,225,226,0.4)', borderRadius: '9999px', marginTop: '0.5rem' }}>
                  <div style={{ height: '100%', background: m.color, width: `${Math.min((m.value / m.goal) * 100, 100)}%`, borderRadius: '9999px' }} />
                </div>
                <p className="font-inter" style={{ fontSize: '0.625rem', color: '#a1a1aa', marginTop: '0.25rem' }}>/ {m.goal}g</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
