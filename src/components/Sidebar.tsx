import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DevicesIcon from '@mui/icons-material/Devices';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  profile: {
    name: string;
    email: string;
    phone: string;
    role: string;
    avatarBg: string;
  };
  desktopCollapsed?: boolean;
  onDesktopCollapseToggle?: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  profile,
  desktopCollapsed = false,
  onDesktopCollapseToggle,
  onLogout,
}) => {
  const menuGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
      ],
    },
    {
      title: 'RESIDENTS',
      items: [
        { id: 'seniors', text: 'Seniors', icon: <PeopleIcon /> },
        { id: 'guardians', text: 'Guardians', icon: <SecurityIcon /> },
        { id: 'monitors', text: 'Monitors', icon: <VisibilityIcon /> },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { id: 'devices', text: 'Devices', icon: <DevicesIcon /> },
        { id: 'alerts', text: 'Alerts', icon: <NotificationsIcon /> },
        { id: 'users', text: 'Users', icon: <PeopleIcon /> },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { id: 'profile', text: 'My Profile', icon: <PersonIcon /> },
      ],
    },
  ];

  const getFilteredGroups = () => {
    const isClientAdmin = profile.role === 'ADMIN';
    return menuGroups.map(group => {
      let filteredItems = group.items;
      if (!isClientAdmin) {
        filteredItems = group.items.filter(item => 
          item.id !== 'users' && 
          item.id !== 'devices' && 
          item.id !== 'guardians' && 
          item.id !== 'monitors'
        );
      }
      return { ...group, items: filteredItems };
    }).filter(group => group.items.length > 0);
  };

  return (
    <Box
      sx={{
        width: desktopCollapsed ? 70 : 260,
        backgroundColor: '#0F172A', // Slate-900 / Dark Navy matching the screenshot
        color: '#94A3B8',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1100,
        transition: 'width 0.3s ease',
      }}
    >
      {/* Brand Logo Header */}
      <Box
        sx={{
          p: desktopCollapsed ? 1.5 : 3,
          display: 'flex',
          flexDirection: desktopCollapsed ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: desktopCollapsed ? 'center' : 'space-between',
          gap: desktopCollapsed ? 1.5 : 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
          {/* Logo Icon */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D45529',
            }}
          >
            <CloudQueueIcon sx={{ fontSize: 28 }} />
          </Box>
          {!desktopCollapsed && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1.2rem',
                color: '#FFFFFF',
                letterSpacing: '-0.3px',
                whiteSpace: 'nowrap',
              }}
            >
              SeniorCare
            </Typography>
          )}
        </Box>
        <IconButton
          onClick={onDesktopCollapseToggle}
          size="small"
          sx={{
            color: '#8C7E76',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '6px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
          }}
        >
          {desktopCollapsed ? <ChevronRightIcon sx={{ fontSize: 18 }} /> : <ChevronLeftIcon sx={{ fontSize: 18 }} />}
        </IconButton>
      </Box>

      {/* Navigation Menus with Group Categories */}
      <Box sx={{ flexGrow: 1, px: desktopCollapsed ? 1 : 2, mt: 1, overflowY: 'auto' }}>
        {getFilteredGroups().map((group) => (
          <Box key={group.title} sx={{ mb: desktopCollapsed ? 1.5 : 2.5 }}>
            {!desktopCollapsed && (
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  fontWeight: 800,
                  color: '#475569', // Muted slate color for labels
                  letterSpacing: '1px',
                  fontSize: '0.68rem',
                  display: 'block',
                  mb: 0.75,
                }}
              >
                {group.title}
              </Typography>
            )}
            <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <ListItem key={item.id} disablePadding>
                    <ListItemButton
                      onClick={() => onTabChange(item.id)}
                      sx={{
                        borderRadius: '8px',
                        py: 1.25,
                        px: desktopCollapsed ? 0 : 2,
                        justifyContent: desktopCollapsed ? 'center' : 'initial',
                        backgroundColor: isActive ? '#1E293B' : 'transparent', // Highlight active navy blue
                        color: isActive ? '#FFFFFF' : '#94A3B8',
                        '&:hover': {
                          backgroundColor: isActive ? '#1E293B' : 'rgba(255, 255, 255, 0.03)',
                          color: '#FFFFFF',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: desktopCollapsed ? 0 : 36,
                          color: isActive ? '#D45529' : '#475569', // Orange icon for active
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {!desktopCollapsed && (
                        <ListItemText>
                          <Typography
                            sx={{
                              fontSize: '0.9rem',
                              fontWeight: isActive ? 600 : 500,
                              color: isActive ? '#FFFFFF' : 'inherit',
                            }}
                          >
                            {item.text}
                          </Typography>
                        </ListItemText>
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* User profile footer */}
      <Box sx={{ p: desktopCollapsed ? 1 : 2, mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 1, width: '100%' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: desktopCollapsed ? 0 : 1.5, px: desktopCollapsed ? 0 : 1, width: '100%', justifyContent: desktopCollapsed ? 'center' : 'flex-start' }}>
          <Avatar
            sx={{
              bgcolor: profile.avatarBg,
              color: '#FFFFFF',
              width: 38,
              height: 38,
              fontSize: '0.85rem',
              fontWeight: 700,
              border: '2px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {profile.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
          </Avatar>
          {!desktopCollapsed && (
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {profile.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 600 }}>
                {profile.role}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Logout Button */}
        <ListItemButton
          onClick={onLogout}
          sx={{
            borderRadius: '8px',
            color: '#B8A8A0',
            py: 1,
            px: desktopCollapsed ? 0 : 2,
            justifyContent: desktopCollapsed ? 'center' : 'initial',
            width: '100%',
            mt: 1,
            '&:hover': {
              backgroundColor: 'rgba(244, 63, 94, 0.08)',
              color: '#F43F5E',
              '& .logout-icon': {
                color: '#F43F5E',
              },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: desktopCollapsed ? 0 : 36, color: '#8C7E76', display: 'flex', justifyContent: 'center' }} className="logout-icon">
            <ExitToAppIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          {!desktopCollapsed && (
            <ListItemText>
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                Logout
              </Typography>
            </ListItemText>
          )}
        </ListItemButton>
      </Box>
    </Box>
  );
};
export default Sidebar;
