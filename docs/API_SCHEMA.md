# API Schema Reference

This is the single place to **check and update** the backend API contract for the SeniorCare dashboard.

- **Code that implements this schema:** [`src/api/services.ts`](../src/api/services.ts) (endpoints) and [`src/api/types.ts`](../src/api/types.ts) (data shapes)
- **Backend base URL:** set in [`.env`](../.env) (`VITE_API_BASE_URL=/api`) and proxied by [`vite.config.ts`](../vite.config.ts)
- **Auth:** every call automatically carries `Authorization: Bearer <token>` unless marked **Public** below

> **How to update:** when the backend adds/changes an endpoint — (1) update the table here, (2) add/adjust the function in `services.ts`, (3) add/adjust the request/response shape in `types.ts`. Keep all three in sync.

---

## 1. Authentication — `AuthService`

| Action | Method & Path | Request body (types.ts) | Auth | Used by |
|---|---|---|---|---|
| Sign in (email + password) | `POST /v1/auth/signin` | `UserSignInRequest` | Public | Login page |
| Sign up by email | `POST /v1/auth/signup/email` | `EmailSignUpRequest` | Public | — |
| Refresh access token | `POST /v1/auth/refresh` | header `refreshToken` | Public | — |
| Logout | `POST /v1/auth/logout` | header `refreshToken` | Public | App (logout) |
| Update own account | `PUT /v1/auth/me` | `UpdateProfileRequest` | Bearer | — |
| Verify email | `POST /v1/auth/verify-email/{userId}` | — | Bearer | — |
| Change password | `POST /v1/auth/change-password` | `UserLoginDTO` | Public | — |
| Google sign-in | `POST /v1/auth/google` | `GoogleAuthRequest` | Public | — |
| Forgot password | `POST /v1/auth/forgot-password` | `ForgotPasswordRequest` | Public | — |
| Reset password | `POST /v1/auth/reset-password` | `ResetPasswordRequest` + token | Public | — |
| Validate reset token | `GET /v1/auth/validate-reset-token/{token}` | — | Public | — |

Response on sign-in: `{ access_token, refresh_token }` — stored in browser localStorage.

## 2. Profile — `ProfileService`

| Action | Method & Path | Request body | Used by |
|---|---|---|---|
| Get my profile | `GET /v1/profile` | — | App, Profile page |
| Update profile | `PUT /v1/profile` | `UpdateProfileRequest` | Profile page |
| Update personal info | `PUT /v1/profile/personal-info` | `PersonalInfoRequest` | — |
| Verify phone | `POST /v1/profile/verify-phone` | — | — |

## 3. Seniors — `SeniorService`

| Action | Method & Path | Request body | Used by |
|---|---|---|---|
| Create senior | `POST /v1/seniors/create` | `SeniorRequestDTO` | — |
| Map senior to guardian | `POST /v1/seniors/map` | `SMRequest` | — |
| Approve mapping | `POST /v1/seniors/map/{mappingId}/approve` | — | — |
| Reject mapping | `POST /v1/seniors/map/{mappingId}/reject` | — | — |
| Delete mapping | `DELETE /v1/seniors/map/{mappingId}` | — | Guardians page |
| List my seniors | `GET /v1/seniors/my-seniors` | — | Seniors page, Dashboard |
| List my guardians | `GET /v1/seniors/my-guardians` | — | Seniors page, Dashboard |
| List my monitors | `GET /v1/seniors/my-monitors` | — | Dashboard |

## 4. Monitors — `MonitorService`

| Action | Method & Path | Request body | Used by |
|---|---|---|---|
| Assign monitor to senior | `POST /v1/monitors/assign` | `MonitorMappingRequest` | Monitors page |
| Delete monitor mapping | `DELETE /v1/monitors/mappings/{mappingId}` | — | Monitors page |
| Monitors of a senior | `GET /v1/monitors/of-senior/{seniorId}` | — | — |
| My monitored seniors | `GET /v1/monitors/my-seniors` | — | — |

## 5. Compliance — `ComplianceService`

| Action | Method & Path | Request body | Used by |
|---|---|---|---|
| Upload health report | `POST /v1/compliance/reports` | `UploadReportsRequest` | — |
| Reports of a senior | `GET /v1/compliance/reports/senior/{seniorId}` | — | Seniors page (Medical tab) |
| Complete subscription | `POST /v1/compliance/subscription/complete?seniorId=` | — | — |

## 6. Dashboards — `DashboardService` (Public)

| Action | Method & Path |
|---|---|
| Guardian dashboard | `GET /v1/guardian-dashboard/{guardianUUID}` |
| Senior dashboard | `GET /v1/senior-dashboard/{seniorUUID}` |
| Monitor dashboard | `GET /v1/monitor-dashboard/{seniorUUID}` |
| Mapped seniors (monitor) | `GET /v1/monitor-dashboard/mapped-seniors` (Bearer) |

## 7. Device Registry — `DeviceService`

