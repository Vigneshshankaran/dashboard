/**
 * services.ts — the "phone book" of the backend.
 *
 * Every action the app can ask the backend to do lives here, grouped by
 * feature (Auth, Profile, Seniors, Monitors, Devices, Alarms, Admin, ...).
 * Pages never call fetch() directly — they import a service from this file.
 *
 * Conventions:
 *  - `client.get/post/put/patch/delete` → normal authenticated calls
 *  - `request(...)` → only for calls that need special handling
 *    (skipAuth for public endpoints, or custom headers)
 */
import { client, request } from './client';
import type {
  UUID,
  UserRole,
  UserSignInRequest,
  EmailSignUpRequest,
  UpdateProfileRequest,
  UserLoginDTO,
  GoogleAuthRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  PersonalInfoRequest,
  SeniorRequestDTO,
  SMRequest,
  MonitorMappingRequest,
  UploadReportsRequest,
  DeviceRegistrationRequest,
  AssignDeviceRequest,
  UnassignDeviceRequest,
  VitalSyncRequest,
  AlarmEvent,
  DeviceStatusEvent,
  PositionEvent,
  SCUnifiedEventDTO,
  FrappeLeadDTO,
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  AdminMapRequest,
  AuthTokens,
  UserProfile,
  SeniorSummary,
  DeviceSummary,
  AdminCounts,
  ComplianceReport,
} from './types';

// 1. Authentication Services
export const AuthService = {
  signin: (body: UserSignInRequest) =>
    request<AuthTokens>('/v1/auth/signin', { method: 'POST', body, skipAuth: true }),

  signupEmail: (body: EmailSignUpRequest) =>
    request('/v1/auth/signup/email', { method: 'POST', body, skipAuth: true }),

  refresh: (refreshToken: string) =>
    request('/v1/auth/refresh', {
      method: 'POST',
      headers: { refreshToken },
      skipAuth: true,
    }),

  logout: (refreshToken: string) =>
    request('/v1/auth/logout', {
      method: 'POST',
      headers: { refreshToken },
      skipAuth: true,
    }),

  updateMe: (body: UpdateProfileRequest) =>
    client.put('/v1/auth/me', body),

  verifyEmail: (userId: UUID) =>
    client.post(`/v1/auth/verify-email/${userId}`),

  changePassword: (body: UserLoginDTO) =>
    request('/v1/auth/change-password', { method: 'POST', body, skipAuth: true }),

  googleAuth: (body: GoogleAuthRequest) =>
    request('/v1/auth/google', { method: 'POST', body, skipAuth: true }),

  loginGoogle: () =>
    request('/v1/auth/login/google', { method: 'GET', skipAuth: true }),

  forgotPassword: (body: ForgotPasswordRequest) =>
    request('/v1/auth/forgot-password', { method: 'POST', body, skipAuth: true }),

  resetPassword: (body: ResetPasswordRequest, token: string) =>
    request('/v1/auth/reset-password', {
      method: 'POST',
      body,
      headers: { Authorization: `Bearer ${token}` },
      skipAuth: true,
    }),

  validateResetToken: (token: string) =>
    request(`/v1/auth/validate-reset-token/${token}`, { method: 'GET', skipAuth: true }),

  getResetPasswordPage: (queryParams: { token: string; platform?: string }) =>
    request('/v1/auth/reset-password-page', { method: 'GET', queryParams, skipAuth: true }),
};

// 2. User Profile Services
export const ProfileService = {
  getProfile: () =>
    client.get<UserProfile & { data?: UserProfile }>('/v1/profile'),

  updateProfile: (body: UpdateProfileRequest) =>
    client.put('/v1/profile', body),

  updatePersonalInfo: (body: PersonalInfoRequest) =>
    client.put('/v1/profile/personal-info', body),

  verifyPhone: () =>
    client.post('/v1/profile/verify-phone'),
};

// 3. Senior Services
export const SeniorService = {
  createSenior: (body: SeniorRequestDTO) =>
    client.post('/v1/seniors/create', body),

  mapSenior: (body: SMRequest) =>
    client.post('/v1/seniors/map', body),

  approveMapping: (mappingId: UUID) =>
    client.post(`/v1/seniors/map/${mappingId}/approve`),

  rejectMapping: (mappingId: UUID) =>
    client.post(`/v1/seniors/map/${mappingId}/reject`),

  deleteMapping: (mappingId: UUID) =>
    client.delete(`/v1/seniors/map/${mappingId}`),

  getMySeniors: () =>
    client.get<SeniorSummary[]>('/v1/seniors/my-seniors'),

  getMyGuardians: () =>
    client.get<UserProfile[]>('/v1/seniors/my-guardians'),

  getMyMonitors: () =>
    client.get<UserProfile[]>('/v1/seniors/my-monitors'),
};

