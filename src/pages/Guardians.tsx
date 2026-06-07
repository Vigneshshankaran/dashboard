import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
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
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  IconButton,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

// Senior-Guardian mapping item
interface MappingItem {
  id: string;
  seniorName: string;
  seniorEmail: string;
  seniorPhone: string;
  guardianName: string;
  guardianEmail: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  date: string;
}

// Available seniors list
const SENIORS = [
  { id: 's1', name: 'Sushil T.', email: '8459221606@healthsoft.in' },
  { id: 's2', name: 'Dummy Senior', email: '9317251535@healthsoft.in' },
  { id: 's3', name: 'Shravan Harishankar', email: '9003197571@healthsoft.in' },
  { id: 's4', name: 'KC Anand', email: '9840074789@healthsoft.in' },
];

// Available guardians list
const GUARDIANS = [
  { id: 'g1', name: 'YSk Kumar', email: 'ktsushildev@gmail.com' },
  { id: 'g2', name: 'Ratnender Girri', email: 'ratnendr.girri@gmail.com' },
  { id: 'g3', name: 'Seetharam S.', email: 'catchseetga@gmail.com' },
  { id: 'g4', name: 'KC Anand', email: 'kcanand@healthsoft.in' },
  { id: 'g5', name: 'Healthsoft Admin Team', email: 'healthsoftcare@gmail.com' },
];

