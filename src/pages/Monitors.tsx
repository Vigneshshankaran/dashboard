import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
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
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link'; // Chain link icon for Assign Monitor
import LinkOffIcon from '@mui/icons-material/LinkOff'; // Revoke unlink icon
import { AdminService, MonitorService } from '../api';
import { DataState } from '../components/DataState';


// Monitor assignment structure
interface MonitorAssignmentItem {
  id: string;
  seniorName: string;
  seniorEmail: string;
  seniorPhone: string;
  monitorName: string;
  monitorEmail: string;
  createdDate: string;
}

export const Monitors: React.FC = () => {
  // Pre-populated monitor assignments matching screenshot
  const [assignments, setAssignments] = useState<MonitorAssignmentItem[]>([]);

  // Search and filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeniorFilter, setSelectedSeniorFilter] = useState('ALL');

  // Dialog State for Assign Monitor — dropdowns of real users (UUIDs)
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [assignSeniorId, setAssignSeniorId] = useState('');
  const [assignMonitorId, setAssignMonitorId] = useState('');
  const [seniorOptions, setSeniorOptions] = useState<{ id: string; name: string; email: string }[]>([]);
  const [monitorOptions, setMonitorOptions] = useState<{ id: string; name: string; email: string }[]>([]);

  // Page load / error state
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    fetchMonitorAssignments();
  }, []);

  // Tolerant readers — backend may send flat, nested, or snake_case fields
  const personName = (p: any) =>
    p?.name || `${p?.firstName || p?.first_name || ''} ${p?.lastName || p?.last_name || ''}`.trim();
  const personEmail = (p: any) => p?.primaryEmail || p?.email || '';
  const personPhone = (p: any) => {
    const ph = p?.phoneNumber || p?.phone_number;
    return ph ? String(ph) : '';
  };

  const fetchMonitorAssignments = () => {
    setPageError(null);
    // The mappings often carry only user IDs — fetch users too so we can
    // resolve names/emails, and to populate the Assign dialog dropdowns.
    Promise.all([
      AdminService.adminGetMonitorMappings(),
      AdminService.adminGetUsers().catch(() => []),
    ])
      .then(([res, users]) => {
        setPageLoading(false);

        const usersById: Record<string, any> = {};
        const seniors: { id: string; name: string; email: string }[] = [];
        const monitors: { id: string; name: string; email: string }[] = [];
        (users || []).forEach((u: any) => {
          const id = u.id || u.userId;
          if (!id) return;
          usersById[id] = u;
          const option = { id, name: personName(u) || 'User', email: personEmail(u) || '—' };
          if (u.role === 'SENIOR') seniors.push(option);
          else if (u.role === 'MONITOR') monitors.push(option);
        });
        setSeniorOptions(seniors);
        setMonitorOptions(monitors);

        if (res) {
          const list: MonitorAssignmentItem[] = res.map((m: any, idx: number) => {
            // Senior/monitor may be nested objects, or just IDs we resolve via users
            const senior = m.senior || usersById[m.seniorId || m.seniorUUID] || {};
            const monitor = m.monitor || usersById[m.monitorId || m.monitorUUID] || {};

            let dateStr = '—';
            const rawDate = m.createdAt || m.created_at || m.createdDate || m.date;
            if (rawDate) {
              const d = new Date(rawDate);
              if (!isNaN(d.getTime())) {
                dateStr = d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
              }
            }

            return {
              id: m.id || m.mappingId || String(idx),
              seniorName: m.seniorName || personName(senior) || 'Senior',
              seniorEmail: m.seniorEmail || personEmail(senior) || '—',
              seniorPhone: m.seniorPhone || personPhone(senior) || '—',
              monitorName: m.monitorName || personName(monitor) || 'Monitor',
              monitorEmail: m.monitorEmail || personEmail(monitor) || '—',
              createdDate: dateStr,
            };
          });
          setAssignments(list);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch monitor assignments from API:', err);
        setPageLoading(false);
        setPageError(err?.message || 'The server could not be reached. Please try again.');
      });
  };

  // Revoke handler
  const handleRevoke = (id: string) => {
    MonitorService.deleteMonitorMapping(id)
      .then(() => {
        fetchMonitorAssignments();
      })
      .catch((err) => {
        console.error('Failed to revoke monitor mapping from API:', err);
        alert('Failed to revoke monitor mapping from API.');
      });
  };

  // Add Assignment handler — sends the selected users' real UUIDs
  const handleAssignMonitor = () => {
    if (!assignSeniorId || !assignMonitorId) return;

    MonitorService.assignMonitor({
      seniorId: assignSeniorId,
      monitorId: assignMonitorId,
    })
      .then(() => {
        fetchMonitorAssignments();
        setOpenAssignDialog(false);
        setAssignSeniorId('');
        setAssignMonitorId('');
      })
      .catch((err) => {
        console.error('Failed to assign monitor in API:', err);
        alert('Failed to assign monitor in API.');
      });
  };

  // Filter list
  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.seniorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.monitorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSenior = selectedSeniorFilter === 'ALL' || a.seniorName === selectedSeniorFilter;

    return matchesSearch && matchesSenior;
  });

  // Grouping logic for rows
  const getGroupedRows = () => {
    const grouped: { [key: string]: MonitorAssignmentItem[] } = {};
    filteredAssignments.forEach((a) => {
      if (!grouped[a.seniorName]) {
        grouped[a.seniorName] = [];
      }
      grouped[a.seniorName].push(a);
    });

    const rows: Array<{
      assignment: MonitorAssignmentItem;
      isFirstOfGroup: boolean;
      groupCount: number;
    }> = [];

    Object.keys(grouped).forEach((seniorName) => {
      const items = grouped[seniorName];
      items.forEach((item, index) => {
        rows.push({
          assignment: item,
          isFirstOfGroup: index === 0,
          groupCount: items.length,
        });
      });
    });

    return rows;
  };

  const groupedRows = getGroupedRows();
  const uniqueSeniorsCount = Array.from(new Set(assignments.map((a) => a.seniorName))).length;

  return (
    <DataState loading={pageLoading} error={pageError} onRetry={fetchMonitorAssignments}>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Top Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'flex-start' },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#1A0E07',
              letterSpacing: '-0.5px',
            }}
          >
            Monitor Assignments
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#8C7E76',
              fontWeight: 500,
              mt: 0.5,
            }}
          >
            {assignments.length} mapping(s) across {uniqueSeniorsCount} senior(s)
          </Typography>
        </Box>

        {/* Action Button with Solid Black Icon */}
        <Button
          variant="contained"
          startIcon={<LinkIcon sx={{ color: '#FFFFFF' }} />} // Solid Icon
          onClick={() => setOpenAssignDialog(true)}
          sx={{
            backgroundColor: '#D45529', // Orange background matching theme
            fontWeight: 650,
            alignSelf: { xs: 'stretch', sm: 'flex-start' },
            '&:hover': {
              backgroundColor: '#B23F1C',
            },
          }}
        >
          Assign Monitor
        </Button>
      </Box>

      {/* Search Filter Row */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        <TextField
          placeholder="Filter by senior or monitor name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{
            flexGrow: 1,
            backgroundColor: '#FFFFFF',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              borderColor: '#EAE5E0',
            },
          }}
        />

        <Select
          value={selectedSeniorFilter}
          onChange={(e) => setSelectedSeniorFilter(e.target.value)}
          size="small"
          sx={{
            minWidth: 160,
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
          }}
        >
          <MenuItem value="ALL">All seniors</MenuItem>
          {Array.from(new Set(assignments.map((a) => a.seniorName))).map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Assignments Table */}
      <TableContainer component={Paper} sx={{ border: '1px solid #EAE5E0', boxShadow: 'none' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#FAF8F6' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5, width: '30%' }}>SENIOR</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5, width: '35%' }}>MONITOR</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5, width: '20%' }}>CREATED</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5, width: '15%' }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#8C7E76' }}>
                  No assignments found
                </TableCell>
              </TableRow>
            ) : (
              groupedRows.map(({ assignment, isFirstOfGroup, groupCount }) => (
                <TableRow
                  key={assignment.id}
                  sx={{
                    borderBottom: '1px solid #EAE5E0',
                    '&:hover': { backgroundColor: '#FCFAF8' },
                  }}
                >
                  {/* Column 1: SENIOR (rowSpan grouping) */}
                  {isFirstOfGroup && (
                    <TableCell
                      rowSpan={groupCount}
                      sx={{
                        verticalAlign: 'top',
                        py: 2.5,
                        borderRight: '1px solid #EAE5E0',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <Typography sx={{ fontWeight: 750, color: '#1A0E07', fontSize: '0.925rem' }}>
                        {assignment.seniorName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#8C7E76', fontSize: '0.75rem', mt: 0.25 }}>
                        {assignment.seniorEmail}
                      </Typography>
                      <Chip
                        label={`${groupCount} ${groupCount === 1 ? 'monitor' : 'monitors'}`}
                        size="small"
                        sx={{
                          mt: 1.5,
                          backgroundColor: '#FFF2EC',
                          color: '#D45529',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          height: 18,
                        }}
                      />
                    </TableCell>
                  )}

                  {/* Column 2: MONITOR */}
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          bgcolor: '#D45529', // Orange avatar
                          color: '#FFFFFF',
                          width: 32,
                          height: 32,
                          fontSize: '0.8rem',
                          fontWeight: 700,
                        }}
                      >
                        {assignment.monitorName.substring(0, 1).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 650, color: '#1A0E07', fontSize: '0.9rem' }}>
                          {assignment.monitorName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#8C7E76', fontSize: '0.75rem' }}>
                          {assignment.monitorEmail}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Column 3: CREATED */}
                  <TableCell sx={{ py: 2, color: '#8C7E76', fontSize: '0.85rem', fontWeight: 500 }}>
                    {assignment.createdDate}
                  </TableCell>

                  {/* Column 4: ACTIONS (Revoke with Solid Black Icon) */}
                  <TableCell sx={{ py: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<LinkOffIcon sx={{ color: '#1A0E07' }} />} // Solid Black Icon
                      onClick={() => handleRevoke(assignment.id)}
                      sx={{
                        borderColor: '#FCA5A5',
                        color: '#EF4444',
                        fontWeight: 650,
                        fontSize: '0.75rem',
                        py: 0.5,
                        px: 1.25,
                        backgroundColor: '#FFFFFF',
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: '#FEF2F2',
                          borderColor: '#EF4444',
                        },
                      }}
                    >
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Assign Monitor Dialog Modal */}
      <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)}>
        <DialogTitle sx={{ fontWeight: 750 }}>Assign Monitor to Senior</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.25, pt: 1.5, minWidth: 340 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, mb: 0.5, display: 'block' }}>
              SENIOR
            </Typography>
            <Select
              fullWidth
              size="small"
              value={assignSeniorId}
              onChange={(e) => setAssignSeniorId(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                {seniorOptions.length === 0 ? 'No seniors found' : 'Select a senior...'}
              </MenuItem>
              {seniorOptions.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name} — {s.email}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, mb: 0.5, display: 'block' }}>
              MONITOR
            </Typography>
            <Select
              fullWidth
              size="small"
              value={assignMonitorId}
              onChange={(e) => setAssignMonitorId(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                {monitorOptions.length === 0 ? 'No monitors found' : 'Select a monitor...'}
              </MenuItem>
              {monitorOptions.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name} — {m.email}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleAssignMonitor}
            variant="contained"
            disabled={!assignSeniorId || !assignMonitorId}
            sx={{ backgroundColor: '#D45529', '&:hover': { backgroundColor: '#B23F1C' } }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </DataState>
  );
};
export default Monitors;
