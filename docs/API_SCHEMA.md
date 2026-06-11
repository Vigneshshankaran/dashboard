# API Schema Reference

This is the single place to **check and update** the backend API contract for the SeniorCare dashboard. It mirrors the official backend spec, including **which roles may call each endpoint**.

- **Code that implements this schema:** [`src/api/services.ts`](../src/api/services.ts) (endpoints) and [`src/api/types.ts`](../src/api/types.ts) (data shapes)
- **Backend base URL:** set in [`.env`](../.env) (`VITE_API_BASE_URL=/api`) and proxied by [`vite.config.ts`](../vite.config.ts)
- **Auth column:** `Public` = no login needed. A role list (e.g. `GUARDIAN, ADMIN`) = requires `Authorization: Bearer <token>` AND one of those roles. `Any user` = any authenticated user.

> **How to update:** when the backend adds/changes an endpoint — (1) update the table here, (2) add/adjust the function in `services.ts`, (3) add/adjust the request/response shape in `types.ts`. Keep all three in sync.

---

## 1. Authentication — `AuthService` (`/v1/auth`)

| Action | Method & Path | Request body (types.ts) | Auth | Used by |
|---|---|---|---|---|
| Sign in (email + password) | `POST /v1/auth/signin` | `UserSignInRequest` (email, password, platform) | Public | Login page |
| Sign in (mobile OTP) | `POST /v1/auth/signin/mobile` | phoneNumber, otp | Public | **Not used** — mobile login removed from this app |
| Verify mobile OTP | `POST /v1/auth/signin/mobile/verify` | phoneNumber, otp + header `X-Platform` (optional) | Public | **Not used** — mobile login removed from this app |
| Sign up by email | `POST /v1/auth/signup/email` | `EmailSignUpRequest` | Public | — |
| Refresh access token | `POST /v1/auth/refresh` | header `refreshToken` (required) | Public | API client (auto-refresh on 401) |
| Logout | `POST /v1/auth/logout` | header `refreshToken` (required) | Public | App (logout) |
| Update own account | `PUT /v1/auth/me` | `UpdateProfileRequest` | Any user | — |
| Verify email | `POST /v1/auth/verify-email/{userId}` | — | Any user | — |
| Change password | `POST /v1/auth/change-password` | `UserLoginDTO` | Public | — |
| Google sign-in (token) | `POST /v1/auth/google` | `GoogleAuthRequest` (idToken, platform) | Public | — |
| Google sign-in (redirect) | `GET /v1/auth/login/google` | — | Public | — |
| Forgot password | `POST /v1/auth/forgot-password` | `ForgotPasswordRequest` (email, platform) | Public | — |
| Reset password | `POST /v1/auth/reset-password` | `ResetPasswordRequest` + `Authorization: Bearer <token>` | Bearer token | — |
| Validate reset token | `GET /v1/auth/validate-reset-token/{token}` | — | Public | — |
| Reset password page | `GET /v1/auth/reset-password-page?token=&platform=` | query: token (required), platform (optional) | Public | — |

Response on sign-in: `AuthTokens { access_token, refresh_token }` — stored in browser localStorage.

## 2. Profile — `ProfileService` (`/v1/profile`)

| Action | Method & Path | Request body | Auth | Used by |
|---|---|---|---|---|
| Get my profile | `GET /v1/profile` | — | Any user | App, Profile page |
| Update profile | `PUT /v1/profile` | `UpdateProfileRequest` | Any user | Profile page |
| Update personal info | `PUT /v1/profile/personal-info` | `PersonalInfoRequest` | Any user | — |
| Verify phone | `POST /v1/profile/verify-phone` | — | Any user | — |

## 3. Seniors — `SeniorService` (`/v1/seniors`)

| Action | Method & Path | Request body | Auth | Used by |
|---|---|---|---|---|
| Create senior | `POST /v1/seniors/create` | `SeniorRequestDTO` | GUARDIAN, ADMIN | — |
| Map senior to guardian | `POST /v1/seniors/map` | `SMRequest` (phoneNumber, countryCode) | GUARDIAN, ADMIN | — |
| Approve mapping | `POST /v1/seniors/map/{mappingId}/approve` | — | Any user | — |
| Reject mapping | `POST /v1/seniors/map/{mappingId}/reject` | — | Any user | — |
| Delete mapping | `DELETE /v1/seniors/map/{mappingId}` | — | GUARDIAN, SENIOR, ADMIN | Guardians page |
| List my seniors | `GET /v1/seniors/my-seniors` | — | GUARDIAN, ADMIN | Seniors page, Dashboard |
| List my guardians | `GET /v1/seniors/my-guardians` | — | SENIOR, ADMIN | Seniors page, Dashboard |
| List my monitors | `GET /v1/seniors/my-monitors` | — | SENIOR, ADMIN | Dashboard |