export const Guardians: React.FC = () => {
  const [mappings, setMappings] = useState<MappingItem[]>([
    {
      id: 'm1',
      seniorName: 'Sushil T.',
      seniorEmail: '8459221606@healthsoft.in',
      seniorPhone: '8459221606',
      guardianName: 'YSk Kumar',
      guardianEmail: 'ktsushildev@gmail.com',
      status: 'APPROVED',
      date: 'Apr 12, 2026',
    },
    {
      id: 'm2',
      seniorName: 'Sushil T.',
      seniorEmail: '8459221606@healthsoft.in',
      seniorPhone: '8459221606',
      guardianName: 'Ratnender Girri',
      guardianEmail: 'ratnendr.girri@gmail.com',
      status: 'APPROVED',
      date: 'Apr 19, 2026',
    },
    {
      id: 'm3',
      seniorName: 'Dummy Senior',
      seniorEmail: '9317251535@healthsoft.in',
      seniorPhone: '9317251535',
      guardianName: 'Ratnender Girri',
      guardianEmail: 'ratnendr.girri@gmail.com',
      status: 'APPROVED',
      date: 'Apr 20, 2026',
    },
    {
      id: 'm4',
      seniorName: 'Shravan Harishankar',
      seniorEmail: '9003197571@healthsoft.in',
      seniorPhone: '9003197571',
      guardianName: 'Ratnender Girri',
      guardianEmail: 'ratnendr.girri@gmail.com',
      status: 'APPROVED',
      date: 'Apr 20, 2026',
    },
    {
      id: 'm5',
      seniorName: 'Shravan Harishankar',
      seniorEmail: '9003197571@healthsoft.in',
      seniorPhone: '9003197571',
      guardianName: 'Seetharam S.',
      guardianEmail: 'catchseetga@gmail.com',
      status: 'APPROVED',
      date: 'May 3, 2026',
    },
    {
      id: 'm6',
      seniorName: 'Shravan Harishankar',
      seniorEmail: '9003197571@healthsoft.in',
      seniorPhone: '9003197571',
      guardianName: 'YSk Kumar',
      guardianEmail: 'ktsushildev@gmail.com',
      status: 'APPROVED',
      date: 'May 3, 2026',
    },
  ]);

  const [activeSubTab, setActiveSubTab] = useState(0);

  // Dialog State
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [selectedSeniorId, setSelectedSeniorId] = useState('');
  const [selectedGuardianId, setSelectedGuardianId] = useState('');

  const handleDelink = (id: string) => {
    setMappings((prev) => prev.filter((m) => m.id !== id));
  };

  const handleCloseLinkDialog = () => {
    setOpenLinkDialog(false);
    setSelectedSeniorId('');
    setSelectedGuardianId('');
  };

  const handleLinkSenior = () => {
    if (!selectedSeniorId || !selectedGuardianId) return;
    const senior = SENIORS.find((s) => s.id === selectedSeniorId);
    const guardian = GUARDIANS.find((g) => g.id === selectedGuardianId);
    if (!senior || !guardian) return;

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newMapping: MappingItem = {
      id: Date.now().toString(),
      seniorName: senior.name,
      seniorEmail: senior.email,
      seniorPhone: '0000000000',
      guardianName: guardian.name,
      guardianEmail: guardian.email,
      status: 'APPROVED',
      date: dateStr,
    };

    setMappings((prev) => [...prev, newMapping]);
    handleCloseLinkDialog();
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveSubTab(newValue);
  };

  const filteredMappings = mappings.filter((m) => {
    if (activeSubTab === 0) return true;
    if (activeSubTab === 1) return m.status === 'PENDING';
    if (activeSubTab === 2) return m.status === 'APPROVED';
    if (activeSubTab === 3) return m.status === 'REJECTED';
    return true;
  });

  const getGroupedRows = () => {
    const grouped: { [key: string]: MappingItem[] } = {};
    filteredMappings.forEach((m) => {
      if (!grouped[m.seniorName]) grouped[m.seniorName] = [];
      grouped[m.seniorName].push(m);
    });

    const rows: Array<{ mapping: MappingItem; isFirstOfGroup: boolean; groupCount: number }> = [];
    Object.keys(grouped).forEach((seniorName) => {
      grouped[seniorName].forEach((item, index) => {
        rows.push({ mapping: item, isFirstOfGroup: index === 0, groupCount: grouped[seniorName].length });
      });
    });

    return rows;
  };

  const groupedRows = getGroupedRows();
  const pendingCount = mappings.filter((m) => m.status === 'PENDING').length;
  const selectedSenior = SENIORS.find((s) => s.id === selectedSeniorId);
  const selectedGuardian = GUARDIANS.find((g) => g.id === selectedGuardianId);
  const canCreate = !!selectedSeniorId && !!selectedGuardianId;

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
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1A0E07', letterSpacing: '-0.5px' }}>
            Guardians
          </Typography>
          <Typography variant="body2" sx={{ color: '#8C7E76', fontWeight: 500, mt: 0.5 }}>
            {mappings.length} mapping(s) — {pendingCount} pending approval
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            variant="outlined"
            startIcon={<LinkIcon sx={{ color: '#D45529' }} />}
            onClick={() => setOpenLinkDialog(true)}
            sx={{
              borderColor: '#D45529',
              color: '#D45529',
              fontWeight: 650,
              backgroundColor: '#FFFFFF',
              textTransform: 'none',
              '&:hover': { borderColor: '#4E2818', backgroundColor: '#FAF8F6' },
            }}
          >
            Link Senior
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: '#D45529',
              fontWeight: 650,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#B23F1C' },
            }}
          >
            Add Senior
          </Button>
        </Box>
      </Box>

      {/* Subtab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: '#EAE5E0' }}>
        <Tabs
          value={activeSubTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#D45529' },
            '& .MuiTab-root': {
              fontWeight: 700,
              fontSize: '0.875rem',
              color: '#8C7E76',
              textTransform: 'none',
              minWidth: 80,
              '&.Mui-selected': { color: '#D45529' },
            },
          }}
        >
          <Tab label="All" />
          <Tab label="Pending" />
          <Tab label="Approved" />
          <Tab label="Rejected" />
        </Tabs>
      </Box>

      {/* Mappings Table */}
      <TableContainer component={Paper} sx={{ border: '1px solid #EAE5E0', boxShadow: 'none' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#FAF8F6' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5, width: '30%' }}>SENIOR</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5, width: '35%' }}>LINKED TO</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5, width: '20%' }}>STATUS & DATE</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5, width: '15%' }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#8C7E76' }}>
                  No mappings found
                </TableCell>
              </TableRow>
            ) : (
              groupedRows.map(({ mapping, isFirstOfGroup, groupCount }) => (
                <TableRow
                  key={mapping.id}
                  sx={{ borderBottom: '1px solid #EAE5E0', '&:hover': { backgroundColor: '#FCFAF8' } }}
                >
                  {isFirstOfGroup && (
                    <TableCell
                      rowSpan={groupCount}
                      sx={{ verticalAlign: 'top', py: 2.5, borderRight: '1px solid #EAE5E0', backgroundColor: '#FFFFFF' }}
                    >
                      <Typography sx={{ fontWeight: 750, color: '#1A0E07', fontSize: '0.925rem' }}>
                        {mapping.seniorName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#8C7E76', fontSize: '0.75rem', mt: 0.25 }}>
                        {mapping.seniorEmail}
                      </Typography>
                      <Chip
                        label={`${groupCount} ${groupCount === 1 ? 'link' : 'links'}`}
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

                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: '#D45529', color: '#FFFFFF', width: 32, height: 32, fontSize: '0.8rem', fontWeight: 700 }}>
                        {mapping.guardianName.substring(0, 1).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 650, color: '#1A0E07', fontSize: '0.9rem' }}>
                          {mapping.guardianName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#8C7E76', fontSize: '0.75rem' }}>
                          {mapping.guardianEmail}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={mapping.status}
                      size="small"
                      sx={{
                        backgroundColor: mapping.status === 'APPROVED' ? '#ECFDF5' : '#FEF2F2',
                        color: mapping.status === 'APPROVED' ? '#10B981' : '#EF4444',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        borderRadius: '4px',
                        mb: 0.5,
                      }}
                    />
                    <Typography sx={{ color: '#8C7E76', fontSize: '0.75rem', fontWeight: 500 }}>
                      {mapping.date}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<LinkOffIcon sx={{ color: '#EF4444', fontSize: 15 }} />}
                      onClick={() => handleDelink(mapping.id)}
                      sx={{
                        borderColor: '#FCA5A5',
                        color: '#EF4444',
                        fontWeight: 650,
                        fontSize: '0.75rem',
                        py: 0.5,
                        px: 1.25,
                        backgroundColor: '#FFFFFF',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#FEF2F2', borderColor: '#EF4444' },
                      }}
                    >
                      De-Link
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Link Senior to Guardian Dialog ── */}
      <Dialog
        open={openLinkDialog}
        onClose={handleCloseLinkDialog}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '14px',
              overflow: 'hidden',
            },
          },
        }}
      >
        {/* Custom Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            px: 3,
            pt: 2.5,
            pb: 2,
            borderBottom: '1px solid #F0EBE6',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                backgroundColor: '#FFF2EC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <LinkIcon sx={{ color: '#D45529', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#1A0E07', fontSize: '1.05rem', lineHeight: 1.2 }}>
                Link Senior to Guardian
              </Typography>
              <Typography sx={{ color: '#8C7E76', fontSize: '0.78rem', mt: 0.3 }}>
                Select a Senior and a Guardian to create a mapping
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleCloseLinkDialog}
            size="small"
            sx={{ color: '#8C7E76', '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' } }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
          {/* Two-panel selector row */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>

            {/* Left panel — SENIOR */}
            <Box
              sx={{
                flex: 1,
                border: '1.5px solid #EAE5E0',
                borderRadius: '10px',
                p: 2,
                backgroundColor: '#FAFAFA',
                transition: 'border-color 0.2s',
                ...(selectedSeniorId && { borderColor: '#D45529' }),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
                <PersonIcon sx={{ fontSize: 16, color: '#D45529' }} />
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#8C7E76', letterSpacing: '0.8px' }}>
                  SENIOR
                </Typography>
              </Box>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedSeniorId}
                  onChange={(e) => {
                    setSelectedSeniorId(e.target.value);
                    setSelectedGuardianId('');
                  }}
                  displayEmpty
                  sx={{
                    borderRadius: '7px',
                    backgroundColor: '#FFFFFF',
                    fontSize: '0.875rem',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#EAE5E0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D45529' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#D45529', borderWidth: '1.5px' },
                  }}
                >
                  <MenuItem value="" disabled sx={{ fontSize: '0.875rem', color: '#8C7E76' }}>
                    — Select Senior —
                  </MenuItem>
                  {SENIORS.map((s) => (
                    <MenuItem key={s.id} value={s.id} sx={{ fontSize: '0.875rem' }}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedSenior && (
                <Box sx={{ mt: 1.25, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Avatar sx={{ bgcolor: '#D45529', width: 22, height: 22, fontSize: '0.65rem', fontWeight: 700 }}>
                    {selectedSenior.name[0]}
                  </Avatar>
                  <Typography sx={{ fontSize: '0.72rem', color: '#8C7E76' }}>
                    {selectedSenior.email}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Arrow connector */}
            <Box
              sx={{
                width: 34,
                height: 34,
                mt: 4.5,
                borderRadius: '50%',
                backgroundColor: canCreate ? '#D45529' : '#FFF2EC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background-color 0.3s',
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: 16, color: canCreate ? '#FFFFFF' : '#D45529' }} />
            </Box>

            {/* Right panel — GUARDIAN */}
            <Box
              sx={{
                flex: 1,
                border: '1.5px solid #EAE5E0',
                borderRadius: '10px',
                p: 2,
                backgroundColor: selectedSeniorId ? '#FAFAFA' : '#F5F3F2',
                opacity: selectedSeniorId ? 1 : 0.6,
                transition: 'opacity 0.2s, background-color 0.2s, border-color 0.2s',
                ...(selectedGuardianId && { borderColor: '#D45529' }),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
                <PeopleAltIcon sx={{ fontSize: 16, color: '#D45529' }} />
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#8C7E76', letterSpacing: '0.8px' }}>
                  GUARDIAN
                </Typography>
              </Box>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedGuardianId}
                  onChange={(e) => setSelectedGuardianId(e.target.value)}
                  disabled={!selectedSeniorId}
                  displayEmpty
                  sx={{
                    borderRadius: '7px',
                    backgroundColor: '#FFFFFF',
                    fontSize: '0.875rem',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#EAE5E0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D45529' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#D45529', borderWidth: '1.5px' },
                  }}
                >
                  <MenuItem value="" disabled sx={{ fontSize: '0.875rem', color: '#8C7E76' }}>
                    {selectedSeniorId ? '— Select Guardian —' : '— Select a Senior first —'}
                  </MenuItem>
                  {GUARDIANS.map((g) => (
                    <MenuItem key={g.id} value={g.id} sx={{ fontSize: '0.875rem' }}>
                      {g.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedGuardian && (
                <Box sx={{ mt: 1.25, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Avatar sx={{ bgcolor: '#D45529', width: 22, height: 22, fontSize: '0.65rem', fontWeight: 700 }}>
                    {selectedGuardian.name[0]}
                  </Avatar>
                  <Typography sx={{ fontSize: '0.72rem', color: '#8C7E76' }}>
                    {selectedGuardian.email}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button
            onClick={handleCloseLinkDialog}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: '#8C7E76',
              fontSize: '0.9rem',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLinkSenior}
            disabled={!canCreate}
            startIcon={<LinkIcon sx={{ fontSize: 16 }} />}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              borderRadius: '8px',
              px: 2.5,
              py: 1,
              backgroundColor: '#D45529',
              color: '#FFFFFF',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#B23F1C', boxShadow: 'none' },
              '&.Mui-disabled': { backgroundColor: '#F0E0D6', color: '#C4A090' },
            }}
          >
            Create Link
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Guardians;