// 4. Monitor Services
export const MonitorService = {
  assignMonitor: (body: MonitorMappingRequest) =>
    client.post('/v1/monitors/assign', body),

  deleteMonitorMapping: (mappingId: UUID) =>
    client.delete(`/v1/monitors/mappings/${mappingId}`),

  getMonitorsOfSenior: (seniorId: UUID) =>
    client.get(`/v1/monitors/of-senior/${seniorId}`),

  getMonitorsMySeniors: () =>
    client.get('/v1/monitors/my-seniors'),
};

// 5. Compliance Services
export const ComplianceService = {
  uploadReport: (body: UploadReportsRequest) =>
    client.post('/v1/compliance/reports', body),

  getReportsOfSenior: (seniorId: UUID) =>
    client.get<ComplianceReport[]>(`/v1/compliance/reports/senior/${seniorId}`),

  completeSubscription: (seniorId: UUID) =>
    client.post('/v1/compliance/subscription/complete', undefined, { seniorId }),
};

// 6. Dashboard Services
export const DashboardService = {
  getGuardianDashboard: (guardianUUID: UUID) =>
    request(`/v1/guardian-dashboard/${guardianUUID}`, { method: 'GET', skipAuth: true }),

  getSeniorDashboard: (seniorUUID: UUID) =>
    request(`/v1/senior-dashboard/${seniorUUID}`, { method: 'GET', skipAuth: true }),

  getMonitorDashboard: (seniorUUID: UUID) =>
    request(`/v1/monitor-dashboard/${seniorUUID}`, { method: 'GET', skipAuth: true }),

  getMonitorDashboardMappedSeniors: () =>
    client.get('/v1/monitor-dashboard/mapped-seniors'),
};

// 7. Device Registration Services
export const DeviceService = {
  getDeviceNetworkTypes: () =>
    client.get('/v1/devices/network-types'),

  registerDevice: (body: DeviceRegistrationRequest) =>
    request('/v1/devices/register', { method: 'POST', body, skipAuth: true }),

  rotateDeviceCredentials: (deviceUUID: UUID) =>
    client.post(`/v1/devices/${deviceUUID}/credentials/rotate`),

  revokeDevice: (deviceUUID: UUID) =>
    client.post(`/v1/devices/${deviceUUID}/revoke`),

  getDeviceDetailsByImei: (imei: string) =>
    request(`/v1/devices/details/by-imei/${imei}`, { method: 'GET', skipAuth: true }),

  getDeviceDetailsByImeiList: (imeiList: string[]) =>
    request('/v1/devices/details/by-imei-list', { method: 'POST', body: imeiList, skipAuth: true }),
};

// 8. Device Assignment Services
export const DeviceAssignmentService = {
  assignDevice: (body: AssignDeviceRequest, xForwardedFor?: string) =>
    request('/v1/devices/assignments/assign', {
      method: 'POST',
      body,
      headers: xForwardedFor ? { 'X-Forwarded-For': xForwardedFor } : undefined,
    }),

  unassignDevice: (assignmentId: UUID, body: UnassignDeviceRequest, xForwardedFor?: string) =>
    request(`/v1/devices/assignments/unassign/${assignmentId}`, {
      method: 'POST',
      body,
      headers: xForwardedFor ? { 'X-Forwarded-For': xForwardedFor } : undefined,
    }),

  getDeviceAssignment: (deviceId: UUID) =>
    client.get(`/v1/devices/assignments/get/${deviceId}`),

  getDeviceAssignmentAuditLogs: (assignmentId: UUID) =>
    client.get(`/v1/devices/assignments/audit-logs/${assignmentId}`), // ADMIN ONLY

  getSeniorDevices: (seniorUUID: UUID) =>
    client.get(`/v1/devices/assignments/seniors/${seniorUUID}/devices`),
};

// 9. Vitals Services
export const VitalService = {
  syncVitals: (body: VitalSyncRequest) =>
    request('/v1/vitals/sync', { method: 'POST', body, skipAuth: true }),

  getVitalsSummary: (queryParams: { deviceUUID: UUID; days: number }) =>
    request('/v1/vitals/summary', { method: 'GET', queryParams, skipAuth: true }),
};

// 10. Alarm Events Services
export const AlarmService = {
  saveAlarmEvents: (body: AlarmEvent[]) =>
    request('/v1/alarm/save', { method: 'POST', body, skipAuth: true }),

  getAlarmsByDevice: (deviceUUID: UUID) =>
    client.get(`/v1/alarm/by-device/${deviceUUID}`),

  getAllAlarms: () =>
    request('/v1/alarm/all', { method: 'GET', skipAuth: true }),

  getAlarm: (id: number) =>
    request(`/v1/alarm/${id}`, { method: 'GET', skipAuth: true }),

  deleteAlarm: (id: number) =>
    request(`/v1/alarm/${id}`, { method: 'DELETE', skipAuth: true }),
};

