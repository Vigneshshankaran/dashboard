import React, { useState, useEffect } from 'react';
import { Grid, Card, Box, Typography, Link } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ElderlyIcon from '@mui/icons-material/Elderly';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // Standard arrow icon
import { AdminService, SeniorService, AlarmService } from '../api';

interface MetricItem {
  id: string;
  title: string;
  value: number;
  icon: React.ReactNode;
  linkText: string;
  tab: string; // sidebar tab this card's link opens
  isAlert?: boolean;
}

interface MetricsGridProps {
  role?: string;
  onNavigate: (tab: string) => void;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ role, onNavigate }) => {
  const [counts, setCounts] = useState({
    users: 0,
    seniors: 0,
    devices: 0,
    approvals: 0,
    alarms: 0,
  });

  useEffect(() => {
    const isClientAdmin = role === 'ADMIN';

    if (isClientAdmin) {
      AdminService.adminGetCounts()
        .then((res) => {
          if (res) {
            setCounts({
              users: res.totalUsers ?? res.users ?? 0,
              seniors: res.totalSeniors ?? res.seniors ?? 0,
              devices: res.totalDevices ?? res.devices ?? 0,
              approvals: res.pendingMappings ?? res.approvals ?? 0,
              alarms: res.totalAlerts ?? res.alarms ?? 0,
            });
          }
        })
        .catch((err) => {
          console.error('Failed to load counts from API:', err);
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
            users: guardians.length + monitors.length, // Total relationship contacts
            seniors: seniors.length,
            devices: seniors.reduce((acc: number, s: any) => acc + (s.devicesCount || 0), 0),
            approvals: 0, // Pending approvals not applicable for family/caregivers
            alarms: alarms.length,
          });
        })
        .catch((err) => {
          console.error('Failed to load user-level counts:', err);
        });
    }
  }, [role]);

  const isAdmin = role === 'ADMIN';

  const metrics: MetricItem[] = [
    {
      id: 'users',
      title: 'TOTAL USERS',
      value: counts.users,
      icon: <PeopleIcon />,
      linkText: 'View all users',
      tab: 'users',
    },
    {
      id: 'seniors',
      title: 'REGISTERED SENIORS',
      value: counts.seniors,
      icon: <ElderlyIcon />,
      linkText: 'View seniors',
      tab: 'seniors',
    },
    {
      id: 'devices',
      title: 'ACTIVE DEVICES',
      value: counts.devices,
      icon: <SmartphoneIcon />,
      linkText: 'View devices',
      tab: 'devices',
    },
    {
      id: 'approvals',
      title: 'PENDING APPROVALS',
      value: counts.approvals,
      icon: <HourglassEmptyIcon />,
      linkText: 'View mappings',
      tab: 'guardians',
    },
    {
      id: 'alarms',
      title: 'ALARM EVENTS',
      value: counts.alarms,
      icon: <NotificationsActiveIcon />,
      linkText: 'View alerts',
      tab: 'alerts',
      isAlert: true,
    },
    // Hide links to admin-only pages from non-admin users (matches sidebar)
  ].map((m) => ({
    ...m,
    linkText: !isAdmin && ['users', 'devices', 'guardians'].includes(m.tab) ? '' : m.linkText,
  }));

  return (
    <Grid container spacing={2.5}>
      {metrics.map((metric) => (
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={metric.id}>
          <Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              backgroundColor: metric.isAlert ? '#FFF5F5' : '#FFFFFF',
              borderColor: metric.isAlert ? '#FCA5A5' : '#EAE5E0',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: metric.isAlert ? '#EF4444' : '#D45529',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Box>
              {/* Header: Icon & Value */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: '8px',
                    backgroundColor: '#FAF8F6',
                    color: '#1A0E07',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {metric.icon}
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: '#1A0E07',
                    lineHeight: 1,
                  }}
                >
                  {metric.value}
                </Typography>
              </Box>

              {/* Title label */}
              <Typography
                variant="caption"
                sx={{
                  color: '#8C7E76',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  display: 'block',
                  mb: 2,
                }}
              >
                {metric.title}
              </Typography>
            </Box>

            {/* Footer link — navigates to the matching page */}
            {metric.linkText && (
              <Link
                component="button"
                type="button"
                onClick={() => onNavigate(metric.tab)}
                underline="none"
                sx={{
                  fontSize: '0.75rem',
                  color: '#8C7E76',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  width: 'fit-content',
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#D45529',
                    '& .link-arrow': {
                      transform: 'translateX(2px)',
                    },
                  },
                }}
              >
                {metric.linkText}
                <ArrowForwardIcon
                  className="link-arrow"
                  sx={{
                    fontSize: 12,
                    transition: 'transform 0.2s ease',
                    color: 'inherit'
                  }}
                />
              </Link>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
export default MetricsGrid;
