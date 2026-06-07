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
  Avatar,
  Chip,
  IconButton,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogActions,
  Paper, // Fixed: Added Paper import
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

// User structure
interface UserItem {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'GUARDIAN' | 'SENIOR' | 'MONITOR';
  status: 'Active' | 'Offline';
  avatarBg: string;
  avatarColor: string;
}

export const Users: React.FC = () => {
  // Mock data of 11 users matching the screenshot
  const [users, setUsers] = useState<UserItem[]>([
    {
      id: '1',
      name: 'Ratnender Aarti',
      username: 'ratnender.aarti.fa68',
      email: 'aarti.ratnender@gmail.com',
      phone: '7018232095',
      role: 'GUARDIAN',
      status: 'Active',
      avatarBg: '#D1FAE5',
      avatarColor: '#10B981',
    },
    {
      id: '2',
      name: 'Shravan Harishankar',
      username: 'shravan.harishankar.0359',
      email: '9003197571@healthsoft.in',
      phone: '9003197571',
      role: 'SENIOR',
      status: 'Active',
      avatarBg: '#DBEAFE',
      avatarColor: '#3B82F6',
    },
    {
      id: '3',
      name: 'Seetharam S.',
      username: 'seetharam.s.9146',
      email: 'catchsee1qa@gmail.com',
      phone: '9500001488',
      role: 'GUARDIAN',
      status: 'Active',
      avatarBg: '#D1FAE5',
      avatarColor: '#10B981',
    },
    {
      id: '4',
      name: 'KC Anand',
      username: 'kc.anand.9366',
      email: '9840074789@healthsoft.in',
      phone: '9840074789',
      role: 'SENIOR',
      status: 'Active',
      avatarBg: '#DBEAFE',
      avatarColor: '#3B82F6',
    },
    {
      id: '5',
      name: 'Shravan H.',
      username: 'shravan.harishankar.3783',
      email: 'shravan.hari03@gmail.com',
      phone: '9840374789',
      role: 'MONITOR',
      status: 'Active',
      avatarBg: '#FEF3C7',
      avatarColor: '#F59E0B',
    },
    {
      id: '6',
      name: 'KC Anand',
      username: 'kc.anand.fb9c',
      email: 'kcanand@healthsoft.in',
      phone: '9840098400',
      role: 'GUARDIAN',
      status: 'Active',
      avatarBg: '#D1FAE5',
      avatarColor: '#10B981',
    },
    {
      id: '7',
      name: 'Dummy Senior',
      username: 'dummy.senior.c97b',
      email: '9317251535@healthsoft.in',
      phone: '9317251535',
      role: 'SENIOR',
      status: 'Active',
      avatarBg: '#DBEAFE',
      avatarColor: '#3B82F6',
    },
    {
      id: '8',
      name: 'Healthsoft Admin Team',
      username: 'healthsoft.monitor.dc16',
      email: 'healthsoftcare@gmail.com',
      phone: '1234512345',
      role: 'ADMIN',
      status: 'Active',
      avatarBg: '#FCE7F3',
      avatarColor: '#E11D48',
    },
    {
      id: '9',
      name: 'Ratnender Girri',
      username: 'ratnender',
      email: 'ratnendr.girri@gmail.com',
      phone: '9317251526',
      role: 'ADMIN',
      status: 'Active',
      avatarBg: '#FCE7F3',
      avatarColor: '#E11D48',
    },
    {
      id: '10',
      name: 'Prasad K.',
      username: 'prasad.k.2e70',
      email: 'prkin.r@gmail.com',
      phone: '9840727704',
      role: 'MONITOR',
      status: 'Active',
      avatarBg: '#FEF3C7',
      avatarColor: '#F59E0B',
    },
    {
      id: '11',
      name: 'YSK Kumar',
      username: 'kushal.kumar.846e',
      email: 'ktsushildev@gmail.com',
      phone: '1234567890',
      role: 'GUARDIAN',
      status: 'Active',
      avatarBg: '#D1FAE5',
      avatarColor: '#10B981',
    },
  ]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'GUARDIAN' | 'SENIOR' | 'MONITOR'>('ALL');
  const [statusDropdown, setStatusDropdown] = useState('ALL');

  // Dialog State for Add User
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'GUARDIAN' | 'SENIOR' | 'MONITOR'>('SENIOR');

  // Role details colors and counts mapping
  const roleMetadata = {
    ADMIN: { label: 'Admins', color: '#E11D48', count: users.filter(u => u.role === 'ADMIN').length },
    GUARDIAN: { label: 'Guardians', color: '#10B981', count: users.filter(u => u.role === 'GUARDIAN').length },
    SENIOR: { label: 'Seniors', color: '#3B82F6', count: users.filter(u => u.role === 'SENIOR').length },
    MONITOR: { label: 'Monitors', color: '#F59E0B', count: users.filter(u => u.role === 'MONITOR').length },
  };

  // Add User handler
  const handleAddUser = () => {
    if (!firstName.trim() || !lastName.trim() || !role) return;

    // Pick avatar colors based on role
    let avatarBg = '#DBEAFE';
    let avatarColor = '#3B82F6';
    if (role === 'ADMIN') { avatarBg = '#FCE7F3'; avatarColor = '#E11D48'; }
    else if (role === 'GUARDIAN') { avatarBg = '#D1FAE5'; avatarColor = '#10B981'; }
    else if (role === 'MONITOR') { avatarBg = '#FEF3C7'; avatarColor = '#F59E0B'; }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const generatedUsername = username.trim()
      ? username.trim().replace(/^@/, '')
      : `${firstName.trim().toLowerCase()}.${lastName.trim().toLowerCase()}.${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser: UserItem = {
      id: Date.now().toString(),
      name: fullName,
      username: generatedUsername,
      email: email.trim() || 'N/A',
      phone: phone.trim() || 'N/A',
      role: role,
      status: 'Active',
      avatarBg,
      avatarColor,
    };

    setUsers((prev) => [...prev, newUser]);
    setOpenAddDialog(false);
    setFirstName('');
    setLastName('');
    setUsername('');
    setPhone('');
    setEmail('');
    setPassword('');
    setRole('SENIOR');
  };

  // Delete User handler
  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Filter logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);

    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesStatus = statusDropdown === 'ALL' || user.status === statusDropdown;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'flex-start' }, gap: { xs: 2, sm: 0 } }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1A0E07', letterSpacing: '-0.5px' }}>
            User Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#8C7E76', mt: 0.5 }}>
            {filteredUsers.length} of {users.length} users
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
          sx={{
            px: 2.5,
            py: 1,
            backgroundColor: '#4F46E5', // Blue brand button
            '&:hover': {
              backgroundColor: '#4338CA',
            },
          }}
        >
          Add User
        </Button>
      </Box>

      {/* Filter Row Pills */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* All Tab */}
        <Chip
          label={`12 All`}
          variant={roleFilter === 'ALL' ? 'filled' : 'outlined'}
          onClick={() => setRoleFilter('ALL')}
          sx={{
            borderColor: roleFilter === 'ALL' ? '#DBEAFE' : '#EAE5E0',
            backgroundColor: roleFilter === 'ALL' ? '#EEF2FF' : '#FFFFFF',
            color: roleFilter === 'ALL' ? '#4F46E5' : '#1A0E07',
            fontWeight: 700,
            cursor: 'pointer',
            px: 0.5,
            '&:hover': {
              backgroundColor: '#EEF2FF',
            },
          }}
        />

        {/* Roles Pills */}
        {(Object.keys(roleMetadata) as Array<keyof typeof roleMetadata>).map((roleKey) => {
          const meta = roleMetadata[roleKey];
          const isSelected = roleFilter === roleKey;
          return (
            <Chip
              key={roleKey}
              onClick={() => setRoleFilter(roleKey)}
              icon={
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: meta.color,
                    ml: 1,
                  }}
                />
              }
              label={`${meta.count} ${meta.label}`}
              variant={isSelected ? 'filled' : 'outlined'}
              sx={{
                borderColor: '#EAE5E0',
                backgroundColor: isSelected ? '#FAF8F6' : '#FFFFFF',
                color: '#1A0E07',
                fontWeight: 600,
                cursor: 'pointer',
                pr: 0.5,
                '& .MuiChip-icon': {
                  marginRight: -0.5,
                },
                '&:hover': {
                  backgroundColor: '#FAF8F6',
                },
              }}
            />
          );
        })}
      </Box>

      {/* Search Input and Status drop-down */}
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' } }}>
        <TextField
          placeholder="Search by name, email or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{
            flexGrow: 1,
            backgroundColor: '#FFFFFF',
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              borderColor: '#EAE5E0',
              '& fieldset': {
                borderColor: '#EAE5E0',
              },
              '&:hover fieldset': {
                borderColor: '#D45529',
              },
            },
          }}
          slotProps={{ // Fixed: Using slotProps for inputs in MUI v6
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ color: '#C2B8B2' }}>
                  <SearchIcon sx={{ fontSize: 20 }} />
                </InputAdornment>
              ),
            }
          }}
        />

        <Select
          value={statusDropdown}
          onChange={(e) => setStatusDropdown(e.target.value)}
          size="small"
          sx={{
            minWidth: 140,
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            borderColor: '#EAE5E0',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#EAE5E0',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#D45529',
            },
          }}
        >
          <MenuItem value="ALL">All Status</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Offline">Offline</MenuItem>
        </Select>
      </Box>

      {/* Users Data Table */}
      <TableContainer component={Paper} sx={{ border: '1px solid #EAE5E0', boxShadow: 'none' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#FAF8F6' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5 }}>USER</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5 }}>CONTACT</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5 }}>ROLE</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5 }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#8C7E76', py: 1.5 }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#8C7E76' }}>
                  No matches found for search query.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#FCFAF8' } }}>
                  {/* Column 1: USER */}
                  <TableCell sx={{ py: 1.75 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          bgcolor: user.avatarBg,
                          color: user.avatarColor,
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          width: 38,
                          height: 38,
                          borderRadius: '8px',
                        }}
                      >
                        {user.name.substring(0, 2).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 650, color: '#1A0E07', fontSize: '0.9rem' }}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#8C7E76', fontSize: '0.75rem' }}>
                          {user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Column 2: CONTACT */}
                  <TableCell sx={{ py: 1.75 }}>
                    <Typography sx={{ color: '#1A0E07', fontSize: '0.9rem', fontWeight: 500 }}>
                      {user.email}
                    </Typography>
                    <Typography sx={{ color: '#8C7E76', fontSize: '0.75rem' }}>
                      {user.phone}
                    </Typography>
                  </TableCell>

                  {/* Column 3: ROLE */}
                  <TableCell sx={{ py: 1.75 }}>
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{
                        backgroundColor: user.avatarBg,
                        color: user.avatarColor,
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        borderRadius: '4px',
                      }}
                    />
                  </TableCell>

                  {/* Column 4: STATUS */}
                  <TableCell sx={{ py: 1.75 }}>
                    <Typography sx={{ color: '#10B981', fontWeight: 700, fontSize: '0.85rem' }}>
                      {user.status}
                    </Typography>
                  </TableCell>

                  {/* Column 5: ACTIONS */}
                  <TableCell sx={{ py: 1.75 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {/* Edit (Black icon) */}
                      <IconButton
                        size="small"
                        sx={{
                          color: '#1A0E07',
                          border: '1px solid #EAE5E0',
                          borderRadius: '6px',
                          p: 0.75,
                          '&:hover': {
                            backgroundColor: '#FAF8F6',
                            color: '#3B82F6',
                            borderColor: '#3B82F6',
                          },
                        }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>

                      {/* Lock (Black icon) */}
                      <IconButton
                        size="small"
                        sx={{
                          color: '#1A0E07',
                          border: '1px solid #EAE5E0',
                          borderRadius: '6px',
                          p: 0.75,
                          '&:hover': {
                            backgroundColor: '#FAF8F6',
                            color: '#F59E0B',
                            borderColor: '#F59E0B',
                          },
                        }}
                      >
                        <VpnKeyIcon sx={{ fontSize: 16 }} />
                      </IconButton>

                      {/* Delete (Admin check: no delete action for Admin team) */}
                      {user.role !== 'ADMIN' && (
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteUser(user.id)}
                          sx={{
                            color: '#1A0E07',
                            border: '1px solid #EAE5E0',
                            borderRadius: '6px',
                            p: 0.75,
                            '&:hover': {
                              backgroundColor: '#FEF2F2',
                              color: '#EF4444',
                              borderColor: '#FCA5A5',
                            },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* dialog modal for adding users */}
      <Dialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '12px',
              p: 1,
            }
          }
        }}
      >
        {/* Custom Header with close button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, pt: 2, pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A0E07', fontSize: '1.25rem' }}>
            Add User
          </Typography>
          <IconButton 
            onClick={() => setOpenAddDialog(false)} 
            size="small" 
            sx={{ 
              color: '#8C7E76',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3, py: 2 }}>
          <Box 
            component="form" 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
              gap: 3 
            }}
          >
            {/* First Name */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#8C7E76', letterSpacing: '0.5px' }}>
                FIRST NAME *
              </Typography>
              <TextField
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    '& fieldset': { borderColor: '#EAE5E0' },
                    '&:hover fieldset': { borderColor: '#4F46E5' },
                    '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                  }
                }}
              />
            </Box>

            {/* Last Name */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#8C7E76', letterSpacing: '0.5px' }}>
                LAST NAME *
              </Typography>
              <TextField
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    '& fieldset': { borderColor: '#EAE5E0' },
                    '&:hover fieldset': { borderColor: '#4F46E5' },
                    '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                  }
                }}
              />
            </Box>

            {/* Username */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#8C7E76', letterSpacing: '0.5px' }}>
                USERNAME
              </Typography>
              <TextField
                fullWidth
                placeholder="@username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    '& fieldset': { borderColor: '#EAE5E0' },
                    '&:hover fieldset': { borderColor: '#4F46E5' },
                    '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                  }
                }}
              />
            </Box>

            {/* Phone Number */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#8C7E76', letterSpacing: '0.5px' }}>
                PHONE NUMBER
              </Typography>
              <TextField
                fullWidth
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    '& fieldset': { borderColor: '#EAE5E0' },
                    '&:hover fieldset': { borderColor: '#4F46E5' },
                    '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                  }
                }}
              />
            </Box>

            {/* Email */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#8C7E76', letterSpacing: '0.5px' }}>
                EMAIL
              </Typography>
              <TextField
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    '& fieldset': { borderColor: '#EAE5E0' },
                    '&:hover fieldset': { borderColor: '#4F46E5' },
                    '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                  }
                }}
              />
            </Box>

            {/* Password */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#8C7E76', letterSpacing: '0.5px' }}>
                PASSWORD
              </Typography>
              <TextField
                fullWidth
                placeholder="Leave blank for default"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    '& fieldset': { borderColor: '#EAE5E0' },
                    '&:hover fieldset': { borderColor: '#4F46E5' },
                    '&.Mui-focused fieldset': { borderColor: '#4F46E5' },
                  }
                }}
              />
            </Box>

            {/* Role select (half width column) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#8C7E76', letterSpacing: '0.5px' }}>
                ROLE *
              </Typography>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                size="small"
                fullWidth
                sx={{
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#EAE5E0' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4F46E5' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4F46E5' },
                }}
              >
                <MenuItem value="SENIOR">SENIOR</MenuItem>
                <MenuItem value="GUARDIAN">GUARDIAN</MenuItem>
                <MenuItem value="MONITOR">MONITOR</MenuItem>
                <MenuItem value="ADMIN">ADMIN</MenuItem>
              </Select>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1.5 }}>
          <Button 
            onClick={() => setOpenAddDialog(false)} 
            sx={{
              borderRadius: '8px',
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 700,
              backgroundColor: '#EEF2FF',
              color: '#4F46E5',
              fontSize: '0.9rem',
              '&:hover': {
                backgroundColor: '#E0E7FF',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddUser} 
            variant="contained"
            sx={{
              borderRadius: '8px',
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 700,
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              fontSize: '0.9rem',
              '&:hover': {
                backgroundColor: '#4338CA',
              },
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default Users;
