import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Avatar,
  Chip,
  Button,
  Tabs,
  Tab,
  IconButton,
  Divider,
  Switch,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SpeedIcon from '@mui/icons-material/Speed';
import OpacityIcon from '@mui/icons-material/Opacity';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import ChatIcon from '@mui/icons-material/Chat';
import WarningIcon from '@mui/icons-material/Warning';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import ErrorIcon from '@mui/icons-material/Error';
import SecurityIcon from '@mui/icons-material/Security';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';

import { FallAlertModal } from '../components/FallAlertModal';

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface ActivityLogItem {
  id: string;
  author: string;
  role: string;
  avatarBg: string;
  time: string;
  category: 'INCIDENT' | 'MEDICAL' | 'GENERAL' | 'DEVICE';
  content: string;
}

export const Seniors: React.FC = () => {
  const [openFallAlert, setOpenFallAlert] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState(0);

  // ─── State for Notes & Activity tab ────────────────────────────────────────
  const [noteText, setNoteText] = useState('');
  const [noteCategory, setNoteCategory] = useState<'GENERAL' | 'INCIDENT' | 'MEDICAL' | 'DEVICE'>('GENERAL');
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([
    {
      id: '1',
      author: 'Ravi Krishnamurthy',
      role: 'Admin',
      avatarBg: '#3B82F6',
      time: 'Today, 09:14 AM',
      category: 'INCIDENT',
      content: 'Fall alert triggered for Meena Devi — EV-07B #4421, Wing C. Proceeding through confirmation protocol. Guardian Kavitha Meena auto-notified via WhatsApp + SMS.',
    },
    {
      id: '2',
      author: 'Priya K.',
      role: 'Caregiver',
      avatarBg: '#D45529',
      time: 'Today, 07:45 AM',
      category: 'MEDICAL',
      content: 'Morning vitals recorded. BP elevated at 148/94 — noted for physician review. Senior was cooperative. Complained of knee pain during morning walk. Physiotherapy session reminder sent to Kiran Raj.',
    },
    {
      id: '3',
      author: 'Lakshmi K.',
      role: 'Caregiver',
      avatarBg: '#10B981',
      time: 'Yesterday, 08:20 PM',
      category: 'MEDICAL',
      content: 'Evening medication — Metformin missed again. Senior said she "already took it" (likely confused with calcium supplement). Gently redirected, but she declined. Noted for physician review. Donepezil taken at 9:45 PM.',
    },
    {
      id: '4',
      author: 'Rajan J.',
      role: 'Attendant',
      avatarBg: '#F59E0B',
      time: 'Yesterday, 10:48 PM',
      category: 'INCIDENT',
      content: 'Bed exit alert at 10:32 PM. Checked on senior — she was awake and trying to get water from her table. Assisted her back to bed, placed water bottle within reach. No fall or injury.',
    },
    {
      id: '5',
      author: 'Dr. Suresh Babu',
      role: 'Physician',
      avatarBg: '#3B82F6',
      time: 'May 20, 11:00 AM',
      category: 'MEDICAL',
      content: 'Reviewed Meena Devi. HbA1c remains high at 8.1%. Increasing focus on ensuring Metformin compliance — spoke to Kavitha (daughter) about strategies to remind Amma. BP still elevated — will refer to cardiologist June 5 if no improvement. Next review scheduled June 20.',
    },
    {
      id: '6',
      author: 'Kiran Raj',
      role: 'Physiotherapist',
      avatarBg: '#6B7280',
      time: 'May 19, 10:30 AM',
      category: 'GENERAL',
      content: 'Physiotherapy session completed — 35 min. Focused on lower limb strengthening and balance training. Senior showed improvement in single-leg stand (3 sec -> 5 sec). Recommended anti-skid slippers — requested admin to procure. Next session Thursday.',
    },
    {
      id: '7',
      author: 'Ravi Krishnamurthy',
      role: 'Admin',
      avatarBg: '#3B82F6',
      time: 'May 14, 02:52 PM',
      category: 'DEVICE',
      content: 'Fall alert May 14 — marked as false alarm after calling senior (answered, was seated and had bumped device on table edge). EV-07B sensitivity review logged — possibly needs recalibration. Ticket raised with Healthsoft support.',
    },
  ]);

  // ─── State for Guardian Preferences ───────────────────────────────────────
  const [kavithaPrefs, setKavithaPrefs] = useState({
    fallAlert: true,
    missedDoses: true,
    lowBattery: false,
    geofence: true,
    sosButton: true,
    weeklyReport: true,
  });

  const [sureshPrefs, setSureshPrefs] = useState({
    fallAlert: true,
    missedDoses: false,
    lowBattery: true,
    geofence: true,
    sosButton: true,
    weeklyReport: false,
  });

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveSubTab(newValue);
  };

  const handlePostNote = () => {
    if (!noteText.trim()) return;

    const newLog: ActivityLogItem = {
      id: Date.now().toString(),
      author: 'Ravi Krishnamurthy',
      role: 'Admin',
      avatarBg: '#3B82F6',
      time: 'Just now',
      category: noteCategory,
      content: noteText.trim(),
    };

    setActivityLogs([newLog, ...activityLogs]);
    setNoteText('');
  };

  // Helper count notes
  const totalNotes = activityLogs.length + 35; // base offset
  const incidentNotesCount = activityLogs.filter(l => l.category === 'INCIDENT').length + 6;
  const medicalNotesCount = activityLogs.filter(l => l.category === 'MEDICAL').length + 14;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* 1. Header Banner Panel */}
      <Card
        sx={{
          bgcolor: '#0F172A',
          borderRadius: '12px',
          color: '#FFFFFF',
          p: 3.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          boxShadow: 'none',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2.5,
          }}
        >
          {/* Avatar & Basic Details */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Avatar
              sx={{
                bgcolor: '#FEF3C7',
                color: '#D97706',
                width: 76,
                height: 76,
                fontSize: '1.75rem',
                fontWeight: 800,
                border: '2.5px solid #F59E0B',
              }}
            >
              MD
            </Avatar>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 0.5 }}>
                Meena Devi
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500, mb: 1 }}>
                Female · 82 years · DOB: March 14, 1944 · Blood Group: O+
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<LocationOnIcon sx={{ '&&': { color: '#D97706', fontSize: 13 } }} />}
                  label="Room 12-B - Wing C"
                  size="small"
                  sx={{ bgcolor: '#FEF3C7', color: '#D97706', fontWeight: 700, fontSize: '0.7rem', borderRadius: '6px' }}
                />
                <Chip
                  label="High Fall Risk"
                  size="small"
                  sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 700, fontSize: '0.7rem', borderRadius: '6px' }}
                />
                <Chip
                  label="Active Resident"
                  size="small"
                  sx={{ bgcolor: '#D1FAE5', color: '#059669', fontWeight: 700, fontSize: '0.7rem', borderRadius: '6px' }}
                />
                <Chip
                  label="Admitted Feb 12, 2024"
                  size="small"
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#E2E8F0', fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px' }}
                />
                <Chip
                  label="SR-001"
                  size="small"
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#E2E8F0', fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px' }}
                />
              </Box>
            </Box>
          </Box>

          {/* Header Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', width: { xs: '100%', md: 'auto' } }}>
            <Button
              variant="contained"
              onClick={() => setOpenFallAlert(true)}
              startIcon={<NotificationsActiveIcon />}
              sx={{
                bgcolor: '#EF4444',
                '&:hover': { bgcolor: '#DC2626' },
                color: '#FFFFFF',
                fontWeight: 700,
                textTransform: 'none',
                px: 2.5,
                py: 1,
                fontSize: '0.825rem',
                borderRadius: '8px',
                boxShadow: 'none',
              }}
            >
              Active Fall Alert
            </Button>
            <Button
              variant="outlined"
              startIcon={<PhoneIcon />}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontWeight: 700,
                textTransform: 'none',
                px: 2.5,
                py: 1,
                fontSize: '0.825rem',
                borderRadius: '8px',
                '&:hover': {
                  borderColor: '#FFFFFF',
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              Call Room
            </Button>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 0.5 }} />

        {/* Header Stats Grid */}
        <Grid container spacing={3.5}>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', lineHeight: 1, mb: 0.5 }}>
                3
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>
                FALLS THIS YEAR
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', lineHeight: 1, mb: 0.5 }}>
                68%
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>
                MED COMPLIANCE
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', lineHeight: 1, mb: 0.5 }}>
                2
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>
                DEVICES ACTIVE
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981', lineHeight: 1, mb: 0.5 }}>
                97%
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>
                SPO₂ (LATEST)
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#D97706', lineHeight: 1, mb: 0.5 }}>
                148/94
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>
                BLOOD PRESSURE
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', lineHeight: 1, mb: 0.5 }}>
                2
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>
                GUARDIANS
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* 2. Sub-Tabs */}
      <Box sx={{ borderBottom: '1px solid #EAE5E0', mt: -1 }}>
        <Tabs
          value={activeSubTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#D45529' },
            '& .MuiTab-root': {
              fontWeight: 700,
              fontSize: '0.85rem',
              minWidth: 'auto',
              px: 3,
              pb: 1.25,
              color: '#8C7E76',
              textTransform: 'none',
              '&.Mui-selected': { color: '#D45529' },
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Medical" />
          <Tab label="Devices" />
          <Tab label="Alert History" />
          <Tab label="Guardians" />
          <Tab label="Notes & Activity" />
        </Tabs>
      </Box>

      {/* 3. Sub-Tabs Views Content */}
      <Box>
        {/* SUBTAB 0: Overview (Demographics & Basic Summary) */}
        {activeSubTab === 0 && (
          <Grid container spacing={3.5}>
            {/* Left Demographics */}
            <Grid size={{ xs: 12, md: 8.5 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              <Card sx={{ p: 3, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2.5 }}>
                  PERSONAL INFORMATION
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>FULL NAME</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>Meena Devi</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>GENDER</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>Female</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>DATE OF BIRTH</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>March 14, 1944</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>AGE</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>82 years</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>NATIONALITY</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>Indian</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>BLOOD GROUP</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>O+</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>PRIMARY LANGUAGE</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>Tamil, Hindi</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>RELIGION</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>Hindu</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>RESIDENT ID</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>SR-001</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>ADMISSION DATE</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>February 12, 2024</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>ROOM</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>12-B · Wing C · 2nd Floor</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>MOBILITY AID</Typography><Typography variant="body2" sx={{ fontWeight: 700, color: '#D45529' }}>Walker (prescribed)</Typography></Box></Grid>
                </Grid>
              </Card>

              {/* Vitals Summary */}
              <Card sx={{ p: 3, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px' }}>LATEST VITALS</Typography>
                  <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 500 }}>Recorded 07:30 AM today</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}><Box sx={{ p: 2, border: '1px solid #EAE5E0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0.5 }}><FavoriteIcon sx={{ color: '#D45529', fontSize: 24, mb: 0.5 }} /><Typography variant="h6" sx={{ fontWeight: 800, color: '#1A0E07', lineHeight: 1.1 }}>82</Typography><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.62rem' }}>HEART RATE</Typography><Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600, fontSize: '0.68rem' }}>Normal range</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><Box sx={{ p: 2, border: '1px solid #EAE5E0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0.5 }}><SpeedIcon sx={{ color: '#D45529', fontSize: 24, mb: 0.5 }} /><Typography variant="h6" sx={{ fontWeight: 800, color: '#1A0E07', lineHeight: 1.1 }}>148/94</Typography><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.62rem' }}>BLOOD PRESSURE</Typography><Typography variant="caption" sx={{ color: '#EF4444', fontWeight: 600, fontSize: '0.68rem' }}>Stage 2 - Elevated</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><Box sx={{ p: 2, border: '1px solid #EAE5E0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0.5 }}><OpacityIcon sx={{ color: '#D45529', fontSize: 24, mb: 0.5 }} /><Typography variant="h6" sx={{ fontWeight: 800, color: '#1A0E07', lineHeight: 1.1 }}>97%</Typography><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.62rem' }}>OXYGEN SAT.</Typography><Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600, fontSize: '0.68rem' }}>Normal range</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><Box sx={{ p: 2, border: '1px solid #EAE5E0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0.5 }}><ThermostatIcon sx={{ color: '#D45529', fontSize: 24, mb: 0.5 }} /><Typography variant="h6" sx={{ fontWeight: 800, color: '#1A0E07', lineHeight: 1.1 }}>36.8</Typography><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.62rem' }}>TEMPERATURE</Typography><Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600, fontSize: '0.68rem' }}>Normal</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><Box sx={{ p: 2, border: '1px solid #EAE5E0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0.5 }}><WaterDropIcon sx={{ color: '#D45529', fontSize: 24, mb: 0.5 }} /><Typography variant="h6" sx={{ fontWeight: 800, color: '#1A0E07', lineHeight: 1.1 }}>162</Typography><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.62rem' }}>BLOOD GLUCOSE</Typography><Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 600, fontSize: '0.68rem' }}>Post-meal - High</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><Box sx={{ p: 2, border: '1px solid #EAE5E0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0.5 }}><AirIcon sx={{ color: '#D45529', fontSize: 24, mb: 0.5 }} /><Typography variant="h6" sx={{ fontWeight: 800, color: '#1A0E07', lineHeight: 1.1 }}>16</Typography><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.62rem' }}>RESP. RATE</Typography><Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600, fontSize: '0.68rem' }}>Normal</Typography></Box></Grid>
                </Grid>
              </Card>

              {/* Care Team */}
              <Card sx={{ p: 3, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2.5 }}>CARE TEAM</Typography>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>PRIMARY PHYSICIAN</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>Dr. Suresh Babu - Geriatrics</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>PHYSICIAN CONTACT</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>+91 98451 00001</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>ASSIGNED CAREGIVER</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>Priya K. - Wing C</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>FLOOR ATTENDANT</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>Rajan J. - Wing C</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>DIETITIAN</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>Mrs. Annapurna S.</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>PHYSIOTHERAPIST</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>Mr. Kiran Raj - Mon / Thu</Typography></Box></Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Right Summary Panel */}
            <Grid size={{ xs: 12, md: 3.5 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              <Card sx={{ p: 2.5, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2 }}>RISK SUMMARY</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>Fall Risk</Typography><Typography variant="caption" sx={{ color: '#EF4444', fontWeight: 700 }}>HIGH</Typography></Box><Divider sx={{ borderColor: '#F5F2EF' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>Wander Risk</Typography><Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 700 }}>MEDIUM</Typography></Box><Divider sx={{ borderColor: '#F5F2EF' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>Medication Compliance</Typography><Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 700 }}>MEDIUM</Typography></Box><Divider sx={{ borderColor: '#F5F2EF' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>Diabetes Management</Typography><Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 700 }}>MEDIUM</Typography></Box><Divider sx={{ borderColor: '#F5F2EF' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>Cardiac Risk</Typography><Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 700 }}>MEDIUM</Typography></Box><Divider sx={{ borderColor: '#F5F2EF' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>Pressure Sore Risk</Typography><Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>LOW</Typography></Box>
                </Box>
              </Card>

              <Card sx={{ p: 2.5, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2 }}>EMERGENCY CONTACTS</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Avatar sx={{ bgcolor: '#FEF3C7', color: '#D97706', width: 28, height: 28, fontSize: '0.75rem', fontWeight: 750 }}>KM</Avatar><Box><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07', fontSize: '0.8rem' }}>Kavitha Meena</Typography><Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.68rem', display: 'block' }}>Daughter - Primary</Typography></Box></Box><Box sx={{ display: 'flex', gap: 0.5 }}><IconButton size="small" sx={{ border: '1px solid #EAE5E0', color: '#4F46E5', borderRadius: '4px', p: 0.5 }}><PhoneIcon sx={{ fontSize: 13 }} /></IconButton><IconButton size="small" sx={{ border: '1px solid #EAE5E0', color: '#4F46E5', borderRadius: '4px', p: 0.5 }}><ChatIcon sx={{ fontSize: 13 }} /></IconButton></Box></Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Avatar sx={{ bgcolor: '#DBEAFE', color: '#2563EB', width: 28, height: 28, fontSize: '0.75rem', fontWeight: 750 }}>SM</Avatar><Box><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07', fontSize: '0.8rem' }}>Suresh Meena</Typography><Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.68rem', display: 'block' }}>Son - Secondary</Typography></Box></Box><Box sx={{ display: 'flex', gap: 0.5 }}><IconButton size="small" sx={{ border: '1px solid #EAE5E0', color: '#4F46E5', borderRadius: '4px', p: 0.5 }}><PhoneIcon sx={{ fontSize: 13 }} /></IconButton><IconButton size="small" sx={{ border: '1px solid #EAE5E0', color: '#4F46E5', borderRadius: '4px', p: 0.5 }}><ChatIcon sx={{ fontSize: 13 }} /></IconButton></Box></Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Avatar sx={{ bgcolor: '#D1FAE5', color: '#059669', width: 28, height: 28, fontSize: '0.75rem', fontWeight: 750 }}>SB</Avatar><Box><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07', fontSize: '0.8rem' }}>Dr. Suresh Babu</Typography><Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.68rem', display: 'block' }}>Primary Physician</Typography></Box></Box><Box sx={{ display: 'flex', gap: 0.5 }}><IconButton size="small" sx={{ border: '1px solid #EAE5E0', color: '#4F46E5', borderRadius: '4px', p: 0.5 }}><PhoneIcon sx={{ fontSize: 13 }} /></IconButton><IconButton size="small" sx={{ border: '1px solid #EAE5E0', color: '#4F46E5', borderRadius: '4px', p: 0.5 }}><ChatIcon sx={{ fontSize: 13 }} /></IconButton></Box></Box>
                </Box>
              </Card>

              <Card sx={{ p: 2.5, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2 }}>ACTIVE CONDITIONS</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="Osteoporosis" size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 600, fontSize: '0.73rem', borderRadius: '4px' }} />
                  <Chip label="Type 2 Diabetes" size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 600, fontSize: '0.73rem', borderRadius: '4px' }} />
                  <Chip label="Hypertension" size="small" sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 600, fontSize: '0.73rem', borderRadius: '4px' }} />
                  <Chip label="Mild Dementia" size="small" sx={{ bgcolor: '#F3F4F6', color: '#4B5563', fontWeight: 600, fontSize: '0.73rem', borderRadius: '4px' }} />
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* SUBTAB 1: Medical Details Tab View */}
        {activeSubTab === 1 && (
          <Grid container spacing={3.5}>
            {/* Left Medical Form column */}
            <Grid size={{ xs: 12, md: 8.5 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              
              {/* Card 1: Diagnosed Conditions */}
              <Card sx={{ p: 3, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2.5 }}>
                  DIAGNOSED CONDITIONS
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {/* Condition 1 */}
                  <Box sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#1A0E07', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarningIcon sx={{ color: '#EF4444', fontSize: 16 }} /> Osteoporosis
                      </Typography>
                      <Chip label="High Risk" size="small" sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 800, fontSize: '0.65rem', borderRadius: '4px' }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', lineHeight: 1.5 }}>
                      <strong>Severe</strong> — diagnosed June 2021. High fracture risk. 3 falls this year, 1 resulting in hairline wrist fracture (Jan 2026). Physiotherapy twice weekly.
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  {/* Condition 2 */}
                  <Box sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#1A0E07', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarningAmberIcon sx={{ color: '#D97706', fontSize: 16 }} /> Type 2 Diabetes Mellitus
                      </Typography>
                      <Chip label="Monitor" size="small" sx={{ bgcolor: '#FFFBEB', color: '#D97706', fontWeight: 800, fontSize: '0.65rem', borderRadius: '4px' }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', lineHeight: 1.5 }}>
                      Diagnosed 2014. HbA1c: 8.1% (March 2026). Managed with Metformin 500mg BD. Compliance issues noted this week — 4 missed doses. Blood glucose monitoring twice daily.
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  {/* Condition 3 */}
                  <Box sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#1A0E07', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarningAmberIcon sx={{ color: '#D97706', fontSize: 16 }} /> Hypertension — Stage 2
                      </Typography>
                      <Chip label="Elevated" size="small" sx={{ bgcolor: '#FFFBEB', color: '#D97706', fontWeight: 800, fontSize: '0.65rem', borderRadius: '4px' }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', lineHeight: 1.5 }}>
                      BP consistently elevated — 148/94 today. On Amlodipine 5mg OD. Target BP: 130/80. Review with cardiologist due in June 2026.
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  {/* Condition 4 */}
                  <Box sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#1A0E07', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InfoIcon sx={{ color: '#3B82F6', fontSize: 16 }} /> Mild Cognitive Impairment (Early Dementia)
                      </Typography>
                      <Chip label="Stable" size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 800, fontSize: '0.65rem', borderRadius: '4px' }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', lineHeight: 1.5 }}>
                      Diagnosed March 2025. MMSE score: 22/30. Oriented to person, partially to place. Memory prompts required for medications. Night-time confusion episodes 1-2× per week.
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  {/* Condition 5 */}
                  <Box sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#1A0E07', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InfoIcon sx={{ color: '#3B82F6', fontSize: 16 }} /> Arthritis — Bilateral Knees
                      </Typography>
                      <Chip label="Stable" size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 800, fontSize: '0.65rem', borderRadius: '4px' }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', lineHeight: 1.5 }}>
                      Degenerative arthritis. Mobility reduced. Managed with physiotherapy and Aspirin 75mg. No surgical intervention planned.
                    </Typography>
                  </Box>
                </Box>
              </Card>

              {/* Card 2: Current Medications & Compliance */}
              <Card sx={{ p: 3, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2.5 }}>
                  CURRENT MEDICATIONS & COMPLIANCE
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                  {/* Med 1 */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.25 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#1A0E07' }}>
                          💊 Metformin 500mg
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.75rem', mt: 0.25, display: 'block' }}>
                          For: Type 2 Diabetes · Prescribed by Dr. Suresh Babu · Twice daily — Morning 8:00 AM, Evening 7:00 PM
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip label="MISSED (AM)" size="small" sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 800, fontSize: '0.65rem', borderRadius: '4px', mb: 0.5 }} />
                        <Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.68rem' }}>Refill: 18 days left</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flexGrow: 1, height: 6, bgcolor: '#EAE5E0', borderRadius: '3px', overflow: 'hidden' }}>
                        <Box sx={{ width: '58%', height: '100%', bgcolor: '#F97316' }} />
                      </Box>
                      <Typography sx={{ color: '#F97316', fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>58% this week · 4 missed doses</Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  {/* Med 2 */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.25 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#1A0E07' }}>
                          💊 Amlodipine 5mg
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.75rem', mt: 0.25, display: 'block' }}>
                          For: Hypertension · Prescribed by Dr. Suresh Babu · Once daily — Morning 9:00 AM with food
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip label="TAKEN (9:05 AM)" size="small" sx={{ bgcolor: '#D1FAE5', color: '#059669', fontWeight: 800, fontSize: '0.65rem', borderRadius: '4px', mb: 0.5 }} />
                        <Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.68rem' }}>Refill: 24 days left</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flexGrow: 1, height: 6, bgcolor: '#EAE5E0', borderRadius: '3px', overflow: 'hidden' }}>
                        <Box sx={{ width: '80%', height: '100%', bgcolor: '#10B981' }} />
                      </Box>
                      <Typography sx={{ color: '#10B981', fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>80% this week</Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  {/* Med 3 */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.25 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#1A0E07' }}>
                          💊 Aspirin 75mg
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.75rem', mt: 0.25, display: 'block' }}>
                          For: Arthritis / Cardiac prophylaxis · Dr. Suresh Babu · Once daily — Night 9:00 PM after dinner
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip label="DUE TONIGHT" size="small" sx={{ bgcolor: '#FFFBEB', color: '#D97706', fontWeight: 800, fontSize: '0.65rem', borderRadius: '4px', mb: 0.5 }} />
                        <Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.68rem' }}>Refill: 30 days left</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flexGrow: 1, height: 6, bgcolor: '#EAE5E0', borderRadius: '3px', overflow: 'hidden' }}>
                        <Box sx={{ width: '71%', height: '100%', bgcolor: '#F97316' }} />
                      </Box>
                      <Typography sx={{ color: '#F97316', fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>71% this week</Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  {/* Med 4 */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.25 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#1A0E07' }}>
                          💊 Calcium Carbonate 500mg + Vit D3
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.75rem', mt: 0.25, display: 'block' }}>
                          For: Osteoporosis · Dr. Suresh Babu · Once daily — Afternoon 1:00 PM with lunch
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip label="TAKEN (1:12 PM)" size="small" sx={{ bgcolor: '#D1FAE5', color: '#059669', fontWeight: 800, fontSize: '0.65rem', borderRadius: '4px', mb: 0.5 }} />
                        <Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.68rem' }}>Refill: 12 days left</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flexGrow: 1, height: 6, bgcolor: '#EAE5E0', borderRadius: '3px', overflow: 'hidden' }}>
                        <Box sx={{ width: '90%', height: '100%', bgcolor: '#10B981' }} />
                      </Box>
                      <Typography sx={{ color: '#10B981', fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>90% this week — Excellent</Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  {/* Med 5 */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.25 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#1A0E07' }}>
                          💊 Donepezil 5mg
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.75rem', mt: 0.25, display: 'block' }}>
                          For: Mild Cognitive Impairment · Dr. Kavita Nair (Neurologist) · Once daily — Bedtime 10:00 PM
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip label="DUE TONIGHT" size="small" sx={{ bgcolor: '#FFFBEB', color: '#D97706', fontWeight: 800, fontSize: '0.65rem', borderRadius: '4px', mb: 0.5 }} />
                        <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 0.5 }}><WarningIcon sx={{ fontSize: 11, color: '#F97316' }} /> Refill: 5 days left</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flexGrow: 1, height: 6, bgcolor: '#EAE5E0', borderRadius: '3px', overflow: 'hidden' }}>
                        <Box sx={{ width: '85%', height: '100%', bgcolor: '#10B981' }} />
                      </Box>
                      <Typography sx={{ color: '#10B981', fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>85% this week</Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>

              {/* Card 3: Allergies */}
              <Card sx={{ p: 3, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2.5 }}>
                  ALLERGIES & CONTRAINDICATIONS
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ p: 1.75, bgcolor: '#FFF1F2', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 2, borderLeft: '4px solid #EF4444' }}>
                    <ErrorIcon sx={{ color: '#EF4444', fontSize: 18 }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: '#991B1B', fontWeight: 750, fontSize: '0.825rem' }}>Penicillin</Typography>
                      <Typography variant="caption" sx={{ color: '#991B1B', opacity: 0.9, fontSize: '0.75rem', display: 'block', mt: 0.25 }}>Severe — Anaphylaxis. Documented 1998. No penicillin or beta-lactam antibiotics.</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ p: 1.75, bgcolor: '#FFF1F2', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 2, borderLeft: '4px solid #EF4444' }}>
                    <ErrorIcon sx={{ color: '#EF4444', fontSize: 18 }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: '#991B1B', fontWeight: 750, fontSize: '0.825rem' }}>Sulfonamides</Typography>
                      <Typography variant="caption" sx={{ color: '#991B1B', opacity: 0.9, fontSize: '0.75rem', display: 'block', mt: 0.25 }}>Moderate — Rash and hypersensitivity. Noted 2006.</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ p: 1.75, bgcolor: '#FFFBEB', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 2, borderLeft: '4px solid #F59E0B' }}>
                    <WarningIcon sx={{ color: '#F59E0B', fontSize: 18 }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: '#92400E', fontWeight: 750, fontSize: '0.825rem' }}>NSAIDs (Caution)</Typography>
                      <Typography variant="caption" sx={{ color: '#92400E', opacity: 0.9, fontSize: '0.75rem', display: 'block', mt: 0.25 }}>GI sensitivity. Use with caution and always with food. Avoid high doses.</Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>

            </Grid>

            {/* Right Medical Sidebar Column */}
            <Grid size={{ xs: 12, md: 3.5 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              {/* Physician Info Card */}
              <Card sx={{ p: 2.5, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2 }}>
                  PHYSICIAN INFO
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, fontSize: '0.62rem', letterSpacing: '0.5px' }}>PRIMARY</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 750, color: '#1A0E07', mt: 0.25 }}>Dr. Suresh Babu</Typography>
                    <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.73rem' }}>Geriatrics · MBBS MD</Typography>
                  </Box>

                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  <Box>
                    <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, fontSize: '0.62rem', letterSpacing: '0.5px' }}>NEUROLOGIST</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 750, color: '#1A0E07', mt: 0.25 }}>Dr. Kavita Nair</Typography>
                  </Box>

                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  <Box>
                    <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, fontSize: '0.62rem', letterSpacing: '0.5px' }}>NEXT REVIEW</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#D45529', mt: 0.25 }}>June 5, 2026 - Cardiology</Typography>
                  </Box>

                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  <Box>
                    <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, fontSize: '0.62rem', letterSpacing: '0.5px' }}>LAST VISIT</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07', mt: 0.25 }}>May 20, 2026</Typography>
                  </Box>
                </Box>
              </Card>

              {/* Lab Results Card */}
              <Card sx={{ p: 2.5, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2 }}>
                  LAB RESULTS (LATEST)
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>HbA1c</Typography>
                    <Typography variant="body2" sx={{ color: '#DC2626', fontWeight: 750, fontSize: '0.825rem' }}>8.1% - High</Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>Fasting Glucose</Typography>
                    <Typography variant="body2" sx={{ color: '#DC2626', fontWeight: 750, fontSize: '0.825rem' }}>136 mg/dL</Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>Total Cholesterol</Typography>
                    <Typography variant="body2" sx={{ color: '#059669', fontWeight: 750, fontSize: '0.825rem' }}>174 mg/dL · OK</Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>Serum Creatinine</Typography>
                    <Typography variant="body2" sx={{ color: '#059669', fontWeight: 750, fontSize: '0.825rem' }}>0.9 mg/dL · OK</Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>Vitamin D3</Typography>
                    <Typography variant="body2" sx={{ color: '#DC2626', fontWeight: 750, fontSize: '0.825rem' }}>14 ng/mL - Low</Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>MMSE Score</Typography>
                    <Typography variant="body2" sx={{ color: '#1A0E07', fontWeight: 750, fontSize: '0.825rem' }}>22 / 30</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#8C7E76', mt: 0.5, display: 'block', textAlign: 'right', fontSize: '0.68rem' }}>
                    Last labs: March 18, 2026
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* SUBTAB 2: Devices View Content */}
        {activeSubTab === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Devices Section Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#8C7E76', fontWeight: 600 }}>
                2 devices assigned to Meena Devi - SR-001
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon sx={{ fontSize: 13 }} />}
                sx={{
                  color: '#D45529',
                  borderColor: '#D45529',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  py: 0.5,
                  px: 1.5,
                  '&:hover': {
                    borderColor: '#B23F1C',
                    bgcolor: '#FFF2EC',
                  }
                }}
              >
                Assign Device
              </Button>
            </Box>

            {/* Devices Grid list */}
            <Grid container spacing={3.5}>
              {/* Device 1: EV-07B Wearable */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ border: '1px solid #EAE5E0', boxShadow: 'none', borderRadius: '8px', overflow: 'hidden' }}>
                  {/* Card title banner */}
                  <Box sx={{ bgcolor: '#1E293B', p: 2, color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <DeviceHubIcon sx={{ color: '#3B82F6' }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>EV-07B Wearable</Typography>
                        <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>Device ID: #4421 · IMEI: 867291049012345</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ color: '#10B981', fontWeight: 700, fontSize: '0.725rem', display: 'flex', alignItems: 'center', gap: 0.5 }}><Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981' }} /> Online</Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.625rem' }}>Last sync: 2 min ago</Typography>
                    </Box>
                  </Box>

                  {/* Device stats */}
                  <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.25 }}>
                    <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A0E07' }}>74%</Typography>
                        <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>BATTERY</Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A0E07' }}>12</Typography>
                        <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>ALERTS SENT</Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A0E07', fontSize: '1.15rem', mt: 0.35 }}>Mar '24</Typography>
                        <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>ASSIGNED</Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: -0.5 }}>
                      <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.68rem', fontWeight: 600 }}>Battery</Typography>
                      <Box sx={{ flexGrow: 1, height: 6, bgcolor: '#EAE5E0', borderRadius: '3px', overflow: 'hidden' }}>
                        <Box sx={{ width: '74%', height: '100%', bgcolor: '#10B981' }} />
                      </Box>
                      <Typography sx={{ color: '#10B981', fontWeight: 700, fontSize: '0.725rem' }}>74%</Typography>
                    </Box>

                    {/* Metadata details list */}
                    <Grid container spacing={1.5} sx={{ border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', p: 1.75, borderRadius: '8px' }}>
                      <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.62rem' }}>FIRMWARE</Typography><Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#1A0E07' }}>v3.2.1</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.62rem' }}>NETWORK</Typography><Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#1A0E07' }}>4G LTE - SIM OK</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.62rem' }}>FALL SENSOR</Typography><Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>Active</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.62rem' }}>GPS</Typography><Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>Lock acquired</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.62rem' }}>HEART RATE</Typography><Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>Monitoring</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.62rem' }}>SPO₂</Typography><Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>Monitoring</Typography></Grid>
                    </Grid>

                    {/* Alerts Log from device */}
                    <Box>
                      <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, fontSize: '0.62rem', letterSpacing: '0.5px', display: 'block', mb: 1 }}>
                        RECENT ALERTS FROM THIS DEVICE
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#EF4444' }} />
                          <Typography variant="caption" sx={{ color: '#8C7E76', width: 60 }}>09:14 AM</Typography>
                          <Typography variant="body2" sx={{ color: '#1A0E07', fontSize: '0.78rem', fontWeight: 600 }}>Fall detected — accelerometer 4.2G - <Box component="span" sx={{ color: '#EF4444' }}>Active</Box></Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#94A3B8' }} />
                          <Typography variant="caption" sx={{ color: '#8C7E76', width: 60 }}>May 14</Typography>
                          <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.78rem' }}>Fall detected — resolved (false alarm after call)</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#94A3B8' }} />
                          <Typography variant="caption" sx={{ color: '#8C7E76', width: 60 }}>Apr 2</Typography>
                          <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.78rem' }}>Fall detected — confirmed, attended, resolved</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid>

              {/* Device 2: Guard Rail - Bed Sensor */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ border: '1px solid #EAE5E0', boxShadow: 'none', borderRadius: '8px', overflow: 'hidden' }}>
                  {/* Card title banner */}
                  <Box sx={{ bgcolor: '#1E293B', p: 2, color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <SecurityIcon sx={{ color: '#EF4444' }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Guard Rail — Bed Sensor</Typography>
                        <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>Device ID: #0091 · Installed: Room 12-B</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ color: '#EF4444', fontWeight: 700, fontSize: '0.725rem', display: 'flex', alignItems: 'center', gap: 0.5 }}><Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#EF4444' }} /> Low Battery</Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.625rem' }}>Last sync: 18 min ago</Typography>
                    </Box>
                  </Box>

                  {/* Device stats */}
                  <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.25 }}>
                    <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#EF4444' }}>12%</Typography>
                        <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>BATTERY</Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A0E07' }}>3</Typography>
                        <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>ALERTS SENT</Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A0E07', fontSize: '1.15rem', mt: 0.35 }}>Feb '24</Typography>
                        <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>ASSIGNED</Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: -0.5 }}>
                      <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.68rem', fontWeight: 600 }}>Battery</Typography>
                      <Box sx={{ flexGrow: 1, height: 6, bgcolor: '#EAE5E0', borderRadius: '3px', overflow: 'hidden' }}>
                        <Box sx={{ width: '12%', height: '100%', bgcolor: '#EF4444' }} />
                      </Box>
                      <Typography sx={{ color: '#EF4444', fontWeight: 700, fontSize: '0.725rem' }}>12%</Typography>
                    </Box>

                    {/* Warning Battery Critical Alert */}
                    <Box sx={{ p: 1.25, bgcolor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', borderRadius: '6px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                      <WarningIcon sx={{ fontSize: 14, color: '#EF4444' }} />
                      Battery critical — device may go offline. Please charge or replace immediately.
                    </Box>

                    {/* Metadata details list */}
                    <Grid container spacing={1.5} sx={{ border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', p: 1.75, borderRadius: '8px' }}>
                      <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.62rem' }}>FIRMWARE</Typography><Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#1A0E07' }}>v2.1.0</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.62rem' }}>NETWORK</Typography><Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#1A0E07' }}>WiFi - Connected</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.62rem' }}>BED EXIT SENSOR</Typography><Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>Active</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.62rem' }}>MOTION DETECT</Typography><Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>Active</Typography></Grid>
                    </Grid>

                    {/* Alerts Log from device */}
                    <Box>
                      <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, fontSize: '0.62rem', letterSpacing: '0.5px', display: 'block', mb: 1 }}>
                        RECENT ALERTS FROM THIS DEVICE
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#F97316' }} />
                          <Typography variant="caption" sx={{ color: '#8C7E76', width: 60 }}>3 hrs ago</Typography>
                          <Typography variant="body2" sx={{ color: '#1A0E07', fontSize: '0.78rem', fontWeight: 600 }}>Low battery (12%) — alert sent to admin</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#94A3B8' }} />
                          <Typography variant="caption" sx={{ color: '#8C7E76', width: 60 }}>May 20</Typography>
                          <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.78rem' }}>Bed exit at 2:14 AM — senior returned within 4 min</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#94A3B8' }} />
                          <Typography variant="caption" sx={{ color: '#8C7E76', width: 60 }}>May 8</Typography>
                          <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.78rem' }}>Bed exit at 3:40 AM — staff attended, resolved</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* SUBTAB 3: Alert History View Table */}
        {activeSubTab === 3 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {/* Table title header and filters */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="body2" sx={{ color: '#8C7E76', fontWeight: 600 }}>
                All alerts for Meena Devi - SR-001 — showing 8 of 18 total
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Select defaultValue="ALL" size="small" sx={{ minWidth: 120, bgcolor: '#FFFFFF', borderRadius: '6px' }}>
                  <MenuItem value="ALL">All Types</MenuItem>
                  <MenuItem value="Fall">Fall Detected</MenuItem>
                  <MenuItem value="Dose">Missed Dose</MenuItem>
                  <MenuItem value="Battery">Low Battery</MenuItem>
                  <MenuItem value="Exit">Bed Exit</MenuItem>
                </Select>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    color: '#1A0E07',
                    borderColor: '#EAE5E0',
                    bgcolor: '#FFFFFF',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.825rem',
                    '&:hover': {
                      borderColor: '#D45529',
                      bgcolor: '#FAF8F6',
                    }
                  }}
                >
                  Export CSV
                </Button>
              </Box>
            </Box>

            {/* Main Log Table */}
            <TableContainer component={Paper} sx={{ border: '1px solid #EAE5E0', borderRadius: '8px', boxShadow: 'none', overflow: 'hidden' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: '#FAF8F6' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.75, fontSize: '0.725rem' }}>DATE & TIME</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.75, fontSize: '0.725rem' }}>TYPE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.75, fontSize: '0.725rem' }}>SEVERITY</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.75, fontSize: '0.725rem' }}>DEVICE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.75, fontSize: '0.725rem', width: '35%' }}>DESCRIPTION</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.75, fontSize: '0.725rem' }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.75, fontSize: '0.725rem' }}>RESOLVED BY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Row 1 */}
                  <TableRow sx={{ '&:hover': { bgcolor: '#FCFAF8' } }}>
                    <TableCell sx={{ py: 1.75, fontWeight: 700, color: '#1A0E07', fontSize: '0.825rem' }}>May 30, 09:14 AM<Typography variant="caption" sx={{ display: 'block', color: '#8C7E76', fontSize: '0.68rem' }}>Today</Typography></TableCell>
                    <TableCell sx={{ py: 1.75, fontWeight: 500, fontSize: '0.825rem' }}>Fall Detected</TableCell>
                    <TableCell sx={{ py: 1.75 }}><Chip label="CRITICAL" size="small" sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 800, fontSize: '0.6rem', borderRadius: '4px', height: 20 }} /></TableCell>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem' }}>EV-07B #4421</TableCell>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem', lineHeight: 1.4 }}>Accelerometer 4.2G impact. Posture drop confirmed.</TableCell>
                    <TableCell sx={{ py: 1.75 }}><Chip label="Open" variant="outlined" size="small" sx={{ color: '#EF4444', borderColor: '#FCA5A5', fontWeight: 700, fontSize: '0.68rem', borderRadius: '4px' }} /></TableCell>
                    <TableCell sx={{ py: 1.75, color: '#8C7E76', fontSize: '0.825rem' }}>—</TableCell>
                  </TableRow>

                  {/* Row 2 */}
                  <TableRow sx={{ '&:hover': { bgcolor: '#FCFAF8' } }}>
                    <TableCell sx={{ py: 1.75, fontWeight: 700, color: '#1A0E07', fontSize: '0.825rem' }}>May 30, 08:00 AM<Typography variant="caption" sx={{ display: 'block', color: '#8C7E76', fontSize: '0.68rem' }}>Today</Typography></TableCell>
                    <TableCell sx={{ py: 1.75, fontWeight: 500, fontSize: '0.825rem' }}>Missed Dose</TableCell>
                    <TableCell sx={{ py: 1.75 }}><Chip label="MEDIUM" size="small" sx={{ bgcolor: '#FFFBEB', color: '#D97706', fontWeight: 800, fontSize: '0.6rem', borderRadius: '4px', height: 20 }} /></TableCell>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem' }}>Health Guard</TableCell>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem', lineHeight: 1.4 }}>Metformin 500mg morning dose missed</TableCell>
                    <TableCell sx={{ py: 1.75 }}><Chip label="Noted" variant="outlined" size="small" sx={{ color: '#D97706', borderColor: '#FCD34D', fontWeight: 700, fontSize: '0.68rem', borderRadius: '4px' }} /></TableCell>
                    <TableCell sx={{ py: 1.75, color: '#8C7E76', fontSize: '0.825rem' }}>—</TableCell>
                  </TableRow>

                  {/* Row 3 */}
                  <TableRow sx={{ '&:hover': { bgcolor: '#FCFAF8' } }}>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem' }}>May 29, 07:10 PM</TableCell>
                    <TableCell sx={{ py: 1.75, fontWeight: 500, fontSize: '0.825rem' }}>Low Battery</TableCell>
                    <TableCell sx={{ py: 1.75 }}><Chip label="LOW" size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 800, fontSize: '0.6rem', borderRadius: '4px', height: 20 }} /></TableCell>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem' }}>Guard Rail #0091</TableCell>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem', lineHeight: 1.4 }}>Battery dropped to 12% — charge alert sent</TableCell>
                    <TableCell sx={{ py: 1.75 }}><Chip label="Acknowledged" variant="outlined" size="small" sx={{ color: '#F59E0B', borderColor: '#FCD34D', fontWeight: 700, fontSize: '0.68rem', borderRadius: '4px' }} /></TableCell>
                    <TableCell sx={{ py: 1.75, color: '#1A0E07', fontWeight: 600, fontSize: '0.825rem' }}>Ravi K.</TableCell>
                  </TableRow>

                  {/* Row 4 */}
                  <TableRow sx={{ '&:hover': { bgcolor: '#FCFAF8' } }}>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem' }}>May 27, 10:32 PM</TableCell>
                    <TableCell sx={{ py: 1.75, fontWeight: 500, fontSize: '0.825rem' }}>Bed Exit</TableCell>
                    <TableCell sx={{ py: 1.75 }}><Chip label="MEDIUM" size="small" sx={{ bgcolor: '#FFFBEB', color: '#D97706', fontWeight: 800, fontSize: '0.6rem', borderRadius: '4px', height: 20 }} /></TableCell>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem' }}>Guard Rail #0091</TableCell>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem', lineHeight: 1.4 }}>Nighttime bed exit at 10:32 PM — returned after 6 min</TableCell>
                    <TableCell sx={{ py: 1.75 }}><Chip label="Resolved" variant="outlined" size="small" sx={{ color: '#10B981', borderColor: '#A7F3D0', fontWeight: 700, fontSize: '0.68rem', borderRadius: '4px' }} /></TableCell>
                    <TableCell sx={{ py: 1.75, color: '#1A0E07', fontWeight: 600, fontSize: '0.825rem' }}>Rajan J.</TableCell>
                  </TableRow>

                  {/* Row 5 */}
                  <TableRow sx={{ '&:hover': { bgcolor: '#FCFAF8' } }}>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem' }}>May 14, 02:45 PM</TableCell>
                    <TableCell sx={{ py: 1.75, fontWeight: 500, fontSize: '0.825rem' }}>Fall Detected</TableCell>
                    <TableCell sx={{ py: 1.75 }}><Chip label="CRITICAL" size="small" sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 800, fontSize: '0.6rem', borderRadius: '4px', height: 20 }} /></TableCell>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem' }}>EV-07B #4421</TableCell>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem', lineHeight: 1.4 }}>Fall alert triggered. Called senior — answered, confirmed false alarm.</TableCell>
                    <TableCell sx={{ py: 1.75 }}><Chip label="False Alarm" variant="outlined" size="small" sx={{ color: '#6B7280', borderColor: '#D1D5DB', fontWeight: 700, fontSize: '0.68rem', borderRadius: '4px' }} /></TableCell>
                    <TableCell sx={{ py: 1.75, color: '#1A0E07', fontWeight: 600, fontSize: '0.825rem' }}>Ravi K.</TableCell>
                  </TableRow>

                  {/* Row 6 */}
                  <TableRow sx={{ '&:hover': { bgcolor: '#FCFAF8' } }}>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem' }}>Apr 2, 08:18 AM</TableCell>
                    <TableCell sx={{ py: 1.75, fontWeight: 500, fontSize: '0.825rem' }}>Fall Detected</TableCell>
                    <TableCell sx={{ py: 1.75 }}><Chip label="CRITICAL" size="small" sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 800, fontSize: '0.6rem', borderRadius: '4px', height: 20 }} /></TableCell>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem' }}>EV-07B #4421</TableCell>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem', lineHeight: 1.4 }}>Confirmed fall in corridor near Room 12-B. Dial4242 dispatched. Minor injury — no fracture.</TableCell>
                    <TableCell sx={{ py: 1.75 }}><Chip label="Resolved" variant="outlined" size="small" sx={{ color: '#10B981', borderColor: '#A7F3D0', fontWeight: 700, fontSize: '0.68rem', borderRadius: '4px' }} /></TableCell>
                    <TableCell sx={{ py: 1.75, color: '#1A0E07', fontWeight: 600, fontSize: '0.825rem' }}>Priya K.</TableCell>
                  </TableRow>

                  {/* Row 7 */}
                  <TableRow sx={{ '&:hover': { bgcolor: '#FCFAF8' } }}>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem' }}>Mar 15, 11:00 AM</TableCell>
                    <TableCell sx={{ py: 1.75, fontWeight: 500, fontSize: '0.825rem' }}>Geofence Exit</TableCell>
                    <TableCell sx={{ py: 1.75 }}><Chip label="CRITICAL" size="small" sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 800, fontSize: '0.6rem', borderRadius: '4px', height: 20 }} /></TableCell>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem' }}>EV-07B #4421</TableCell>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem', lineHeight: 1.4 }}>Briefly exited Wing C boundary near stairwell. Returned within 3 min with attendant.</TableCell>
                    <TableCell sx={{ py: 1.75 }}><Chip label="Resolved" variant="outlined" size="small" sx={{ color: '#10B981', borderColor: '#A7F3D0', fontWeight: 700, fontSize: '0.68rem', borderRadius: '4px' }} /></TableCell>
                    <TableCell sx={{ py: 1.75, color: '#1A0E07', fontWeight: 600, fontSize: '0.825rem' }}>Rajan J.</TableCell>
                  </TableRow>

                  {/* Row 8 */}
                  <TableRow sx={{ '&:hover': { bgcolor: '#FCFAF8' } }}>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem' }}>Jan 22, 06:45 AM</TableCell>
                    <TableCell sx={{ py: 1.75, fontWeight: 500, fontSize: '0.825rem' }}>Fall Detected</TableCell>
                    <TableCell sx={{ py: 1.75 }}><Chip label="CRITICAL" size="small" sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 800, fontSize: '0.6rem', borderRadius: '4px', height: 20 }} /></TableCell>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem' }}>EV-07B #4421</TableCell>
                    <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem', lineHeight: 1.4 }}>Fall in bathroom — confirmed. Wrist fracture (hairline). Admitted to hospital for 2 days. Returned Feb 3.</TableCell>
                    <TableCell sx={{ py: 1.75 }}><Chip label="Resolved" variant="outlined" size="small" sx={{ color: '#10B981', borderColor: '#A7F3D0', fontWeight: 700, fontSize: '0.68rem', borderRadius: '4px' }} /></TableCell>
                    <TableCell sx={{ py: 1.75, color: '#1A0E07', fontWeight: 600, fontSize: '0.825rem' }}>Ravi K.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* SUBTAB 4: Guardians View Content */}
        {activeSubTab === 4 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Guardians Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#8C7E76', fontWeight: 600 }}>
                2 guardians linked to Meena Devi - SR-001
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon sx={{ fontSize: 13 }} />}
                sx={{
                  color: '#D45529',
                  borderColor: '#D45529',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  py: 0.5,
                  px: 1.5,
                  '&:hover': {
                    borderColor: '#B23F1C',
                    bgcolor: '#FFF2EC',
                  }
                }}
              >
                Add Guardian
              </Button>
            </Box>

            {/* List of Guardians cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              {/* Guardian 1: Kavitha Meena */}
              <Card sx={{ p: 3, border: '1px solid #EAE5E0', borderRadius: '8px', boxShadow: 'none', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Guardian Header Row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#FEF3C7', color: '#D97706', width: 44, height: 44, fontSize: '1.1rem', fontWeight: 800 }}>KM</Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 750, color: '#1A0E07', display: 'flex', alignItems: 'center', gap: 1 }}>
                        Kavitha Meena
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.73rem' }}>Age 52 · Bangalore · kavitha.meena@gmail.com</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip label="Primary Guardian" size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 800, fontSize: '0.65rem', borderRadius: '4px', mb: 0.5 }} />
                    <Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.68rem', fontWeight: 550 }}>Daughter</Typography>
                  </Box>
                </Box>

                {/* Details info pills */}
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  <Chip label="Mobile: +91 98440 12345" size="small" sx={{ bgcolor: '#FAF8F6', color: '#6E625B', fontWeight: 600, fontSize: '0.725rem', borderRadius: '4px' }} />
                  <Chip label="Email: kavitha.meena@gmail.com" size="small" sx={{ bgcolor: '#FAF8F6', color: '#6E625B', fontWeight: 600, fontSize: '0.725rem', borderRadius: '4px' }} />
                  <Chip label="Address: Koramangala, Bangalore" size="small" sx={{ bgcolor: '#FAF8F6', color: '#6E625B', fontWeight: 600, fontSize: '0.725rem', borderRadius: '4px' }} />
                  <Chip label="WhatsApp: Linked" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.725rem', borderRadius: '4px' }} />
                </Box>

                <Divider sx={{ borderColor: '#F5F2EF' }} />

                {/* Switch notification preferences */}
                <Box>
                  <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.8px', display: 'block', mb: 1.5 }}>
                    ALERT NOTIFICATION PREFERENCES
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', borderRadius: '6px' }}>
                        <Typography sx={{ fontSize: '0.78rem', color: '#1A0E07', fontWeight: 600 }}>🚨 Fall Alert</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: kavithaPrefs.fallAlert ? '#059669' : '#8C7E76', fontWeight: 700 }}>{kavithaPrefs.fallAlert ? 'ON' : 'OFF'}</Typography>
                          <Switch size="small" checked={kavithaPrefs.fallAlert} onChange={(e) => setKavithaPrefs({ ...kavithaPrefs, fallAlert: e.target.checked })} />
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', borderRadius: '6px' }}>
                        <Typography sx={{ fontSize: '0.78rem', color: '#1A0E07', fontWeight: 600 }}>💊 Missed Doses</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: kavithaPrefs.missedDoses ? '#059669' : '#8C7E76', fontWeight: 700 }}>{kavithaPrefs.missedDoses ? 'ON' : 'OFF'}</Typography>
                          <Switch size="small" checked={kavithaPrefs.missedDoses} onChange={(e) => setKavithaPrefs({ ...kavithaPrefs, missedDoses: e.target.checked })} />
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', borderRadius: '6px' }}>
                        <Typography sx={{ fontSize: '0.78rem', color: '#1A0E07', fontWeight: 600 }}>🔋 Low Battery</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: kavithaPrefs.lowBattery ? '#059669' : '#8C7E76', fontWeight: 700 }}>{kavithaPrefs.lowBattery ? 'ON' : 'OFF'}</Typography>
                          <Switch size="small" checked={kavithaPrefs.lowBattery} onChange={(e) => setKavithaPrefs({ ...kavithaPrefs, lowBattery: e.target.checked })} />
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', borderRadius: '6px' }}>
                        <Typography sx={{ fontSize: '0.78rem', color: '#1A0E07', fontWeight: 600 }}>🗺️ Geofence Breach</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: kavithaPrefs.geofence ? '#059669' : '#8C7E76', fontWeight: 700 }}>{kavithaPrefs.geofence ? 'ON' : 'OFF'}</Typography>
                          <Switch size="small" checked={kavithaPrefs.geofence} onChange={(e) => setKavithaPrefs({ ...kavithaPrefs, geofence: e.target.checked })} />
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', borderRadius: '6px' }}>
                        <Typography sx={{ fontSize: '0.78rem', color: '#1A0E07', fontWeight: 600 }}>🆘 SOS Button</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: kavithaPrefs.sosButton ? '#059669' : '#8C7E76', fontWeight: 700 }}>{kavithaPrefs.sosButton ? 'ON' : 'OFF'}</Typography>
                          <Switch size="small" checked={kavithaPrefs.sosButton} onChange={(e) => setKavithaPrefs({ ...kavithaPrefs, sosButton: e.target.checked })} />
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', borderRadius: '6px' }}>
                        <Typography sx={{ fontSize: '0.78rem', color: '#1A0E07', fontWeight: 600 }}>📊 Weekly Report</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: kavithaPrefs.weeklyReport ? '#059669' : '#8C7E76', fontWeight: 700 }}>{kavithaPrefs.weeklyReport ? 'ON' : 'OFF'}</Typography>
                          <Switch size="small" checked={kavithaPrefs.weeklyReport} onChange={(e) => setKavithaPrefs({ ...kavithaPrefs, weeklyReport: e.target.checked })} />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Recent Notifications logs */}
                <Box>
                  <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, fontSize: '0.62rem', letterSpacing: '0.5px', display: 'block', mb: 1.5 }}>
                    RECENT NOTIFICATIONS SENT
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#1A0E07', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                        💬 Fall alert — Meena Devi - WhatsApp + SMS sent
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8C7E76' }}>09:14 AM today</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                        💬 Missed dose alert — 4 this week - WhatsApp
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8C7E76' }}>Yesterday</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                        💬 Weekly health summary — May 19–25
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8C7E76' }}>May 26</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                        💬 Fall alert — resolved as false alarm
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8C7E76' }}>May 14</Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>

              {/* Guardian 2: Suresh Meena */}
              <Card sx={{ p: 3, border: '1px solid #EAE5E0', borderRadius: '8px', boxShadow: 'none', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Guardian Header Row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#DBEAFE', color: '#2563EB', width: 44, height: 44, fontSize: '1.1rem', fontWeight: 800 }}>SM</Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 750, color: '#1A0E07', display: 'flex', alignItems: 'center', gap: 1 }}>
                        Suresh Meena
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.73rem' }}>Age 48 · Chennai · suresh.meena@outlook.com</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip label="Secondary Guardian" size="small" sx={{ bgcolor: '#F3F4F6', color: '#4B5563', fontWeight: 800, fontSize: '0.65rem', borderRadius: '4px', mb: 0.5 }} />
                    <Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.68rem', fontWeight: 550 }}>Son</Typography>
                  </Box>
                </Box>

                {/* Details info pills */}
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  <Chip label="Mobile: +91 98445 67890" size="small" sx={{ bgcolor: '#FAF8F6', color: '#6E625B', fontWeight: 600, fontSize: '0.725rem', borderRadius: '4px' }} />
                  <Chip label="Email: suresh.meena@outlook.com" size="small" sx={{ bgcolor: '#FAF8F6', color: '#6E625B', fontWeight: 600, fontSize: '0.725rem', borderRadius: '4px' }} />
                  <Chip label="City: Chennai" size="small" sx={{ bgcolor: '#FAF8F6', color: '#6E625B', fontWeight: 600, fontSize: '0.725rem', borderRadius: '4px' }} />
                </Box>

                <Divider sx={{ borderColor: '#F5F2EF' }} />

                {/* Switch notification preferences */}
                <Box>
                  <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.8px', display: 'block', mb: 1.5 }}>
                    ALERT NOTIFICATION PREFERENCES
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', borderRadius: '6px' }}>
                        <Typography sx={{ fontSize: '0.78rem', color: '#1A0E07', fontWeight: 600 }}>🚨 Fall Alert</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: sureshPrefs.fallAlert ? '#059669' : '#8C7E76', fontWeight: 700 }}>{sureshPrefs.fallAlert ? 'ON' : 'OFF'}</Typography>
                          <Switch size="small" checked={sureshPrefs.fallAlert} onChange={(e) => setSureshPrefs({ ...sureshPrefs, fallAlert: e.target.checked })} />
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', borderRadius: '6px' }}>
                        <Typography sx={{ fontSize: '0.78rem', color: '#1A0E07', fontWeight: 600 }}>💊 Missed Doses</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: sureshPrefs.missedDoses ? '#059669' : '#8C7E76', fontWeight: 700 }}>{sureshPrefs.missedDoses ? 'ON' : 'OFF'}</Typography>
                          <Switch size="small" checked={sureshPrefs.missedDoses} onChange={(e) => setSureshPrefs({ ...sureshPrefs, missedDoses: e.target.checked })} />
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', borderRadius: '6px' }}>
                        <Typography sx={{ fontSize: '0.78rem', color: '#1A0E07', fontWeight: 600 }}>🔋 Low Battery</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: sureshPrefs.lowBattery ? '#059669' : '#8C7E76', fontWeight: 700 }}>{sureshPrefs.lowBattery ? 'ON' : 'OFF'}</Typography>
                          <Switch size="small" checked={sureshPrefs.lowBattery} onChange={(e) => setSureshPrefs({ ...sureshPrefs, lowBattery: e.target.checked })} />
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', borderRadius: '6px' }}>
                        <Typography sx={{ fontSize: '0.78rem', color: '#1A0E07', fontWeight: 600 }}>🗺️ Geofence Breach</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: sureshPrefs.geofence ? '#059669' : '#8C7E76', fontWeight: 700 }}>{sureshPrefs.geofence ? 'ON' : 'OFF'}</Typography>
                          <Switch size="small" checked={sureshPrefs.geofence} onChange={(e) => setSureshPrefs({ ...sureshPrefs, geofence: e.target.checked })} />
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', borderRadius: '6px' }}>
                        <Typography sx={{ fontSize: '0.78rem', color: '#1A0E07', fontWeight: 600 }}>🆘 SOS Button</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: sureshPrefs.sosButton ? '#059669' : '#8C7E76', fontWeight: 700 }}>{sureshPrefs.sosButton ? 'ON' : 'OFF'}</Typography>
                          <Switch size="small" checked={sureshPrefs.sosButton} onChange={(e) => setSureshPrefs({ ...sureshPrefs, sosButton: e.target.checked })} />
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', borderRadius: '6px' }}>
                        <Typography sx={{ fontSize: '0.78rem', color: '#1A0E07', fontWeight: 600 }}>📊 Weekly Report</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: sureshPrefs.weeklyReport ? '#059669' : '#8C7E76', fontWeight: 700 }}>{sureshPrefs.weeklyReport ? 'ON' : 'OFF'}</Typography>
                          <Switch size="small" checked={sureshPrefs.weeklyReport} onChange={(e) => setSureshPrefs({ ...sureshPrefs, weeklyReport: e.target.checked })} />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Recent Notifications logs */}
                <Box>
                  <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, fontSize: '0.62rem', letterSpacing: '0.5px', display: 'block', mb: 1.5 }}>
                    RECENT NOTIFICATIONS SENT
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#1A0E07', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                        💬 Fall alert — Meena Devi - SMS sent (WhatsApp pending)
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8C7E76' }}>09:14 AM today</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                        💬 Fall alert — resolved as false alarm - SMS
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8C7E76' }}>May 14</Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Box>
          </Box>
        )}

        {/* SUBTAB 5: Notes & Activity View Content */}
        {activeSubTab === 5 && (
          <Grid container spacing={3.5}>
            {/* Left Column: Form & Activity timeline logs */}
            <Grid size={{ xs: 12, md: 8.5 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              
              {/* Form Add Note */}
              <Card sx={{ p: 3, border: '1px solid #EAE5E0', borderRadius: '8px', boxShadow: 'none' }}>
                <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, fontSize: '0.68rem', letterSpacing: '0.5px', display: 'block', mb: 1 }}>
                  ADD NOTE
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Add a care note, observation, or incident record for Meena Devi..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        '& fieldset': { borderColor: '#EAE5E0' },
                        '&:hover fieldset': { borderColor: '#D45529' },
                        '&.Mui-focused fieldset': { borderColor: '#D45529' },
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Category Selector */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, letterSpacing: '0.5px' }}>
                        CATEGORY:
                      </Typography>
                      <Select
                        value={noteCategory}
                        onChange={(e: any) => setNoteCategory(e.target.value)}
                        size="small"
                        sx={{
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          minWidth: 120,
                          bgcolor: '#FFFFFF',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#EAE5E0' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D45529' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#D45529' },
                        }}
                      >
                        <MenuItem value="GENERAL">General</MenuItem>
                        <MenuItem value="INCIDENT">Incident</MenuItem>
                        <MenuItem value="MEDICAL">Medical</MenuItem>
                        <MenuItem value="DEVICE">Device</MenuItem>
                      </Select>
                    </Box>

                    {/* Action Button */}
                    <Button
                      variant="contained"
                      onClick={handlePostNote}
                      startIcon={<SendIcon sx={{ fontSize: 13 }} />}
                      sx={{
                        bgcolor: '#D45529',
                        '&:hover': { bgcolor: '#B23F1C' },
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.825rem',
                        textTransform: 'none',
                        px: 3,
                        py: 0.85,
                        borderRadius: '6px',
                        boxShadow: 'none',
                      }}
                    >
                      Post Note
                    </Button>
                  </Box>
                </Box>
              </Card>

              {/* Activity Log list card */}
              <Card sx={{ p: 3, border: '1px solid #EAE5E0', borderRadius: '8px', boxShadow: 'none' }}>
                <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, fontSize: '0.68rem', letterSpacing: '0.5px', display: 'block', mb: 2.5 }}>
                  ACTIVITY LOG
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                  {activityLogs.map((log, index) => (
                    <Box key={log.id}>
                      {index > 0 && <Divider sx={{ borderColor: '#F5F2EF', mb: 3.5 }} />}
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Avatar sx={{ bgcolor: log.avatarBg, width: 32, height: 32, fontSize: '0.8rem', fontWeight: 800 }}>
                          {log.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 0.75 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography variant="body2" sx={{ fontWeight: 750, color: '#1A0E07' }}>{log.author}</Typography>
                              <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 550 }}>{log.role}</Typography>
                              <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.73rem' }}>· {log.time}</Typography>
                            </Box>
                            <Chip
                              label={log.category}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.62rem',
                                fontWeight: 800,
                                borderRadius: '4px',
                                bgcolor:
                                  log.category === 'INCIDENT' ? '#FEE2E2' :
                                  log.category === 'MEDICAL' ? '#EFF6FF' :
                                  log.category === 'DEVICE' ? '#FFFBEB' : '#F3F4F6',
                                color:
                                  log.category === 'INCIDENT' ? '#DC2626' :
                                  log.category === 'MEDICAL' ? '#2563EB' :
                                  log.category === 'DEVICE' ? '#D97706' : '#4B5563',
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.825rem', lineHeight: 1.5 }}>
                            {log.content}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Card>

            </Grid>

            {/* Right Column Summary & Milestones */}
            <Grid size={{ xs: 12, md: 3.5 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              {/* Quick Summary Counts card */}
              <Card sx={{ p: 2.5, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2 }}>
                  QUICK SUMMARY
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>Total notes</Typography>
                    <Typography variant="body2" sx={{ color: '#1A0E07', fontWeight: 750, fontSize: '0.825rem' }}>{totalNotes}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>Incident notes</Typography>
                    <Typography variant="body2" sx={{ color: '#DC2626', fontWeight: 750, fontSize: '0.825rem' }}>{incidentNotesCount}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>Medical notes</Typography>
                    <Typography variant="body2" sx={{ color: '#2563EB', fontWeight: 750, fontSize: '0.825rem' }}>{medicalNotesCount}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#F5F2EF' }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>Last entry</Typography>
                    <Typography variant="body2" sx={{ color: '#1A0E07', fontWeight: 700, fontSize: '0.78rem' }}>Today, 09:14 AM</Typography>
                  </Box>
                </Box>
              </Card>

              {/* Milestones timeline card */}
              <Card sx={{ p: 2.5, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2.25 }}>
                  MILESTONES
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
                  {/* Milestone 1 */}
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{ mt: 0.5, width: 8, height: 8, borderRadius: '50%', bgcolor: '#4F46E5', flexShrink: 0 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#1A0E07', fontSize: '0.8rem' }}>Admitted</Typography>
                      <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.7rem', display: 'block', mt: 0.1 }}>February 12, 2024 · 473 days ago</Typography>
                    </Box>
                  </Box>

                  {/* Milestone 2 */}
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{ mt: 0.5, width: 8, height: 8, borderRadius: '50%', bgcolor: '#EF4444', flexShrink: 0 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#1A0E07', fontSize: '0.8rem' }}>Wrist fracture</Typography>
                      <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.7rem', display: 'block', mt: 0.1 }}>January 22, 2026 · Hospitalised 2 days</Typography>
                    </Box>
                  </Box>

                  {/* Milestone 3 */}
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{ mt: 0.5, width: 8, height: 8, borderRadius: '50%', bgcolor: '#EC4899', flexShrink: 0 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#1A0E07', fontSize: '0.8rem' }}>Dementia diagnosed</Typography>
                      <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.7rem', display: 'block', mt: 0.1 }}>March 2025</Typography>
                    </Box>
                  </Box>

                  {/* Milestone 4 */}
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{ mt: 0.5, width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981', flexShrink: 0 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#1A0E07', fontSize: '0.8rem' }}>EV-07B assigned</Typography>
                      <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.7rem', display: 'block', mt: 0.1 }}>March 2024</Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Trigger Dialog Alert Modal */}
      <FallAlertModal open={openFallAlert} onClose={() => setOpenFallAlert(false)} />
    </Box>
  );
};

export default Seniors;
