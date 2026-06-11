import React, { useState, useEffect } from 'react';
import { Card, Typography, Box, Chip, Divider } from '@mui/material';
import { ActuatorService, AdminService, SeniorService, AlarmService } from '../api';

interface SystemStatusProps {
  role?: string;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ role }) => {
  const [platformStatus, setPlatformStatus] = useState<string>('Offline');
  const [counts, setCounts] = useState({
    seniors: 0,
    guardians: 0,
    monitors: 0,
    admins: 0,
    devices: 0,
    approvals: 0,
    alarms: 0,
  });

  useEffect(() => {
    // 1. Fetch Actuator Health
    ActuatorService.getHealth()
      .then((res) => {
        if (res && (res.status === 'UP' || res.status === 'Operational')) {
          setPlatformStatus('Operational');
        } else {
          setPlatformStatus('Degraded');
        }
      })
      .catch(() => {
        setPlatformStatus('Offline');
      });

    // 2. Fetch counts
    const isClientAdmin = role === 'ADMIN';

    if (isClientAdmin) {
      AdminService.adminGetCounts()
        .then((res) => {
          if (res) {
            setCounts({
              seniors: res.totalSeniors ?? res.seniors ?? 0,
              guardians: res.totalGuardians ?? res.guardians ?? 0,
              monitors: res.totalMonitors ?? res.monitors ?? 0,
              admins: res.totalAdmins ?? res.admins ?? 0,
              devices: res.totalDevices ?? res.devices ?? 0,
              approvals: res.pendingMappings ?? res.approvals ?? 0,
              alarms: res.totalAlerts ?? res.alarms ?? 0,
            });
          }
        })
        .catch((err) => {
          console.error('Failed to load system status counts:', err);
        });
    } else {
      // Fetch user-level personal counts
      Promise.all([
        SeniorService.getMySeniors().catch(() => []),
        SeniorService.getMyGuardians().catch(() => []),
        SeniorService.getMyMonitors().catch(() => []),
        AlarmService.getAllAlarms().catch(() => []),
      ])
        .then(([seniors, guardians, monitors, alarms]) => {
          setCounts({
            seniors: seniors.length,
            guardians: guardians.length,
            monitors: monitors.length,
            admins: 0,
            devices: seniors.reduce((acc: number, s: any) => acc + (s.devicesCount || 0), 0),
            approvals: 0,
            alarms: alarms.length,
          });
        })
        .catch((err) => {
          console.error('Failed to load user system status counts:', err);
        });
    }
  }, [role]);

  return (
    <Card sx={{ height: '100%' }}>
      {/* Card Header with Live indicator */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#1A0E07',
          }}
        >
          System Status
        </Typography>

        {/* Connection indicator — reflects the real health check result */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: platformStatus === 'Operational' ? '#10B981' : '#EF4444',
              animation: platformStatus === 'Operational' ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { transform: 'scale(0.95)', opacity: 0.8 },
                '50%': { transform: 'scale(1.3)', opacity: 1 },
                '100%': { transform: 'scale(0.95)', opacity: 0.8 },
              },
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: platformStatus === 'Operational' ? '#10B981' : '#EF4444',
              fontSize: '0.8rem',
            }}
          >
            {platformStatus === 'Operational' ? 'Live' : platformStatus}
          </Typography>
        </Box>
      </Box>

      {/* Status Table List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
        {/* Row 1: Platform */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: '#8C7E76', fontWeight: 500 }}>
            Platform
          </Typography>
          <Chip
            label={platformStatus}
            size="small"
            sx={{
              backgroundColor: platformStatus === 'Operational' ? '#ECFDF5' : '#FFF1F2',
              color: platformStatus === 'Operational' ? '#10B981' : '#EF4444',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: '6px',
            }}
          />
        </Box>
        <Divider sx={{ borderColor: '#F5F2EF' }} />

        {/* Row 2: User Coverage */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: '#8C7E76', fontWeight: 500 }}>
            User Coverage
          </Typography>
          <Typography variant="body2" sx={{ color: '#1A0E07', fontWeight: 600 }}>
            {counts.seniors} seniors - {counts.guardians} guardians - {counts.monitors} monitors - {counts.admins} admins
          </Typography>
        </Box>
        <Divider sx={{ borderColor: '#F5F2EF' }} />

        {/* Row 3: Device Fleet */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: '#8C7E76', fontWeight: 500 }}>
            Device Fleet
          </Typography>
          <Typography variant="body2" sx={{ color: '#1A0E07', fontWeight: 600 }}>
            {counts.devices} registered
          </Typography>
        </Box>
        <Divider sx={{ borderColor: '#F5F2EF' }} />

        {/* Row 4: Pending Approvals */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: '#8C7E76', fontWeight: 500 }}>
            Pending Approvals
          </Typography>
          <Chip
            label={counts.approvals > 0 ? `${counts.approvals} pending` : 'None'}
            size="small"
            sx={{
              backgroundColor: counts.approvals > 0 ? '#FFFBEB' : '#ECFDF5',
              color: counts.approvals > 0 ? '#D97706' : '#10B981',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: '6px',
            }}
          />
        </Box>
        <Divider sx={{ borderColor: '#F5F2EF' }} />

        {/* Row 5: Active Alarms */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: '#8C7E76', fontWeight: 500 }}>
            Active Alarms
          </Typography>
          <Chip
            label={`${counts.alarms} events`}
            size="small"
            sx={{
              backgroundColor: counts.alarms > 0 ? '#FEF2F2' : '#ECFDF5',
              color: counts.alarms > 0 ? '#EF4444' : '#10B981',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: '6px',
            }}
          />
        </Box>
      </Box>
    </Card>
  );
};
export default SystemStatus;
