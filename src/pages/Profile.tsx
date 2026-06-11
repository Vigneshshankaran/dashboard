import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  TextField,
  Button,
  Avatar,
  Chip,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { ProfileService, AuthService } from '../api';
import { useFeedback } from '../components/FeedbackProvider';


interface ProfileProps {
  profile: {
    name: string;
    email: string;
    phone: string;
    role: string;
    avatarBg: string;
  };
  onUpdateProfile: (profile: {
    name: string;
    email: string;
    phone: string;
    role: string;
    avatarBg: string;
  }) => void;
}

export const Profile: React.FC<ProfileProps> = ({ profile, onUpdateProfile }) => {
  const { notify } = useFeedback();
  // Toggle editing state
  const [isEditing, setIsEditing] = useState(false);

  // Form input states (matched with mockup screenshots)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [nationality, setNationality] = useState('');
  const [occupation, setOccupation] = useState('');

  // Health Information states
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');

  // Address states
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Toast / Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Local account details states from API
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [authProvider, setAuthProvider] = useState('EMAIL');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [lastLogin, setLastLogin] = useState('—');
  const [memberSince, setMemberSince] = useState('—');
  const [lastUpdated, setLastUpdated] = useState('—');

  useEffect(() => {
    ProfileService.getProfile()
      .then((response) => {
        // Backend may wrap the payload in { data: ... }
        const res = response?.data ?? response;
        if (res) {
          const fName = res.first_name || res.firstName || '';
          const lName = res.last_name || res.lastName || '';
          const name = res.name || `${fName} ${lName}`.trim() || profile.name;
          const phoneNum = res.phone_number || res.phoneNumber || '';
          const uName = res.username || res.userName || '';

          onUpdateProfile({
            name,
            email: res.email || res.primaryEmail || profile.email,
            phone: phoneNum ? String(phoneNum) : profile.phone,
            role: res.role || profile.role,
            avatarBg: profile.avatarBg,
          });
          if (fName) setFirstName(fName);
          if (lName) setLastName(lName);
          if (uName) setUsername(uName);
          if (phoneNum) setPhone(String(phoneNum));

          // Set Account Details from API response
          setUserId(res.user_id || res.id || res.userId || '');
          if (res.status) setStatus(res.status);
          
          const authProv = res.authProvider || res.auth_provider;
          if (authProv) setAuthProvider(authProv);
          
          const emailVer = res.emailVerified !== undefined ? res.emailVerified : res.email_verified;
          if (emailVer !== undefined) setEmailVerified(!!emailVer);
          
          const phoneVer = res.phoneVerified !== undefined ? res.phoneVerified : res.phone_verified;
          if (phoneVer !== undefined) setPhoneVerified(!!phoneVer);

          const formatDate = (ts: any) => {
            if (!ts) return '—';
            const d = new Date(ts);
            return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          };

          if (res.lastLoginAt) setLastLogin(formatDate(res.lastLoginAt));
          else if (res.last_login_at) setLastLogin(formatDate(res.last_login_at));

          if (res.createdAt) setMemberSince(formatDate(res.createdAt));
          else if (res.created_at) setMemberSince(formatDate(res.created_at));

          if (res.updatedAt) setLastUpdated(formatDate(res.updatedAt));
          else if (res.updated_at) setLastUpdated(formatDate(res.updated_at));
          
          const pInfo = res.personalInfo || res.personal_info || res || {};
          const heightVal = pInfo.height ?? res.height ?? '';
          const weightVal = pInfo.weight ?? res.weight ?? '';
          const bg = pInfo.bloodGroup || pInfo.blood_group || res.bloodGroup || res.blood_group || '';
          const alg = pInfo.allergies || res.allergies || '';
          const cond = pInfo.medicalConditions || pInfo.medical_conditions || res.medicalConditions || res.medical_conditions || '';
          const dobVal = res.dob || res.dateOfBirth || res.date_of_birth || pInfo.dob || pInfo.dateOfBirth || pInfo.date_of_birth;

          if (dobVal) setDob(new Date(dobVal).toISOString().split('T')[0]);
          setGender(pInfo.gender || res.gender || '');
          setMaritalStatus(pInfo.maritalStatus || pInfo.marital_status || res.maritalStatus || res.marital_status || '');
          setNationality(pInfo.nationality || res.nationality || '');
          setOccupation(pInfo.occupation || res.occupation || '');
          setHeight(heightVal ? String(heightVal) : '');
          setWeight(weightVal ? String(weightVal) : '');
          setBloodGroup(bg);
          setAllergies(alg);
          setMedicalConditions(cond);

          setAddressLine1(pInfo.addressLine1 || pInfo.address_line1 || res.addressLine1 || res.address_line1 || '');
          setAddressLine2(pInfo.addressLine2 || pInfo.address_line2 || res.addressLine2 || res.address_line2 || '');
          setCity(pInfo.city || res.city || '');
          setState(pInfo.state || res.state || '');
          setCountry(pInfo.country || res.country || '');
          setPostalCode(pInfo.postalCode || pInfo.postal_code || res.postalCode || res.postal_code || '');
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch profile from API, using mock default:', err);
      });
  }, []);

  // Save changes handler
  const handleSave = () => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || profile.name;
    const updatePayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      userName: username.trim(),
      phoneNumber: Number(phone.trim().replace(/\D/g, '')) || 0,
      secondaryEmail: secondaryEmail.trim(),
      profileImageUrl: '',
      dob: dob ? new Date(dob).getTime() : Date.now(),
    };

    const personalInfoPayload = {
      dateOfBirth: dob ? new Date(dob).getTime() : Date.now(),
      gender: gender,
      maritalStatus: maritalStatus,
      nationality: nationality,
      occupation: occupation,
      height: Number(height) || 0.0,
      weight: Number(weight) || 0.0,
      bloodGroup: bloodGroup,
      allergies: allergies,
      medicalConditions: medicalConditions,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      state: state,
      country: country,
      postalCode: postalCode,
    };

    Promise.all([
      ProfileService.updateProfile(updatePayload),
      ProfileService.updatePersonalInfo(personalInfoPayload),
    ])
      .then(() => {
        onUpdateProfile({
          name: fullName,
          email: profile.email,
          phone: phone.trim() || profile.phone,
          role: profile.role,
          avatarBg: profile.avatarBg,
        });
        setIsEditing(false);
        setOpenSnackbar(true);
      })
      .catch((err) => {
        console.error('Failed to update profile or personal info on API:', err);
        notify(`Failed to update profile: ${err?.message || 'Unknown error from server'}`, 'error');
      });
  };

  const handleCancel = () => {
    // Revert to current profile details
    setFirstName(profile.name.split(' ')[0] || '');
    setLastName(profile.name.split(' ').slice(1).join(' ') || '');
    setPhone(profile.phone);
    setIsEditing(false);
  };

  const handleVerifyEmail = () => {
    if (!userId) return;
    AuthService.verifyEmail(userId)
      .then(() => {
        setEmailVerified(true);
        notify('Email verified successfully!', 'success');
      })
      .catch((err: any) => {
        console.error('Failed to verify email:', err);
        notify(`Failed to verify email: ${err?.message || 'Unknown error from server'}`, 'error');
      });
  };

  const handleVerifyPhone = () => {
    ProfileService.verifyPhone()
      .then(() => {
        setPhoneVerified(true);
        notify('Phone verified successfully!', 'success');
      })
      .catch((err: any) => {
        console.error('Failed to verify phone:', err);
        notify(`Failed to verify phone: ${err?.message || 'Unknown error from server'}`, 'error');
      });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Orange Profile Banner Header */}
      <Card
        sx={{
          bgcolor: '#D45529', // Brand Orange
          border: 'none',
          borderRadius: '12px',
          color: '#FFFFFF',
          p: { xs: 2.5, sm: 3.5 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2.5,
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          {/* Circular HA Avatar with gold ADMIN text inside */}
          <Avatar
            sx={{
              bgcolor: '#1E110B', // Chocolate brown avatar bg
              width: 70,
              height: 70,
              border: '2px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#FFFFFF', lineHeight: 1 }}>HA</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '0.55rem', color: '#FCD34D', mt: 0.25, lineHeight: 1 }}>ADMIN</Typography>
          </Avatar>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 750, color: '#FFFFFF', mb: 0.5 }}>
              {firstName} {lastName}
            </Typography>

            {/* Email, Phone and Active Status row */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', opacity: 0.9 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <MailIcon sx={{ fontSize: 15, color: '#FFFFFF' }} />
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{profile.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PhoneIcon sx={{ fontSize: 15, color: '#FFFFFF' }} />
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{phone}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#4ADE80' }} />
                <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#4ADE80' }}>ACTIVE</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Change Password button in white with lock icon */}
        <Button
          variant="contained"
          startIcon={<LockIcon sx={{ fontSize: 16, color: '#D45529' }} />}
          sx={{
            bgcolor: '#FFFFFF',
            color: '#D45529',
            fontWeight: 700,
            fontSize: '0.8rem',
            px: 2,
            py: 1,
            '&:hover': {
              bgcolor: '#FAF8F6',
            },
          }}
        >
          Change Password
        </Button>
      </Card>

      {/* Main Grid Content */}
      <Grid container spacing={3}>
        {/* Left Column: Profile Forms */}
        <Grid size={{ xs: 12, md: 8.5 }}>
          <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Header: Title + Updated + Edit button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 750, color: '#1A0E07' }}>
                Profile Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 500 }}>
                  Updated 01 Jun 2026, 01:50 pm
                </Typography>
                {!isEditing ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                    onClick={() => setIsEditing(true)}
                    size="small"
                    sx={{ borderRadius: '6px', py: 0.5, px: 1.5 }}
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                    onClick={handleCancel}
                    size="small"
                    color="inherit"
                    sx={{ borderRadius: '6px', py: 0.5, px: 1.5 }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Box>

            {/* SECTION 1: BASIC DETAILS */}
            <Box>
              <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.5px', display: 'block', mb: 2 }}>
                BASIC DETAILS
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="FIRST NAME"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    fullWidth
                    size="small"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="LAST NAME"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    fullWidth
                    size="small"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="USERNAME"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    size="small"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="PHONE NUMBER"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                    size="small"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="SECONDARY EMAIL"
                    value={secondaryEmail}
                    onChange={(e) => setSecondaryEmail(e.target.value)}
                    placeholder="Secondary email"
                    fullWidth
                    size="small"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="DATE OF BIRTH"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    fullWidth
                    size="small"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small" disabled={!isEditing}>
                    <InputLabel id="gender-select-label">GENDER</InputLabel>
                    <Select
                      labelId="gender-select-label"
                      label="GENDER"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <MenuItem value="">— Select —</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small" disabled={!isEditing}>
                    <InputLabel id="marital-select-label">MARITAL STATUS</InputLabel>
                    <Select
                      labelId="marital-select-label"
                      label="MARITAL STATUS"
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value)}
                    >
                      <MenuItem value="">— Select —</MenuItem>
                      <MenuItem value="Single">Single</MenuItem>
                      <MenuItem value="Married">Married</MenuItem>
                      <MenuItem value="Divorced">Divorced</MenuItem>
                      <MenuItem value="Widowed">Widowed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="NATIONALITY"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="e.g. Indian"
                    fullWidth
                    size="small"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="OCCUPATION"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Retired Teacher"
                    fullWidth
                    size="small"
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ borderColor: '#F5F2EF' }} />

            {/* SECTION 2: HEALTH INFORMATION */}
            <Box>
              <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.5px', display: 'block', mb: 2 }}>
                HEALTH INFORMATION
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="HEIGHT (CM)"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 165"
                    fullWidth
                    size="small"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="WEIGHT (KG)"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 70"
                    fullWidth
                    size="small"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small" disabled={!isEditing}>
                    <InputLabel id="blood-select-label">BLOOD GROUP</InputLabel>
                    <Select
                      labelId="blood-select-label"
                      label="BLOOD GROUP"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                    >
                      <MenuItem value="">— Select —</MenuItem>
                      <MenuItem value="A+">A+</MenuItem>
                      <MenuItem value="A-">A-</MenuItem>
                      <MenuItem value="B+">B+</MenuItem>
                      <MenuItem value="B-">B-</MenuItem>
                      <MenuItem value="AB+">AB+</MenuItem>
                      <MenuItem value="AB-">AB-</MenuItem>
                      <MenuItem value="O+">O+</MenuItem>
                      <MenuItem value="O-">O-</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="ALLERGIES"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g. Penicillin, Pollen"
                    fullWidth
                    size="small"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="MEDICAL CONDITIONS"
                    value={medicalConditions}
                    onChange={(e) => setMedicalConditions(e.target.value)}
                    placeholder="e.g. Hypertension, Diabetes"
                    fullWidth
                    size="small"
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ borderColor: '#F5F2EF' }} />

            {/* SECTION 3: ADDRESS */}
            <Box>
              <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 800, letterSpacing: '0.5px', display: 'block', mb: 2 }}>
                ADDRESS
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="ADDRESS LINE 1"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="Street address"
                    fullWidth
                    size="small"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="ADDRESS LINE 2"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Apt, suite, etc."
                    fullWidth
                    size="small"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="CITY"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    fullWidth
                    size="small"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="STATE"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    fullWidth
                    size="small"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="COUNTRY"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    fullWidth
                    size="small"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="POSTAL CODE"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Postal code"
                    fullWidth
                    size="small"
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Bottom Form Actions Bar when editing is active */}
            {isEditing && (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" size="medium" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon sx={{ color: '#FFFFFF' }} />}
                  onClick={handleSave}
                  sx={{
                    bgcolor: '#D45529',
                    '&:hover': {
                      bgcolor: '#B23F1C',
                    },
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Right Column: Account Details Side Card */}
        <Grid size={{ xs: 12, md: 3.5 }}>
          <Card sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 750, color: '#1A0E07', mb: 1.5 }}>
              Account Details
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
              {/* User ID Row */}
              <Box>
                <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700, display: 'block', mb: 0.5 }}>
                  USER ID
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6E625B',
                    fontWeight: 600,
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    wordBreak: 'break-all',
                    lineHeight: 1.3,
                  }}
                >
                  {userId || '—'}
                </Typography>
              </Box>
              <Divider sx={{ borderColor: '#F5F2EF' }} />

              {/* Role Row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700 }}>
                  ROLE
                </Typography>
                <Chip
                  label={profile.role || '—'}
                  size="small"
                  sx={{
                    bgcolor: '#F59E0B',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.725rem',
                    borderRadius: '6px',
                  }}
                />
              </Box>
              <Divider sx={{ borderColor: '#F5F2EF' }} />

              {/* Status Row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700 }}>
                  STATUS
                </Typography>
                <Chip
                  label={status}
                  size="small"
                  sx={{
                    bgcolor: status === 'ACTIVE' ? '#ECFDF5' : '#FEF2F2',
                    color: status === 'ACTIVE' ? '#10B981' : '#EF4444',
                    fontWeight: 700,
                    fontSize: '0.725rem',
                    borderRadius: '6px',
                  }}
                />
              </Box>
              <Divider sx={{ borderColor: '#F5F2EF' }} />

              {/* Auth Provider Row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700 }}>
                  AUTH PROVIDER
                </Typography>
                <Typography variant="body2" sx={{ color: '#1A0E07', fontWeight: 700 }}>
                  {authProvider}
                </Typography>
              </Box>
              <Divider sx={{ borderColor: '#F5F2EF' }} />

              {/* Email Verification Row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700 }}>
                  EMAIL VERIFIED
                </Typography>
                {emailVerified ? (
                  <Chip
                    label="VERIFIED"
                    size="small"
                    sx={{
                      bgcolor: '#D1FAE5',
                      color: '#065F46',
                      fontWeight: 700,
                      fontSize: '0.725rem',
                      borderRadius: '6px',
                    }}
                  />
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleVerifyEmail}
                    startIcon={<CheckCircleIcon sx={{ fontSize: 13, color: '#D45529' }} />}
                    sx={{
                      borderColor: '#D45529',
                      color: '#D45529',
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                      py: 0.25,
                      px: 1,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#FEF2F2',
                        borderColor: '#B23F1C',
                      },
                    }}
                  >
                    Verify Email
                  </Button>
                )}
              </Box>
              <Divider sx={{ borderColor: '#F5F2EF' }} />

              {/* Phone Verification Row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700 }}>
                  PHONE VERIFIED
                </Typography>
                {phoneVerified ? (
                  <Chip
                    label="VERIFIED"
                    size="small"
                    sx={{
                      bgcolor: '#D1FAE5',
                      color: '#065F46',
                      fontWeight: 700,
                      fontSize: '0.725rem',
                      borderRadius: '6px',
                    }}
                  />
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleVerifyPhone}
                    startIcon={<CheckCircleIcon sx={{ fontSize: 13, color: '#D45529' }} />}
                    sx={{
                      borderColor: '#D45529',
                      color: '#D45529',
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                      py: 0.25,
                      px: 1,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#FEF2F2',
                        borderColor: '#B23F1C',
                      },
                    }}
                  >
                    Verify Phone
                  </Button>
                )}
              </Box>
              <Divider sx={{ borderColor: '#F5F2EF' }} />

              {/* Last Login Row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700 }}>
                  LAST LOGIN
                </Typography>
                <Typography variant="body2" sx={{ color: '#6E625B', fontWeight: 600, fontSize: '0.8rem' }}>
                  {lastLogin}
                </Typography>
              </Box>
              <Divider sx={{ borderColor: '#F5F2EF' }} />

              {/* Member Since Row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700 }}>
                  MEMBER SINCE
                </Typography>
                <Typography variant="body2" sx={{ color: '#6E625B', fontWeight: 600, fontSize: '0.8rem' }}>
                  {memberSince}
                </Typography>
              </Box>
              <Divider sx={{ borderColor: '#F5F2EF' }} />

              {/* Last Updated Row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#8C7E76', fontWeight: 700 }}>
                  LAST UPDATED
                </Typography>
                <Typography variant="body2" sx={{ color: '#6E625B', fontWeight: 600, fontSize: '0.8rem' }}>
                  {lastUpdated}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Profile Saved Success Toast */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: '100%', fontWeight: 700 }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
