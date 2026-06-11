import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Devices } from './pages/Devices';
import { Guardians } from './pages/Guardians';
import { Monitors } from './pages/Monitors';
import { Alerts } from './pages/Alerts';
import { Profile } from './pages/Profile';
import { Seniors } from './pages/Seniors';
import { Card, Typography, Box } from '@mui/material';
import { Login } from './pages/Login';
import { ProfileService, AuthService } from './api';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('authToken'));

  // Hoisted Admin Profile State
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    avatarBg: '#D45529', // SeniorCare Theme primary orange-brown
  });

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
    setProfile({
      name: '',
      email: '',
      phone: '',
      role: '',
      avatarBg: '#D45529',
    });
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard role={profile.role} onNavigate={setActiveTab} />;
      case 'seniors':
        return <Seniors currentUserName={profile.name} currentUserRole={profile.role} />;
      case 'users':
        return <Users />;
      case 'devices':
        return <Devices />;
      case 'guardians':
        return <Guardians />;
      case 'monitors':
        return <Monitors />;
      case 'alerts':
        return <Alerts role={profile.role} />;
      case 'profile':
        return <Profile profile={profile} onUpdateProfile={setProfile} />;
      default:
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Card sx={{ maxWidth: 600, width: '100%', textAlign: 'center', py: 6, px: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, color: '#1A0E07' }}>
                Section Under Development
              </Typography>
              <Typography variant="body2" sx={{ color: '#8C7E76' }}>
                The "{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}" panel is currently under construction for this live monitoring view.
              </Typography>
            </Card>
          </Box>
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout activeTab={activeTab} profile={profile} onTabChange={setActiveTab} onLogout={handleLogout}>
        {renderContent()}
      </Layout>
    </ThemeProvider>
  );
};

export default App;
