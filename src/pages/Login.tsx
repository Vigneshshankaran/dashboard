import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import { AuthService, BASE_URL } from '../api';

interface LoginProps {
  onLoginSuccess: () => void;
}

const GoogleIconSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 8 }}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<number>(0);

  // Email form states
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Mobile OTP states
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  // Sign up form states
  const [signupFirstName, setSignupFirstName] = useState<string>('');
  const [signupLastName, setSignupLastName] = useState<string>('');
  const [signupEmail, setSignupEmail] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('');
  const [signupPhone, setSignupPhone] = useState<string>('');

  // Forgot Password states
  const [openForgotDialog, setOpenForgotDialog] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');

  // Cooldown timer handler for sending OTP
  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Email Signin Handler
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await AuthService.signin({
        email: email.trim(),
        password,
        platform: 'web',
      });

      // Backend may wrap the tokens in { data: ... }
      const tokens = (res as any)?.data ?? res;
      if (tokens && tokens.access_token) {
        localStorage.setItem('authToken', tokens.access_token);
        if (tokens.refresh_token) {
          localStorage.setItem('refreshToken', tokens.refresh_token);
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

  // Send OTP Handler
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setErrorMsg('Please enter your phone number.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await AuthService.signinMobile({
        phoneNumber: phoneNumber.trim(),
        otp: '',
      });
      setOtpSent(true);
      setResendCooldown(60);
    } catch (err: any) {
      console.error('Send OTP error:', err);
      setErrorMsg(err.message || 'Failed to send OTP. Please verify your phone number.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP Handler
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !otp) {
      setErrorMsg('Please enter both phone number and OTP.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await AuthService.signinMobileVerify({
        phoneNumber: phoneNumber.trim(),
        otp: otp.trim(),
      }, 'web');

      // Backend may wrap the tokens in { data: ... }
      const tokens = (res as any)?.data ?? res;
      if (tokens && tokens.access_token) {
        localStorage.setItem('authToken', tokens.access_token);
        if (tokens.refresh_token) {
          localStorage.setItem('refreshToken', tokens.refresh_token);
        }
        onLoginSuccess();
      } else {
        setErrorMsg('Verification succeeded but no token was returned.');
      }
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      setErrorMsg(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Sign up handler
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupFirstName || !signupLastName || !signupEmail || !signupPassword || !signupPhone) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await AuthService.signupEmail({
        firstName: signupFirstName.trim(),
        lastName: signupLastName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
        phoneNumber: Number(signupPhone.trim().replace(/\D/g, '')) || 0,
      });
      setSuccessMsg('Registration successful! You can now sign in below.');
      setActiveTab(0); // Switch to Email login tab
      // Clear inputs
      setSignupFirstName('');
      setSignupLastName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupPhone('');
    } catch (err: any) {
      console.error('Email signup error:', err);
      setErrorMsg(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password request handler
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await AuthService.forgotPassword({
        email: forgotEmail.trim(),
        platform: 'web',
      });
      setSuccessMsg('Instructions to reset your password have been sent to your email.');
      setOpenForgotDialog(false);
      setForgotEmail('');
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setErrorMsg(err.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  // Google Signin — backend address comes from VITE_API_BASE_URL (.env),
  // never hardcoded, so dev and production each hit the right server
  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/v1/auth/login/google`;
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
                FALL DETECTION
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                Real-time alerts
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
                HEALTH VITALS
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                Device monitoring
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
              Sign in or register to manage residents, monitors, and alerts.
            </Typography>

            {/* Premium Selector Tabs (Email, Mobile OTP, Register) */}
            <Tabs
              value={activeTab}
              onChange={(_, val) => {
                setActiveTab(val);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              variant="fullWidth"
              sx={{
                mb: 4,
                borderBottom: '1px solid #EAE5E0',
                '& .MuiTabs-indicator': {
                  backgroundColor: '#D45529',
                },
              }}
            >
              <Tab
                label="Sign In"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: activeTab === 0 ? '#D45529' : '#8C7E76',
                  '&.Mui-selected': { color: '#D45529' },
                }}
              />
              <Tab
                label="Mobile OTP"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: activeTab === 1 ? '#D45529' : '#8C7E76',
                  '&.Mui-selected': { color: '#D45529' },
                }}
              />
              <Tab
                label="Register"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: activeTab === 2 ? '#D45529' : '#8C7E76',
                  '&.Mui-selected': { color: '#D45529' },
                }}
              />
            </Tabs>

            {/* Notifications */}
            {errorMsg && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '8px', fontWeight: 500 }}>
                {errorMsg}
              </Alert>
            )}
            {successMsg && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: '8px', fontWeight: 500 }}>
                {successMsg}
              </Alert>
            )}

            {/* Tab 0: Email/Password Login Form */}
            {activeTab === 0 && (
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
            )}

            {/* Tab 1: Mobile OTP Login Form */}
            {activeTab === 1 && (
              <Box>
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} id="send-otp-form">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      <TextField
                        id="phone-input"
                        label="Phone Number"
                        type="tel"
                        variant="outlined"
                        fullWidth
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 1234567890"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon sx={{ color: '#8C7E76', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          }
                        }}
                      />

                      <Button
                        id="send-otp-button"
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
                      </Button>
                    </Box>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} id="verify-otp-form">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      <Typography variant="body2" sx={{ color: '#6E625B', mb: 1 }}>
                        We sent a verification code to <strong>{phoneNumber}</strong>.
                      </Typography>

                      <TextField
                        id="otp-input"
                        label="6-Digit OTP"
                        type="text"
                        variant="outlined"
                        fullWidth
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <VpnKeyIcon sx={{ color: '#8C7E76', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          }
                        }}
                      />

                      <Button
                        id="verify-otp-button"
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify & Login'}
                      </Button>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Button
                          id="resend-otp-button"
                          variant="text"
                          disabled={resendCooldown > 0 || loading}
                          onClick={handleSendOtp}
                          sx={{
                            color: '#D45529',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            p: 0,
                            textTransform: 'none',
                            '&:hover': { background: 'none', textDecoration: 'underline' },
                          }}
                        >
                          {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                        </Button>
                        <Button
                          id="change-phone-button"
                          variant="text"
                          onClick={() => {
                            setOtpSent(false);
                            setOtp('');
                            setErrorMsg(null);
                          }}
                          sx={{
                            color: '#8C7E76',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            p: 0,
                            textTransform: 'none',
                            '&:hover': { background: 'none', textDecoration: 'underline' },
                          }}
                        >
                          Change Phone Number
                        </Button>
                      </Box>
                    </Box>
                  </form>
                )}
              </Box>
            )}

            {/* Tab 2: User Self-Registration Form */}
            {activeTab === 2 && (
              <form onSubmit={handleSignupSubmit} id="email-signup-form">
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="First Name"
                      type="text"
                      variant="outlined"
                      fullWidth
                      required
                      value={signupFirstName}
                      onChange={(e) => setSignupFirstName(e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: '#8C7E76', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        }
                      }}
                    />
                    <TextField
                      label="Last Name"
                      type="text"
                      variant="outlined"
                      fullWidth
                      required
                      value={signupLastName}
                      onChange={(e) => setSignupLastName(e.target.value)}
                    />
                  </Box>

                  <TextField
                    label="Email address"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
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
                    label="Phone Number"
                    type="tel"
                    variant="outlined"
                    fullWidth
                    required
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="e.g. 1234567890"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: '#8C7E76', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }
                    }}
                  />

                  <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#8C7E76', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }
                    }}
                  />

                  <Button
                    id="email-signup-button"
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
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                  </Button>
                </Box>
              </form>
            )}

            {/* Google Social OAuth Integrator */}
            {activeTab !== 2 && (
              <Box sx={{ mt: 3, mb: 1 }}>
                <Divider sx={{ mb: 3, color: '#C2B8B2', fontSize: '0.75rem', fontWeight: 600 }}>OR</Divider>
                <Button
                  id="google-signin-button"
                  variant="outlined"
                  fullWidth
                  size="large"
                  onClick={handleGoogleLogin}
                  sx={{
                    py: 1.25,
                    color: '#1A0E07',
                    borderColor: '#EAE5E0',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    backgroundColor: '#FFFFFF',
                    '&:hover': {
                      borderColor: '#C2B8B2',
                      backgroundColor: '#FAF8F6',
                    },
                  }}
                >
                  <GoogleIconSvg />
                  Continue with Google
                </Button>
              </Box>
            )}

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
                onClick={() => setOpenForgotDialog(true)}
                sx={{
                  color: '#D45529',
                  fontWeight: 700,
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Forgot Password?
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Box>

      {/* Forgot Password Modal Dialog */}
      <Dialog
        open={openForgotDialog}
        onClose={() => setOpenForgotDialog(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: '12px', p: 1 }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#1A0E07', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Reset Password
          <IconButton onClick={() => setOpenForgotDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleForgotSubmit}>
          <DialogContent>
            <Typography variant="body2" sx={{ color: '#6E625B', mb: 3 }}>
              Enter your email address and we'll send you instructions to reset your password.
            </Typography>
            <TextField
              label="Email address"
              type="email"
              variant="outlined"
              fullWidth
              required
              autoFocus
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
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
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpenForgotDialog(false)} sx={{ color: '#8C7E76', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ fontWeight: 700 }}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Send Instructions'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Login;
