import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        await loginWithGoogle(tokenResponse.access_token);
        navigate('/');
      } catch (err) {
        const msg = err.response?.data?.message || 'Google login failed. Please try again.';
        setError(Array.isArray(msg) ? msg[0] : msg);
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google login failed.')
  });

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '28rem', margin: '0 auto' }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="font-manrope font-bold" style={{ fontSize: '2.5rem', color: 'var(--primary)', letterSpacing: '-0.05em' }}>Macros</h1>
        <p className="font-inter" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#71717a', marginTop: '0.25rem' }}>Precision Tracking</p>
      </div>

      <div className="glass-card rounded-custom shadow-premium" style={{ padding: '2.5rem' }}>
        <h2 className="font-manrope font-bold text-2xl mb-2">Welcome Back</h2>
        <p className="font-inter" style={{ color: '#71717a', fontSize: '0.875rem', marginBottom: '2rem' }}>Sign in to access your vitals.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="font-inter font-semibold" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#71717a' }}>Email</label>
            <input 
              id="login-email"
              type="email" 
              style={{ padding: '0.875rem 1rem', border: '1px solid var(--outline-variant)', borderRadius: '0.75rem', outline: 'none', background: 'rgba(255,255,255,0.6)', fontSize: '0.9375rem', transition: 'border-color 0.2s' }}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="font-inter font-semibold" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#71717a' }}>Password</label>
            <input 
              id="login-password"
              type="password" 
              style={{ padding: '0.875rem 1rem', border: '1px solid var(--outline-variant)', borderRadius: '0.75rem', outline: 'none', background: 'rgba(255,255,255,0.6)', fontSize: '0.9375rem', transition: 'border-color 0.2s' }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.2)', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}>
              <p className="font-inter" style={{ color: 'var(--error)', fontSize: '0.8125rem' }}>{error}</p>
            </div>
          )}
          
          <button 
            id="login-submit"
            type="submit" 
            className="btn-primary" 
            disabled={loading} 
            style={{ padding: '1rem', marginTop: '0.5rem', width: '100%', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--outline-variant)' }}></div>
            <span style={{ margin: '0 1rem', fontSize: '0.8rem', color: '#71717a' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--outline-variant)' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
              type="button" 
              onClick={() => handleGoogleLogin()}
              className="btn-primary" 
              disabled={loading} 
              style={{ 
                padding: '1rem', 
                width: '100%', 
                opacity: loading ? 0.7 : 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem', 
                background: 'rgba(255,255,255,0.8)', 
                color: '#18181b',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: '1px solid var(--outline-variant)'
              }}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{width: 20, height: 20}} />
              <span className="font-inter font-semibold" style={{ fontSize: '0.9375rem' }}>Continue with Google</span>
            </button>
          </div>
        </form>
      </div>
      
      <p className="font-inter" style={{ fontSize: '0.875rem', color: '#71717a', textAlign: 'center', marginTop: '2rem' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
      </p>
    </div>
  );
}
