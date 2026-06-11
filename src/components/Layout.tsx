import React, { useState } from 'react';
import { Box, Drawer } from '@mui/material';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  profile: {
    name: string;
    email: string;
    phone: string;
    role: string;
    avatarBg: string;
  };
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, profile, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getTabTitle = (tab: string) => {
    if (tab === 'dashboard') return 'Dashboard';
    return tab.charAt(0).toUpperCase() + tab.slice(1);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF8F6' }}>
      
      {/* 1. Sidebar for Mobile (Temporary Drawer) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 260,
            borderRight: 'none'
          },
        }}
      >
        <Sidebar 
          activeTab={activeTab} 
          profile={profile} 
          onTabChange={(tab) => {
            onTabChange(tab);
            setMobileOpen(false); // Close drawer on item select
          }} 
          onLogout={onLogout}
        />
      </Drawer>

      {/* 2. Sidebar for Desktop (Permanent Fixed) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          width: desktopCollapsed ? 70 : 260,
          flexShrink: 0,
          transition: 'width 0.3s ease',
        }}
      >
        <Sidebar 
          activeTab={activeTab} 
          profile={profile} 
          onTabChange={onTabChange} 
          desktopCollapsed={desktopCollapsed}
          onDesktopCollapseToggle={() => setDesktopCollapsed(!desktopCollapsed)}
          onLogout={onLogout}
        />
      </Box>

      {/* 3. Main content viewport */}
      <Box
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: desktopCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 260px)' },
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: 'width 0.3s ease',
        }}
      >
        {/* Topbar */}
        <Topbar
          title={getTabTitle(activeTab)}
          profile={profile}
          onMobileMenuToggle={handleDrawerToggle}
          onNavigate={onTabChange}
          desktopCollapsed={desktopCollapsed}
          onLogout={onLogout}
        />

        {/* Content workspace wrapper */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: { xs: '80px', sm: '88px', md: '96px' }, // Offset for fixed 64px Topbar + padding
            px: { xs: 2, sm: 3, md: 4 },
            pb: { xs: 2, sm: 3, md: 4 },
            overflowY: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
export default Layout;
