# Page-to-API and Schema Mapping Reference

This document maps all React pages in `src/pages/` to their respective API calls from `src/api/services.ts`, detailing the exact request schemas and keys passed during execution.

---

## 1. Login Page (`Login.tsx`)

Handles user authentication, login via password or OTP, and password reset trigger requests.

| API Method Call | HTTP Endpoint & Method | Request Payload / Schema | Keys Passed in Request |
| :--- | :--- | :--- | :--- |
| **`AuthService.signin`** | `POST /v1/auth/signin` | `UserSignInRequest` | `{ email, password, platform: 'web' }` |
| **`AuthService.signinMobile`** | `POST /v1/auth/signin/mobile` | `MobileSignInRequest` (partial) | `{ phoneNumber: inputPhone }` *(triggers OTP)* |
| **`AuthService.signinMobileVerify`** | `POST /v1/auth/signin/mobile/verify` | `MobileSignInRequest` | `{ phoneNumber, otp: verificationCode }` + header `X-Platform: web` |
| **`AuthService.forgotPassword`** | `POST /v1/auth/forgot-password` | `ForgotPasswordRequest` | `{ email, platform: 'web' }` |

---

## 2. Operations Overview Dashboard (`Dashboard.tsx`)

Consolidates metrics and health checks using subcomponents `MetricsGrid.tsx` and `SystemStatus.tsx`.

| Component / Service | API Method Call | HTTP Endpoint | Payload / Keys |
| :--- | :--- | :--- | :--- |
| **`SystemStatus`** / Health | **`ActuatorService.getHealth`** | `GET /v1/actuator/health` | None |
| **`SystemStatus`** & **`MetricsGrid`** (Admin) | **`AdminService.adminGetCounts`** | `GET /v1/admin/counts` | None |
| **`SystemStatus`** & **`MetricsGrid`** (Non-Admin) | **`SeniorService.getMySeniors`** | `GET /v1/seniors/my-seniors` | None |
| **`SystemStatus`** & **`MetricsGrid`** (Non-Admin) | **`SeniorService.getMyGuardians`** | `GET /v1/seniors/my-guardians` | None |
| **`SystemStatus`** & **`MetricsGrid`** (Non-Admin) | **`SeniorService.getMyMonitors`** | `GET /v1/seniors/my-monitors` | None |
| **`SystemStatus`** & **`MetricsGrid`** (Non-Admin) | **`AlarmService.getAllAlarms`** | `GET /v1/alarm/all` | None |

---

## 3. Care Command Centre (`CommandCentre.tsx`)

The central real-time monitoring console, fetching all metrics, active alerts, devices, and backend health status.

| API Method Call | HTTP Endpoint | Payload / Keys |
| :--- | :--- | :--- |
| **`ProfileService.getProfile`** | `GET /v1/profile` | None *(if user role prop is missing)* |
| **`AdminService.adminGetSeniors`** (Admin)<br>**`SeniorService.getMySeniors`** (Non-Admin) | `GET /v1/admin/seniors`<br>`GET /v1/seniors/my-seniors` | None |
| **`AdminService.adminGetAlarmEvents`** (Admin)<br>**`AlarmService.getAllAlarms`** (Non-Admin) | `GET /v1/admin/alarm-events`<br>`GET /v1/alarm/all` | None |
| **`AdminService.adminGetDevices`** (Admin only) | `GET /v1/admin/devices` | None |
| **`AdminService.adminGetCounts`** (Admin only) | `GET /v1/admin/counts` | None |
| **`ActuatorService.getHealth`** | `GET /v1/actuator/health` | None |

---

## 4. Alerts Cockpit (`Alerts.tsx`)

Operations console listing active alarms and warning signs.

| API Method Call | HTTP Endpoint | Payload / Keys |
| :--- | :--- | :--- |
| **`AdminService.adminGetAlarmEvents`** (Admin)<br>**`AlarmService.getAllAlarms`** (Non-Admin) | `GET /v1/admin/alarm-events`<br>`GET /v1/alarm/all` | None |

