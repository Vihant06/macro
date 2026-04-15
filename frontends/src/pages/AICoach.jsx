import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService, aiService } from '../services/macroService';

const QUICK_REPLIES = [
  { label: 'Adjust my calories', icon: 'tune' },
  { label: 'What should I eat?', icon: 'restaurant' },
  { label: 'Log a workout',      icon: 'fitness_center' },
  { label: 'My macro targets',   icon: 'pie_chart' },
];

// ── Sub-components ─────────────────────────────────────────────────────────────
function MealPlanCard({ plan }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(16px)',
      borderRadius: '1.25rem',
      padding: '1.25rem',
      marginTop: '0.5rem',
      boxShadow: '0 4px 20px rgba(65,0,7,0.06)',
    }}>
      {/* Daily targets row */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a1a1aa', fontWeight: 600 }}>
          DAILY TARGETS
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.25rem' }}>
          <span className="font-manrope font-bold" style={{ fontSize: '2rem', color: 'var(--primary)', lineHeight: 1 }}>
            {plan.calories}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600, textTransform: 'uppercase' }}>kcal</span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Protein', value: plan.protein },
              { label: 'Carbs',   value: plan.carbs },
              { label: 'Fats',    value: plan.fat },
            ].map(m => (
              <span key={m.label} style={{
                background: 'rgba(183,16,42,0.08)', color: 'var(--primary)',
                borderRadius: '9999px', padding: '0.2rem 0.6rem',
                fontSize: '0.75rem', fontWeight: 600,
              }}>
                {m.value}g <span style={{ fontWeight: 400, color: '#a1a1aa', fontSize: '0.65rem', textTransform: 'uppercase' }}>{m.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Macronutrient balance bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.65rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            MACRONUTRIENT BALANCE
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            OPTIMAL DISTRIBUTION
          </span>
        </div>
        <div style={{ height: '4px', borderRadius: '9999px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ background: 'var(--primary)', flex: plan.protein * 4 }} />
          <div style={{ background: '#d97706', flex: plan.carbs * 4 }} />
          <div style={{ background: '#2563eb', flex: plan.fat * 9 }} />
        </div>
      </div>

      {/* Meals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {plan.meals.map((meal, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '2.25rem', height: '2.25rem', minWidth: '2.25rem',
              background: 'rgba(183,16,42,0.07)', borderRadius: '0.75rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem',
            }}>
              {meal.icon}
            </div>
            <div>
              <p className="font-inter font-semibold" style={{ fontSize: '0.875rem', color: '#1d1b1c' }}>{meal.name}</p>
              <p className="font-inter" style={{ fontSize: '0.8rem', color: '#71717a', lineHeight: 1.4, marginTop: '0.125rem' }}>{meal.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div style={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-end',
      gap: '0.5rem',
      marginBottom: '1rem',
    }}>
      {!isUser && (
        <div style={{
          width: '2rem', height: '2rem', minWidth: '2rem',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'white' }}>psychology</span>
        </div>
      )}

      <div style={{ maxWidth: '80%' }}>
        {/* Text bubble */}
        <div style={{
          padding: '0.875rem 1rem',
          borderRadius: isUser ? '1.25rem 1.25rem 0.25rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.25rem',
          background: isUser
            ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)'
            : 'rgba(255,255,255,0.85)',
          backdropFilter: !isUser ? 'blur(16px)' : undefined,
          boxShadow: '0 2px 12px rgba(65,0,7,0.08)',
          color: isUser ? 'white' : '#1d1b1c',
          fontSize: '0.9rem',
          lineHeight: 1.5,
        }}>
          {/* Parse **bold** */}
          {message.text.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </div>

        {/* Meal plan card (AI only) */}
        {!isUser && message.plan && <MealPlanCard plan={message.plan} />}

        {/* Timestamp */}
        <p style={{
          fontSize: '0.65rem', color: '#a1a1aa', marginTop: '0.25rem',
          textAlign: isUser ? 'right' : 'left', padding: '0 0.25rem',
        }}>
          {message.time}
        </p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AICoach() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [goals,   setGoals]   = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const now = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Fetch user context once
  useEffect(() => {
    Promise.allSettled([userService.getProfile(), userService.getGoals()]).then(([p, g]) => {
      const prof = p.status === 'fulfilled' ? p.value : null;
      const gls  = g.status === 'fulfilled' ? g.value : null;
      setProfile(prof);
      setGoals(gls);

      const name = prof?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'there';
      const tdee = gls?.dailyCalories ? Math.round(gls.dailyCalories * 1.1) : 2800;
      const cals = gls?.dailyCalories || 2000;

      setMessages([{
        id: 1,
        role: 'assistant',
        text: `Hi ${name}! I've analyzed your energy expenditure for the last 7 days. Your TDEE is currently estimated at **${tdee} kcal**. You're targeting **${cals} kcal/day** to hit your goal. Would you like to adjust your goal or see a high-protein meal plan for tomorrow?`,
        time: now(),
      }]);
    });
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text: text.trim(), time: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiService.chat(text);
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: res.text,
        plan: res.plan,
        time: now(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('AI Chat error:', error);
      
      const errorMessage = error.response?.status === 429 
        ? "You've reached your daily limit of 10 AI requests. See you tomorrow!"
        : "Sorry, I'm having trouble connecting right now. Please try again later.";
        
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: errorMessage,
        time: now(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>

      {/* Chat messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: '8rem',
      }}>
        {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{
              width: '2rem', height: '2rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'white' }}>psychology</span>
            </div>
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '1.25rem 1.25rem 1.25rem 0.25rem',
              background: 'rgba(255,255,255,0.85)',
              boxShadow: '0 2px 12px rgba(65,0,7,0.08)',
              display: 'flex', gap: '0.3rem', alignItems: 'center',
            }}>
              {[0, 0.2, 0.4].map((delay, i) => (
                <div key={i} style={{
                  width: '0.45rem', height: '0.45rem', borderRadius: '50%',
                  background: 'var(--primary)', opacity: 0.6,
                  animation: `pulse 1.2s ease-in-out ${delay}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies + input — fixed at bottom */}
      <div style={{
        position: 'fixed', bottom: '5rem', left: 0, right: 0,
        background: 'rgba(255,248,249,0.9)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.4)',
        padding: '0.75rem 1rem 0.5rem',
        zIndex: 30,
      }}>
        {/* Quick replies */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {QUICK_REPLIES.map(r => (
            <button
              key={r.label}
              onClick={() => sendMessage(r.label)}
              style={{
                flex: '0 0 auto',
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                background: 'rgba(183,16,42,0.07)',
                border: 'none', borderRadius: '9999px',
                padding: '0.5rem 0.875rem',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                color: 'var(--primary)', whiteSpace: 'nowrap',
                transition: 'background 0.15s',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>

        {/* Message input row */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', marginTop: '0.25rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              value={input}
              placeholder="Message AI Coach..."
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              style={{
                width: '100%',
                padding: '0.875rem 3rem 0.875rem 1rem',
                border: '1.5px solid rgba(183,16,42,0.15)',
                borderRadius: '9999px',
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(12px)',
                fontSize: '0.9rem',
                outline: 'none',
                color: '#1d1b1c',
                boxSizing: 'border-box',
              }}
            />
            {/* Mic icon */}
            <span className="material-symbols-outlined" style={{
              position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
              color: '#a1a1aa', fontSize: '1.25rem', cursor: 'pointer',
            }}>mic</span>
          </div>

          {/* Send button */}
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            style={{
              width: '3rem', height: '3rem', minWidth: '3rem',
              borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, var(--primary), var(--primary-container))'
                : 'rgba(183,16,42,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: input.trim() ? '0 4px 16px rgba(183,16,42,0.3)' : 'none',
            }}
          >
            <span className="material-symbols-outlined" style={{
              color: input.trim() && !loading ? 'white' : 'var(--primary)',
              fontSize: '1.25rem',
            }}>send</span>
          </button>
        </div>
      </div>

      {/* Keyframe for typing dots */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
