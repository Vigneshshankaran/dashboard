import React, { useState } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { MetricsGrid } from '../components/MetricsGrid';
import { QuickActions } from '../components/QuickActions';
import { SystemStatus } from '../components/SystemStatus';

interface DashboardProps {
  role?: string;
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ role, onNavigate }) => {
  // Bumping this key remounts MetricsGrid/SystemStatus, which re-fetches their data
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Page Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
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
            Operations Overview
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#8C7E76',
              fontWeight: 500,
              mt: 0.5,
            }}
          >
            SeniorCare Platform - Real-time monitoring
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          sx={{
            px: 2,
            py: 1,
            color: '#1A0E07',
            borderColor: '#EAE5E0',
            fontWeight: 600,
            fontSize: '0.85rem',
            backgroundColor: '#FFFFFF',
            '&:hover': {
              borderColor: '#D45529',
              backgroundColor: '#FAF8F6',
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Metric Cards Grid */}
      <Box>
        <MetricsGrid key={`metrics-${refreshKey}`} role={role} />
      </Box>

      {/* Lower Workspace Grid */}
      <Grid container spacing={3.5}>
        {/* Quick Actions List (left) */}
        <Grid size={{ xs: 12, md: 7 }}>
          <QuickActions role={role} onNavigate={onNavigate} />
        </Grid>

        {/* System Status Table (right) */}
        <Grid size={{ xs: 12, md: 5 }}>
          <SystemStatus key={`status-${refreshKey}`} role={role} />
        </Grid>
      </Grid>
    </Box>
  );
};
export default Dashboard;
