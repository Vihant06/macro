import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/macroService';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [goals, setGoals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingGoals, setEditingGoals] = useState(false);
  const [editingStats, setEditingStats] = useState(false);
  const [goalForm, setGoalForm] = useState({});
  const [statsForm, setStatsForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileData, goalsData] = await Promise.allSettled([
          userService.getProfile(),
          userService.getGoals(),
        ]);
        if (profileData.status === 'fulfilled') {
          setProfile(profileData.value);
          setStatsForm({
            age: profileData.value.age || '',
            height: profileData.value.height || '',
            weight: profileData.value.weight || '',
            bodyFat: profileData.value.bodyFat || '',
            activityLevel: profileData.value.activityLevel || 'sedentary',
            goal: profileData.value.goal || 'maintain',
          });
        }
        if (goalsData.status === 'fulfilled') {
          setGoals(goalsData.value);
          setGoalForm(goalsData.value);
        }
      } catch (err) {
        console.error('Profile error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveGoals = async () => {
    setSaving(true);
    try {
      const updated = await userService.updateGoals({
        dailyCalories: Number(goalForm.dailyCalories),
        proteinGrams: Number(goalForm.proteinGrams),
        carbsGrams: Number(goalForm.carbsGrams),
        fatGrams: Number(goalForm.fatGrams),
      });
      setGoals(updated);
      setEditingGoals(false);
    } catch (err) {
      console.error('Save goals error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCalculateMacros = async () => {
    setSaving(true);
    try {
      const activityMap = {
        'sedentary': 1,
        'lightly_active': 2,
        'moderately_active': 3,
        'very_active': 4,
        'extremely_active': 5
      };
      
      const goalMap = {
        'lose_weight': -1,
        'maintain': 0,
        'gain_muscle': 1
      };

      const result = await userService.calculateGoals({
        age: Number(statsForm.age),
        weight: Number(statsForm.weight),
        height: Number(statsForm.height),
        bodyFat: Number(statsForm.bodyFat),
        activityLevel: activityMap[statsForm.activityLevel] || 1,
        goal: goalMap[statsForm.goal] || 0
      });
      
      // Update both profile and goals from the backend recalculation
      const [updatedProfile, updatedGoals] = await Promise.all([
        userService.getProfile(),
        userService.getGoals(),
      ]);
      
      setProfile(updatedProfile);
      setGoals(updatedGoals);
      setGoalForm(updatedGoals);
      setEditingStats(false);
    } catch (err) {
      console.error('Calculate macros error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', border: '3px solid var(--outline-variant)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <p className="font-inter mt-4" style={{ color: '#71717a', fontSize: '0.875rem' }}>Loading profile...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const userName = profile?.name || user?.name || 'User';
  const userEmail = profile?.email || user?.email || '';

  const inputStyle = { padding: '0.75rem 0.875rem', border: '1px solid var(--outline-variant)', borderRadius: '0.75rem', outline: 'none', background: 'rgba(255,255,255,0.6)', fontSize: '0.9375rem', width: '100%' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Profile Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
        <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', border: '3px solid var(--primary)', background: 'linear-gradient(135deg, var(--primary), var(--primary-container))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '2rem', color: 'white', fontWeight: 700 }}>{userName.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <h1 className="font-manrope font-bold text-2xl" style={{ letterSpacing: '-0.025em' }}>{userName}</h1>
          <p className="font-inter" style={{ fontSize: '0.875rem', color: '#71717a' }}>{userEmail}</p>
        </div>
      </div>

      {/* Macro Calculator & Stats */}
      <div className="glass-card rounded-custom shadow-premium" style={{ padding: '1.5rem' }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-manrope font-bold text-lg" style={{ color: 'var(--primary)' }}>Macro Calculator</h2>
            <p className="font-inter" style={{ fontSize: '0.75rem', color: '#71717a' }}>Update your stats to recalculate your targets</p>
          </div>
          <button 
            onClick={handleCalculateMacros}
            style={{ 
              background: 'var(--primary)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.75rem', 
              padding: '0.5rem 1rem', 
              cursor: 'pointer', 
              fontWeight: 600, 
              fontSize: '0.875rem',
              opacity: saving ? 0.7 : 1,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 12px rgba(var(--primary-rgb), 0.2)'
            }}
            disabled={saving}
          >
            {saving ? 'Recalculating...' : 'Recalculate Macros'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label className="font-inter font-semibold" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', display: 'block', marginBottom: '0.375rem' }}>Age</label>
            <input 
              type="number" 
              style={inputStyle}
              value={statsForm.age || ''} 
              onChange={(e) => setStatsForm(f => ({ ...f, age: e.target.value }))}
              placeholder="e.g. 25"
            />
          </div>
          <div>
            <label className="font-inter font-semibold" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', display: 'block', marginBottom: '0.375rem' }}>Height (cm)</label>
            <input 
              type="number" 
              style={inputStyle}
              value={statsForm.height || ''} 
              onChange={(e) => setStatsForm(f => ({ ...f, height: e.target.value }))}
              placeholder="e.g. 175"
            />
          </div>
          <div>
            <label className="font-inter font-semibold" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', display: 'block', marginBottom: '0.375rem' }}>Weight (kg)</label>
            <input 
              type="number" 
              style={inputStyle}
              value={statsForm.weight || ''} 
              onChange={(e) => setStatsForm(f => ({ ...f, weight: e.target.value }))}
              placeholder="e.g. 75"
            />
          </div>
          <div>
            <label className="font-inter font-semibold" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', display: 'block', marginBottom: '0.375rem' }}>Body Fat %</label>
            <input 
              type="number" 
              style={inputStyle}
              value={statsForm.bodyFat || ''} 
              onChange={(e) => setStatsForm(f => ({ ...f, bodyFat: e.target.value }))}
              placeholder="Optional"
            />
          </div>
          
          <div style={{ gridColumn: 'span 2' }}>
            <label className="font-inter font-semibold" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', display: 'block', marginBottom: '0.375rem' }}>Activity Level</label>
            <select 
              style={{ ...inputStyle, appearance: 'auto' }}
              value={statsForm.activityLevel || 'sedentary'}
              onChange={(e) => setStatsForm(f => ({ ...f, activityLevel: e.target.value }))}
            >
              <option value="sedentary">Poor / Sedentary (Office, little exercise)</option>
              <option value="lightly_active">Lightly Active (1-3 days/week exercise)</option>
              <option value="moderately_active">Moderately Active (3-5 days/week exercise)</option>
              <option value="very_active">Active (6-7 days/week exercise)</option>
              <option value="extremely_active">Extreme (Physical job & heavy training)</option>
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label className="font-inter font-semibold" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', display: 'block', marginBottom: '0.375rem' }}>Goal</label>
            <select 
              style={{ ...inputStyle, appearance: 'auto' }}
              value={statsForm.goal || 'maintain'}
              onChange={(e) => setStatsForm(f => ({ ...f, goal: e.target.value }))}
            >
              <option value="lose_weight">Lose Weight (-500 kcal)</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain_muscle">Gain Muscle (+300 kcal)</option>
            </select>
          </div>
        </div>
      </div>


      {/* Macro Targets Section */}
      <div className="glass-card rounded-custom shadow-premium" style={{ padding: '1.5rem', background: 'linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.4))' }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-manrope font-bold text-lg">Daily Macro Targets</h2>
            <p className="font-inter" style={{ fontSize: '0.75rem', color: '#71717a' }}>Your customized blueprint for success</p>
          </div>
          <button 
            onClick={() => editingGoals ? handleSaveGoals() : setEditingGoals(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}
            disabled={saving}
          >
            {saving ? 'Saving...' : editingGoals ? 'Save Manual' : 'Override Manual'}
          </button>
        </div>

        {editingGoals ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { key: 'dailyCalories', label: 'Calories', unit: 'kcal' },
              { key: 'proteinGrams', label: 'Protein', unit: 'g' },
              { key: 'carbsGrams', label: 'Carbs', unit: 'g' },
              { key: 'fatGrams', label: 'Fat', unit: 'g' },
            ].map(field => (
              <div key={field.key}>
                <label className="font-inter font-semibold" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#71717a', display: 'block', marginBottom: '0.375rem' }}>{field.label} ({field.unit})</label>
                <input 
                  type="number" 
                  style={inputStyle}
                  value={goalForm[field.key] || ''} 
                  onChange={(e) => setGoalForm(f => ({ ...f, [field.key]: e.target.value }))}
                />
              </div>
            ))}
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem' }}>
              <button onClick={() => setEditingGoals(false)} style={{ flex: 1, background: 'none', border: '1px solid var(--outline-variant)', borderRadius: '0.75rem', padding: '0.75rem', cursor: 'pointer', color: '#71717a' }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
            {[
              { label: 'Calories', value: goals?.dailyCalories || 2000, unit: 'kcal', color: 'var(--primary)', icon: 'local_fire_department' },
              { label: 'Protein', value: goals?.proteinGrams || 150, unit: 'g', color: '#e11d48', icon: 'egg' },
              { label: 'Carbs', value: goals?.carbsGrams || 225, unit: 'g', color: '#d97706', icon: 'bakery_dining' },
              { label: 'Fat', value: goals?.fatGrams || 65, unit: 'g', color: '#2563eb', icon: 'oil_barrel' },
            ].map(g => (
              <div key={g.label} style={{ 
                padding: '1.25rem', 
                background: 'white', 
                borderRadius: '1rem', 
                border: '1px solid rgba(0,0,0,0.03)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ 
                  width: '2.5rem', height: '2.5rem', borderRadius: '50%', 
                  background: `${g.color}15`, color: g.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>{g.icon}</span>
                </div>
                <div>
                  <p className="font-inter" style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', fontWeight: 600 }}>{g.label}</p>
                  <p className="font-manrope font-bold text-xl" style={{ color: g.color }}>{g.value} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#a1a1aa' }}>{g.unit}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className="glass-card rounded-custom shadow-premium" style={{ padding: '0.5rem 0' }}>
        {[
          { label: 'Sync Wearables', icon: 'watch' },
          { label: 'Notifications', icon: 'notifications' },
          { label: 'Data Export', icon: 'download' },
        ].map((item, idx) => (
          <div key={idx} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.5rem', borderBottom: idx !== 2 ? '1px solid rgba(0,0,0,0.05)' : 'none',
            cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="material-symbols-outlined" style={{ color: '#71717a' }}>{item.icon}</span>
              <span className="font-inter font-medium text-base">{item.label}</span>
            </div>
            <span className="material-symbols-outlined" style={{ color: '#d4d4d8' }}>chevron_right</span>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="glass-card rounded-custom shadow-premium" style={{ padding: '0.5rem 0' }}>
        <div 
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            padding: '1rem 1.5rem', cursor: 'pointer'
          }}
        >
          <span className="material-symbols-outlined text-rose-600">logout</span>
          <span className="font-inter font-medium text-base text-rose-600">Log Out</span>
        </div>
      </div>
    </div>
  );
}
