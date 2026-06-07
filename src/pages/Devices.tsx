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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import BoltIcon from '@mui/icons-material/Bolt';
import SyncIcon from '@mui/icons-material/Sync';
import BlockIcon from '@mui/icons-material/Block';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import SettingsIcon from '@mui/icons-material/Settings';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PersonIcon from '@mui/icons-material/Person';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CheckIcon from '@mui/icons-material/Check';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

// Device item structure
interface DeviceItem {
  id: string;
  name: string;
  imei: string;
  model: string;
  network: string;
  status: 'ACTIVE' | 'BLOCKED';
  assignedToName: string;
  assignedToPhone: string;
  battery: string;
}

// Assignment structure
interface AssignmentItem {
  id: string;
  deviceName: string;
  deviceImei: string;
  seniorName: string;
  seniorPhone: string;
  status: 'ASSIGNED';
  assignedAt: string;
}

export const Devices: React.FC = () => {
  // Mock data of devices matching screenshot
  const [devices, setDevices] = useState<DeviceItem[]>([
    {
      id: '1',
      name: 'Sushil Wrist Band',
      imei: '—',
      model: '—',
      network: '—',
      status: 'ACTIVE',
      assignedToName: 'Sushil T.',
      assignedToPhone: '8459221606',
      battery: '—',
    },
    {
      id: '2',
      name: 'shravan',
      imei: '861045082850739',
      model: '—',
      network: '4G',
      status: 'ACTIVE',
      assignedToName: 'Shravan Harishankar',
      assignedToPhone: '9003197571',
      battery: '55%',
    },
    {
      id: '3',
      name: 'testevwatch11766',
      imei: '861045085111766',
      model: 'EV-06',
      network: '4G',
      status: 'ACTIVE',
      assignedToName: 'Shravan Harishankar',
      assignedToPhone: '9003197571',
      battery: '0%',
    },
    {
      id: '4',
      name: 'Testeviewgps25576',
      imei: '861045005125576',
      model: 'EV07BA',
      network: '4G',
      status: 'ACTIVE',
      assignedToName: 'Sushil T.',
      assignedToPhone: '8459221606',
      battery: '3%',
    },
  ]);

  // Pre-populated assignments matching screenshot
  const [assignments, setAssignments] = useState<AssignmentItem[]>([
    {
      id: 'a1',
      deviceName: 'shravan',
      deviceImei: '861045082850739',
      seniorName: 'Shravan Harishankar',
      seniorPhone: '9003197571',
      status: 'ASSIGNED',
      assignedAt: '05 Sept, 03:59 pm',
    },
    {
      id: 'a2',
      deviceName: 'Testeviewgps25576',
      deviceImei: '861045005125576',
      seniorName: 'Sushil T.',
      seniorPhone: '8459221606',
      status: 'ASSIGNED',
      assignedAt: '18 Feb, 06:21 pm',
    },
    {
      id: 'a3',
      deviceName: 'testevwatch11766',
      deviceImei: '861045085111766',
      seniorName: 'Shravan Harishankar',
      seniorPhone: '9003197571',
      status: 'ASSIGNED',
      assignedAt: '23 Aug, 09:02 am',
    },
    {
      id: 'a4',
      deviceName: 'Sushil Wrist Band',
      deviceImei: '—',
      seniorName: 'Sushil T.',
      seniorPhone: '8459221606',
      status: 'ASSIGNED',
      assignedAt: '02 May, 12:52 pm',
    },
  ]);

  // Tab State
  const [activeSubTab, setActiveSubTab] = useState(0);

  // IMEI Lookup Search Field State
  const [imeiSearch, setImeiSearch] = useState('');
  const [imeiFilter, setImeiFilter] = useState('');

  // Health view state values
  const [thresholdSeconds, setThresholdSeconds] = useState('900');
  const [selectedHealthDevice, setSelectedHealthDevice] = useState('');

  // Assignments view state values
  const [selectedAssignDevice, setSelectedAssignDevice] = useState('');
  const [selectedAssignSenior, setSelectedAssignSenior] = useState('');

  // Dialog State for Register Device
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [newDeviceImei, setNewDeviceImei] = useState('');
  const [newDeviceIdentifier, setNewDeviceIdentifier] = useState('');
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceModel, setNewDeviceModel] = useState('');
  const [newDeviceMacAddress, setNewDeviceMacAddress] = useState('');
  const [newDeviceFirmware, setNewDeviceFirmware] = useState('');
  const [newDeviceNetwork, setNewDeviceNetwork] = useState('');
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
  };

  // Register Device Handler
  const handleRegisterDevice = () => {
    if (!newDeviceName.trim()) return;

    const newDevice: DeviceItem = {
      id: Date.now().toString(),
      name: newDeviceName.trim(),
      imei: newDeviceImei.trim() || '—',
      model: newDeviceModel.trim() || '—',
      network: newDeviceNetwork.trim() || '—',
      status: 'ACTIVE',
      assignedToName: '—',
      assignedToPhone: '—',
      battery: '—',
    };

    setDevices((prev) => [...prev, newDevice]);
    handleCloseRegisterDialog();
  };

  // Assign Device to Senior Handler
  const handleAssignDevice = () => {
    if (!selectedAssignDevice || !selectedAssignSenior) return;

    const targetDevice = devices.find((d) => d.id === selectedAssignDevice);
    if (!targetDevice) return;

    const seniorName = selectedAssignSenior;
    // Generate simple dummy phone
    const seniorPhone = seniorName === 'Shravan Harishankar' ? '9003197571' : '8459221606';

    const newAssignment: AssignmentItem = {
      id: Date.now().toString(),
      deviceName: targetDevice.name,
      deviceImei: targetDevice.imei,
      seniorName: seniorName,
      seniorPhone: seniorPhone,
      status: 'ASSIGNED',
      assignedAt: 'Just now',
    };

    setAssignments((prev) => [newAssignment, ...prev]);
    setSelectedAssignDevice('');
    setSelectedAssignSenior('');
  };

  // Toggle Block Status
  const handleToggleBlock = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const newStatus = d.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
          return { ...d, status: newStatus };
        }
        return d;
      })
    );
  };

  // Delete/Unlink Device
  const handleDeleteDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  // Unlink/Delete Assignment
  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
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
                          <Typography sx={{ fontWeight: 650, color: '#1A0E07', fontSize: '0.85rem' }}>
                            {device.assignedToName}
                          </Typography>
                          <Typography sx={{ color: '#8C7E76', fontSize: '0.75rem' }}>
                            {device.assignedToPhone}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ color: '#1A0E07', fontWeight: 500, py: 1.75 }}>
                          {device.battery}
                        </TableCell>
                        <TableCell sx={{ py: 1.75 }}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
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
                            <IconButton
                              size="small"
                              sx={{
                                color: '#1A0E07',
                                border: '1px solid #EAE5E0',
                                borderRadius: '6px',
                                p: 0.75,
                                '&:hover': {
                                  backgroundColor: '#FAF8F6',
                                  color: '#F59E0B',
                                  borderColor: '#F59E0B',
                                },
                              }}
                            >
                              <SyncIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleToggleBlock(device.id)}
                              sx={{
                                color: '#1A0E07',
                                border: '1px solid #EAE5E0',
                                borderRadius: '6px',
                                p: 0.75,
                                backgroundColor: device.status === 'BLOCKED' ? '#F3F4F6' : 'transparent',
                                '&:hover': {
                                  backgroundColor: '#EAE5E0',
                                  color: '#4B5563',
                                  borderColor: '#9CA3AF',
                                },
                              }}
                            >
                              <BlockIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteDevice(device.id)}
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
                Load Inactive
              </Button>
            </Box>
            <Typography variant="body2" sx={{ color: '#8C7E76', mt: 1 }}>
              No inactive devices found.
            </Typography>
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
                    <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 600 }}>CELLULAR SIGNAL</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A0E07' }}>
                      {selectedDeviceDetails.network !== '—' ? '🟢 Strong (94% RSSI)' : '🔴 Offline'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 600 }}>BATTERY HEALTH</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A0E07' }}>
                      {selectedDeviceDetails.battery !== '—' ? `${selectedDeviceDetails.battery} (Good)` : '—'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 600 }}>LAST REFRESH TIMESTAMP</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A0E07' }}>Just now</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 600 }}>GEOLOCATION LOCK</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A0E07' }}>🟢 Connected (GPS Locked)</Typography>
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
                      Choose an unassigned device...
                    </MenuItem>
                    {devices.map((device) => (
                      <MenuItem key={device.id} value={device.id}>
                        {device.name}
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
                      Choose a senior...
                    </MenuItem>
                    <MenuItem value="Shravan Harishankar">Shravan Harishankar</MenuItem>
                    <MenuItem value="Sushil T.">Sushil T.</MenuItem>
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
                            <IconButton size="small" sx={{ color: '#C2B8B2' }}>
                              <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
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
                            <IconButton size="small" sx={{ color: '#C2B8B2' }}>
                              <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
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
                            {/* File / Details Icon */}
                            <IconButton
                              size="small"
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
                              <DescriptionOutlinedIcon sx={{ fontSize: 16 }} />
                            </IconButton>

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
    </Box>
  );
};
export default Devices;