| Action | Method & Path | Request body | Used by |
|---|---|---|---|
| Network types | `GET /v1/devices/network-types` | — | — |
| Register device | `POST /v1/devices/register` | `DeviceRegistrationRequest` | Devices page |
| Rotate credentials | `POST /v1/devices/{deviceUUID}/credentials/rotate` | — | — |
| Revoke device | `POST /v1/devices/{deviceUUID}/revoke` | — | Devices page |
| Lookup by IMEI | `GET /v1/devices/details/by-imei/{imei}` | — (Public) | — |
| Lookup by IMEI list | `POST /v1/devices/details/by-imei-list` | `string[]` (Public) | — |

## 8. Device Assignments — `DeviceAssignmentService`

| Action | Method & Path | Request body | Used by |
|---|---|---|---|
| Assign device to senior | `POST /v1/devices/assignments/assign` | `AssignDeviceRequest` | Devices page |
| Unassign device | `POST /v1/devices/assignments/unassign/{assignmentId}` | `UnassignDeviceRequest` | Devices page |
| Get assignment | `GET /v1/devices/assignments/get/{deviceId}` | — | — |
| Assignment audit logs | `GET /v1/devices/assignments/audit-logs/{assignmentId}` | — (Admin) | — |
| Devices of a senior | `GET /v1/devices/assignments/seniors/{seniorUUID}/devices` | — | Seniors page (Devices tab) |

## 9. Vitals — `VitalService` (Public)

| Action | Method & Path | Request body |
|---|---|---|
| Sync vitals | `POST /v1/vitals/sync` | `VitalSyncRequest` (contains `DailyVitalSummary[]`) |
| Vitals summary | `GET /v1/vitals/summary?deviceUUID=&days=` | — |

## 10. Alarms — `AlarmService`

| Action | Method & Path | Request body | Used by |
|---|---|---|---|
| Save alarm events | `POST /v1/alarm/save` | `AlarmEvent[]` (Public) | — |
| Alarms by device | `GET /v1/alarm/by-device/{deviceUUID}` | — (Bearer) | — |
| All alarms | `GET /v1/alarm/all` | — (Public) | Alerts page, Seniors page, Dashboard |
| One alarm | `GET /v1/alarm/{id}` | — (Public) | — |
| Delete alarm | `DELETE /v1/alarm/{id}` | — (Public) | — |

## 11–13. Device Events / Status / Position

| Service | Endpoints |
|---|---|
| `DeviceEventService` | `POST /v1/device-events/save-all` — body `SCUnifiedEventDTO[]` |
| `DeviceStatusService` | `POST /v1/device-status/save`, `GET /v1/device-status/by-device/{uuid}`, `GET /v1/device-status/all`, `GET/DELETE /v1/device-status/{id}` — body `DeviceStatusEvent[]` |
| `PositionService` | `POST /v1/position/save`, `GET /v1/position/by-device/{uuid}`, `GET /v1/position/all`, `GET/DELETE /v1/position/{id}` — body `PositionEvent[]` |

## 14. CRM — `CrmService` (Admin)

| Action | Method & Path | Request body |
|---|---|---|
| Get lead | `GET /v1/api/crm/leads/{leadName}` | — |
| Save lead | `POST /v1/api/crm/leads` | `FrappeLeadDTO` |

## 15. Admin — `AdminService` (Admin role required)

| Action | Method & Path | Request body | Used by |
|---|---|---|---|
| Create user | `POST /v1/admin/users` | `AdminCreateUserRequest` | Users page |
| Update user | `PUT /v1/admin/users/{userId}` | `AdminUpdateUserRequest` | Users page |
| Deactivate / Reactivate | `PATCH /v1/admin/users/{userId}/deactivate` / `.../reactivate` | — | — |
| Delete user | `DELETE /v1/admin/users/{userId}` | — | Users page |
| List users | `GET /v1/admin/users?active=` | — | Users page, Guardians page |
| Users available for senior | `GET /v1/admin/users/available-for-senior/{seniorId}?role=` | — | — |
| List seniors | `GET /v1/admin/seniors` | — | — |
| Senior by mobile | `GET /v1/admin/seniors/{mobile}` | — | — |
| List devices | `GET /v1/admin/devices` | — | Devices page |
| List assignments | `GET /v1/admin/assignments` | — | Devices page |
| List guardian mappings | `GET /v1/admin/mappings` | — | Guardians page |
| Map guardian ↔ senior | `POST /v1/admin/mappings/admin-map` | `AdminMapRequest` | Guardians page |
| Entity counts | `GET /v1/admin/counts` | — | Dashboard (metrics) |
| All alarm events | `GET /v1/admin/alarm-events` | — | Alerts page |
| Monitor mappings | `GET /v1/admin/monitor-mappings` | — | Monitors page |
| Backfill usernames | `POST /v1/admin/backfill-usernames` | — | — |

## 16. Health Checks — `ActuatorService` (Public)

`GET /v1/actuator/health` (used by Dashboard system status), plus `/ping`, `/uptime`, `/system`, `/db`, `/ready`, `/internal/details`.

---

## Shared response & error handling

- All requests flow through [`src/api/client.ts`](../src/api/client.ts).
- Non-2xx responses throw an `ApiError { message, status, data }` — pages catch it and show a friendly message.
- A generic wrapper `ApiResponse<T> { success, message, data, timestamp }` is available in `types.ts` for endpoints that use that envelope.
