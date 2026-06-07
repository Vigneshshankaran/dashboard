import React from 'react';
import { Grid, Card, Box, Typography, Link } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ElderlyIcon from '@mui/icons-material/Elderly';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // Standard arrow icon

interface MetricItem {
  id: string;
  title: string;
  value: number;
  icon: React.ReactNode;
  linkText: string;
  isAlert?: boolean;
}

export const MetricsGrid: React.FC = () => {
  const metrics: MetricItem[] = [
    {
      id: 'users',
      title: 'TOTAL USERS',
      value: 12,
      icon: <PeopleIcon />,
      linkText: 'View all users',
    },
    {
      id: 'seniors',
      title: 'REGISTERED SENIORS',
      value: 4,
      icon: <ElderlyIcon />,
      linkText: 'View seniors',
    },
    {
      id: 'devices',
      title: 'ACTIVE DEVICES',
      value: 4,
      icon: <SmartphoneIcon />,
      linkText: 'View devices',
    },
    {
      id: 'approvals',
      title: 'PENDING APPROVALS',
      value: 0,
      icon: <HourglassEmptyIcon />,
      linkText: 'View mappings',
    },
    {
      id: 'alarms',
      title: 'ALARM EVENTS',
      value: 73,
      icon: <NotificationsActiveIcon />,
      linkText: 'View alerts',
      isAlert: true,
    },
  ];

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

            {/* Footer link with ArrowForwardIcon */}
            <Link
              href="#"
              underline="none"
              sx={{
                fontSize: '0.75rem',
                color: '#8C7E76',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                width: 'fit-content',
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
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
export default MetricsGrid;