## 4. Monitors — `MonitorService` (`/v1/monitors`)

| Action | Method & Path | Request body | Auth | Used by |
|---|---|---|---|---|
| Assign monitor to senior | `POST /v1/monitors/assign` | `MonitorMappingRequest` | ADMIN, GUARDIAN, SENIOR | Monitors page |
| Delete monitor mapping | `DELETE /v1/monitors/mappings/{mappingId}` | — | ADMIN, GUARDIAN, SENIOR, MONITOR | Monitors page |
| Monitors of a senior | `GET /v1/monitors/of-senior/{seniorId}` | — | ADMIN, GUARDIAN, SENIOR, MONITOR | — |
| My monitored seniors | `GET /v1/monitors/my-seniors` | — | MONITOR, ADMIN | — |

## 5. Compliance — `ComplianceService` (`/v1/compliance`)

| Action | Method & Path | Request body | Auth | Used by |
|---|---|---|---|---|
| Upload health report | `POST /v1/compliance/reports` | `UploadReportsRequest` | GUARDIAN, ADMIN | — |
| Reports of a senior | `GET /v1/compliance/reports/senior/{seniorId}` | — | GUARDIAN, ADMIN | Seniors page (Medical tab) |
| Complete subscription | `POST /v1/compliance/subscription/complete?seniorId=` | — | GUARDIAN, ADMIN | — |

## 6. Dashboards — `DashboardService`

| Action | Method & Path | Auth |
|---|---|---|
| Guardian dashboard | `GET /v1/guardian-dashboard/{guardianUUID}` | Public |
| Senior dashboard | `GET /v1/senior-dashboard/{seniorUUID}` | Public |
| Monitor dashboard | `GET /v1/monitor-dashboard/{seniorUUID}` | Public |
| Mapped seniors (monitor) | `GET /v1/monitor-dashboard/mapped-seniors` | Public |

## 7. Device Registry — `DeviceService` (`/v1/devices`)

| Action | Method & Path | Request body | Auth | Used by |
|---|---|---|---|---|
| Network types | `GET /v1/devices/network-types` | — | Bearer token | — |
| Register device | `POST /v1/devices/register` | `DeviceRegistrationRequest` | Public | Devices page |
| Rotate credentials | `POST /v1/devices/{deviceUUID}/credentials/rotate` | — | Bearer token | — |
| Revoke device | `POST /v1/devices/{deviceUUID}/revoke` | — | Bearer token | Devices page |
| Lookup by IMEI | `GET /v1/devices/details/by-imei/{imei}` | — | Public | — |
| Lookup by IMEI list | `POST /v1/devices/details/by-imei-list` | `string[]` (IMEI list) | Public | — |

## 8. Device Assignments — `DeviceAssignmentService` (`/v1/devices/assignments`)

| Action | Method & Path | Request body | Auth | Used by |
|---|---|---|---|---|
| Assign device to senior | `POST /v1/devices/assignments/assign` | `AssignDeviceRequest` + `X-Forwarded-For` (optional) | Bearer token | Devices page |
| Unassign device | `POST /v1/devices/assignments/unassign/{assignmentId}` | `UnassignDeviceRequest` + `X-Forwarded-For` (optional) | Bearer token | Devices page |
| Get assignment | `GET /v1/devices/assignments/get/{deviceId}` | — | Bearer token | — |
| Assignment audit logs | `GET /v1/devices/assignments/audit-logs/{assignmentId}` | — | Bearer token (ADMIN) | — |
| Devices of a senior | `GET /v1/devices/assignments/seniors/{seniorUUID}/devices` | — | Bearer token | Seniors page (Devices tab) |

## 9. Vitals — `VitalService` (`/v1/vitals`)

| Action | Method & Path | Request body | Auth |
|---|---|---|---|
| Sync vitals | `POST /v1/vitals/sync` | `VitalSyncRequest` (contains `DailyVitalSummary[]`) | Public |
| Vitals summary | `GET /v1/vitals/summary?deviceUUID=&days=` | query: deviceUUID (required), days (required) | Public |

## 10. Alarms — `AlarmService` (`/v1/alarm`)

| Action | Method & Path | Request body | Auth | Used by |
|---|---|---|---|---|
| Save alarm events | `POST /v1/alarm/save` | `AlarmEvent[]` | Public | — |
| Alarms by device | `GET /v1/alarm/by-device/{deviceUUID}` | — | ADMIN, MONITOR, GUARDIAN | — |
| All alarms | `GET /v1/alarm/all` | — | Public | Alerts page, Seniors page, Dashboard |
| One alarm | `GET /v1/alarm/{id}` | — | Public | — |
| Delete alarm | `DELETE /v1/alarm/{id}` | — | Public | — |

## 11. Device Events — `DeviceEventService` (`/v1/device-events`)

