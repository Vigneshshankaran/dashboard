import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Fade,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import { AuthService } from '../api';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Email form states
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await AuthService.signin({
        email: email.trim(),
        password,
        platform: 'web',
      });

      if (res && res.access_token) {
        localStorage.setItem('authToken', res.access_token);
        if (res.refresh_token) {
          localStorage.setItem('refreshToken', res.refresh_token);
        }
        onLoginSuccess();
      } else {
        setErrorMsg('Authentication succeeded but no token was returned.');
      }
    } catch (err: any) {
      console.error('Email signin error:', err);
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      id="login-page-root"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: '#FAF8F6', // Theme background color
      }}
    >
      {/* Visual Left Panel (Hidden on mobile) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: '1.2 1 0%',
          bgcolor: '#0F172A', // Slate-900 / Dark Navy matching sidebar
          color: '#FFFFFF',
          p: 6,
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Ambient Shapes */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,85,41,0.1) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Brand Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, zIndex: 2 }}>
          <CloudQueueIcon sx={{ fontSize: 32, color: '#D45529' }} />
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
            SeniorCare
          </Typography>
        </Box>

        {/* Dynamic Marketing Graphic */}
        <Box sx={{ my: 'auto', maxW: '520px', zIndex: 2 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              lineHeight: 1.2,
              mb: 3,
              letterSpacing: '-1.5px',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Care, monitored with safety.
          </Typography>
          <Typography variant="body1" sx={{ color: '#94A3B8', mb: 4, lineHeight: 1.6 }}>
            Real-time fall detection, health vitals monitoring, and senior resident tracking. Empowering caregivers with immediate alert responses.
          </Typography>

          {/* Micro Card Dashboard Previews */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                p: 2.5,
                flex: '1 1 200px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Typography variant="caption" sx={{ color: '#D45529', fontWeight: 700, letterSpacing: '0.5px' }}>
                LIVE VITALS
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                98% Active
              </Typography>
            </Box>
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                p: 2.5,
                flex: '1 1 200px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700, letterSpacing: '0.5px' }}>
                SYSTEM STATUS
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                Fully Calibrated
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Footer info */}
        <Box sx={{ zIndex: 2 }}>
          <Typography variant="caption" sx={{ color: '#475569' }}>
            &copy; {new Date().getFullYear()} SeniorCare. All rights reserved.
          </Typography>
        </Box>
      </Box>

      {/* Right Login Controller Form */}
      <Box
        sx={{
          flex: '1 1 0%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 3, sm: 6 },
        }}
      >
        <Fade in timeout={800}>
          <Box sx={{ width: '100%', maxWidth: '440px' }}>
            {/* Header on Mobile view */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 4 }}>
              <CloudQueueIcon sx={{ fontSize: 32, color: '#D45529' }} />
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A0E07' }}>
                SeniorCare
              </Typography>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#1A0E07',
                mb: 1.5,
                letterSpacing: '-0.5px',
              }}
            >
              Welcome back
            </Typography>
            <Typography variant="body2" sx={{ color: '#6E625B', mb: 4 }}>
              Sign in to manage residents, monitors, and alerts.
            </Typography>

            {/* Error alerts */}
            {errorMsg && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '8px', fontWeight: 500 }}>
                {errorMsg}
              </Alert>
            )}

            <form onSubmit={handleEmailSubmit} id="email-login-form">
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    id="email-input"
                    label="Email address"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#8C7E76', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }
                    }}
                  />

                  <TextField
                    id="password-input"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#8C7E76', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              id="toggle-password-visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    }}
                  />

                  <Button
                    id="email-signin-button"
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '0.95rem',
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                  </Button>
                </Box>
              </form>

            {/* Bottom auxiliary options */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 4,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#D45529',
                  fontWeight: 700,
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Forgot Password?
              </Typography>
              <Typography variant="body2" sx={{ color: '#6E625B' }}>
                Need help?{' '}
                <Box
                  component="span"
                  sx={{
                    color: '#D45529',
                    fontWeight: 700,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Contact Support
                </Box>
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};
export default Login;
