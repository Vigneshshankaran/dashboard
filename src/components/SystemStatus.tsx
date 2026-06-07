import React from 'react';
import { Card, Typography, Box, Chip, Divider } from '@mui/material';

export const SystemStatus: React.FC = () => {
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

        {/* Live Indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#10B981',
              animation: 'pulse 2s infinite',
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
              color: '#10B981',
              fontSize: '0.8rem',
            }}
          >
            Live
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
            label="Operational"
            size="small"
            sx={{
              backgroundColor: '#ECFDF5',
              color: '#10B981',
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
            4 seniors - 4 guardians - 2 monitors - 2 admins
          </Typography>
        </Box>
        <Divider sx={{ borderColor: '#F5F2EF' }} />

        {/* Row 3: Device Fleet */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: '#8C7E76', fontWeight: 500 }}>
            Device Fleet
          </Typography>
          <Typography variant="body2" sx={{ color: '#1A0E07', fontWeight: 600 }}>
            4 registered
          </Typography>
        </Box>
        <Divider sx={{ borderColor: '#F5F2EF' }} />

        {/* Row 4: Pending Approvals */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: '#8C7E76', fontWeight: 500 }}>
            Pending Approvals
          </Typography>
          <Chip
            label="None"
            size="small"
            sx={{
              backgroundColor: '#ECFDF5',
              color: '#10B981',
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
            label="73 events"
            size="small"
            sx={{
              backgroundColor: '#FEF2F2',
              color: '#EF4444',
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
