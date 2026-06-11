import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  Tabs,
  Tab,
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
  Alert,
  InputAdornment,
} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { AlarmService, AdminService } from '../api';
import { DataState } from '../components/DataState';


interface AlarmEventLog {
  id: string;
  type: 'Startup' | 'Alarm' | 'Fall' | 'Panic' | 'Geofence';
  device: string;
  identifier: string;
  serial: string;
  timestamp: string;
  severity: string;
  resolved: boolean;
}

interface StatusCardProps {
  value: number | string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ value, label, icon, color, bgColor }) => {
  return (
    <Card
      sx={{
        p: 1.25,
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        height: '100%',
        borderColor: '#EAE5E0',
        borderRadius: '8px',
        boxShadow: 'none',
        bgcolor: '#FFFFFF',
        transition: 'all 0.15s ease-in-out',
        '&:hover': {
          borderColor: color,
          bgcolor: '#FAF8F6',
        }
      }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          bgcolor: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: color,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 800,
            color: color,
            fontSize: '1.05rem',
            lineHeight: 1,
            mb: 0.25,
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#8C7E76',
            fontWeight: 700,
            fontSize: '0.65rem',
            lineHeight: 1,
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </Typography>
      </Box>
    </Card>
  );
};

interface AlertsProps {
  role?: string;
}

// How often the alerts list silently re-checks the backend (milliseconds)
const ALERTS_POLL_INTERVAL = 30_000;

export const Alerts: React.FC<AlertsProps> = ({ role }) => {
  const [activeSubTab, setActiveSubTab] = useState<number>(0);
  const [hasError, setHasError] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // Filters for System Alerts tab
  const [systemSearch, setSystemSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Filters for Alarm Events tab
  const [alarmTypeFilter, setAlarmTypeFilter] = useState('ALL');
  const [alarmDeviceSearch, setAlarmDeviceSearch] = useState('');
  const [alarmIdentifierSearch, setAlarmIdentifierSearch] = useState('');
  const [alarmSerialSearch, setAlarmSerialSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [logs, setLogs] = useState<AlarmEventLog[]>([]);

  const fetchAlerts = () => {
    const isClientAdmin = role === 'ADMIN';
    const apiCall = isClientAdmin 
      ? AdminService.adminGetAlarmEvents() 
      : AlarmService.getAllAlarms();

    apiCall
      .then((res) => {
        setHasError(false);
        setPageLoading(false);
        setPageError(null);
        if (res) {
          const mapped: AlarmEventLog[] = res.map((a: any) => {
            let type: 'Startup' | 'Alarm' | 'Fall' | 'Panic' | 'Geofence' = 'Alarm';
            
            if (a['fall.alarm.start'] || a['fall.alarm.stop']) type = 'Fall';
            else if (a['alarm.panic.start'] || a['alarm.panic.stop']) type = 'Panic';
            else if (a['startup.alarm']) type = 'Startup';
            else if (a['geofence.alarm.1'] || a['geofence.alarm.2']) type = 'Geofence';
            else if (a.alarmType) {
              const at = String(a.alarmType).toLowerCase();
              if (at.includes('startup')) type = 'Startup';
              else if (at.includes('fall')) type = 'Fall';
              else if (at.includes('panic') || at.includes('sos')) type = 'Panic';
              else if (at.includes('geofence')) type = 'Geofence';
            }
            
            let dateStr = '—';
            if (a.timestamp) {
              const ts = String(a.timestamp).length === 10 ? a.timestamp * 1000 : a.timestamp;
              const d = new Date(ts);
              dateStr = d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            }
            return {
              id: String(a.id || Math.random()),
              type,
              device: a['device.name'] || a.deviceUUID || 'Device',
              identifier: a.ident || (a.deviceUUID ? String(a.deviceUUID).slice(0, 8) : '—'),
              serial: a['device.serial.number'] || '—',
              timestamp: dateStr,
              severity: a.severity || 'MEDIUM',
              resolved: a.isResolved !== undefined ? a.isResolved : (a.resolved || false),
            };
          });
          setLogs(mapped);
        }
      })
      .catch((err) => {
        console.error('Failed to load alarms from API:', err);
        setHasError(true);
        setPageLoading(false);
        // Only block the page if we have nothing to show; during background
        // polling we keep the last good data on screen instead.
        setLogs((prev) => {
          if (prev.length === 0) {
            setPageError(err?.message || 'The server could not be reached. Please try again.');
          }
          return prev;
        });
      });
  };

  // Initial load + live polling so new alerts appear without a manual refresh
  useEffect(() => {
    fetchAlerts();
    const pollId = setInterval(fetchAlerts, ALERTS_POLL_INTERVAL);
    return () => clearInterval(pollId);
  }, [role]);

  const handleRefresh = () => {
    fetchAlerts();
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveSubTab(newValue);
  };

  // Filter Alarm logs dynamically
  const filteredLogs = logs.filter((log) => {
    const matchesType = alarmTypeFilter === 'ALL' || log.type === alarmTypeFilter;
    const matchesDevice = log.device.toLowerCase().includes(alarmDeviceSearch.toLowerCase());
    const matchesIdentifier = log.identifier.includes(alarmIdentifierSearch);
    const matchesSerial = log.serial.includes(alarmSerialSearch);
    return matchesType && matchesDevice && matchesIdentifier && matchesSerial;
  });

  const getLogDotColor = (type: string) => {
    switch (type) {
      case 'Panic': return '#EF4444'; // Red
      case 'Fall': return '#F97316'; // Orange
      case 'Alarm': return '#3B82F6'; // Blue
      case 'Startup': return '#3B82F6'; // Blue
      default: return '#8C7E76';
    }
  };

  // Dynamic count metrics
  const criticalCount = logs.filter(l => String(l.severity).toUpperCase() === 'CRITICAL').length;
  const highCount = logs.filter(l => String(l.severity).toUpperCase() === 'HIGH').length;
  const mediumCount = logs.filter(l => String(l.severity).toUpperCase() === 'MEDIUM').length;
  const lowCount = logs.filter(l => String(l.severity).toUpperCase() === 'LOW').length;
  const acknowledgedCount = logs.filter(l => l.resolved === true).length;
  const totalOpenCount = logs.filter(l => l.resolved !== true).length;

  const panicCount = logs.filter(l => l.type === 'Panic').length;
  const fallCount = logs.filter(l => l.type === 'Fall').length;
  const geofenceCount = logs.filter(l => l.type === 'Geofence').length;
  const startupCount = logs.filter(l => l.type === 'Startup').length;

  return (
    <DataState loading={pageLoading} error={pageError} onRetry={fetchAlerts}>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Header Row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#1A0E07',
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
            }}
          >
            System Alerts
          </Typography>
          <Typography variant="body2" sx={{ color: '#8C7E76', fontWeight: 500, mt: 0.5 }}>
            Monitor device health events and alarm activity
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<AutorenewIcon sx={{ color: '#1A0E07' }} />}
            onClick={handleRefresh}
            sx={{
              px: 2,
              py: 1,
              color: '#1A0E07',
              borderColor: '#EAE5E0',
              backgroundColor: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'none',
              '&:hover': { borderColor: '#D45529', backgroundColor: '#FAF8F6' },
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Unified Status Cards Grid */}
      <Grid container spacing={1.5}>
        {/* Row 1 Status Cards (Critical, High, Medium, Low, Acknowledged, Total Open) */}
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatusCard value={criticalCount} label="Critical" icon={<ErrorIcon sx={{ fontSize: 16 }} />} color="#EF4444" bgColor="#FFE4E6" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatusCard value={highCount} label="High" icon={<WarningIcon sx={{ fontSize: 16 }} />} color="#F97316" bgColor="#FFEDD5" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatusCard value={mediumCount} label="Medium" icon={<AccessTimeIcon sx={{ fontSize: 16 }} />} color="#EAB308" bgColor="#FEF9C3" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatusCard value={lowCount} label="Low" icon={<RemoveCircleIcon sx={{ fontSize: 16 }} />} color="#A855F7" bgColor="#F3E8FF" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatusCard value={acknowledgedCount} label="Acknowledged" icon={<CheckCircleIcon sx={{ fontSize: 16 }} />} color="#22C55E" bgColor="#DCFCE7" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatusCard value={totalOpenCount} label="Total Open" icon={<AssignmentIcon sx={{ fontSize: 16 }} />} color="#3B82F6" bgColor="#DBEAFE" />
        </Grid>

        {/* Row 2 Status Cards (Panic, Fall, Geofence, Startup) */}
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatusCard value={panicCount} label="Panic" icon={<NotificationsIcon sx={{ fontSize: 16 }} />} color="#E11D48" bgColor="#FFE4E6" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatusCard value={fallCount} label="Fall" icon={<DirectionsRunIcon sx={{ fontSize: 16 }} />} color="#F97316" bgColor="#FFEDD5" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatusCard value={geofenceCount} label="Geofence" icon={<LocationOnIcon sx={{ fontSize: 16 }} />} color="#EAB308" bgColor="#FEF9C3" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatusCard value={startupCount} label="Startup" icon={<SyncIcon sx={{ fontSize: 16 }} />} color="#16A34A" bgColor="#DCFCE7" />
        </Grid>
      </Grid>

      {/* Sub Tabs Container */}
      <Box>
        <Box sx={{ borderBottom: '1px solid #EAE5E0', mb: 3 }}>
          <Tabs
            value={activeSubTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: '0.85rem',
                minWidth: 'auto',
                px: 3,
                pb: 1.25,
                color: '#6E625B',
              },
            }}
          >
            <Tab label="System Alerts" />
            <Tab label={`Alarm Events (${logs.length})`} />
          </Tabs>
        </Box>

        {/* SUBTAB 0: System Alerts View */}
        {activeSubTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Clean filter panel */}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                placeholder="Search by type, message, device..."
                value={systemSearch}
                onChange={(e) => setSystemSearch(e.target.value)}
                size="small"
                sx={{
                  flexGrow: 1,
                  minWidth: 260,
                  bgcolor: '#FFFFFF',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    borderColor: '#EAE5E0',
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#8C7E76', fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                size="small"
                sx={{
                  minWidth: 160,
                  bgcolor: '#FFFFFF',
                  borderRadius: '8px',
                }}
              >
                <MenuItem value="ALL">All Severities</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                size="small"
                sx={{
                  minWidth: 160,
                  bgcolor: '#FFFFFF',
                  borderRadius: '8px',
                }}
              >
                <MenuItem value="ALL">All Types</MenuItem>
                <MenuItem value="Panic">Panic</MenuItem>
                <MenuItem value="Fall">Fall</MenuItem>
                <MenuItem value="Geofence">Geofence</MenuItem>
                <MenuItem value="Startup">Startup</MenuItem>
              </Select>
            </Box>

            {/* Error Warning Banner */}
            {hasError && (
              <Alert
                severity="error"
                sx={{
                  width: '100%',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: '1px solid #FCA5A5',
                  backgroundColor: '#FEE2E2',
                  color: '#991B1B',
                  py: 0.5,
                  '& .MuiAlert-icon': {
                    color: '#EF4444',
                  },
                }}
              >
                Failed to load system alerts.
              </Alert>
            )}

            {/* Clean empty state wrapper */}
            <Card
              sx={{
                py: 12,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                bgcolor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #EAE5E0',
                boxShadow: 'none',
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 48, color: '#C2B8B2' }} />
              <Typography
                variant="body1"
                sx={{
                  color: '#8C7E76',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                No open alerts found
              </Typography>
            </Card>
          </Box>
        )}

        {/* SUBTAB 1: Alarm Events */}
        {activeSubTab === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Filter controls panel */}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
              <Select
                value={alarmTypeFilter}
                onChange={(e) => setAlarmTypeFilter(e.target.value)}
                size="small"
                sx={{
                  minWidth: 120,
                  bgcolor: '#FFFFFF',
                  borderRadius: '8px',
                }}
              >
                <MenuItem value="ALL">All Types</MenuItem>
                <MenuItem value="Alarm">Alarm</MenuItem>
                <MenuItem value="Fall">Fall</MenuItem>
                <MenuItem value="Panic">Panic</MenuItem>
                <MenuItem value="Startup">Startup</MenuItem>
              </Select>

              <TextField
                placeholder="Device name..."
                value={alarmDeviceSearch}
                onChange={(e) => setAlarmDeviceSearch(e.target.value)}
                size="small"
                sx={{
                  minWidth: 150,
                  flexGrow: 1,
                  bgcolor: '#FFFFFF',
                  '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                }}
              />

              <TextField
                placeholder="Identifier..."
                value={alarmIdentifierSearch}
                onChange={(e) => setAlarmIdentifierSearch(e.target.value)}
                size="small"
                sx={{
                  minWidth: 150,
                  flexGrow: 1,
                  bgcolor: '#FFFFFF',
                  '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                }}
              />

              <TextField
                placeholder="Serial number..."
                value={alarmSerialSearch}
                onChange={(e) => setAlarmSerialSearch(e.target.value)}
                size="small"
                sx={{
                  minWidth: 150,
                  flexGrow: 1,
                  bgcolor: '#FFFFFF',
                  '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                }}
              />

              <TextField
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                size="small"
                sx={{
                  width: 220,
                  bgcolor: '#FFFFFF',
                  '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                }}
              />

              <TextField
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                size="small"
                sx={{
                  width: 220,
                  bgcolor: '#FFFFFF',
                  '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                }}
              />
            </Box>

            {/* Clean flat Table Container */}
            <TableContainer
              component={Paper}
              sx={{
                border: '1px solid #EAE5E0',
                borderRadius: '12px',
                boxShadow: 'none',
                overflow: 'hidden',
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: '#FAF8F6' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', fontSize: '0.725rem', letterSpacing: '0.5px', py: 2 }}>TYPE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', fontSize: '0.725rem', letterSpacing: '0.5px', py: 2 }}>DEVICE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', fontSize: '0.725rem', letterSpacing: '0.5px', py: 2 }}>IDENTIFIER</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', fontSize: '0.725rem', letterSpacing: '0.5px', py: 2 }}>SERIAL</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', fontSize: '0.725rem', letterSpacing: '0.5px', py: 2 }}>TIMESTAMP</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#8C7E76' }}>
                        No logs match the current filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow
                        key={log.id}
                        sx={{
                          '&:hover': { bgcolor: '#FAF8F6' },
                          '&:last-child td, &:last-child th': { border: 0 },
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        {/* Type column with indicator dot */}
                        <TableCell sx={{ py: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: getLogDotColor(log.type),
                                flexShrink: 0,
                              }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A0E07', fontSize: '0.85rem' }}>
                              {log.type}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell sx={{ color: '#6E625B', fontWeight: 500, py: 1.5, fontSize: '0.825rem' }}>{log.device}</TableCell>
                        <TableCell sx={{ color: '#6E625B', fontWeight: 500, py: 1.5, fontSize: '0.825rem' }}>{log.identifier}</TableCell>
                        <TableCell sx={{ color: '#6E625B', fontWeight: 500, py: 1.5, fontSize: '0.825rem' }}>{log.serial}</TableCell>
                        <TableCell sx={{ color: '#6E625B', fontWeight: 500, py: 1.5, fontSize: '0.825rem' }}>{log.timestamp}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>

    </Box>
    </DataState>
  );
};

export default Alerts;
