import React, { useState } from 'react';
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
import { Seniors } from './pages/Seniors'; // Added Seniors import
import { Card, Typography, Box } from '@mui/material';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Hoisted Admin Profile State
  const [profile, setProfile] = useState({
    name: 'Healthsoft Admin Team',
    email: 'healthsoftcare@gmail.com',
    phone: '1234512345',
    role: 'ADMIN',
    avatarBg: '#D45529', // SeniorCare Theme primary orange-brown
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'seniors': // Added Seniors route case
        return <Seniors />;
      case 'users':
        return <Users />;
      case 'devices':
        return <Devices />;
      case 'guardians':
        return <Guardians />;
      case 'monitors':
        return <Monitors />;
      case 'alerts':
        return <Alerts />;
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout activeTab={activeTab} profile={profile} onTabChange={setActiveTab}>
        {renderContent()}
      </Layout>
    </ThemeProvider>
  );
};

export default App;
