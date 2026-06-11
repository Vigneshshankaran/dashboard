import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, Snackbar, Typography, Box } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined';

/**
 * FeedbackProvider — the app's replacement for the browser's ugly
 * alert() and confirm() popups.
 *
 *   const { notify, confirm } = useFeedback();
 *   notify('Saved!', 'success');                          // toast
 *   notify(err.message, 'error');                         // error toast
 *   const ok = await confirm({ title, message, danger }); // styled dialog
 */
type Severity = 'success' | 'error' | 'info' | 'warning';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  /** Red confirm button for destructive actions */
  danger?: boolean;
}

interface FeedbackApi {
  notify: (message: string, severity?: Severity) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const FeedbackContext = createContext<FeedbackApi | null>(null);

export const useFeedback = (): FeedbackApi => {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used inside <FeedbackProvider>');
  return ctx;
};

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Toast state
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: Severity }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Confirm dialog state — resolver is kept in a ref so confirm() can await it
  const [confirmState, setConfirmState] = useState<(ConfirmOptions & { open: boolean }) | null>(null);
  const resolverRef = useRef<((answer: boolean) => void) | null>(null);

  const notify = useCallback((message: string, severity: Severity = 'info') => {
    setToast({ open: true, message, severity });
  }, []);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setConfirmState({ ...options, open: true });
    });
  }, []);

  const answer = (value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setConfirmState((prev) => (prev ? { ...prev, open: false } : null));
  };

  return (
    <FeedbackContext.Provider value={{ notify, confirm }}>
      {children}

      {/* Toast — bottom center, theme-styled */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={(_, reason) => {
          if (reason === 'clickaway') return;
          setToast((p) => ({ ...p, open: false }));
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          variant="filled"
          severity={toast.severity}
          onClose={() => setToast((p) => ({ ...p, open: false }))}
          sx={{ borderRadius: '10px', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', maxWidth: 480 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      {/* Confirmation dialog */}
      <Dialog
        open={Boolean(confirmState?.open)}
        onClose={() => answer(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '14px', p: 0.5 } } }}
      >
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '10px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: confirmState?.danger ? '#FEE2E2' : '#FFF7ED',
                color: confirmState?.danger ? '#DC2626' : '#D45529',
              }}
            >
              {confirmState?.danger ? <WarningAmberIcon /> : <HelpOutlineIcon />}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 750, color: '#1A0E07', mb: 0.75, lineHeight: 1.3 }}>
                {confirmState?.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6E625B', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {confirmState?.message}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => answer(false)}
            sx={{ color: '#8C7E76', fontWeight: 600, textTransform: 'none' }}
          >
            {confirmState?.cancelText || 'Cancel'}
          </Button>
          <Button
            onClick={() => answer(true)}
            variant="contained"
            autoFocus
            sx={{
              fontWeight: 700,
              textTransform: 'none',
              px: 2.5,
              borderRadius: '8px',
              boxShadow: 'none',
              bgcolor: confirmState?.danger ? '#DC2626' : '#D45529',
              '&:hover': { bgcolor: confirmState?.danger ? '#B91C1C' : '#B23F1C', boxShadow: 'none' },
            }}
          >
            {confirmState?.confirmText || 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </FeedbackContext.Provider>
  );
};

export default FeedbackProvider;
