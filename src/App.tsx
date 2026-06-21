import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import { theme } from './theme/theme';
import { Layout } from './components/Layout';
import { FeedbackProvider } from './components/FeedbackProvider';
import { ProfileService, AuthService } from './api';

// Pages are lazy-loaded: each one downloads only when first visited,
// which keeps the initial load (login screen) fast.
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Seniors = lazy(() => import('./pages/Seniors'));
const Users = lazy(() => import('./pages/Users'));
const Devices = lazy(() => import('./pages/Devices'));
const Guardians = lazy(() => import('./pages/Guardians'));
const Monitors = lazy(() => import('./pages/Monitors'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Profile = lazy(() => import('./pages/Profile'));
const CommandCentre = lazy(() => import('./pages/CommandCentre'));

interface ProfileState {
  name: string;
  email: string;
  phone: string;
  role: string;
  avatarBg: string;
}

const EMPTY_PROFILE: ProfileState = {
  name: '',
  email: '',
  phone: '',
  role: '',
  avatarBg: '#D45529', // SeniorCare theme primary
};

// Centered spinner shown while a lazy page chunk downloads
const PageLoader: React.FC = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 12 }}>
    <CircularProgress sx={{ color: '#D45529' }} />
  </Box>
);

// Blocks admin-only pages for other roles. While the profile is still
// loading (role unknown) it shows a spinner instead of wrongly redirecting.
const RequireAdmin: React.FC<{ role: string; children: React.ReactElement }> = ({ role, children }) => {
  if (!role) return <PageLoader />;
  return role === 'ADMIN' ? children : <Navigate to="/" replace />;
};

// The signed-in application: sidebar + topbar + routed pages.
// The URL is the single source of truth for which page is active.
const AppShell: React.FC<{
  profile: ProfileState;
  onUpdateProfile: (p: ProfileState) => void;
  onLogout: () => void;
}> = ({ profile, onUpdateProfile, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // '/seniors' → 'seniors'; '/' → 'dashboard'
  const activeTab = location.pathname === '/' ? 'dashboard' : location.pathname.replace(/^\//, '');
  const goToTab = (tab: string) => navigate(tab === 'dashboard' ? '/' : `/${tab}`);

  return (
    <Layout activeTab={activeTab} profile={profile} onTabChange={goToTab} onLogout={onLogout}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Dashboard role={profile.role} onNavigate={goToTab} />} />
          <Route path="/command-centre" element={<CommandCentre role={profile.role} />} />
          <Route path="/seniors" element={<Seniors currentUserName={profile.name} currentUserRole={profile.role} />} />
          <Route path="/alerts" element={<Alerts role={profile.role} />} />
          <Route path="/profile" element={<Profile profile={profile} onUpdateProfile={onUpdateProfile} />} />
          <Route path="/users" element={<RequireAdmin role={profile.role}><Users /></RequireAdmin>} />
          <Route path="/devices" element={<RequireAdmin role={profile.role}><Devices /></RequireAdmin>} />
          <Route path="/guardians" element={<RequireAdmin role={profile.role}><Guardians /></RequireAdmin>} />
          <Route path="/monitors" element={<RequireAdmin role={profile.role}><Monitors /></RequireAdmin>} />
          {/* Unknown URL → back to the dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('authToken'));
  const [profile, setProfile] = useState<ProfileState>(EMPTY_PROFILE);

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      AuthService.logout(refreshToken).catch((err) => {
        console.warn('Logout API call failed:', err);
      });
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setProfile(EMPTY_PROFILE);
  };

  const fetchProfile = () => {
    ProfileService.getProfile()
      .then((res) => {
        // Backend may wrap the payload in { data: ... } and uses snake_case field names
        const data = res?.data ?? res;
        if (data) {
          const firstName = data.first_name || data.firstName || '';
          const lastName = data.last_name || data.lastName || '';
          const phoneNumber = data.phone_number || data.phoneNumber || '';
          setProfile({
            name:
              data.name ||
              `${firstName} ${lastName}`.trim() ||
              data.username ||
              data.userName ||
              (data.email ? String(data.email).split('@')[0] : '') ||
              'User',
            email: data.email || data.primaryEmail || '',
            phone: phoneNumber ? String(phoneNumber) : '',
            role: data.role || '',
            avatarBg: '#D45529',
          });
        }
      })
      .catch((err) => {
        console.warn('Failed to load profile:', err);
        handleLogout();
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  // When the API client gives up on refreshing an expired token,
  // it broadcasts 'auth:expired' — return the user to the login screen.
  useEffect(() => {
    const onSessionExpired = () => {
      setIsAuthenticated(false);
      setProfile(EMPTY_PROFILE);
    };
    window.addEventListener('auth:expired', onSessionExpired);
    return () => window.removeEventListener('auth:expired', onSessionExpired);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FeedbackProvider>
        <BrowserRouter>
          {isAuthenticated ? (
            <AppShell profile={profile} onUpdateProfile={setProfile} onLogout={handleLogout} />
          ) : (
            <Suspense fallback={<PageLoader />}>
              <Login onLoginSuccess={() => setIsAuthenticated(true)} />
            </Suspense>
          )}
        </BrowserRouter>
      </FeedbackProvider>
    </ThemeProvider>
  );
};

export default App;
