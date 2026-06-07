import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Button, // Added Button for seniors header actions
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit'; // Added EditIcon
import AddIcon from '@mui/icons-material/Add'; // Added AddIcon

interface TopbarProps {
  title: string;
  activeTab?: string; // Added activeTab prop
  onMobileMenuToggle: () => void;
  profile: {
    name: string;
    email: string;
    phone: string;
    role: string;
    avatarBg: string;
  };
  desktopCollapsed?: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ title, activeTab, onMobileMenuToggle, profile, desktopCollapsed }) => {
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

        {activeTab === 'seniors' ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mr: { xs: 0, md: 4 } }}>
            {/* Breadcrumb Title */}
            <Typography
              variant="h6"
              sx={{
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: { xs: '0.85rem', sm: '1.05rem' },
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Box component="span" sx={{ color: '#8C7E76', fontWeight: 500 }}>— Seniors</Box>
              <Box component="span" sx={{ color: '#FFFFFF' }}>/ Meena Devi</Box>
            </Typography>

            {/* Seniors Top Actions */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  color: '#B8A8A0',
                  borderColor: 'rgba(255,255,255,0.15)',
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 0.5,
                  px: 1.5,
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.3)',
                    bgcolor: 'rgba(255,255,255,0.05)',
                  }
                }}
              >
                — Prev Senior
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  color: '#B8A8A0',
                  borderColor: 'rgba(255,255,255,0.15)',
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 0.5,
                  px: 1.5,
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.3)',
                    bgcolor: 'rgba(255,255,255,0.05)',
                  }
                }}
              >
                Next Senior —
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon sx={{ fontSize: 13 }} />}
                sx={{
                  color: '#B8A8A0',
                  borderColor: 'rgba(255,255,255,0.15)',
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 0.5,
                  px: 1.5,
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.3)',
                    bgcolor: 'rgba(255,255,255,0.05)',
                  }
                }}
              >
                Edit Profile
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon sx={{ fontSize: 13 }} />}
                sx={{
                  bgcolor: '#D45529',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  fontWeight: 700,
                  py: 0.6,
                  px: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#B23F1C',
                    boxShadow: 'none',
                  }
                }}
              >
                Add Note
              </Button>
            </Box>
          </Box>
        ) : (
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
        )}
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
          <MenuItem onClick={handleMenuClose}>My Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>System Configs</MenuItem>
          <DividerMenuItem />
          <MenuItem onClick={handleMenuClose} sx={{ color: '#F43F5E' }}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

const DividerMenuItem = () => (
  <Box sx={{ borderBottom: '1px solid #EAE5E0', my: 1 }} />
);
export default Topbar;