// 11. Device Events Services
export const DeviceEventService = {
  saveDeviceEvents: (body: SCUnifiedEventDTO[]) =>
    request('/v1/device-events/save-all', { method: 'POST', body, skipAuth: true }),
};

// 12. Device Status Services
export const DeviceStatusService = {
  saveDeviceStatusEvents: (body: DeviceStatusEvent[]) =>
    request('/v1/device-status/save', { method: 'POST', body, skipAuth: true }),

  getDeviceStatusByDevice: (deviceUUID: UUID) =>
    client.get(`/v1/device-status/by-device/${deviceUUID}`),

  getAllDeviceStatuses: () =>
    request('/v1/device-status/all', { method: 'GET', skipAuth: true }),

  getDeviceStatus: (id: number) =>
    request(`/v1/device-status/${id}`, { method: 'GET', skipAuth: true }),

  deleteDeviceStatus: (id: number) =>
    request(`/v1/device-status/${id}`, { method: 'DELETE', skipAuth: true }),
};

// 13. Position Events Services
export const PositionService = {
  savePositionEvents: (body: PositionEvent[]) =>
    request('/v1/position/save', { method: 'POST', body, skipAuth: true }),

  getPositionByDevice: (deviceUUID: UUID) =>
    client.get(`/v1/position/by-device/${deviceUUID}`),

  getAllPositions: () =>
    request('/v1/position/all', { method: 'GET', skipAuth: true }),

  getPosition: (id: number) =>
    request(`/v1/position/${id}`, { method: 'GET', skipAuth: true }),

  deletePosition: (id: number) =>
    request(`/v1/position/${id}`, { method: 'DELETE', skipAuth: true }),
};

// 14. CRM Services
export const CrmService = {
  getCrmLead: (leadName: string) =>
    client.get(`/v1/api/crm/leads/${leadName}`), // ADMIN ONLY

  saveCrmLead: (body: FrappeLeadDTO) =>
    client.post('/v1/api/crm/leads', body), // ADMIN ONLY
};

// 15. Admin Services
export const AdminService = {
  backfillUsernames: () =>
    client.post('/v1/admin/backfill-usernames'),

  adminCreateUser: (body: AdminCreateUserRequest) =>
    client.post('/v1/admin/users', body),

  adminUpdateUser: (userId: UUID, body: AdminUpdateUserRequest) =>
    client.put(`/v1/admin/users/${userId}`, body),

  adminDeactivateUser: (userId: UUID) =>
    client.patch(`/v1/admin/users/${userId}/deactivate`),

  adminReactivateUser: (userId: UUID) =>
    client.patch(`/v1/admin/users/${userId}/reactivate`),

  adminDeleteUser: (userId: UUID) =>
    client.delete(`/v1/admin/users/${userId}`),

  adminGetUsers: (queryParams?: { active?: boolean }) =>
    client.get<UserProfile[]>('/v1/admin/users', queryParams),

  adminGetUsersAvailableForSenior: (seniorId: UUID, queryParams?: { role?: UserRole }) =>
    client.get(`/v1/admin/users/available-for-senior/${seniorId}`, queryParams),

  adminGetSeniors: () =>
    client.get('/v1/admin/seniors'),

  adminGetSeniorByMobile: (mobile: number) =>
    client.get(`/v1/admin/seniors/${mobile}`),

  adminGetDevices: () =>
    client.get<DeviceSummary[]>('/v1/admin/devices'),

  adminGetAssignments: () =>
    client.get('/v1/admin/assignments'),

  adminGetMappings: () =>
    client.get('/v1/admin/mappings'),

  adminMapGuardianSenior: (body: AdminMapRequest) =>
    client.post('/v1/admin/mappings/admin-map', body),

  adminGetCounts: () =>
    client.get<AdminCounts>('/v1/admin/counts'),

  adminGetAlarmEvents: () =>
    client.get('/v1/admin/alarm-events'),

  adminGetMonitorMappings: () =>
    client.get('/v1/admin/monitor-mappings'),
};

// 16. Actuator Services
export const ActuatorService = {
  getHealth: () =>
    request('/v1/actuator/health', { method: 'GET', skipAuth: true }),

  getHealthPing: () =>
    request('/v1/actuator/health/ping', { method: 'GET', skipAuth: true }),

  getHealthUptime: () =>
    request('/v1/actuator/health/uptime', { method: 'GET', skipAuth: true }),

  getHealthSystem: () =>
    request('/v1/actuator/health/system', { method: 'GET', skipAuth: true }),

  getHealthDb: () =>
    request('/v1/actuator/health/db', { method: 'GET', skipAuth: true }),

  getHealthReady: () =>
    request('/v1/actuator/health/ready', { method: 'GET', skipAuth: true }),

  getHealthInternalDetails: () =>
    client.get('/v1/actuator/health/internal/details'), // Authentication checks might be localhost-only on server side
};