| Action | Method & Path | Request body | Auth |
|---|---|---|---|
| Save device events | `POST /v1/device-events/save-all` | `SCUnifiedEventDTO[]` (full field list in types.ts) | Public |

## 12. Device Status — `DeviceStatusService` (`/v1/device-status`)

| Action | Method & Path | Request body | Auth |
|---|---|---|---|
| Save status events | `POST /v1/device-status/save` | `DeviceStatusEvent[]` | Public |
| Status by device | `GET /v1/device-status/by-device/{deviceUUID}` | — | ADMIN, MONITOR, GUARDIAN |
| All statuses | `GET /v1/device-status/all` | — | Public |
| One status | `GET /v1/device-status/{id}` | — | Public |
| Delete status | `DELETE /v1/device-status/{id}` | — | Public |

## 13. Position Events — `PositionService` (`/v1/position`)

| Action | Method & Path | Request body | Auth |
|---|---|---|---|
| Save position events | `POST /v1/position/save` | `PositionEvent[]` | Public |
| Position by device | `GET /v1/position/by-device/{deviceUUID}` | — | ADMIN, MONITOR, GUARDIAN |
| All positions | `GET /v1/position/all` | — | Public |
| One position | `GET /v1/position/{id}` | — | Public |
| Delete position | `DELETE /v1/position/{id}` | — | Public |

## 14. CRM — `CrmService` (`/v1/api/crm`)

| Action | Method & Path | Request body | Auth |
|---|---|---|---|
| Get lead | `GET /v1/api/crm/leads/{leadName}` | — | ADMIN |
| Save lead | `POST /v1/api/crm/leads` | `FrappeLeadDTO` | ADMIN |

## 15. Admin — `AdminService` (`/v1/admin`) — all endpoints require ADMIN

| Action | Method & Path | Request body | Used by |
|---|---|---|---|
| Backfill usernames | `POST /v1/admin/backfill-usernames` | — | — |
| Create user | `POST /v1/admin/users` | `AdminCreateUserRequest` | Users page |
| Update user | `PUT /v1/admin/users/{userId}` | `AdminUpdateUserRequest` | Users page |
| Deactivate user | `PATCH /v1/admin/users/{userId}/deactivate` | — | — |
| Reactivate user | `PATCH /v1/admin/users/{userId}/reactivate` | — | — |
| Delete user | `DELETE /v1/admin/users/{userId}` | — | Users page |
| List users | `GET /v1/admin/users?active=` | query: active (optional) | Users page, Guardians page |
| Users available for senior | `GET /v1/admin/users/available-for-senior/{seniorId}?role=` | query: role (optional) | — |
| List seniors | `GET /v1/admin/seniors` | — | — |
| Senior by mobile | `GET /v1/admin/seniors/{mobile}` | — | — |
| List devices | `GET /v1/admin/devices` | — | Devices page |
| List assignments | `GET /v1/admin/assignments` | — | Devices page |
| List guardian mappings | `GET /v1/admin/mappings` | — | Guardians page |
| Map guardian ↔ senior | `POST /v1/admin/mappings/admin-map` | `AdminMapRequest` | Guardians page |
| Entity counts | `GET /v1/admin/counts` | — | Dashboard (metrics) |
| All alarm events | `GET /v1/admin/alarm-events` | — | Alerts page |
| Monitor mappings | `GET /v1/admin/monitor-mappings` | — | Monitors page |

## 16. Health Checks — `ActuatorService` (`/v1/actuator/health`) — all Public

`GET /v1/actuator/health` (used by Dashboard system status), plus `/ping`, `/uptime`, `/system`, `/db`, `/ready`.
Exception: `/internal/details` is **localhost only** on the server.

---

## Role-permission notes for this app's pages

The pages call role-appropriate endpoints, but be aware of these spec rules:

- `my-seniors` is for **GUARDIAN/ADMIN**, while `my-guardians` and `my-monitors` are for **SENIOR/ADMIN** — a GUARDIAN user will get a 403 on the latter two. Dashboard widgets already tolerate this (failed calls count as 0).
- `Alarms by device`, `Status by device`, `Position by device` need **ADMIN, MONITOR or GUARDIAN**.
- Everything under `/v1/admin/**` and CRM is **ADMIN only** — the app hides those pages from other roles.

## Shared response & error handling

- All requests flow through [`src/api/client.ts`](../src/api/client.ts): attaches the Bearer token, auto-refreshes it on 401 (single retry), and broadcasts `auth:expired` when the session truly ends.
- Non-2xx responses throw an `ApiError { message, status, data }` — pages catch it and show a friendly message.
- Known response shapes live in `types.ts`: `AuthTokens`, `UserProfile`, `SeniorSummary`, `DeviceSummary`, `AdminCounts`, `ComplianceReport`, plus the generic `ApiResponse<T>` envelope.