---

## 5. Seniors Directory (`Seniors.tsx`)

Manages seniors, their vital histories, mappings, and uploaded health compliance reports.

| API Method Call | HTTP Endpoint | Request Payload / Schema | Keys / Parameters Passed |
| :--- | :--- | :--- | :--- |
| **`AdminService.adminGetSeniors`** (Admin)<br>**`SeniorService.getMySeniors`** (Guardian)<br>**`MonitorService.getMonitorsMySeniors`** (Monitor) | `GET /v1/admin/seniors`<br>`GET /v1/seniors/my-seniors`<br>`GET /v1/monitors/my-seniors` | None | None |
| **`DeviceAssignmentService.getSeniorDevices`** | `GET /v1/devices/assignments/seniors/{seniorUUID}/devices` | URL Param | `seniorUUID` (UUID string) |
| **`AlarmService.getAllAlarms`** | `GET /v1/alarm/all` | None | None |
| **`VitalService.getVitalsSummary`** | `GET /v1/vitals/summary` | Query Params | `deviceUUID` (UUID string), `days: 7` |
| **`ComplianceService.getReportsOfSenior`** | `GET /v1/compliance/reports/senior/{seniorId}` | URL Param | `seniorId` (UUID string) |
| **`AdminService.adminGetMappings`** (Admin)<br>**`SeniorService.getMyGuardians`** (Non-Admin) | `GET /v1/admin/mappings`<br>`GET /v1/seniors/my-guardians` | None | None |
| **`SeniorService.createSenior`** | `POST /v1/seniors/create` | `SeniorRequestDTO` | `{ firstName, lastName, phoneNumber, height, weight, gender, dateOfBirth }` |

---

## 6. Guardians Mapping Page (`Guardians.tsx`)

Connects guardians/caregivers with seniors.

| API Method Call | HTTP Endpoint | Request Payload / Schema | Keys / Parameters Passed |
| :--- | :--- | :--- | :--- |
| **`AdminService.adminGetUsers`** | `GET /v1/admin/users` | Query Params (optional) | `{ active: true }` |
| **`SeniorService.createSenior`** | `POST /v1/seniors/create` | `SeniorRequestDTO` | `{ firstName, lastName, phoneNumber, height, weight, gender, dateOfBirth }` |
| **`AdminService.adminGetMappings`** | `GET /v1/admin/mappings` | None | None |
| **`SeniorService.deleteMapping`** | `DELETE /v1/seniors/map/{mappingId}` | URL Param | `mappingId` (UUID string) |
| **`AdminService.adminMapGuardianSenior`** | `POST /v1/admin/mappings/admin-map` | `AdminMapRequest` | `{ guardianId, seniorId }` |

---

## 7. Monitors Mapping Page (`Monitors.tsx`)

Manages mapping configurations connecting monitoring agents to seniors.

| API Method Call | HTTP Endpoint | Request Payload / Schema | Keys / Parameters Passed |
| :--- | :--- | :--- | :--- |
| **`AdminService.adminGetMonitorMappings`** | `GET /v1/admin/monitor-mappings` | None | None |
| **`AdminService.adminGetUsers`** | `GET /v1/admin/users` | None | None |
| **`MonitorService.deleteMonitorMapping`** | `DELETE /v1/monitors/mappings/{mappingId}` | URL Param | `mappingId` (UUID string) |
| **`MonitorService.assignMonitor`** | `POST /v1/monitors/assign` | `MonitorMappingRequest` | `{ monitorId, seniorId }` |

---

## 8. Device Configuration Console (`Devices.tsx`)

Administrates hardware devices, links device identifiers (IMEI/Serial), and monitors assignment statuses.

