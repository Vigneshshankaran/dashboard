import React, { useState } from 'react';
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
  const [assignments, setAssignments] = useState<MonitorAssignmentItem[]>([
    {
      id: 'a1',
      seniorName: 'Sushil T.',
      seniorEmail: '8459221606@healthsoft.in',
      seniorPhone: '8459221606',
      monitorName: 'Healthsoft Admin Team',
      monitorEmail: 'healthsoftcare@gmail.com',
      createdDate: 'May 24, 2026',
    },
    {
      id: 'a2',
      seniorName: 'Sushil T.',
      seniorEmail: '8459221606@healthsoft.in',
      seniorPhone: '8459221606',
      monitorName: 'Shravan H.',
      monitorEmail: 'shravan.hari03@gmail.com',
      createdDate: 'May 24, 2026',
    },
    {
      id: 'a3',
      seniorName: 'Sushil T.',
      seniorEmail: '8459221606@healthsoft.in',
      seniorPhone: '8459221606',
      monitorName: 'Prasad K.',
      monitorEmail: 'prkin@gmail.com',
      createdDate: 'May 24, 2026',
    },
    {
      id: 'a4',
      seniorName: 'Shravan Harishankar',
      seniorEmail: '9003197571@healthsoft.in',
      seniorPhone: '9003197571',
      monitorName: 'Healthsoft Admin Team',
      monitorEmail: 'healthsoftcare@gmail.com',
      createdDate: 'May 24, 2026',
    },
    {
      id: 'a5',
      seniorName: 'Shravan Harishankar',
      seniorEmail: '9003197571@healthsoft.in',
      seniorPhone: '9003197571',
      monitorName: 'Shravan H.',
      monitorEmail: 'shravan.hari03@gmail.com',
      createdDate: 'May 24, 2026',
    },
    {
      id: 'a6',
      seniorName: 'Shravan Harishankar',
      seniorEmail: '9003197571@healthsoft.in',
      seniorPhone: '9003197571',
      monitorName: 'Prasad K.',
      monitorEmail: 'prkin@gmail.com',
      createdDate: 'May 24, 2026',
    },
    {
      id: 'a7',
      seniorName: 'KC Anand',
      seniorEmail: '9840074789@healthsoft.in',
      seniorPhone: '9840074789',
      monitorName: 'Healthsoft Admin Team',
      monitorEmail: 'healthsoftcare@gmail.com',
      createdDate: 'May 24, 2026',
    },
    {
      id: 'a8',
      seniorName: 'KC Anand',
      seniorEmail: '9840074789@healthsoft.in',
      seniorPhone: '9840074789',
      monitorName: 'Shravan H.',
      monitorEmail: 'shravan.hari03@gmail.com',
      createdDate: 'May 24, 2026',
    },
    {
      id: 'a9',
      seniorName: 'KC Anand',
      seniorEmail: '9840074789@healthsoft.in',
      seniorPhone: '9840074789',
      monitorName: 'Prasad K.',
      monitorEmail: 'prkin@gmail.com',
      createdDate: 'May 24, 2026',
    },
  ]);

  // Search and filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeniorFilter, setSelectedSeniorFilter] = useState('ALL');

  // Dialog State for Assign Monitor
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [assignSeniorName, setAssignSeniorName] = useState('');
  const [assignSeniorEmail, setAssignSeniorEmail] = useState('');
  const [assignMonitorName, setAssignMonitorName] = useState('');
  const [assignMonitorEmail, setAssignMonitorEmail] = useState('');

  // Revoke handler
  const handleRevoke = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  // Add Assignment handler
  const handleAssignMonitor = () => {
    if (!assignSeniorName.trim() || !assignMonitorName.trim()) return;

    const newAssignment: MonitorAssignmentItem = {
      id: Date.now().toString(),
      seniorName: assignSeniorName.trim(),
      seniorEmail: assignSeniorEmail.trim() || `${assignSeniorName.toLowerCase().replace(/\s+/g, '')}@healthsoft.in`,
      seniorPhone: '9840055555',
      monitorName: assignMonitorName.trim(),
      monitorEmail: assignMonitorEmail.trim() || `${assignMonitorName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      createdDate: 'May 24, 2026',
    };

    setAssignments((prev) => [...prev, newAssignment]);
    setOpenAssignDialog(false);
    setAssignSeniorName('');
    setAssignSeniorEmail('');
    setAssignMonitorName('');
    setAssignMonitorEmail('');
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
          <TextField
            label="Senior Name"
            fullWidth
            value={assignSeniorName}
            onChange={(e) => setAssignSeniorName(e.target.value)}
            size="small"
          />
          <TextField
            label="Senior Email (optional)"
            fullWidth
            value={assignSeniorEmail}
            onChange={(e) => setAssignSeniorEmail(e.target.value)}
            size="small"
          />
          <TextField
            label="Monitor Name"
            fullWidth
            value={assignMonitorName}
            onChange={(e) => setAssignMonitorName(e.target.value)}
            size="small"
          />
          <TextField
            label="Monitor Email (optional)"
            fullWidth
            value={assignMonitorEmail}
            onChange={(e) => setAssignMonitorEmail(e.target.value)}
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleAssignMonitor} variant="contained" sx={{ backgroundColor: '#D45529', '&:hover': { backgroundColor: '#B23F1C' } }}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default Monitors;
