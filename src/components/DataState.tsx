import React from 'react';
import { Box, Card, Typography, Button, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

/**
 * DataState — shared "loading / error / content" wrapper used by every page.
 *
 *   <DataState loading={loading} error={error} onRetry={fetchData}>
 *     ...page content...
 *   </DataState>
 *
 * While loading → centered spinner. On error → friendly card with a Retry
 * button. Otherwise → renders the page content.
 */
interface DataStateProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
}

export const DataState: React.FC<DataStateProps> = ({ loading, error, onRetry, children }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 12, gap: 2 }}>
        <CircularProgress sx={{ color: '#D45529' }} />
        <Typography variant="body2" sx={{ color: '#8C7E76', fontWeight: 600 }}>
          Loading data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <Card sx={{ maxWidth: 480, width: '100%', textAlign: 'center', py: 5, px: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1A0E07' }}>
            Couldn't load data
          </Typography>
          <Typography variant="body2" sx={{ color: '#8C7E76', mb: 3 }}>
            {error}
          </Typography>
          {onRetry && (
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              sx={{ bgcolor: '#D45529', '&:hover': { bgcolor: '#B23F1C' }, fontWeight: 700, textTransform: 'none' }}
            >
              Retry
            </Button>
          )}
        </Card>
      </Box>
    );
  }

  return <>{children}</>;
};

export default DataState;
