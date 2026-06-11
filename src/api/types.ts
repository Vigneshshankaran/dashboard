/**
 * types.ts — the shapes of data sent to and received from the backend.
 *
 * Grouped to mirror services.ts: Auth, Profile, Senior, Monitor, Compliance,
 * Device, Vitals, Alarm/Events, CRM, Admin. If the backend API changes a
 * field, this is the file to update.
 */
export type UUID = string;

// Roles allowed
export type UserRole = 'ADMIN' | 'MONITOR' | 'GUARDIAN' | 'SENIOR';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'DEACTIVATED';

// Authentication Interfaces
export interface UserSignInRequest {
  email: string;
  password: string;
  platform: string;
}

export interface MobileSignInRequest {
  phoneNumber: string;
  otp: string;
}

export interface EmailSignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: number;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  userName: string;
  phoneNumber: number;
  secondaryEmail: string;
  profileImageUrl: string;
  dob: number;
}

export interface UserLoginDTO {
  userId: UUID;
  oldPassword: string;
  newPassword: string;
  phoneNumber: number;
  email: string;
}

export interface GoogleAuthRequest {
  idToken: string;
  platform: string;
}

export interface ForgotPasswordRequest {
  email: string;
  platform: string;
}

export interface ResetPasswordRequest {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

// Profile Interfaces
export interface PersonalInfoRequest {
  dateOfBirth: number;
  gender: string;
  maritalStatus: string;
  nationality: string;
  occupation: string;
  height: number;
  weight: number;
  bloodGroup: string;
  allergies: string;
  medicalConditions: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

// Senior Interfaces
export interface SeniorRequestDTO {
  firstName: string;
  lastName: string;
  phoneNumber: number;
  height: number;
  weight: number;
  gender: string;
  dateOfBirth: number;
}

export interface SMRequest {
  phoneNumber: number;
  countryCode: string;
}

// Monitor Interfaces
export interface MonitorMappingRequest {
  seniorId: UUID;
  monitorId: UUID;
}

// Compliance Interfaces
export interface UploadReportsRequest {
  reportName: string;
  reportUrl: string;
  reportType: string;
  seniorId: UUID;
}

// Device Registration Interfaces
// Only identifier and name are required — the rest may be omitted/null
export interface DeviceRegistrationRequest {
  deviceIdentifier: string;
  deviceName: string;
  module?: string;
  iccid?: string;
  mac?: string | null;
  model?: string;
  deviceTypeId?: string;
  deviceType?: string;
  firmwareVersion?: string;
  networkType?: string;
  serverTimestamp?: number;
  imei?: string;
}

// Device Assignment Interfaces
export interface AssignDeviceRequest {
  deviceUUID: UUID;
  seniorUUID: UUID;
}

export interface UnassignDeviceRequest {
  assignmentId: UUID;
  reason: string;
}

// Vitals Interfaces
export interface DailyVitalSummary {
  date: string;
  systolicBp?: number;
  diastolicBp?: number;
  heartRate?: number;
  spo2?: number;
  temperature?: number;
  steps?: number;
  glucose?: number;
  [key: string]: any;
}

export interface VitalSyncRequest {
  deviceUUID: UUID;
  syncDays: number;
  syncFrom: string; // LocalDate (YYYY-MM-DD)
  syncTo: string; // LocalDate (YYYY-MM-DD)
  vitalSummaries: DailyVitalSummary[];
}

// Alarm Events Interfaces
export interface AlarmEvent {
  id?: number;
  deviceUUID: UUID;
  alarmType: string;
  severity: string;
  timestamp: number;
  resolved: boolean;
  resolvedBy?: string;
  description: string;
  [key: string]: any;
}

// Device Status Interfaces
export interface DeviceStatusEvent {
  id?: number;
  deviceUUID: UUID;
  status: string;
  batteryLevel: number;
  signalStrength: number;
  timestamp: number;
  [key: string]: any;
}

// Position Events Interfaces
export interface PositionEvent {
  id?: number;
  deviceUUID: UUID;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  direction: number;
  timestamp: number;
  [key: string]: any;
}

// SCUnifiedEventDTO (Device Events)
export interface SCUnifiedEventDTO {
  deviceId?: number;
  deviceName?: string;
  deviceSerialNumber?: string;
  deviceTypeId?: number;
  ident?: string;
  peer?: string;
  channelId?: number;
  protocolId?: number;
  eventEnum?: number;
  eventSeqnum?: number;
  timestamp?: number;
  serverTimestamp?: number;
  timestampKey?: number;
  positionLatitude?: number;
  positionLongitude?: number;
  positionAltitude?: number;
  positionDirection?: number;
  positionHdop?: number;
  positionSatellites?: number;
  positionSpeed?: number;
  positionValid?: boolean;
  gnssVehicleMileage?: number;
  alarmPanicStart?: boolean;
  alarmPanicStop?: boolean;
  fallAlarmStart?: boolean;
  fallAlarmStop?: boolean;
  startupAlarm?: boolean;
  batteryLowAlarm?: boolean;
  noMotionAlarm?: boolean;
  geofenceAlarm1?: boolean;
  geofenceAlarm2?: boolean;
  geofenceStatus1?: boolean;
  geofenceStatus2?: boolean;
  geofenceStatus3?: boolean;
  geofenceStatus4?: boolean;
  tiltStatus?: boolean;
  vehicleState?: string;
  vehicleStateBitmask?: number;
  bluetoothMacAddress?: string;
  agpsPositionValid?: boolean;
  batteryChargingStatus?: boolean;
  batteryFull?: boolean;
  batteryLevel?: number;
  bluetoothConnectedStatus?: boolean;
  deviceReboot?: boolean;
  fallAlarmStatus?: boolean;
  gsmNetworkType?: string;
  gsmSignalDbm?: number;
  indoorStatus?: boolean;
  locationSource?: 'Beacon' | 'Bluetooth' | 'Gps' | 'Gsm' | 'Smart' | 'Wifi';
  messageBufferedStatus?: boolean;
  movementStatus?: boolean;
  operatingModeEnum?: number;
  wifiHomeStatus?: boolean;
  wifiStatus?: boolean;
  metadata?: Record<string, any>;
}

// CRM Interfaces
export interface FrappeLeadDTO {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modifiedBy: string;
  docstatus: number;
  idx: number;
  customIsCaregiver: number;
  customIsSenior: number;
  namingSeries?: string;
  salutation?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  leadName: string;
  jobTitle?: string;
  gender?: string;
  customDateOfBirth?: string; // LocalDate
  customConversationLanguage?: string;
  customLinkedLead?: string;
  leadOwner?: string;
  status: string;
  customer?: string;
  type?: string;
  requestType?: string;
  customPairedCustomer?: string;
  emailId?: string;
  website?: string;
  mobileNo?: string;
  whatsappNo?: string;
  phone?: string;
  phoneExt?: string;
  companyName?: string;
  noOfEmployees?: string;
  annualRevenue?: number;
  industry?: string;
  marketSegment?: string;
  territory?: string;
  fax?: string;
  city?: string;
  state?: string;
  country?: string;
  customRelationshipToSenior?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  qualificationStatus?: string;
  qualifiedBy?: string;
  qualifiedOn?: string;
  company?: string;
  language?: string;
  image?: string;
  title?: string;
  disabled?: number;
  unsubscribed?: number;
  blogSubscriber?: number;
  customMedicalConditions?: string;
  customLivingSituation?: string;
  customMobilityLevel?: string;
  customContact1Name?: string;
  customContact2NameOptional?: string;
  customContact1Phone?: string;
  customContact2PhoneOptional?: string;
  customDoctorsName?: string;
  customDoctorsPhone?: string;
  doctype: string;
  notes?: any[];
  errorMessage?: string;
}

// Admin Interfaces
export interface AdminCreateUserRequest {
  role: UserRole;
  firstName: string;
  lastName: string;
  phoneNumber: number;
  email: string;
  password: string;
  guardianId?: UUID;
  height?: number;
  weight?: number;
  gender?: string;
  dateOfBirth?: number;
}

export interface AdminUpdateUserRequest {
  firstName: string;
  lastName: string;
  userName: string;
  phoneNumber: number;
  primaryEmail: string;
  secondaryEmail: string;
  profileImageUrl: string;
  role: UserRole;
  status: UserStatus;
  active: boolean;
}

export interface AdminMapRequest {
  guardianId: UUID;
  seniorId: UUID;
}

// Generic API response container
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  timestamp?: number;
}

// ─── Response shapes (what the backend RETURNS) ───────────────────────────────
// The backend mixes snake_case and camelCase field names, so these types list
// both variants. The index signature keeps them tolerant of extra fields.

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  [key: string]: any;
}

