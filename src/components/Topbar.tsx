import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';

interface TopbarProps {
  title: string;
  onMobileMenuToggle: () => void;
  onNavigate: (tab: string) => void;
  profile: {
    name: string;
    email: string;
    phone: string;
    role: string;
    avatarBg: string;
  };
  desktopCollapsed?: boolean;
  onLogout: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ title, onMobileMenuToggle, onNavigate, profile, desktopCollapsed, onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        height: 64,
        backgroundColor: '#0F172A', // Slate-900 / Dark Navy matching the sidebar
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: 4 }, // Responsive horizontal padding
        position: 'fixed',
        top: 0,
        right: 0,
        left: { xs: 0, md: desktopCollapsed ? 70 : 260 }, // Shifting left offset responsive
        zIndex: 1000,
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'left 0.3s ease',
      }}
    >
      {/* Left: Mobile Menu Toggle & Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMobileMenuToggle}
          sx={{
            color: '#FFFFFF',
            display: { md: 'none' }, // Visible only on mobile
            mr: 0.5,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '1.05rem',
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Right: Admin Control Dropdown */}
      <Box
        onClick={handleMenuOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
          py: 0.5,
          px: 1,
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
          },
        }}
      >
        <Avatar
          sx={{
            bgcolor: profile.avatarBg,
            width: 32,
            height: 32,
            fontSize: '0.8rem',
            fontWeight: 700,
          }}
        >
          {profile.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
        </Avatar>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.2,
            }}
          >
            {profile.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#8C7E76',
              fontWeight: 600,
              display: 'block',
              fontSize: '0.7rem',
            }}
          >
            {profile.role}
          </Typography>
        </Box>
        <IconButton size="small" sx={{ color: '#8C7E76', p: 0 }}>
          <ArrowDropDownIcon />
        </IconButton>
      </Box>

      {/* Menu lives OUTSIDE the clickable box — otherwise item clicks bubble
          up to the box's onClick and instantly re-open the menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ mt: 1.5 }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => { handleMenuClose(); onNavigate('profile'); }}>My Profile</MenuItem>
        <DividerMenuItem />
        <MenuItem onClick={() => { handleMenuClose(); onLogout(); }} sx={{ color: '#F43F5E' }}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

const DividerMenuItem = () => (
  <Box sx={{ borderBottom: '1px solid #EAE5E0', my: 1 }} />
);
export default Topbar;
