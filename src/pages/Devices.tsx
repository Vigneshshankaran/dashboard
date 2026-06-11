import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Card,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  Tooltip,
  CircularProgress,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import BoltIcon from '@mui/icons-material/Bolt';
import BlockIcon from '@mui/icons-material/Block';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HistoryIcon from '@mui/icons-material/History';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import SettingsIcon from '@mui/icons-material/Settings';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PersonIcon from '@mui/icons-material/Person';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CheckIcon from '@mui/icons-material/Check';
import { useEffect } from 'react';
import { AdminService, DeviceService, DeviceAssignmentService, DeviceStatusService } from '../api';
import { DataState } from '../components/DataState';

// Device item structure
interface DeviceItem {
  id: string;
  name: string;
  imei: string;
  identifier: string;
  model: string;
  network: string;
  status: string; // backend value as-is, e.g. ACTIVE / REVOKED
  firmware: string;
  lastSeen: string;
  assignedToName: string;
  assignedToPhone: string;
  battery: string;
}

// Assignment structure
interface AssignmentItem {
  id: string;
  deviceUUID: string;
  deviceName: string;
  deviceImei: string;
  seniorName: string;
  seniorPhone: string;
  status: 'ASSIGNED';
  assignedAt: string;
}

export const Devices: React.FC = () => {
  // Mock data of devices matching screenshot
  const [devices, setDevices] = useState<DeviceItem[]>([]);

  // Pre-populated assignments matching screenshot
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);

  // Tab State
  const [activeSubTab, setActiveSubTab] = useState(0);

  // IMEI Lookup Search Field State
  const [imeiSearch, setImeiSearch] = useState('');
  const [imeiFilter, setImeiFilter] = useState('');

  // Health view state values
  const [thresholdSeconds, setThresholdSeconds] = useState('900');
  const [selectedHealthDevice, setSelectedHealthDevice] = useState('');
  // null = not checked yet; [] = checked, all devices healthy
  const [inactiveDevices, setInactiveDevices] = useState<{ id: string; name: string; imei: string; lastSeen: number }[] | null>(null);
  const [inactiveLoading, setInactiveLoading] = useState(false);

  // Assignments view state values
  const [selectedAssignDevice, setSelectedAssignDevice] = useState('');
  const [selectedAssignSenior, setSelectedAssignSenior] = useState('');
  const [seniorsData, setSeniorsData] = useState<any[]>([]); // raw seniors from /v1/admin/seniors
  const [seniorUsers, setSeniorUsers] = useState<any[]>([]); // SENIOR-role users from /v1/admin/users (id/email/status)

  // Detail popups for the assignments table
  const [deviceDetail, setDeviceDetail] = useState<any | null>(null);
  const [seniorDetail, setSeniorDetail] = useState<any | null>(null);
  const [auditDialog, setAuditDialog] = useState<{ open: boolean; loading: boolean; logs: any[]; error: string | null }>({
    open: false,
    loading: false,
    logs: [],
    error: null,
  });

  // Dialog State for Register Device
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [newDeviceImei, setNewDeviceImei] = useState('');
  const [newDeviceIdentifier, setNewDeviceIdentifier] = useState('');
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceModel, setNewDeviceModel] = useState('');
  const [newDeviceMacAddress, setNewDeviceMacAddress] = useState('');
  const [newDeviceFirmware, setNewDeviceFirmware] = useState('');
  const [newDeviceNetwork, setNewDeviceNetwork] = useState('');
  const [newDeviceType, setNewDeviceType] = useState('');
  const [newDeviceTypeId, setNewDeviceTypeId] = useState('');
  const [showCustomNetwork, setShowCustomNetwork] = useState(false);

  // Close Register Device Dialog & Reset State
  const handleCloseRegisterDialog = () => {
    setOpenRegisterDialog(false);
    setShowCustomNetwork(false);
    setNewDeviceImei('');
    setNewDeviceIdentifier('');
    setNewDeviceName('');
    setNewDeviceModel('');
    setNewDeviceMacAddress('');
    setNewDeviceFirmware('');
    setNewDeviceNetwork('');
    setNewDeviceType('');
    setNewDeviceTypeId('');
  };

  // Page load / error state
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // Load devices, assignments, and seniors (assign dropdown + detail popups)
  useEffect(() => {
    fetchDevices();
    fetchAssignments();
    fetchSeniors();
  }, []);

  const fetchSeniors = () => {
    AdminService.adminGetSeniors()
      .then((res) => {
        setSeniorsData(Array.isArray(res) ? res : res?.data ?? []);
      })
      .catch((err) => {
        console.warn('Failed to fetch seniors from API:', err);
      });
    // The users list carries id/email/status that the seniors list may lack —
    // used to enrich the Senior Details popup.
    AdminService.adminGetUsers()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res as any)?.data ?? [];
        setSeniorUsers(list.filter((u: any) => u.role === 'SENIOR'));
      })
      .catch((err) => {
        console.warn('Failed to fetch users from API:', err);
      });
  };

  const fetchDevices = () => {
    setPageError(null);
    AdminService.adminGetDevices()
      .then((res) => {
        setPageLoading(false);
        if (res) {
          const list: DeviceItem[] = res.map((d: any) => {
            // Real API fields: id, deviceName, imei, deviceIdentifier, model,
            // networkType, status (ACTIVE/REVOKED), batteryLevel, lastSeen
            let lastSeenStr = '—';
            if (d.lastSeen) {
              const ts = new Date(String(d.lastSeen).length === 10 ? Number(d.lastSeen) * 1000 : d.lastSeen);
              if (!isNaN(ts.getTime())) {
                lastSeenStr = ts.toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
              }
            }
            return {
              id: d.id,
              name: d.deviceName || 'Unnamed Device',
              imei: d.imei || d.deviceIdentifier || '—',
              identifier: d.deviceIdentifier || '—',
              model: d.model || '—',
              network: d.networkType || '—',
              status: d.status || '—', // show the backend's status exactly as sent (ACTIVE / REVOKED)
              firmware: d.firmwareVersion || d.firmware || '—',
              lastSeen: lastSeenStr,
              assignedToName: '—',
              assignedToPhone: '—',
              battery: d.batteryLevel !== null && d.batteryLevel !== undefined ? `${d.batteryLevel}%` : '—',
            };
          });
          setDevices(list);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch devices from API:', err);
        setPageLoading(false);
        setPageError(err?.message || 'The server could not be reached. Please try again.');
      });
  };

  const fetchAssignments = () => {
    AdminService.adminGetAssignments()
      .then((res) => {
        if (res) {
          const list: AssignmentItem[] = res.map((a: any) => {
            // Real API flat fields: assignmentId, deviceId, deviceName, deviceIdentifier,
            // imei, seniorFirstName, seniorLastName, seniorPhone, status, assignedAt
            let assignedAtStr = '—';
            if (a.assignedAt) {
              const dt = new Date(a.assignedAt);
              if (!isNaN(dt.getTime())) {
                assignedAtStr = dt.toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
              }
            }
            return {
              id: a.assignmentId,
              deviceUUID: a.deviceId,
              deviceName: a.deviceName || a.deviceIdentifier || '—',
              deviceImei: a.imei || a.deviceIdentifier || '—',
              seniorName: `${a.seniorFirstName || ''} ${a.seniorLastName || ''}`.trim() || '—',
              seniorPhone: a.seniorPhone ? String(a.seniorPhone) : '—',
              status: 'ASSIGNED',
              assignedAt: assignedAtStr,
            };
          });
          setAssignments(list);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch assignments from API:', err);
      });
  };

  // Join devices with assignments by deviceId
  const getAssignedSenior = (device: DeviceItem) =>
    assignments.find((a) => a.deviceUUID === device.id);

  // Register Device Handler
  const handleRegisterDevice = () => {
    if (!newDeviceName.trim()) return;

    const payload = {
      deviceIdentifier: newDeviceIdentifier.trim() || newDeviceImei.trim() || String(Date.now()),
      deviceName: newDeviceName.trim(),
      module: newDeviceModel.trim() || undefined,
      iccid: '',
      mac: newDeviceMacAddress.trim() || null,
      model: newDeviceModel.trim() || undefined,
      deviceTypeId: newDeviceTypeId.trim() || '782',
      deviceType: newDeviceType.trim(),
      firmwareVersion: newDeviceFirmware.trim() || undefined,
      networkType: newDeviceNetwork.trim() || '4G',
      serverTimestamp: Date.now(),
      imei: newDeviceImei.trim(),
    };

    DeviceService.registerDevice(payload)
      .then(() => {
        fetchDevices();
        handleCloseRegisterDialog();
      })
      .catch((err) => {
        console.error('Failed to register device in API:', err);
        alert(`Registration failed: ${err?.message || 'Unknown error from server'}`);
      });
  };

  // Assign Device to Senior Handler
  const handleAssignDevice = () => {
    if (!selectedAssignDevice || !selectedAssignSenior) return;

    const payload = {
      deviceUUID: selectedAssignDevice,
      seniorUUID: selectedAssignSenior,
    };

    DeviceAssignmentService.assignDevice(payload)
      .then(() => {
        fetchAssignments();
        setSelectedAssignDevice('');
        setSelectedAssignSenior('');
      })
      .catch((err) => {
        console.error('Failed to assign device in API:', err);
        alert('Failed to assign device in API.');
      });
  };

  // Revoke a device — one-way per the backend spec (there is no un-revoke)
  const handleRevokeDevice = (id: string) => {
    if (!window.confirm('Revoke this device? It will stop being able to send data. This cannot be undone.')) return;
    DeviceService.revokeDevice(id)
      .then(() => {
        fetchDevices();
      })
      .catch((err) => {
        console.error('Failed to revoke device in API:', err);
        alert(`Revoke failed: ${err?.message || 'Unknown error from server'}`);
      });
  };

  // Rotate a device's credentials (POST /v1/devices/{uuid}/credentials/rotate)
  // and show the result — including any new credentials — in a popup.
  const [rotateResult, setRotateResult] = useState<{
    open: boolean;
    loading: boolean;
    deviceName: string;
    data: any | null;
    error: string | null;
  }>({ open: false, loading: false, deviceName: '', data: null, error: null });

  const handleRotateCredentials = (device: DeviceItem) => {
    setRotateResult({ open: true, loading: true, deviceName: device.name, data: null, error: null });
    DeviceService.rotateDeviceCredentials(device.id)
      .then((res) => {
        setRotateResult({ open: true, loading: false, deviceName: device.name, data: res?.data ?? res ?? {}, error: null });
      })
      .catch((err) => {
        console.error('Failed to rotate device credentials in API:', err);
        setRotateResult({
          open: true,
          loading: false,
          deviceName: device.name,
          data: null,
          error: err?.message || 'Unknown error from server',
        });
      });
  };

  // Unlink/Delete Assignment
  const handleDeleteAssignment = (id: string) => {
    if (!window.confirm('Unassign this device from its senior?')) return;
    DeviceAssignmentService.unassignDevice(id, { assignmentId: id, reason: 'Unlinked by Admin' })
      .then(() => {
        fetchAssignments();
      })
      .catch((err) => {
        console.error('Failed to unassign device in API:', err);
        alert(`Unassign failed: ${err?.message || 'Unknown error from server'}`);
      });
  };

  // ─── Assignment table detail popups ────────────────────────────────────────
  const openDeviceDetails = (assignment: any) => {
    // Use the registry record when we have it; otherwise show what the assignment carries
    const dev = devices.find((d) => d.id === assignment.deviceUUID || (d.imei !== '—' && d.imei === assignment.deviceImei));
    setDeviceDetail(
      dev || {
        id: assignment.deviceUUID || '—',
        name: assignment.deviceName,
        imei: assignment.deviceImei,
        identifier: '—',
        model: '—',
        network: '—',
        status: '—',
        firmware: '—',
        lastSeen: '—',
        battery: '—',
      }
    );
  };

  const openSeniorDetails = (assignment: any) => {
    // Assignments carry only name + phone. Resolve the full record from BOTH
    // the seniors list and the users list (which has id/email/status), then
    // merge. Phones compared by their last 10 digits to survive country codes.
    const normalizePhone = (p: any) => String(p ?? '').replace(/\D/g, '').slice(-10);
    const phone = normalizePhone(assignment.seniorPhone);
    const matches = (s: any) =>
      (phone && normalizePhone(s.phoneNumber || s.phone_number) === phone) ||
      `${s.firstName || s.first_name || ''} ${s.lastName || s.last_name || ''}`.trim() === assignment.seniorName;

    const senior = seniorsData.find(matches);
    const user = seniorUsers.find(matches);
    const raw = senior || user ? { ...(user || {}), ...(senior || {}) } : null;
    setSeniorDetail({ name: assignment.seniorName, phone: assignment.seniorPhone, raw });
  };

  const openAuditHistory = (assignmentId: string) => {
    setAuditDialog({ open: true, loading: true, logs: [], error: null });
    DeviceAssignmentService.getDeviceAssignmentAuditLogs(assignmentId)
      .then((res) => {
        const logs = Array.isArray(res) ? res : res?.data ?? [];
        setAuditDialog({ open: true, loading: false, logs, error: null });
      })
      .catch((err) => {
        setAuditDialog({ open: true, loading: false, logs: [], error: err?.message || 'Failed to load audit history.' });
      });
  };

  // Find devices that stopped reporting: compare each device's newest status
  // event (GET /v1/device-status/all) against the chosen threshold.
  const handleLoadInactive = () => {
    setInactiveLoading(true);
    DeviceStatusService.getAllDeviceStatuses()
      .then((res) => {
        setInactiveLoading(false);
        const statuses = Array.isArray(res) ? res : res?.data ?? [];
        const latestByDevice: Record<string, number> = {};
        statuses.forEach((s: any) => {
          const key = s.deviceUUID || s.ident;
          if (!key || !s.timestamp) return;
          const ts = String(s.timestamp).length === 10 ? s.timestamp * 1000 : Number(s.timestamp);
          if (ts > (latestByDevice[key] || 0)) latestByDevice[key] = ts;
        });
        const cutoff = Date.now() - (Number(thresholdSeconds) || 900) * 1000;
        const stale = devices
          .map((d) => ({
            id: d.id,
            name: d.name,
            imei: d.imei,
            lastSeen: latestByDevice[d.id] || latestByDevice[d.imei] || 0,
          }))
          .filter((d) => d.lastSeen === 0 || d.lastSeen < cutoff);
        setInactiveDevices(stale);
      })
      .catch((err) => {
        setInactiveLoading(false);
        console.warn('Failed to load device statuses from API:', err);
        alert(`Could not load device statuses: ${err?.message || 'Unknown error from server'}`);
      });
  };

  // Filter list by IMEI lookup
  const filteredDevices = devices.filter((device) => {
    if (!imeiFilter) return true;
    return device.imei.includes(imeiFilter);
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveSubTab(newValue);
  };

  const selectedDeviceDetails = devices.find((d) => d.id === selectedHealthDevice);

  return (
    <DataState loading={pageLoading} error={pageError} onRetry={() => { fetchDevices(); fetchAssignments(); }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Page Title & Register Button */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'flex-start' },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: '#1A0E07',
            letterSpacing: '-0.5px',
          }}
        >
          Device Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenRegisterDialog(true)}
          sx={{
            px: 2.5,
            py: 1,
            backgroundColor: '#4F46E5', // Purple-blue button
            '&:hover': {
              backgroundColor: '#4338CA',
            },
          }}
        >
          Register Device
        </Button>
      </Box>

      {/* Navigation Sub-Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: '#EAE5E0' }}>
        <Tabs
          value={activeSubTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#4F46E5',
            },
            '& .MuiTab-root': {
              fontWeight: 700,
              fontSize: '0.875rem',
              color: '#8C7E76',
              textTransform: 'none',
              minWidth: 90,
              '&.Mui-selected': {
                color: '#4F46E5',
              },
            },
          }}
        >
          <Tab label="Registry" />
          <Tab label="Health" />
          <Tab label="Assignments" />
        </Tabs>
      </Box>

      {/* Subtab content container */}
      {activeSubTab === 0 ? (
        <>
          {/* Lookup IMEI Card */}
          <Card sx={{ p: 2.5, border: '1px solid #EAE5E0', boxShadow: 'none' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A0E07', mb: 1.5, fontSize: '0.95rem' }}>
              Lookup by IMEI
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <TextField
                placeholder="15-digit IMEI"
                value={imeiSearch}
                onChange={(e) => setImeiSearch(e.target.value)}
                size="small"
                sx={{
                  flexGrow: 1,
                  backgroundColor: '#FFFFFF',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#EAE5E0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#D45529',
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={() => setImeiFilter(imeiSearch.trim())}
                sx={{
                  backgroundColor: '#FAF8F6',
                  color: '#1A0E07',
                  border: '1px solid #EAE5E0',
                  boxShadow: 'none',
                  px: 4,
                  '&:hover': {
                    backgroundColor: '#EAE5E0',
                    borderColor: '#C2B8B2',
                    boxShadow: 'none',
                  },
                }}
              >
                Search
              </Button>
            </Box>
          </Card>

          {/* All Devices Table */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 750, color: '#1A0E07', fontSize: '1.05rem' }}>
                All Devices
              </Typography>
              <Button
                size="small"
                startIcon={<RefreshIcon />}
                onClick={() => setImeiFilter('')}
                sx={{
                  color: '#8C7E76',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  textTransform: 'none',
                  '&:hover': {
                    color: '#D45529',
                  },
                }}
              >
                Refresh
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ border: '1px solid #EAE5E0', boxShadow: 'none' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: '#FAF8F6' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5 }}>IMEI</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5 }}>Model</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5 }}>Network</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5 }}>Assigned To</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5 }}>Battery</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDevices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6, color: '#8C7E76' }}>
                        No devices registered in local registry.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDevices.map((device) => (
                      <TableRow key={device.id} sx={{ '&:hover': { backgroundColor: '#FCFAF8' } }}>
                        <TableCell sx={{ fontWeight: 650, color: '#1A0E07', py: 1.75 }}>
                          {device.name}
                        </TableCell>
                        <TableCell sx={{ color: '#1A0E07', py: 1.75 }}>
                          {device.imei}
                        </TableCell>
                        <TableCell sx={{ color: '#8C7E76', py: 1.75 }}>
                          {device.model}
                        </TableCell>
                        <TableCell sx={{ color: '#8C7E76', py: 1.75 }}>
                          {device.network}
                        </TableCell>
                        <TableCell sx={{ py: 1.75 }}>
                          <Chip
                            label={device.status}
                            size="small"
                            sx={{
                              backgroundColor: device.status === 'ACTIVE' ? '#ECFDF5' : '#FEE2E2',
                              color: device.status === 'ACTIVE' ? '#10B981' : '#EF4444',
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              borderRadius: '4px',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1.75 }}>
                          {(() => {
                            const assignment = getAssignedSenior(device);
                            const name = assignment?.seniorName || (device.assignedToName !== '—' ? device.assignedToName : '');
                            const phone = assignment?.seniorPhone || (device.assignedToPhone !== '—' ? device.assignedToPhone : '');
                            return name ? (
                              <>
                                <Typography sx={{ fontWeight: 650, color: '#1A0E07', fontSize: '0.85rem' }}>
                                  {name}
                                </Typography>
                                <Typography sx={{ color: '#8C7E76', fontSize: '0.75rem' }}>
                                  {phone || '—'}
                                </Typography>
                              </>
                            ) : (
                              <Typography sx={{ color: '#8C7E76', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                Unassigned
                              </Typography>
                            );
                          })()}
                        </TableCell>
                        <TableCell sx={{ color: '#1A0E07', fontWeight: 500, py: 1.75 }}>
                          {device.battery}
                        </TableCell>
                        <TableCell sx={{ py: 1.75 }}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              title="Rotate device credentials"
                              onClick={() => handleRotateCredentials(device)}
                              sx={{
                                color: '#1A0E07',
                                border: '1px solid #EAE5E0',
                                borderRadius: '6px',
                                p: 0.75,
                                '&:hover': {
                                  backgroundColor: '#FAF8F6',
                                  color: '#3B82F6',
                                  borderColor: '#3B82F6',
                                },
                              }}
                            >
                              <BoltIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            {(() => {
                              const assignment = getAssignedSenior(device);
                              return assignment ? (
                                <Tooltip title={`Unassign from ${assignment.seniorName}`} arrow>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteAssignment(assignment.id)}
                                    sx={{
                                      color: '#1A0E07',
                                      border: '1px solid #EAE5E0',
                                      borderRadius: '6px',
                                      p: 0.75,
                                      '&:hover': {
                                        backgroundColor: '#FFF7ED',
                                        color: '#F97316',
                                        borderColor: '#FDBA74',
                                      },
                                    }}
                                  >
                                    <LinkOffIcon sx={{ fontSize: 16 }} />
                                  </IconButton>
                                </Tooltip>
                              ) : null;
                            })()}
                            <IconButton
                              size="small"
                              title="Revoke device (permanent)"
                              onClick={() => handleRevokeDevice(device.id)}
                              disabled={device.status === 'REVOKED'}
                              sx={{
                                color: '#1A0E07',
                                border: '1px solid #EAE5E0',
                                borderRadius: '6px',
                                p: 0.75,
                                '&:hover': {
                                  backgroundColor: '#FEF2F2',
                                  color: '#EF4444',
                                  borderColor: '#FCA5A5',
                                },
                              }}
                            >
                              <BlockIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      ) : activeSubTab === 1 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Card 1: Inactive Devices */}
          <Card sx={{ p: 2.5, border: '1px solid #EAE5E0', boxShadow: 'none' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A0E07', mb: 2, fontSize: '0.95rem' }}>
              Inactive Devices
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mb: 1.5,
              }}
            >
              <TextField
                label="Threshold (seconds)"
                type="number"
                value={thresholdSeconds}
                onChange={(e) => setThresholdSeconds(e.target.value)}
                size="small"
                sx={{
                  flexGrow: 1,
                  backgroundColor: '#FFFFFF',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#EAE5E0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#D45529',
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleLoadInactive}
                disabled={inactiveLoading}
                sx={{
                  backgroundColor: '#FAF8F6',
                  color: '#1A0E07',
                  border: '1px solid #EAE5E0',
                  boxShadow: 'none',
                  px: 4,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  '&:hover': {
                    backgroundColor: '#EAE5E0',
                    borderColor: '#C2B8B2',
                    boxShadow: 'none',
                  },
                }}
              >
                {inactiveLoading ? 'Checking...' : 'Load Inactive'}
              </Button>
            </Box>
            {inactiveDevices === null ? (
              <Typography variant="body2" sx={{ color: '#8C7E76', mt: 1 }}>
                Set a threshold and click "Load Inactive" to find devices that have stopped reporting.
              </Typography>
            ) : inactiveDevices.length === 0 ? (
              <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600, mt: 1 }}>
                All devices reported within the last {thresholdSeconds} seconds.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                {inactiveDevices.map((d) => (
                  <Box key={d.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.25, bgcolor: '#FFF1F2', borderRadius: '6px', border: '1px solid #FECDD3' }}>
                    <Typography variant="body2" sx={{ fontWeight: 650, color: '#9F1239' }}>
                      {d.name}{d.imei !== '—' ? ` · ${d.imei}` : ''}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9F1239' }}>
                      {d.lastSeen
                        ? `Last seen ${new Date(d.lastSeen).toLocaleString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}`
                        : 'Never reported'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Card>

          {/* Card 2: Device Health Lookup */}
          <Card sx={{ p: 2.5, border: '1px solid #EAE5E0', boxShadow: 'none' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A0E07', mb: 2, fontSize: '0.95rem' }}>
              Device Health Lookup
            </Typography>

            <FormControl fullWidth size="small">
              <Select
                value={selectedHealthDevice}
                onChange={(e) => setSelectedHealthDevice(e.target.value)}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start" sx={{ color: '#1A0E07', mr: 1 }}>
                    <SettingsIcon sx={{ fontSize: 18 }} />
                  </InputAdornment>
                }
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#EAE5E0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D45529',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Select a device to inspect health...
                </MenuItem>
                {devices.map((device) => (
                  <MenuItem key={device.id} value={device.id}>
                    {device.name} {device.imei !== '—' ? `(${device.imei})` : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Selected device diagnostics details */}
            {selectedDeviceDetails && (
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#FAF8F6', borderRadius: '8px', border: '1px dashed #EAE5E0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <HealthAndSafetyIcon sx={{ color: '#10B981' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 750, color: '#1A0E07' }}>
                    Diagnostics for {selectedDeviceDetails.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 600 }}>NETWORK</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A0E07' }}>
                      {selectedDeviceDetails.network !== '—' ? `🟢 ${selectedDeviceDetails.network}` : '🔴 Unknown'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 600 }}>BATTERY</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A0E07' }}>
                      {selectedDeviceDetails.battery !== '—' ? selectedDeviceDetails.battery : '—'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 600 }}>STATUS</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A0E07' }}>{selectedDeviceDetails.status || '—'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 600 }}>MODEL</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A0E07' }}>{selectedDeviceDetails.model || '—'}</Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Card>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          {/* Card 1: Assign Device to Senior */}
          <Card sx={{ p: 2.5, border: '1px solid #EAE5E0', boxShadow: 'none' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A0E07', mb: 0.5, fontSize: '0.95rem' }}>
              Assign Device to Senior
            </Typography>
            <Typography variant="body2" sx={{ color: '#8C7E76', mb: 3 }}>
              Link an unassigned device to a senior profile
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2.5,
                mb: 2.5,
              }}
            >
              {/* Dropdown 1: DEVICE */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.7rem' }}>
                  DEVICE
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedAssignDevice}
                    onChange={(e) => setSelectedAssignDevice(e.target.value)}
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start" sx={{ color: '#1A0E07', mr: 1 }}>
                        <SmartphoneIcon sx={{ fontSize: 18 }} />
                      </InputAdornment>
                    }
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#EAE5E0',
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      {devices.filter((d) => !getAssignedSenior(d)).length === 0
                        ? 'All devices are already assigned'
                        : 'Choose an unassigned device...'}
                    </MenuItem>
                    {devices
                      .filter((d) => !getAssignedSenior(d))
                      .map((device) => (
                        <MenuItem key={device.id} value={device.id}>
                          {device.name} {device.imei !== '—' ? `(${device.imei})` : ''}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Dropdown 2: SENIOR */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, fontSize: '0.7rem' }}>
                  SENIOR
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedAssignSenior}
                    onChange={(e) => setSelectedAssignSenior(e.target.value)}
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start" sx={{ color: '#1A0E07', mr: 1 }}>
                        <PersonIcon sx={{ fontSize: 18 }} />
                      </InputAdornment>
                    }
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#EAE5E0',
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      {seniorsData.length === 0 ? 'No seniors found' : 'Choose a senior...'}
                    </MenuItem>
                    {seniorsData.map((s: any, idx: number) => {
                      const sid = s.id || s.userId || s.uuid || String(idx);
                      const sname = s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Unnamed Senior';
                      return (
                        <MenuItem key={sid} value={sid}>
                          {sname}{s.phoneNumber ? ` — ${s.phoneNumber}` : ''}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<CheckIcon />}
                onClick={handleAssignDevice}
                sx={{
                  px: 3,
                  py: 1,
                  backgroundColor: '#4F46E5',
                  '&:hover': {
                    backgroundColor: '#4338CA',
                  },
                }}
              >
                Assign Device
              </Button>
            </Box>
          </Card>

          {/* Table: All Assignments */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 750, color: '#1A0E07', fontSize: '1.05rem' }}>
                  All Assignments
                </Typography>
                <Chip
                  label={assignments.length}
                  size="small"
                  sx={{
                    backgroundColor: '#EEF2FF',
                    color: '#4F46E5',
                    fontWeight: 700,
                    height: 20,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
              <Button
                size="small"
                startIcon={<RefreshIcon />}
                onClick={() => {}}
                sx={{
                  color: '#8C7E76',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  textTransform: 'none',
                  '&:hover': {
                    color: '#D45529',
                  },
                }}
              >
                Refresh
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ border: '1px solid #EAE5E0', boxShadow: 'none' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: '#FAF8F6' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5 }}>Device</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5 }}>Senior</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5 }}>Assigned At</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#8C7E76' }}>
                        No active assignments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    assignments.map((assignment) => (
                      <TableRow key={assignment.id} sx={{ '&:hover': { backgroundColor: '#FCFAF8' } }}>
                        {/* Device */}
                        <TableCell sx={{ py: 1.75 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box>
                              <Typography sx={{ fontWeight: 650, color: '#1A0E07', fontSize: '0.9rem' }}>
                                {assignment.deviceName}
                              </Typography>
                              <Typography sx={{ color: '#8C7E76', fontSize: '0.75rem' }}>
                                {assignment.deviceImei}
                              </Typography>
                            </Box>
                            <Tooltip title="View device details" arrow>
                              <IconButton size="small" onClick={() => openDeviceDetails(assignment)} sx={{ color: '#C2B8B2', '&:hover': { color: '#3B82F6' } }}>
                                <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>

                        {/* Senior */}
                        <TableCell sx={{ py: 1.75 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box>
                              <Typography sx={{ fontWeight: 650, color: '#1A0E07', fontSize: '0.9rem' }}>
                                {assignment.seniorName}
                              </Typography>
                              <Typography sx={{ color: '#8C7E76', fontSize: '0.75rem' }}>
                                {assignment.seniorPhone}
                              </Typography>
                            </Box>
                            <Tooltip title="View senior details" arrow>
                              <IconButton size="small" onClick={() => openSeniorDetails(assignment)} sx={{ color: '#C2B8B2', '&:hover': { color: '#3B82F6' } }}>
                                <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>

                        {/* Status */}
                        <TableCell sx={{ py: 1.75 }}>
                          <Chip
                            label={assignment.status}
                            size="small"
                            sx={{
                              backgroundColor: '#ECFDF5',
                              color: '#10B981',
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              borderRadius: '4px',
                            }}
                          />
                        </TableCell>

                        {/* Assigned At */}
                        <TableCell sx={{ color: '#8C7E76', py: 1.75, fontSize: '0.85rem' }}>
                          {assignment.assignedAt}
                        </TableCell>

                        {/* Actions */}
                        <TableCell sx={{ py: 1.75 }}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {/* Audit History */}
                            <Tooltip title="Audit history" arrow>
                              <IconButton
                                size="small"
                                onClick={() => openAuditHistory(assignment.id)}
                                sx={{
                                  color: '#1A0E07',
                                  border: '1px solid #EAE5E0',
                                  borderRadius: '6px',
                                  p: 0.75,
                                  '&:hover': {
                                    backgroundColor: '#FAF8F6',
                                    color: '#3B82F6',
                                    borderColor: '#3B82F6',
                                  },
                                }}
                              >
                                <HistoryIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            {/* Unlink / Delete Assignment */}
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteAssignment(assignment.id)}
                              sx={{
                                color: '#1A0E07',
                                border: '1px solid #EAE5E0',
                                borderRadius: '6px',
                                p: 0.75,
                                '&:hover': {
                                  backgroundColor: '#FEF2F2',
                                  color: '#EF4444',
                                  borderColor: '#FCA5A5',
                                },
                              }}
                            >
                              <LinkOffIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      )}

      {/* dialog modal for registering device */}
      <Dialog 
        open={openRegisterDialog} 
        onClose={handleCloseRegisterDialog}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '12px',
              p: 1.5,
            }
          }
        }}
      >
        {/* Custom Header with close button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, pt: 1, pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A0E07', fontSize: '1.25rem' }}>
            Register New Device
          </Typography>
          <IconButton 
            onClick={handleCloseRegisterDialog} 
            size="small" 
            sx={{ 
              color: '#8C7E76',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3, py: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Row 1: IMEI * */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ width: 140, fontSize: '0.875rem', fontWeight: 600, color: '#1A0E07' }}>
                IMEI *
              </Typography>
              <TextField
                fullWidth
                placeholder="15-digit IMEI"
                value={newDeviceImei}
                onChange={(e) => setNewDeviceImei(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    '& fieldset': { borderColor: '#EAE5E0' },
                    '&:hover fieldset': { borderColor: '#4F46E5' },
                    '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                  }
                }}
              />
            </Box>

            {/* Row 2: Identifier * */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ width: 140, fontSize: '0.875rem', fontWeight: 600, color: '#1A0E07' }}>
                Identifier *
              </Typography>
              <TextField
                fullWidth
                placeholder="Unique device identifier"
                value={newDeviceIdentifier}
                onChange={(e) => setNewDeviceIdentifier(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    '& fieldset': { borderColor: '#EAE5E0' },
                    '&:hover fieldset': { borderColor: '#4F46E5' },
                    '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                  }
                }}
              />
            </Box>

            {/* Row 3: Name * */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ width: 140, fontSize: '0.875rem', fontWeight: 600, color: '#1A0E07' }}>
                Name *
              </Typography>
              <TextField
                fullWidth
                placeholder="Device name"
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    '& fieldset': { borderColor: '#EAE5E0' },
                    '&:hover fieldset': { borderColor: '#4F46E5' },
                    '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                  }
                }}
              />
            </Box>

            {/* Row 4: Model */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ width: 140, fontSize: '0.875rem', fontWeight: 600, color: '#1A0E07' }}>
                Model
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. WatchPro X1"
                value={newDeviceModel}
                onChange={(e) => setNewDeviceModel(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    '& fieldset': { borderColor: '#EAE5E0' },
                    '&:hover fieldset': { borderColor: '#4F46E5' },
                    '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                  }
                }}
              />
            </Box>

            {/* Row 5: MAC Address */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ width: 140, fontSize: '0.875rem', fontWeight: 600, color: '#1A0E07' }}>
                MAC Address
              </Typography>
              <TextField
                fullWidth
                placeholder="AA:BB:CC:DD:EE:FF"
                value={newDeviceMacAddress}
                onChange={(e) => setNewDeviceMacAddress(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    '& fieldset': { borderColor: '#EAE5E0' },
                    '&:hover fieldset': { borderColor: '#4F46E5' },
                    '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                  }
                }}
              />
            </Box>

            {/* Row 6: Firmware */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ width: 140, fontSize: '0.875rem', fontWeight: 600, color: '#1A0E07' }}>
                Firmware
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. 1.0.0"
                value={newDeviceFirmware}
                onChange={(e) => setNewDeviceFirmware(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    '& fieldset': { borderColor: '#EAE5E0' },
                    '&:hover fieldset': { borderColor: '#4F46E5' },
                    '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                  }
                }}
              />
            </Box>

            {/* Row 7: Network */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ width: 140, fontSize: '0.875rem', fontWeight: 600, color: '#1A0E07' }}>
                Network
              </Typography>
              
              {!showCustomNetwork ? (
                <Select
                  value={newDeviceNetwork}
                  onChange={(e) => {
                    if (e.target.value === 'CUSTOM') {
                      setShowCustomNetwork(true);
                      setNewDeviceNetwork('');
                    } else {
                      setNewDeviceNetwork(e.target.value);
                    }
                  }}
                  size="small"
                  fullWidth
                  sx={{
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#EAE5E0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4F46E5' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4F46E5' },
                  }}
                >
                  <MenuItem value="">Select network...</MenuItem>
                  <MenuItem value="4G">4G LTE</MenuItem>
                  <MenuItem value="5G">5G Network</MenuItem>
                  <MenuItem value="3G">Legacy 3G</MenuItem>
                  <MenuItem value="—">No Cellular Module (Bluetooth/Wifi)</MenuItem>
                  <MenuItem value="CUSTOM" sx={{ fontStyle: 'italic', color: '#4F46E5', fontWeight: 600 }}>
                    + Custom Network...
                  </MenuItem>
                </Select>
              ) : (
                <TextField
                  fullWidth
                  placeholder="Enter custom network (e.g. LoRaWAN)"
                  value={newDeviceNetwork}
                  onChange={(e) => setNewDeviceNetwork(e.target.value)}
                  size="small"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setShowCustomNetwork(false);
                              setNewDeviceNetwork('');
                            }}
                            sx={{ color: '#8C7E76' }}
                            title="Back to list"
                          >
                            <CloseIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      '& fieldset': { borderColor: '#EAE5E0' },
                      '&:hover fieldset': { borderColor: '#4F46E5' },
                      '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                    }
                  }}
                />
              )}
            </Box>

            {/* Row 8: Device Type * */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ width: 140, fontSize: '0.875rem', fontWeight: 600, color: '#1A0E07' }}>
                Device Type *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. EV07BA (exact value from backend)"
                value={newDeviceType}
                onChange={(e) => setNewDeviceType(e.target.value)}
                size="small"
                helperText="Must exactly match backend enum (case-sensitive)"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    '& fieldset': { borderColor: '#EAE5E0' },
                    '&:hover fieldset': { borderColor: '#4F46E5' },
                    '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                  }
                }}
              />
            </Box>

            {/* Row 9: Device Type ID */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ width: 140, fontSize: '0.875rem', fontWeight: 600, color: '#1A0E07' }}>
                Type ID
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. 782 (default: 782)"
                value={newDeviceTypeId}
                onChange={(e) => setNewDeviceTypeId(e.target.value)}
                size="small"
                helperText="Numeric device type identifier (leave blank for 782)"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    '& fieldset': { borderColor: '#EAE5E0' },
                    '&:hover fieldset': { borderColor: '#4F46E5' },
                    '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                  }
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1.5 }}>
          <Button 
            onClick={handleCloseRegisterDialog} 
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: '#8C7E76',
              fontSize: '0.9rem',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRegisterDevice} 
            variant="contained"
            sx={{
              borderRadius: '8px',
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 700,
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              fontSize: '0.9rem',
              '&:hover': {
                backgroundColor: '#4338CA',
              },
            }}
          >
            Register
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Device Details popup ─────────────────────────────────────────── */}
      <Dialog open={Boolean(deviceDetail)} onClose={() => setDeviceDetail(null)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 750, color: '#1A0E07', mb: 2 }}>
            Device Details
          </Typography>
          {deviceDetail && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {[
                ['Name', deviceDetail.name],
                ['UUID', deviceDetail.id],
                ['IMEI', deviceDetail.imei],
                ['Identifier', deviceDetail.identifier],
                ['Model', deviceDetail.model],
                ['Network', deviceDetail.network],
                ['Status', deviceDetail.status],
                ['Firmware', deviceDetail.firmware],
                ['Battery', deviceDetail.battery],
                ['Last Seen', deviceDetail.lastSeen],
              ].map(([label, value]) => (
                <React.Fragment key={label}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#8C7E76', fontWeight: 600 }}>{label}</Typography>
                    <Typography variant="body2" sx={{ color: '#1A0E07', fontWeight: 700 }}>{value || '—'}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#F5F2EF' }} />
                </React.Fragment>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeviceDetail(null)} color="inherit">Close</Button>
        </DialogActions>
      </Dialog>

      {/* ─── Senior Details popup ─────────────────────────────────────────── */}
      <Dialog open={Boolean(seniorDetail)} onClose={() => setSeniorDetail(null)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 750, color: '#1A0E07', mb: 2 }}>
            Senior Details
          </Typography>
          {seniorDetail && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {[
                ['Name', seniorDetail.name],
                ['UUID', seniorDetail.raw?.id || seniorDetail.raw?.userId || seniorDetail.raw?.seniorId || seniorDetail.raw?.uuid || '—'],
                ['Phone', seniorDetail.phone],
                ['Email', seniorDetail.raw?.primaryEmail || seniorDetail.raw?.email || '—'],
                ['Status', seniorDetail.raw?.status || (seniorDetail.raw?.active !== undefined ? (seniorDetail.raw.active ? 'ACTIVE' : 'INACTIVE') : '—')],
                ['Gender', seniorDetail.raw?.gender || (seniorDetail.raw?.isMale !== undefined ? (seniorDetail.raw.isMale ? 'Male' : 'Female') : '—')],
                ['Date of Birth', seniorDetail.raw?.dateOfBirth ? new Date(seniorDetail.raw.dateOfBirth).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'],
                ['Height', seniorDetail.raw?.height ? `${seniorDetail.raw.height} cm` : '—'],
                ['Weight', seniorDetail.raw?.weight ? `${seniorDetail.raw.weight} kg` : '—'],
              ].map(([label, value]) => (
                <React.Fragment key={String(label)}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#8C7E76', fontWeight: 600 }}>{label}</Typography>
                    <Typography variant="body2" sx={{ color: '#1A0E07', fontWeight: 700 }}>{value || '—'}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#F5F2EF' }} />
                </React.Fragment>
              ))}
              {!seniorDetail.raw && (
                <Typography variant="caption" sx={{ color: '#8C7E76', mt: 0.5 }}>
                  Showing assignment data — full senior record was not found in the registry.
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSeniorDetail(null)} color="inherit">Close</Button>
        </DialogActions>
      </Dialog>

      {/* ─── Audit History popup (GET /v1/devices/assignments/audit-logs/{id}) ── */}
      <Dialog open={auditDialog.open} onClose={() => setAuditDialog((p) => ({ ...p, open: false }))} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 750, color: '#1A0E07', mb: 2 }}>
            Assignment Audit History
          </Typography>
          {auditDialog.loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={28} sx={{ color: '#D45529' }} />
            </Box>
          ) : auditDialog.error ? (
            <Typography variant="body2" sx={{ color: '#DC2626' }}>{auditDialog.error}</Typography>
          ) : auditDialog.logs.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#8C7E76' }}>No audit entries recorded for this assignment.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {auditDialog.logs.map((log: any, idx: number) => {
                const rawTs = log.timestamp || log.createdAt || log.created_at;
                const when = rawTs && !isNaN(new Date(rawTs).getTime())
                  ? new Date(rawTs).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : '—';
                const action = log.action || log.eventType || log.event || log.type || 'Event';
                const actor = log.performedBy || log.actor || log.assignedBy || log.user || '';
                const reason = log.reason || log.notes || '';
                return (
                  <Box key={log.id || idx} sx={{ p: 1.5, bgcolor: '#FAF8F6', borderRadius: '8px', border: '1px solid #EAE5E0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.25 }}>
                      <Typography variant="body2" sx={{ fontWeight: 750, color: '#1A0E07' }}>{action}</Typography>
                      <Typography variant="caption" sx={{ color: '#8C7E76' }}>{when}</Typography>
                    </Box>
                    {(actor || reason) && (
                      <Typography variant="caption" sx={{ color: '#6E625B', display: 'block' }}>
                        {[actor && `By: ${actor}`, reason && `Reason: ${reason}`].filter(Boolean).join(' · ')}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAuditDialog((p) => ({ ...p, open: false }))} color="inherit">Close</Button>
        </DialogActions>
      </Dialog>

      {/* ─── Credential Rotation result popup ─────────────────────────────── */}
      <Dialog open={rotateResult.open} onClose={() => setRotateResult((p) => ({ ...p, open: false }))} maxWidth="xs" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 750, color: '#1A0E07', mb: 0.5 }}>
            Rotate Credentials
          </Typography>
          <Typography variant="body2" sx={{ color: '#8C7E76', mb: 2 }}>
            {rotateResult.deviceName}
          </Typography>
          {rotateResult.loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={28} sx={{ color: '#D45529' }} />
            </Box>
          ) : rotateResult.error ? (
            <Typography variant="body2" sx={{ color: '#DC2626' }}>
              Rotation failed: {rotateResult.error}
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Typography variant="body2" sx={{ color: '#059669', fontWeight: 700 }}>
                ✓ Credentials rotated successfully
              </Typography>
              {rotateResult.data && Object.entries(rotateResult.data).filter(([, v]) => ['string', 'number', 'boolean'].includes(typeof v)).length > 0 && (
                <>
                  <Typography variant="caption" sx={{ color: '#8C7E76' }}>
                    New credentials returned by the server — copy them now; they are not shown again:
                  </Typography>
                  <Box sx={{ p: 1.5, bgcolor: '#FAF8F6', borderRadius: '8px', border: '1px solid #EAE5E0', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    {Object.entries(rotateResult.data)
                      .filter(([, v]) => ['string', 'number', 'boolean'].includes(typeof v))
                      .map(([key, value]) => (
                        <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                          <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700 }}>{key}</Typography>
                          <Typography variant="caption" sx={{ color: '#1A0E07', fontWeight: 600, fontFamily: 'monospace', wordBreak: 'break-all', textAlign: 'right' }}>
                            {String(value)}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRotateResult((p) => ({ ...p, open: false }))} color="inherit">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
    </DataState>
  );
};
export default Devices;
