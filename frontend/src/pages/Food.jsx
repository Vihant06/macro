import React, { useState, useEffect, useCallback } from 'react';
import { foodService, macroService } from '../services/macroService';

import { useDate } from '../context/DateContext';

const MEAL_ICONS = {
  breakfast: 'free_breakfast',
  lunch: 'lunch_dining',
  dinner: 'dinner_dining',
  snack: 'cookie',
};

const MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snack'];

function AddFoodModal({ mealType, selectedDate, onClose, onSaved }) {
  const [form, setForm] = useState({
    foodName: '', servingSize: '', calories: '', protein: '', carbs: '', fat: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      // Use the context's selected date, defaulting to noon to avoid timezone shift on the day
      const targetDate = new Date(`${selectedDate}T12:00:00Z`);
      await foodService.createEntry({
        foodName: form.foodName,
        mealType,
        date: targetDate.toISOString(),
        servingSize: Number(form.servingSize),
        calories: Number(form.calories),
        protein: Number(form.protein),
        carbs: Number(form.carbs),
        fat: Number(form.fat),
      });
      onSaved();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : (msg || 'Failed to save entry'));
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { padding: '0.75rem 0.875rem', border: '1px solid var(--outline-variant)', borderRadius: '0.75rem', outline: 'none', background: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', width: '100%' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div className="glass-card shadow-premium" style={{ width: '100%', maxWidth: '32rem', borderRadius: '1.5rem 1.5rem 0 0', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-manrope font-bold text-xl" style={{ textTransform: 'capitalize' }}>Add {mealType}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ color: '#71717a' }}>close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="font-inter font-semibold" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#71717a', display: 'block', marginBottom: '0.375rem' }}>Food Name</label>
            <input style={inputStyle} placeholder="e.g. Chicken Breast" value={form.foodName} onChange={e => setForm(f => ({ ...f, foodName: e.target.value }))} required />
          </div>
          
          <div>
            <label className="font-inter font-semibold" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#71717a', display: 'block', marginBottom: '0.375rem' }}>Serving Size (g)</label>
            <input type="number" style={inputStyle} placeholder="150" value={form.servingSize} onChange={e => setForm(f => ({ ...f, servingSize: e.target.value }))} required min="0" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="font-inter font-semibold" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#71717a', display: 'block', marginBottom: '0.375rem' }}>Calories</label>
              <input type="number" style={inputStyle} placeholder="250" value={form.calories} onChange={e => setForm(f => ({ ...f, calories: e.target.value }))} required min="0" />
            </div>
            <div>
              <label className="font-inter font-semibold" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#71717a', display: 'block', marginBottom: '0.375rem' }}>Protein (g)</label>
              <input type="number" style={inputStyle} placeholder="30" value={form.protein} onChange={e => setForm(f => ({ ...f, protein: e.target.value }))} required min="0" />
            </div>
            <div>
              <label className="font-inter font-semibold" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#71717a', display: 'block', marginBottom: '0.375rem' }}>Carbs (g)</label>
              <input type="number" style={inputStyle} placeholder="20" value={form.carbs} onChange={e => setForm(f => ({ ...f, carbs: e.target.value }))} required min="0" />
            </div>
            <div>
              <label className="font-inter font-semibold" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#71717a', display: 'block', marginBottom: '0.375rem' }}>Fat (g)</label>
              <input type="number" style={inputStyle} placeholder="10" value={form.fat} onChange={e => setForm(f => ({ ...f, fat: e.target.value }))} required min="0" />
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.2)', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}>
              <p className="font-inter" style={{ color: 'var(--error)', fontSize: '0.8125rem' }}>{error}</p>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={saving} style={{ width: '100%', padding: '0.875rem', marginTop: '0.5rem', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving...' : 'Add Entry'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Food() {
  const [entries, setEntries] = useState([]);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingMeal, setAddingMeal] = useState(null);
  const { selectedDate } = useDate();

  const displayDateText = new Date(`${selectedDate}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [entriesData, macroData] = await Promise.allSettled([
        foodService.getEntries(selectedDate),
        macroService.getTodayTotals(selectedDate),
      ]);

      if (entriesData.status === 'fulfilled') setEntries(entriesData.value);
      if (macroData.status === 'fulfilled') setTotals(macroData.value);
    } catch (err) {
      console.error('Food data error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id) => {
    try {
      await foodService.deleteEntry(id);
      fetchData();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Group entries by meal type
  const grouped = MEAL_ORDER.reduce((acc, type) => {
    acc[type] = entries.filter(e => e.mealType === type);
    return acc;
  }, {});

  const kcalRemaining = totals ? totals.remaining.calories : '--';

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', border: '3px solid var(--outline-variant)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <p className="font-inter mt-4" style={{ color: '#71717a', fontSize: '0.875rem' }}>Loading food diary...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-manrope font-bold text-3xl" style={{ letterSpacing: '-0.025em' }}>Food Diary</h1>
          <p className="font-inter mt-1" style={{ fontSize: '0.875rem', color: '#71717a' }}>{displayDateText}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p className="font-inter font-bold text-primary" style={{ fontSize: '1.25rem' }}>{typeof kcalRemaining === 'number' ? kcalRemaining.toLocaleString() : kcalRemaining}</p>
          <p className="font-inter" style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717a', fontWeight: 600 }}>Kcal Remaining</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {MEAL_ORDER.map((mealType) => {
          const mealEntries = grouped[mealType] || [];
          const mealCals = mealEntries.reduce((sum, e) => sum + e.calories, 0);
          const icon = MEAL_ICONS[mealType];
          const label = mealType.charAt(0).toUpperCase() + mealType.slice(1);

          return (
            <div key={mealType} className="glass-card rounded-custom shadow-premium" style={{ padding: '1.5rem' }}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'rgba(183,16,42,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined text-primary">{icon}</span>
                  </div>
                  <div>
                    <h3 className="font-manrope font-bold text-lg">{label}</h3>
                    <p className="font-inter" style={{ fontSize: '0.75rem', color: '#71717a' }}>
                      {mealEntries.length === 0 ? 'No entries' : `${mealEntries.length} item${mealEntries.length > 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="font-manrope font-bold text-xl">{mealCals}</p>
                  <p className="font-inter" style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717a', fontWeight: 600 }}>Kcal</p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem' }}>
                {mealEntries.length === 0 ? (
                  <p className="font-inter" style={{ fontSize: '0.875rem', color: '#a1a1aa' }}>Not logged yet</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {mealEntries.map(entry => (
                      <div key={entry.id} className="flex justify-between items-center" style={{ padding: '0.375rem 0' }}>
                        <div>
                          <p className="font-inter font-medium" style={{ fontSize: '0.875rem' }}>{entry.foodName}</p>
                          <p className="font-inter" style={{ fontSize: '0.6875rem', color: '#a1a1aa' }}>
                            {entry.servingSize}g • P:{entry.protein}g C:{entry.carbs}g F:{entry.fat}g
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-inter font-bold" style={{ fontSize: '0.875rem' }}>{entry.calories}</span>
                          <button onClick={() => handleDelete(entry.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#d4d4d8' }}>close</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button 
                  onClick={() => setAddingMeal(mealType)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, fontSize: '0.875rem', marginTop: '0.75rem' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>add_circle</span>
                  Add
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {addingMeal && (
        <AddFoodModal
          mealType={addingMeal}
          selectedDate={selectedDate}
          onClose={() => setAddingMeal(null)}
          onSaved={fetchData}
        />
      )}
    </div>
  );
}
