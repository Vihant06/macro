import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Food from './pages/Food';
import Workout from './pages/Workout';
import WorkoutSession from './components/WorkoutSession';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import AICoach from './pages/AICoach';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DateProvider, useDate } from './context/DateContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function TopAppBar() {
  const { user } = useAuth();
  const { selectedDate, setSelectedDate } = useDate();
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  const isToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return selectedDate === today;
  };

  const displayDate = () => {
    if (isToday()) return 'Today';
    const date = new Date(selectedDate);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <header style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 50,
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 1.5rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.4)'
    }}>
      <div className="flex items-center gap-3">
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid rgba(183,16,42,0.1)'
        }}>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{initial}</span>
        </div>
        <div className="flex flex-col">
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717a', fontWeight: 500 }}>
            Precision Tracking
          </span>
          <h1 className="font-manrope text-xl font-bold" style={{ color: 'var(--primary)', letterSpacing: '-0.05em' }}>
            Macros
          </h1>
        </div>
      </div>
      
      {/* Calendar Button wrapped around native date picker */}
      <div style={{ position: 'relative' }}>
        <button className="glass-card" style={{
          height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          borderRadius: '9999px', border: 'none', cursor: 'pointer', padding: '0 1rem', background: !isToday() ? 'rgba(225, 29, 72, 0.1)' : ''
        }}>
          <span className="font-inter font-semibold" style={{ fontSize: '0.75rem', color: !isToday() ? 'var(--primary)' : '#71717a' }}>{displayDate()}</span>
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '1.25rem' }}>calendar_today</span>
        </button>
        <input 
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer'
          }}
        />
      </div>
    </header>
  );
}

function BottomNavBar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'grid_view' },
    { path: '/food', label: 'Food', icon: 'restaurant' },
    { path: '/workout', label: 'Workout', icon: 'fitness_center' },
    { path: '/coach', label: 'Coach', icon: 'psychology' },
    { path: '/profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, width: '100%',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '0.5rem 1rem 1.5rem 1rem',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(32px)',
      WebkitBackdropFilter: 'blur(32px)',
      borderRadius: '1.5rem 1.5rem 0 0',
      zIndex: 50,
      boxShadow: '0px -10px 40px rgba(65,0,7,0.06)',
      borderTop: '1px solid rgba(255, 255, 255, 0.4)'
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textDecoration: 'none',
            padding: '0.375rem 1rem',
            borderRadius: '9999px',
            background: isActive ? 'rgba(225, 29, 72, 0.1)' : 'transparent',
            color: isActive ? 'var(--primary)' : '#a1a1aa',
            transition: 'all 0.2s ease-in-out'
          }}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
              {item.icon}
            </span>
            <span className="font-inter font-medium" style={{ fontSize: '10px', textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.025em' }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function FAB() {
  const navigate = useNavigate();
  const location = useLocation();
  // Hide FAB on the AI Coach page since it has its own input bar
  if (location.pathname === '/coach') return null;
  return (
    <button onClick={() => navigate('/food')} style={{
      position: 'fixed', bottom: '7rem', right: '1.5rem',
      width: '3.5rem', height: '3.5rem',
      background: 'var(--primary)', color: 'var(--on-primary)',
      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 10px 25px rgba(183, 16, 42, 0.4)',
      border: 'none', cursor: 'pointer', zIndex: 40,
      transition: 'transform 0.2s ease'
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>add</span>
    </button>
  );
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { user } = useAuth();
  
  return (
    <Router>
      <ErrorBoundary>
        {user && <TopAppBar />}
        <div className={user ? "app-container" : ""}>
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/food" element={<PrivateRoute><Food /></PrivateRoute>} />
            <Route path="/workout" element={<PrivateRoute><Workout /></PrivateRoute>} />
            <Route path="/workout/session" element={<PrivateRoute><WorkoutSession /></PrivateRoute>} />
            <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
            <Route path="/coach" element={<PrivateRoute><AICoach /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><div style={{ paddingBottom: '2rem' }}><Profile /></div></PrivateRoute>} />
          </Routes>
        </div>
        {user && <FAB />}
        {user && <BottomNavBar />}
      </ErrorBoundary>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <DateProvider>
        <AppContent />
      </DateProvider>
    </AuthProvider>
  );
}

export default App;
