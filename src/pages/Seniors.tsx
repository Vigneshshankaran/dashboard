import React, { useState, useEffect } from 'react';
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
import FavoriteIcon from '@mui/icons-material/Favorite';
import SpeedIcon from '@mui/icons-material/Speed';
import OpacityIcon from '@mui/icons-material/Opacity';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import WarningIcon from '@mui/icons-material/Warning';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';
import SendIcon from '@mui/icons-material/Send';
import ErrorIcon from '@mui/icons-material/Error';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';

import { FallAlertModal } from '../components/FallAlertModal';
import { DataState } from '../components/DataState';
import { SeniorService, DeviceAssignmentService, AlarmService, ComplianceService, AdminService } from '../api';


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

interface SeniorsProps {
  currentUserName?: string;
  currentUserRole?: string;
}

export const Seniors: React.FC<SeniorsProps> = ({ currentUserName, currentUserRole }) => {
  const [openFallAlert, setOpenFallAlert] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState(0);

  // API States
  const [selectedSenior, setSelectedSenior] = useState<any>({
    id: '',
    name: '',
    gender: '',
    age: 0,
    dob: '',
    bloodGroup: '',
    room: '',
    residentId: '',
    admissionDate: '',
    mobilityAid: '',
    fallsCount: 0,
    medCompliance: 0,
    devicesCount: 0,
    latestSpo2: 0,
    latestBp: '',
    guardiansCount: 0,
    latestHeartRate: 0,
    latestTemperature: 0,
    latestBloodGlucose: 0,
    latestRespRate: 0,
  });

  const [seniorsList, setSeniorsList] = useState<any[]>([]);

  const [seniorDevices, setSeniorDevices] = useState<any[]>([]);

  const [seniorAlerts, setSeniorAlerts] = useState<any[]>([]);

  const [seniorGuardians, setSeniorGuardians] = useState<any[]>([]);

  const [seniorReports, setSeniorReports] = useState<any[]>([]);

  // Page load / error state
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // Load Seniors from API.
  // Admins see ALL seniors (/v1/admin/seniors); guardians see only the
  // seniors mapped to them (/v1/seniors/my-seniors) — per the backend spec.
  const loadSeniors = () => {
    setPageError(null);
    const apiCall = currentUserRole === 'ADMIN'
      ? AdminService.adminGetSeniors()
      : SeniorService.getMySeniors();
    apiCall
      .then((res) => {
        setPageLoading(false);
        if (res) {
          const list = res.map((s: any) => {
            const name = s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Unnamed Senior';
            let age = 0;
            let dobStr = '—';
            if (s.dateOfBirth) {
              const dobDate = new Date(s.dateOfBirth);
              dobStr = dobDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
              const diff = Date.now() - dobDate.getTime();
              age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)) || 0;
            }
            return {
              id: s.id || s.seniorId || '—',
              name,
              gender: s.gender || '—',
              age,
              dob: dobStr,
              bloodGroup: s.bloodGroup || '—',
              room: s.room || '—',
              residentId: s.residentId || s.id || '—',
              admissionDate: s.admissionDate || '—',
              mobilityAid: s.mobilityAid || '—',
              fallsCount: s.fallsCount ?? 0,
              medCompliance: s.medCompliance ?? 0,
              devicesCount: s.devicesCount ?? 0,
              latestSpo2: s.latestSpo2 ?? 0,
              latestBp: s.latestBp || '—',
              guardiansCount: s.guardiansCount ?? 0,
              latestHeartRate: s.latestHeartRate ?? 0,
              latestTemperature: s.latestTemperature ?? 0,
              latestBloodGlucose: s.latestBloodGlucose ?? 0,
              latestRespRate: s.latestRespRate ?? 0,
              nationality: s.nationality || '—',
              language: s.language || '—',
              religion: s.religion || '—',
              primaryPhysician: s.primaryPhysician || '—',
              physicianPhone: s.physicianPhone || '—',
              caregiver: s.caregiver || '—',
              floorAttendant: s.floorAttendant || '—',
              dietitian: s.dietitian || '—',
              physiotherapist: s.physiotherapist || '—',
              fallRisk: s.fallRisk || '—',
              wanderRisk: s.wanderRisk || '—',
              cardiacRisk: s.cardiacRisk || '—',
              activeConditions: s.activeConditions || (s.medicalConditions ? String(s.medicalConditions).split(',').map((c: string) => c.trim()).filter(Boolean) : []),
              allergies: s.allergies || '',
            };
          });
          setSeniorsList(list);
          if (list.length > 0) {
            setSelectedSenior(list[0]);
          } else {
            setSelectedSenior({
              id: '',
              name: '',
              gender: '',
              age: 0,
              dob: '',
              bloodGroup: '',
              room: '',
              residentId: '',
              admissionDate: '',
              mobilityAid: '',
              fallsCount: 0,
              medCompliance: 0,
              devicesCount: 0,
              latestSpo2: 0,
              latestBp: '',
              guardiansCount: 0,
              latestHeartRate: 0,
              latestTemperature: 0,
              latestBloodGlucose: 0,
              latestRespRate: 0,
              nationality: '—',
              language: '—',
              religion: '—',
              primaryPhysician: '—',
              physicianPhone: '—',
              caregiver: '—',
              floorAttendant: '—',
              dietitian: '—',
              physiotherapist: '—',
              fallRisk: '—',
              wanderRisk: '—',
              cardiacRisk: '—',
              activeConditions: [],
            });
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load seniors from API:', err);
        setPageLoading(false);
        setPageError(err?.message || 'The server could not be reached. Please try again.');
      });
  };

  // Re-run when the role arrives (the profile loads a moment after sign-in)
  useEffect(() => {
    loadSeniors();
  }, [currentUserRole]);

  // Load selected senior's details (devices, alarms, etc.)
  useEffect(() => {
    if (!selectedSenior || !selectedSenior.id) return;

    // Fetch assigned devices — only show what the backend actually reports
    DeviceAssignmentService.getSeniorDevices(selectedSenior.id)
      .then((devicesRes) => {
        const list = (devicesRes || []).map((d: any, idx: number) => ({
          id: d.id || d.deviceUUID || d.imei || String(idx),
          name: d.deviceName || d.name || 'Wearable Device',
          deviceId: d.deviceTypeId ? `#${d.deviceTypeId}` : '—',
          imei: d.imei || d.deviceIdentifier || '—',
          status: d.status === 'BLOCKED' ? 'Blocked' : (d.status || 'Active'),
          battery: typeof d.batteryLevel === 'number' ? d.batteryLevel : '—',
          firmware: d.firmwareVersion || '—',
          network: d.networkType || '—',
          fallSensor: d.fallAlarmStatus ? 'Active' : '—',
          gps: d.positionValid ? 'Locked' : '—',
          lastSync: d.serverTimestamp
            ? new Date(d.serverTimestamp).toLocaleString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
            : '—',
          alerts: [],
        }));
        setSeniorDevices(list);
      })
      .catch((err) => {
        console.warn('Failed to load devices for senior from API:', err);
        setSeniorDevices([]);
      });

    // Fetch alarms
    AlarmService.getAllAlarms()
      .then((alarmsRes) => {
        const filtered = (alarmsRes || []).filter((a: any) => a.deviceUUID === selectedSenior.id || !a.deviceUUID);
        const list = filtered.map((a: any, idx: number) => {
          let dateStr = '—';
          if (a.timestamp) {
            const d = new Date(a.timestamp);
            dateStr = d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          }
          return {
            id: String(a.id ?? idx),
            date: dateStr,
            relative: '',
            type: a.alarmType || 'Alarm',
            severity: a.severity || 'MEDIUM',
            device: a.deviceUUID ? a.deviceUUID.slice(0, 8) : '—',
            description: a.description || '—',
            status: a.resolved ? 'Resolved' : 'Open',
            resolvedBy: a.resolvedBy || '—',
          };
        });
        setSeniorAlerts(list);
      })
      .catch((err) => {
        console.warn('Failed to load alarms from API:', err);
        setSeniorAlerts([]);
      });

    // Fetch uploaded health/compliance reports for this senior
    ComplianceService.getReportsOfSenior(selectedSenior.id)
      .then((reportsRes) => {
        const list = (reportsRes || []).map((r: any, idx: number) => ({
          id: r.id || String(idx),
          name: r.reportName || 'Report',
          type: r.reportType || '—',
          url: r.reportUrl || '',
        }));
        setSeniorReports(list);
      })
      .catch((err) => {
        console.warn('Failed to load reports for senior from API:', err);
        setSeniorReports([]);
      });

    // Fetch guardians — no invented ages/cities; missing fields show as blank
    SeniorService.getMyGuardians()
      .then((guardiansRes) => {
        const list = (guardiansRes || []).map((g: any, idx: number) => ({
          id: g.id || String(idx),
          name: g.name || `${g.firstName || ''} ${g.lastName || ''}`.trim() || 'Guardian',
          relationship: g.relationship || 'Guardian',
          age: g.age ?? null,
          location: g.location || g.city || '',
          email: g.email || '—',
          phone: g.phoneNumber ? String(g.phoneNumber) : '—',
          whatsapp: Boolean(g.whatsapp),
          call: Boolean(g.phoneNumber),
          notes: g.notes || '',
        }));
        setSeniorGuardians(list);
      })
      .catch((err) => {
        console.warn('Failed to load guardians from API:', err);
        setSeniorGuardians([]);
      });
  }, [selectedSenior]);

  // ─── State for Alert History tab ───────────────────────────────────────────
  const [alertTypeFilter, setAlertTypeFilter] = useState('ALL');

  const filteredSeniorAlerts = seniorAlerts.filter(
    (a) => alertTypeFilter === 'ALL' || String(a.type).toLowerCase().includes(alertTypeFilter.toLowerCase())
  );

  // Download the visible alert history as a CSV file
  const handleExportAlertsCsv = () => {
    const header = ['Date', 'Type', 'Severity', 'Device', 'Description', 'Status', 'Resolved By'];
    const rows = filteredSeniorAlerts.map((a) =>
      [a.date, a.type, a.severity, a.device, a.description, a.status, a.resolvedBy]
        .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `alerts-${selectedSenior.residentId || 'senior'}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // ─── State for Notes & Activity tab ────────────────────────────────────────
  const [noteText, setNoteText] = useState('');
  const [noteCategory, setNoteCategory] = useState<'GENERAL' | 'INCIDENT' | 'MEDICAL' | 'DEVICE'>('GENERAL');
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);

  // ─── State for Guardian Preferences ───────────────────────────────────────

  const [guardianPrefs, setGuardianPrefs] = useState<Record<string, any>>({});

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveSubTab(newValue);
  };

  const handlePostNote = () => {
    if (!noteText.trim()) return;

    const newLog: ActivityLogItem = {
      id: Date.now().toString(),
      author: currentUserName || 'Staff',
      role: currentUserRole || 'Staff',
      avatarBg: '#3B82F6',
      time: new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      category: noteCategory,
      content: noteText.trim(),
    };

    setActivityLogs([newLog, ...activityLogs]);
    setNoteText('');
  };

  // Helper count notes
  const totalNotes = activityLogs.length;
  const incidentNotesCount = activityLogs.filter(l => l.category === 'INCIDENT').length;
  const medicalNotesCount = activityLogs.filter(l => l.category === 'MEDICAL').length;
  const lastNoteTime = activityLogs.length > 0 ? activityLogs[0].time : '—';

  // No seniors in the system yet — explain instead of showing a blank profile
  if (!pageLoading && !pageError && seniorsList.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <Card sx={{ maxWidth: 520, width: '100%', textAlign: 'center', py: 6, px: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: '#1A0E07' }}>
            No seniors found
          </Typography>
          <Typography variant="body2" sx={{ color: '#8C7E76', lineHeight: 1.6 }}>
            {currentUserRole === 'ADMIN'
              ? 'There are no senior residents registered in the system yet. Create a user with the SENIOR role on the Users page, then map a guardian to them on the Guardians page.'
              : 'No seniors are mapped to your account yet. Ask an administrator to link you to a senior, or send a mapping request.'}
          </Typography>
        </Card>
      </Box>
    );
  }

  return (
    <DataState loading={pageLoading} error={pageError} onRetry={loadSeniors}>
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
              {selectedSenior.name ? selectedSenior.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
            </Avatar>

            <Box>
              {seniorsList.length > 1 ? (
                <Select
                  value={selectedSenior.id}
                  onChange={(e) => {
                    const found = seniorsList.find(s => s.id === e.target.value);
                    if (found) setSelectedSenior(found);
                  }}
                  size="small"
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    mb: 0.5,
                    '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '.MuiSelect-icon': { color: '#FFFFFF' },
                    p: 0,
                    ml: -1.5,
                  }}
                >
                  {seniorsList.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 0.5 }}>
                  {selectedSenior.name}
                </Typography>
              )}
              <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500, mb: 1 }}>
                {selectedSenior.gender} · {selectedSenior.age} years · DOB: {selectedSenior.dob} · Blood Group: {selectedSenior.bloodGroup}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<LocationOnIcon sx={{ '&&': { color: '#D97706', fontSize: 13 } }} />}
                  label={selectedSenior.room}
                  size="small"
                  sx={{ bgcolor: '#FEF3C7', color: '#D97706', fontWeight: 700, fontSize: '0.7rem', borderRadius: '6px' }}
                />
                <Chip
                  label={selectedSenior.mobilityAid || 'Active Resident'}
                  size="small"
                  sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 700, fontSize: '0.7rem', borderRadius: '6px' }}
                />
                <Chip
                  label="Active Resident"
                  size="small"
                  sx={{ bgcolor: '#D1FAE5', color: '#059669', fontWeight: 700, fontSize: '0.7rem', borderRadius: '6px' }}
                />
                <Chip
                  label={`Admitted ${selectedSenior.admissionDate}`}
                  size="small"
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#E2E8F0', fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px' }}
                />
                <Chip
                  label={selectedSenior.residentId}
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
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 0.5 }} />

        {/* Header Stats Grid */}
        <Grid container spacing={3.5}>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', lineHeight: 1, mb: 0.5 }}>
                {selectedSenior.fallsCount}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>
                FALLS THIS YEAR
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', lineHeight: 1, mb: 0.5 }}>
                {selectedSenior.medCompliance}%
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>
                MED COMPLIANCE
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', lineHeight: 1, mb: 0.5 }}>
                {selectedSenior.devicesCount}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>
                DEVICES ACTIVE
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981', lineHeight: 1, mb: 0.5 }}>
                {selectedSenior.latestSpo2}%
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>
                SPO₂ (LATEST)
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#D97706', lineHeight: 1, mb: 0.5 }}>
                {selectedSenior.latestBp}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>
                BLOOD PRESSURE
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', lineHeight: 1, mb: 0.5 }}>
                {selectedSenior.guardiansCount}
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
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>FULL NAME</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>{selectedSenior.name}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>GENDER</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>{selectedSenior.gender}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>DATE OF BIRTH</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>{selectedSenior.dob}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>AGE</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>{selectedSenior.age} years</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>NATIONALITY</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>{selectedSenior.nationality || '—'}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>BLOOD GROUP</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>{selectedSenior.bloodGroup}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>PRIMARY LANGUAGE</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>{selectedSenior.language || '—'}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>RELIGION</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>{selectedSenior.religion || '—'}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>RESIDENT ID</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>{selectedSenior.residentId}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>ADMISSION DATE</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>{selectedSenior.admissionDate}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>ROOM</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>{selectedSenior.room}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>MOBILITY AID</Typography><Typography variant="body2" sx={{ fontWeight: 700, color: '#D45529' }}>{selectedSenior.mobilityAid || '—'}</Typography></Box></Grid>
                </Grid>
              </Card>

              {/* Vitals Summary */}
              <Card sx={{ p: 3, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px' }}>LATEST VITALS</Typography>
                  <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 500 }}>Live readings</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}><Box sx={{ p: 2, border: '1px solid #EAE5E0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0.5 }}><FavoriteIcon sx={{ color: '#D45529', fontSize: 24, mb: 0.5 }} /><Typography variant="h6" sx={{ fontWeight: 800, color: '#1A0E07', lineHeight: 1.1 }}>{selectedSenior.latestHeartRate || '—'}</Typography><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.62rem' }}>HEART RATE</Typography><Typography variant="caption" sx={{ color: selectedSenior.latestHeartRate ? '#10B981' : '#8C7E76', fontWeight: 600, fontSize: '0.68rem' }}>{selectedSenior.latestHeartRate ? 'Normal range' : '—'}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><Box sx={{ p: 2, border: '1px solid #EAE5E0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0.5 }}><SpeedIcon sx={{ color: '#D45529', fontSize: 24, mb: 0.5 }} /><Typography variant="h6" sx={{ fontWeight: 800, color: '#1A0E07', lineHeight: 1.1 }}>{selectedSenior.latestBp || '—'}</Typography><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.62rem' }}>BLOOD PRESSURE</Typography><Typography variant="caption" sx={{ color: selectedSenior.latestBp !== '—' ? '#10B981' : '#8C7E76', fontWeight: 600, fontSize: '0.68rem' }}>{selectedSenior.latestBp !== '—' ? 'Normal' : '—'}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><Box sx={{ p: 2, border: '1px solid #EAE5E0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0.5 }}><OpacityIcon sx={{ color: '#D45529', fontSize: 24, mb: 0.5 }} /><Typography variant="h6" sx={{ fontWeight: 800, color: '#1A0E07', lineHeight: 1.1 }}>{selectedSenior.latestSpo2 ? `${selectedSenior.latestSpo2}%` : '—'}</Typography><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.62rem' }}>OXYGEN SAT.</Typography><Typography variant="caption" sx={{ color: selectedSenior.latestSpo2 ? '#10B981' : '#8C7E76', fontWeight: 600, fontSize: '0.68rem' }}>{selectedSenior.latestSpo2 ? 'Normal range' : '—'}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><Box sx={{ p: 2, border: '1px solid #EAE5E0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0.5 }}><ThermostatIcon sx={{ color: '#D45529', fontSize: 24, mb: 0.5 }} /><Typography variant="h6" sx={{ fontWeight: 800, color: '#1A0E07', lineHeight: 1.1 }}>{selectedSenior.latestTemperature ? `${selectedSenior.latestTemperature}°C` : '—'}</Typography><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.62rem' }}>TEMPERATURE</Typography><Typography variant="caption" sx={{ color: selectedSenior.latestTemperature ? '#10B981' : '#8C7E76', fontWeight: 600, fontSize: '0.68rem' }}>{selectedSenior.latestTemperature ? 'Normal' : '—'}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><Box sx={{ p: 2, border: '1px solid #EAE5E0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0.5 }}><WaterDropIcon sx={{ color: '#D45529', fontSize: 24, mb: 0.5 }} /><Typography variant="h6" sx={{ fontWeight: 800, color: '#1A0E07', lineHeight: 1.1 }}>{selectedSenior.latestBloodGlucose || '—'}</Typography><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.62rem' }}>BLOOD GLUCOSE</Typography><Typography variant="caption" sx={{ color: selectedSenior.latestBloodGlucose ? '#10B981' : '#8C7E76', fontWeight: 600, fontSize: '0.68rem' }}>{selectedSenior.latestBloodGlucose ? 'Normal' : '—'}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><Box sx={{ p: 2, border: '1px solid #EAE5E0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0.5 }}><AirIcon sx={{ color: '#D45529', fontSize: 24, mb: 0.5 }} /><Typography variant="h6" sx={{ fontWeight: 800, color: '#1A0E07', lineHeight: 1.1 }}>{selectedSenior.latestRespRate || '—'}</Typography><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.62rem' }}>RESP. RATE</Typography><Typography variant="caption" sx={{ color: selectedSenior.latestRespRate ? '#10B981' : '#8C7E76', fontWeight: 600, fontSize: '0.68rem' }}>{selectedSenior.latestRespRate ? 'Normal' : '—'}</Typography></Box></Grid>
                </Grid>
              </Card>

              {/* Care Team */}
              <Card sx={{ p: 3, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2.5 }}>CARE TEAM</Typography>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>PRIMARY PHYSICIAN</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>{selectedSenior.primaryPhysician}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>PHYSICIAN CONTACT</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>{selectedSenior.physicianPhone}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>ASSIGNED CAREGIVER</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>{selectedSenior.caregiver}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>FLOOR ATTENDANT</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>{selectedSenior.floorAttendant}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>DIETITIAN</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>{selectedSenior.dietitian}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}><Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>PHYSIOTHERAPIST</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07' }}>{selectedSenior.physiotherapist}</Typography></Box></Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Right Summary Panel */}
            <Grid size={{ xs: 12, md: 3.5 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              <Card sx={{ p: 2.5, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2 }}>RISK SUMMARY</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>Fall Risk</Typography><Typography variant="caption" sx={{ color: selectedSenior.fallRisk === 'HIGH' ? '#EF4444' : selectedSenior.fallRisk === 'MEDIUM' ? '#F59E0B' : selectedSenior.fallRisk === 'LOW' ? '#10B981' : '#8C7E76', fontWeight: 700 }}>{selectedSenior.fallRisk}</Typography></Box><Divider sx={{ borderColor: '#F5F2EF' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>Wander Risk</Typography><Typography variant="caption" sx={{ color: selectedSenior.wanderRisk === 'HIGH' ? '#EF4444' : selectedSenior.wanderRisk === 'MEDIUM' ? '#F59E0B' : selectedSenior.wanderRisk === 'LOW' ? '#10B981' : '#8C7E76', fontWeight: 700 }}>{selectedSenior.wanderRisk}</Typography></Box><Divider sx={{ borderColor: '#F5F2EF' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>Cardiac Risk</Typography><Typography variant="caption" sx={{ color: selectedSenior.cardiacRisk === 'HIGH' ? '#EF4444' : selectedSenior.cardiacRisk === 'MEDIUM' ? '#F59E0B' : selectedSenior.cardiacRisk === 'LOW' ? '#10B981' : '#8C7E76', fontWeight: 700 }}>{selectedSenior.cardiacRisk}</Typography></Box>
                </Box>
              </Card>

              <Card sx={{ p: 2.5, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2 }}>EMERGENCY CONTACTS</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {seniorGuardians.length > 0 ? (
                    seniorGuardians.map((g, index) => {
                      const initials = g.name ? g.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'G';
                      const isPrimary = index === 0 || String(g.relationship).toLowerCase().includes('primary');
                      const avatarBg = isPrimary ? '#FEF3C7' : '#DBEAFE';
                      const avatarColor = isPrimary ? '#D97706' : '#2563EB';
                      return (
                        <Box key={g.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ bgcolor: avatarBg, color: avatarColor, width: 28, height: 28, fontSize: '0.75rem', fontWeight: 750 }}>{initials}</Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07', fontSize: '0.8rem' }}>{g.name}</Typography>
                              <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.68rem', display: 'block' }}>{g.relationship} · {g.phone}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })
                  ) : (
                    <Typography variant="body2" sx={{ color: '#8C7E76', fontSize: '0.8rem' }}>No emergency contacts listed</Typography>
                  )}
                </Box>
              </Card>

              <Card sx={{ p: 2.5, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2 }}>ACTIVE CONDITIONS</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedSenior.activeConditions && selectedSenior.activeConditions.length > 0 ? (
                    selectedSenior.activeConditions.map((cond: string) => (
                      <Chip key={cond} label={cond} size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 600, fontSize: '0.73rem', borderRadius: '4px' }} />
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ color: '#8C7E76', fontSize: '0.8rem' }}>None</Typography>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* SUBTAB 1: Medical Details Tab View — all data comes from the backend */}
        {activeSubTab === 1 && (
          <Grid container spacing={3.5}>
            {/* Left Medical column */}
            <Grid size={{ xs: 12, md: 8.5 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>

              {/* Card 1: Diagnosed Conditions */}
              <Card sx={{ p: 3, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2.5 }}>
                  DIAGNOSED CONDITIONS
                </Typography>
                {selectedSenior.activeConditions && selectedSenior.activeConditions.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {selectedSenior.activeConditions.map((cond: string, idx: number) => (
                      <React.Fragment key={cond}>
                        {idx > 0 && <Divider sx={{ borderColor: '#F5F2EF' }} />}
                        <Box sx={{ py: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <InfoIcon sx={{ color: '#3B82F6', fontSize: 16 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#1A0E07' }}>{cond}</Typography>
                        </Box>
                      </React.Fragment>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: '#8C7E76', fontSize: '0.8rem' }}>
                    No diagnosed conditions on record for this senior.
                  </Typography>
                )}
              </Card>

              {/* Card 2: Medications — shown when the backend provides medication data */}
              <Card sx={{ p: 3, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2.5 }}>
                  CURRENT MEDICATIONS &amp; COMPLIANCE
                </Typography>
                <Typography variant="body2" sx={{ color: '#8C7E76', fontSize: '0.8rem' }}>
                  No medication records available for this senior yet.
                </Typography>
              </Card>

              {/* Card 3: Allergies */}
              <Card sx={{ p: 3, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2.5 }}>
                  ALLERGIES &amp; CONTRAINDICATIONS
                </Typography>
                {selectedSenior.allergies ? (
                  <Box sx={{ p: 1.75, bgcolor: '#FFF1F2', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 2, borderLeft: '4px solid #EF4444' }}>
                    <ErrorIcon sx={{ color: '#EF4444', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: '#991B1B', fontWeight: 750, fontSize: '0.825rem' }}>
                      {selectedSenior.allergies}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: '#8C7E76', fontSize: '0.8rem' }}>
                    No known allergies on record.
                  </Typography>
                )}
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
                    <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, fontSize: '0.62rem', letterSpacing: '0.5px' }}>PRIMARY PHYSICIAN</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 750, color: '#1A0E07', mt: 0.25 }}>{selectedSenior.primaryPhysician || '—'}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#F5F2EF' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, fontSize: '0.62rem', letterSpacing: '0.5px' }}>CONTACT</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 650, color: '#1A0E07', mt: 0.25 }}>{selectedSenior.physicianPhone || '—'}</Typography>
                  </Box>
                </Box>
              </Card>

              {/* Health Reports Card — uploaded compliance reports from the backend */}
              <Card sx={{ p: 2.5, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2 }}>
                  HEALTH REPORTS
                </Typography>
                {seniorReports.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {seniorReports.map((report, idx) => (
                      <React.Fragment key={report.id}>
                        {idx > 0 && <Divider sx={{ borderColor: '#F5F2EF' }} />}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ color: '#6E625B', fontSize: '0.8rem', fontWeight: 500 }}>{report.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700 }}>{report.type}</Typography>
                        </Box>
                      </React.Fragment>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: '#8C7E76', fontSize: '0.8rem' }}>
                    No reports uploaded for this senior.
                  </Typography>
                )}
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
                {seniorDevices.length} devices assigned to {selectedSenior.name} - {selectedSenior.residentId}
              </Typography>
            </Box>

            {/* Devices Grid list */}
            {seniorDevices.length === 0 && (
              <Card sx={{ p: 4, textAlign: 'center', border: '1px solid #EAE5E0', borderRadius: '8px', boxShadow: 'none' }}>
                <Typography variant="body2" sx={{ color: '#8C7E76' }}>
                  No devices assigned to this senior. Devices can be assigned from the Devices page.
                </Typography>
              </Card>
            )}
            <Grid container spacing={3.5}>
              {seniorDevices.map((device) => (
                <Grid size={{ xs: 12, md: 6 }} key={device.id}>
                  <Card sx={{ border: '1px solid #EAE5E0', boxShadow: 'none', borderRadius: '8px', overflow: 'hidden' }}>
                    {/* Card title banner */}
                    <Box sx={{ bgcolor: '#1E293B', p: 2, color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <DeviceHubIcon sx={{ color: '#3B82F6' }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{device.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>Device ID: {device.deviceId} · IMEI: {device.imei}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ color: device.status === 'Online' || device.status === 'ACTIVE' ? '#10B981' : '#EF4444', fontWeight: 700, fontSize: '0.725rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: device.status === 'Online' || device.status === 'ACTIVE' ? '#10B981' : '#EF4444' }} /> {device.status}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.625rem' }}>Last sync: {device.lastSync}</Typography>
                      </Box>
                    </Box>

                    {/* Device stats */}
                    <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.25 }}>
                      <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                        <Grid size={{ xs: 4 }}>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: (device.battery !== '—' && typeof device.battery === 'number' && device.battery < 20) ? '#EF4444' : '#1A0E07' }}>
                            {device.battery !== '—' ? `${device.battery}%` : '—'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>BATTERY</Typography>
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A0E07' }}>{device.alerts ? device.alerts.length : 0}</Typography>
                          <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>ALERTS SENT</Typography>
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A0E07', fontSize: '1.15rem', mt: 0.35 }}>Active</Typography>
                          <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.65rem' }}>STATUS</Typography>
                        </Grid>
                      </Grid>

                      {device.battery !== '—' && typeof device.battery === 'number' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: -0.5 }}>
                          <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.68rem', fontWeight: 600 }}>Battery</Typography>
                          <Box sx={{ flexGrow: 1, height: 6, bgcolor: '#EAE5E0', borderRadius: '3px', overflow: 'hidden' }}>
                            <Box sx={{ width: `${device.battery}%`, height: '100%', bgcolor: device.battery < 20 ? '#EF4444' : '#10B981' }} />
                          </Box>
                          <Typography sx={{ color: device.battery < 20 ? '#EF4444' : '#10B981', fontWeight: 700, fontSize: '0.725rem' }}>{device.battery}%</Typography>
                        </Box>
                      )}

                      {/* Warning Battery Critical Alert */}
                      {device.battery !== '—' && typeof device.battery === 'number' && device.battery < 20 && (
                        <Box sx={{ p: 1.25, bgcolor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', borderRadius: '6px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                          <WarningIcon sx={{ fontSize: 14, color: '#EF4444' }} />
                          Battery critical — device may go offline. Please charge or replace immediately.
                        </Box>
                      )}

                      {/* Metadata details list */}
                      <Grid container spacing={1.5} sx={{ border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', p: 1.75, borderRadius: '8px' }}>
                        <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.62rem' }}>FIRMWARE</Typography><Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#1A0E07' }}>{device.firmware}</Typography></Grid>
                        <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.62rem' }}>NETWORK</Typography><Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#1A0E07' }}>{device.network}</Typography></Grid>
                        <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.62rem' }}>FALL SENSOR</Typography><Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>{device.fallSensor}</Typography></Grid>
                        <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.62rem' }}>GPS</Typography><Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>{device.gps}</Typography></Grid>
                      </Grid>

                      {/* Alerts Log from device */}
                      {device.alerts && device.alerts.length > 0 && (
                        <Box>
                          <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, fontSize: '0.62rem', letterSpacing: '0.5px', display: 'block', mb: 1 }}>
                            RECENT ALERTS FROM THIS DEVICE
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {device.alerts.map((alert: any, idx: number) => (
                              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }} key={idx}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: alert.status === 'ACTIVE' || alert.status === 'CRITICAL' ? '#EF4444' : '#94A3B8' }} />
                                <Typography variant="caption" sx={{ color: '#8C7E76', width: 60 }}>{alert.time.split(',')[0] || alert.time}</Typography>
                                <Typography variant="body2" sx={{ color: '#1A0E07', fontSize: '0.78rem', fontWeight: 650 }}>{alert.type} - <Box component="span" sx={{ color: alert.status === 'ACTIVE' || alert.status === 'CRITICAL' ? '#EF4444' : '#94A3B8' }}>{alert.status}</Box></Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* SUBTAB 3: Alert History View Table */}
        {activeSubTab === 3 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {/* Table title header and filters */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="body2" sx={{ color: '#8C7E76', fontWeight: 600 }}>
                All alerts for {selectedSenior.name} - {selectedSenior.residentId} — showing {filteredSeniorAlerts.length} of {seniorAlerts.length} total
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Select
                  value={alertTypeFilter}
                  onChange={(e) => setAlertTypeFilter(e.target.value)}
                  size="small"
                  sx={{ minWidth: 120, bgcolor: '#FFFFFF', borderRadius: '6px' }}
                >
                  <MenuItem value="ALL">All Types</MenuItem>
                  <MenuItem value="Fall">Fall Detected</MenuItem>
                  <MenuItem value="Dose">Missed Dose</MenuItem>
                  <MenuItem value="Battery">Low Battery</MenuItem>
                  <MenuItem value="Exit">Bed Exit</MenuItem>
                </Select>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleExportAlertsCsv}
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
                  {filteredSeniorAlerts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#8C7E76' }}>
                        No alerts logged for this senior.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSeniorAlerts.map((alert) => (
                      <TableRow key={alert.id} sx={{ '&:hover': { bgcolor: '#FCFAF8' } }}>
                        <TableCell sx={{ py: 1.75, fontWeight: 700, color: '#1A0E07', fontSize: '0.825rem' }}>
                          {alert.date}
                          {alert.relative && (
                            <Typography variant="caption" sx={{ display: 'block', color: '#8C7E76', fontSize: '0.68rem' }}>
                              {alert.relative}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ py: 1.75, fontWeight: 500, fontSize: '0.825rem' }}>{alert.type}</TableCell>
                        <TableCell sx={{ py: 1.75 }}>
                          <Chip
                            label={alert.severity}
                            size="small"
                            sx={{
                              bgcolor: alert.severity === 'CRITICAL' ? '#FEE2E2' : alert.severity === 'MEDIUM' ? '#FFFBEB' : '#EFF6FF',
                              color: alert.severity === 'CRITICAL' ? '#DC2626' : alert.severity === 'MEDIUM' ? '#D97706' : '#2563EB',
                              fontWeight: 800,
                              fontSize: '0.6rem',
                              borderRadius: '4px',
                              height: 20
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem' }}>{alert.device}</TableCell>
                        <TableCell sx={{ py: 1.75, color: '#6E625B', fontSize: '0.825rem', lineHeight: 1.4 }}>{alert.description}</TableCell>
                        <TableCell sx={{ py: 1.75 }}>
                          <Chip
                            label={alert.status}
                            variant="outlined"
                            size="small"
                            sx={{
                              color: alert.status === 'Open' || alert.status === 'ACTIVE' ? '#EF4444' : alert.status === 'Noted' || alert.status === 'Acknowledged' ? '#D97706' : '#10B981',
                              borderColor: alert.status === 'Open' || alert.status === 'ACTIVE' ? '#FCA5A5' : alert.status === 'Noted' || alert.status === 'Acknowledged' ? '#FCD34D' : '#A7F3D0',
                              fontWeight: 700,
                              fontSize: '0.68rem',
                              borderRadius: '4px'
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1.75, color: '#8C7E76', fontSize: '0.825rem' }}>{alert.resolvedBy}</TableCell>
                      </TableRow>
                    ))
                  )}
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
                {seniorGuardians.length} guardians linked to {selectedSenior.name} - {selectedSenior.residentId}
              </Typography>
            </Box>

            {/* List of Guardians cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              {seniorGuardians.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center', border: '1px solid #EAE5E0', borderRadius: '8px', boxShadow: 'none' }}>
                  <Typography variant="body2" sx={{ color: '#8C7E76' }}>No linked guardians found for this senior.</Typography>
                </Card>
              ) : (
                seniorGuardians.map((guardian, index) => {
                  const initials = guardian.name
                    ? guardian.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                    : 'G';
                  const isPrimary = index === 0 || String(guardian.relationship).toLowerCase().includes('primary');
                  const avatarBg = isPrimary ? '#FEF3C7' : '#DBEAFE';
                  const avatarColor = isPrimary ? '#D97706' : '#2563EB';
                  const chipLabel = isPrimary ? 'Primary Guardian' : 'Secondary Guardian';
                  const chipBg = isPrimary ? '#EFF6FF' : '#F3F4F6';
                  const chipColor = isPrimary ? '#2563EB' : '#4B5563';

                  const prefs = guardianPrefs[guardian.id] || {
                    fallAlert: false,
                    missedDoses: false,
                    lowBattery: false,
                    geofence: false,
                    sosButton: false,
                    weeklyReport: false
                  };

                  const togglePref = (key: string, val: boolean) => {
                    setGuardianPrefs(prev => ({
                      ...prev,
                      [guardian.id]: {
                        ...prefs,
                        [key]: val
                      }
                    }));
                  };

                  return (
                    <Card key={guardian.id} sx={{ p: 3, border: '1px solid #EAE5E0', borderRadius: '8px', boxShadow: 'none', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      {/* Guardian Header Row */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: avatarBg, color: avatarColor, width: 44, height: 44, fontSize: '1.1rem', fontWeight: 800 }}>{initials}</Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 750, color: '#1A0E07', display: 'flex', alignItems: 'center', gap: 1 }}>
                              {guardian.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.73rem' }}>
                              {[guardian.age ? `Age ${guardian.age}` : null, guardian.location || null, guardian.email].filter(Boolean).join(' · ')}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Chip label={chipLabel} size="small" sx={{ bgcolor: chipBg, color: chipColor, fontWeight: 800, fontSize: '0.65rem', borderRadius: '4px', mb: 0.5 }} />
                          <Typography variant="caption" sx={{ color: '#8C7E76', display: 'block', fontSize: '0.68rem', fontWeight: 550 }}>
                            {guardian.relationship}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Details info pills */}
                      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        <Chip label={`Mobile: ${guardian.phone}`} size="small" sx={{ bgcolor: '#FAF8F6', color: '#6E625B', fontWeight: 600, fontSize: '0.725rem', borderRadius: '4px' }} />
                        <Chip label={`Email: ${guardian.email}`} size="small" sx={{ bgcolor: '#FAF8F6', color: '#6E625B', fontWeight: 600, fontSize: '0.725rem', borderRadius: '4px' }} />
                        {guardian.location && <Chip label={`City: ${guardian.location}`} size="small" sx={{ bgcolor: '#FAF8F6', color: '#6E625B', fontWeight: 600, fontSize: '0.725rem', borderRadius: '4px' }} />}
                        {guardian.whatsapp && <Chip label="WhatsApp: Linked" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.725rem', borderRadius: '4px' }} />}
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
                                <Typography variant="caption" sx={{ color: prefs.fallAlert ? '#059669' : '#8C7E76', fontWeight: 700 }}>{prefs.fallAlert ? 'ON' : 'OFF'}</Typography>
                                <Switch size="small" checked={prefs.fallAlert} onChange={(e) => togglePref('fallAlert', e.target.checked)} />
                              </Box>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', borderRadius: '6px' }}>
                              <Typography sx={{ fontSize: '0.78rem', color: '#1A0E07', fontWeight: 600 }}>💊 Missed Doses</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="caption" sx={{ color: prefs.missedDoses ? '#059669' : '#8C7E76', fontWeight: 700 }}>{prefs.missedDoses ? 'ON' : 'OFF'}</Typography>
                                <Switch size="small" checked={prefs.missedDoses} onChange={(e) => togglePref('missedDoses', e.target.checked)} />
                              </Box>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', borderRadius: '6px' }}>
                              <Typography sx={{ fontSize: '0.78rem', color: '#1A0E07', fontWeight: 600 }}>🔋 Low Battery</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="caption" sx={{ color: prefs.lowBattery ? '#059669' : '#8C7E76', fontWeight: 700 }}>{prefs.lowBattery ? 'ON' : 'OFF'}</Typography>
                                <Switch size="small" checked={prefs.lowBattery} onChange={(e) => togglePref('lowBattery', e.target.checked)} />
                              </Box>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', borderRadius: '6px' }}>
                              <Typography sx={{ fontSize: '0.78rem', color: '#1A0E07', fontWeight: 600 }}>🗺️ Geofence Breach</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="caption" sx={{ color: prefs.geofence ? '#059669' : '#8C7E76', fontWeight: 700 }}>{prefs.geofence ? 'ON' : 'OFF'}</Typography>
                                <Switch size="small" checked={prefs.geofence} onChange={(e) => togglePref('geofence', e.target.checked)} />
                              </Box>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', borderRadius: '6px' }}>
                              <Typography sx={{ fontSize: '0.78rem', color: '#1A0E07', fontWeight: 600 }}>🆘 SOS Button</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="caption" sx={{ color: prefs.sosButton ? '#059669' : '#8C7E76', fontWeight: 700 }}>{prefs.sosButton ? 'ON' : 'OFF'}</Typography>
                                <Switch size="small" checked={prefs.sosButton} onChange={(e) => togglePref('sosButton', e.target.checked)} />
                              </Box>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #FAF8F6', bgcolor: '#FAF8F6', borderRadius: '6px' }}>
                              <Typography sx={{ fontSize: '0.78rem', color: '#1A0E07', fontWeight: 600 }}>📊 Weekly Report</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="caption" sx={{ color: prefs.weeklyReport ? '#059669' : '#8C7E76', fontWeight: 700 }}>{prefs.weeklyReport ? 'ON' : 'OFF'}</Typography>
                                <Switch size="small" checked={prefs.weeklyReport} onChange={(e) => togglePref('weeklyReport', e.target.checked)} />
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Recent Notifications logs */}
                      {guardian.notes && (
                        <Box>
                          <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, fontSize: '0.62rem', letterSpacing: '0.5px', display: 'block', mb: 1.5 }}>
                            RECENT NOTIFICATIONS SENT
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ color: '#1A0E07', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                                {guardian.notes}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#8C7E76' }}>Recent</Typography>
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Card>
                  );
                })
              )}
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
                    placeholder={`Add a care note, observation, or incident record for ${selectedSenior.name || 'this resident'}...`}
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
                          {log.author.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
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
                    <Typography variant="body2" sx={{ color: '#1A0E07', fontWeight: 700, fontSize: '0.78rem' }}>{lastNoteTime}</Typography>
                  </Box>
                </Box>
              </Card>

              {/* Milestones timeline card */}
              <Card sx={{ p: 2.5, borderRadius: '8px', border: '1px solid #EAE5E0', boxShadow: 'none' }}>
                <Typography variant="subtitle2" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.8px', mb: 2.25 }}>
                  MILESTONES
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
                  {selectedSenior.admissionDate && selectedSenior.admissionDate !== '—' && (
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Box sx={{ mt: 0.5, width: 8, height: 8, borderRadius: '50%', bgcolor: '#4F46E5', flexShrink: 0 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#1A0E07', fontSize: '0.8rem' }}>Admitted</Typography>
                        <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.7rem', display: 'block', mt: 0.1 }}>{selectedSenior.admissionDate}</Typography>
                      </Box>
                    </Box>
                  )}
                  {seniorDevices.map((device) => (
                    <Box key={device.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Box sx={{ mt: 0.5, width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981', flexShrink: 0 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#1A0E07', fontSize: '0.8rem' }}>{device.name} assigned</Typography>
                        <Typography variant="caption" sx={{ color: '#8C7E76', fontSize: '0.7rem', display: 'block', mt: 0.1 }}>IMEI: {device.imei}</Typography>
                      </Box>
                    </Box>
                  ))}
                  {(!selectedSenior.admissionDate || selectedSenior.admissionDate === '—') && seniorDevices.length === 0 && (
                    <Typography variant="body2" sx={{ color: '#8C7E76', fontSize: '0.8rem' }}>No milestones recorded yet.</Typography>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Trigger Dialog Alert Modal — shows the currently selected resident's real data */}
      <FallAlertModal
        open={openFallAlert}
        onClose={() => setOpenFallAlert(false)}
        patient={{
          name: selectedSenior.name,
          age: selectedSenior.age || undefined,
          gender: selectedSenior.gender !== '—' ? selectedSenior.gender : undefined,
          condition: selectedSenior.activeConditions?.[0],
          room: selectedSenior.room !== '—' ? selectedSenior.room : undefined,
          device: seniorDevices[0]?.name,
          battery: typeof seniorDevices[0]?.battery === 'number' ? seniorDevices[0].battery : undefined,
          alertTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }}
        respondedBy={currentUserName ? `${currentUserName}${currentUserRole ? ` (${currentUserRole})` : ''}` : undefined}
      />
    </Box>
    </DataState>
  );
};

export default Seniors;