export interface UserProfile {
  id?: UUID;
  userId?: UUID;
  name?: string;
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  userName?: string;
  username?: string;
  email?: string;
  primaryEmail?: string;
  phoneNumber?: number | string;
  phone_number?: number | string;
  role?: UserRole;
  status?: UserStatus;
  active?: boolean;
  [key: string]: any;
}

export interface SeniorSummary {
  id?: UUID;
  seniorId?: UUID;
  name?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: number;
  bloodGroup?: string;
  allergies?: string;
  medicalConditions?: string;
  [key: string]: any;
}

export interface DeviceSummary {
  id?: UUID;
  uuid?: UUID;
  deviceUUID?: UUID;
  deviceName?: string;
  deviceIdentifier?: string;
  imei?: string;
  model?: string;
  networkType?: string;
  firmwareVersion?: string;
  batteryLevel?: number;
  status?: string;
  [key: string]: any;
}

export interface AdminCounts {
  totalUsers?: number;
  totalSeniors?: number;
  totalGuardians?: number;
  totalMonitors?: number;
  totalDevices?: number;
  [key: string]: any;
}

export interface ComplianceReport {
  id?: UUID;
  reportName?: string;
  reportType?: string;
  reportUrl?: string;
  seniorId?: UUID;
  [key: string]: any;
}