| API Method Call | HTTP Endpoint | Request Payload / Schema | Keys / Parameters Passed |
| :--- | :--- | :--- | :--- |
| **`AdminService.adminGetSeniors`** | `GET /v1/admin/seniors` | None | None |
| **`AdminService.adminGetUsers`** | `GET /v1/admin/users` | None | None |
| **`AdminService.adminGetDevices`** | `GET /v1/admin/devices` | None | None |
| **`AdminService.adminGetAssignments`** | `GET /v1/admin/assignments` | None | None |
| **`DeviceService.registerDevice`** | `POST /v1/devices/register` | `DeviceRegistrationRequest` | `{ deviceIdentifier, deviceName, model, networkType, imei }` |
| **`DeviceAssignmentService.assignDevice`** | `POST /v1/devices/assignments/assign` | `AssignDeviceRequest` | `{ deviceUUID, seniorUUID }` |
| **`DeviceService.revokeDevice`** | `POST /v1/devices/{deviceUUID}/revoke` | URL Param | `deviceUUID` (UUID string) |
| **`DeviceService.rotateDeviceCredentials`** | `POST /v1/devices/{deviceUUID}/credentials/rotate` | URL Param | `deviceUUID` (UUID string) |
| **`DeviceAssignmentService.unassignDevice`** | `POST /v1/devices/assignments/unassign/{assignmentId}` | URL Param & `UnassignDeviceRequest` body | `assignmentId` (URL parameter), `{ assignmentId, reason }` (request body) |
| **`DeviceAssignmentService.getDeviceAssignmentAuditLogs`** | `GET /v1/devices/assignments/audit-logs/{assignmentId}` | URL Param | `assignmentId` (UUID string) |
| **`DeviceStatusService.getAllDeviceStatuses`** | `GET /v1/device-status/all` | None | None |

---

## 9. User Account Manager (`Users.tsx`)

Provides complete user accounts administration (creating, editing, deactivating, and deleting users).

| API Method Call | HTTP Endpoint | Request Payload / Schema | Keys / Parameters Passed |
| :--- | :--- | :--- | :--- |
| **`AdminService.adminGetUsers`** | `GET /v1/admin/users` | None | None |
| **`AdminService.adminCreateUser`** | `POST /v1/admin/users` | `AdminCreateUserRequest` | `{ role, firstName, lastName, phoneNumber, email, password, height, weight, gender, dateOfBirth }` |
| **`AdminService.adminUpdateUser`** | `PUT /v1/admin/users/{userId}` | `AdminUpdateUserRequest` | `userId` (URL parameter), `{ firstName, lastName, userName, phoneNumber, primaryEmail, secondaryEmail, profileImageUrl, role, status, active }` (body) |
| **`AdminService.adminDeleteUser`** | `DELETE /v1/admin/users/{userId}` | URL Param | `userId` (UUID string) |
| **`AdminService.adminDeactivateUser`** | `PATCH /v1/admin/users/{userId}/deactivate` | URL Param | `userId` (UUID string) |
| **`AdminService.adminReactivateUser`** | `PATCH /v1/admin/users/{userId}/reactivate` | URL Param | `userId` (UUID string) |

---

## 10. Profile Settings (`Profile.tsx`)

Allows authenticated users to view/edit their own profile information and submit personal/medical details.

| API Method Call | HTTP Endpoint | Request Payload / Schema | Keys / Parameters Passed |
| :--- | :--- | :--- | :--- |
| **`ProfileService.getProfile`** | `GET /v1/profile` | None | None |
| **`ProfileService.updateProfile`** | `PUT /v1/profile` | `UpdateProfileRequest` | `{ firstName, lastName, userName, phoneNumber, secondaryEmail, profileImageUrl, dob }` |
| **`ProfileService.updatePersonalInfo`** | `PUT /v1/profile/personal-info` | `PersonalInfoRequest` | `{ dateOfBirth, gender, maritalStatus, nationality, occupation, height, weight, bloodGroup, allergies, medicalConditions, addressLine1, addressLine2, city, state, country, postalCode }` |
| **`AuthService.verifyEmail`** | `POST /v1/auth/verify-email/{userId}` | URL Param | `userId` (UUID string) |
| **`ProfileService.verifyPhone`** | `POST /v1/profile/verify-phone` | None | None |
