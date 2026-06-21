/**
 * CommandCentre.tsx — the "Care Command Centre" operations console.
 *
 * Read-only live view. EVERYTHING shown here comes from the backend through the
 * service layer (../api). There are no demo values, no placeholder content, and
 * no client-side actions that pretend to change server state:
 *
 *   - Residents/seniors → AdminService.adminGetSeniors / SeniorService.getMySeniors
 *   - Alerts (tickets)  → AdminService.adminGetAlarmEvents / AlarmService.getAllAlarms
 *   - Device counts     → AdminService.adminGetDevices
 *   - Live senior count → AdminService.adminGetCounts
 *   - System status     → ActuatorService.getHealth
 *
 * Any field the backend doesn't return is shown as "Not provided" rather than a
 * made-up value. Resolved/open status is taken straight from the alarm record.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  Tabs,
  Tab,
  Chip,
  Avatar,
} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DevicesIcon from '@mui/icons-material/Devices';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InboxIcon from '@mui/icons-material/Inbox';
import CircleIcon from '@mui/icons-material/Circle';
import {
  ProfileService,
  AdminService,
  SeniorService,
  AlarmService,
  ActuatorService,
} from '../api';
import { DataState } from '../components/DataState';

/* ─── Theme tokens (match the rest of the app) ──────────────────────────── */
const C = {
  text: '#1A0E07',
  muted: '#8C7E76',
  sub: '#6E625B',
  border: '#EAE5E0',
  surface: '#FFFFFF',
  bg: '#FAF8F6',
  primary: '#D45529',
  red: '#EF4444',
  redBg: '#FEE2E2',
  amber: '#F59E0B',
  amberBg: '#FEF3C7',
  green: '#22C55E',
  greenBg: '#DCFCE7',
  blue: '#3B82F6',
  blueBg: '#DBEAFE',
  muteBg: '#F1F0EE',
};

/* ─── Types (only fields the backend actually returns) ──────────────────── */
interface CCSenior {
  key: string;
  name: string;
  age: number | null;
  gender?: string;
  bloodGroup?: string;
  medical?: string;
  allergies?: string;
  hsId?: string;
}

type Sev = 'high' | 'medium' | 'low' | 'resolved';
interface CCTicket {
  id: string;
  sid: string | null;
  kind: 'sos' | 'geo' | 'vitals' | 'dose' | 'other';
  type: string;
  sev: Sev;
  severityLabel: string; // real backend severity, or derived from the alarm type
  serial: string;
  time: string;
  device: string;
  resolved: boolean;
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */
const toMillis = (ts: any): number | null => {
  if (ts === undefined || ts === null || ts === '') return null;
  const n = Number(ts);
  if (Number.isNaN(n)) {
    const p = Date.parse(String(ts));
    return Number.isNaN(p) ? null : p;
  }
  return n < 1e12 ? n * 1000 : n;
};
const initialsOf = (name: string) =>
  name.split(/\s+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '–';
const ageFromDob = (dob: any): number | null => {
  const ms = toMillis(dob);
  if (ms === null) return null;
  const diff = Date.now() - ms;
  if (diff <= 0) return null;
  return Math.floor(diff / 3.15576e10);
};
const relTime = (ts: any): string => {
  const ms = toMillis(ts);
  if (ms === null) return 'time unknown';
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min${m > 1 ? 's' : ''} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m ago`;
  return `${Math.floor(h / 24)}d ago`;
};

/** Friendly label for the alarm type, derived from whatever the backend sends. */
function classifyAlarm(a: any): { kind: CCTicket['kind']; type: string } {
  const at = String(a.alarmType || a.type || a.eventType || '').toLowerCase();
  const has = (k: string) => a[k] !== undefined && a[k] !== null;
  if (has('fall.alarm.start') || has('fall.alarm.stop') || at.includes('fall')) return { kind: 'sos', type: 'SOS — Fall detected' };
  if (has('alarm.panic.start') || has('alarm.panic.stop') || at.includes('panic') || at.includes('sos')) return { kind: 'sos', type: 'SOS — Panic button' };
  if (has('geofence.alarm.1') || has('geofence.alarm.2') || at.includes('geo')) return { kind: 'geo', type: 'Geo-fence breach' };
  if (at.includes('heart') || at.includes('hr') || at.includes('spo')) return { kind: 'vitals', type: 'Abnormal vitals' };
  if (at.includes('dose') || at.includes('medic')) return { kind: 'dose', type: 'Missed dose' };
  if (has('startup.alarm') || at.includes('startup')) return { kind: 'other', type: 'Device startup' };
  return { kind: 'other', type: a.alarmType ? String(a.alarmType) : 'Alarm event' };
}

const sevStyle = (sev: Sev): { color: string; bg: string } => {
  switch (sev) {
    case 'high': return { color: C.red, bg: C.redBg };
    case 'medium': return { color: C.amber, bg: C.amberBg };
    case 'low': return { color: C.blue, bg: C.blueBg };
    default: return { color: C.green, bg: C.greenBg };
  }
};

/* ─── Small stat card ───────────────────────────────────────────────────── */
const StatCard: React.FC<{ value: React.ReactNode; label: string; icon: React.ReactNode; color: string; bg: string; onClick?: () => void }> = ({ value, label, icon, color, bg, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      display: 'flex', alignItems: 'center', gap: 1.5, height: '100%', bgcolor: C.surface,
      cursor: onClick ? 'pointer' : 'default', transition: 'all .15s',
      '&.MuiCard-root': { p: 1.5, border: `1px solid ${C.border}`, borderRadius: '12px', boxShadow: 'none' },
      '&:hover': onClick ? { borderColor: color, bgcolor: C.bg } : {},
    }}
  >
    <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontWeight: 800, color, fontSize: '1.25rem', lineHeight: 1 }}>{value}</Typography>
      <Typography variant="caption" sx={{ color: C.muted, fontWeight: 700, fontSize: '0.68rem', display: 'block', whiteSpace: 'nowrap' }}>{label}</Typography>
    </Box>
  </Card>
);

/** A label/value row. Renders "Not provided" when the backend gave us nothing. */
const Field: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => {
  const empty = value === null || value === undefined || value === '';
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.75, borderBottom: `1px solid ${C.border}` }}>
      <Typography variant="caption" sx={{ color: C.muted, fontWeight: 600 }}>{label}</Typography>
      {empty ? (
        <Typography variant="caption" sx={{ color: '#B8ADA6', fontStyle: 'italic' }}>Not provided</Typography>
      ) : (
        <Typography variant="body2" sx={{ color: C.text, fontWeight: 600, textAlign: 'right' }}>{value}</Typography>
      )}
    </Box>
  );
};

const POLL_MS = 30_000;

type FilterKey = 'all' | 'sos' | 'geo' | 'vitals' | 'dose' | 'resolved';
const FILTERS: [FilterKey, string][] = [
  ['all', 'All'],
  ['sos', 'SOS'],
  ['geo', 'Geo-fence'],
  ['vitals', 'Vitals'],
  ['dose', 'Medication'],
  ['resolved', 'Resolved'],
];

interface CommandCentreProps { role?: string }

export const CommandCentre: React.FC<CommandCentreProps> = ({ role: roleProp }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seniors, setSeniors] = useState<Record<string, CCSenior>>({});
  const [tickets, setTickets] = useState<CCTicket[]>([]);
  const [deviceStats, setDeviceStats] = useState({ total: 0, lowBattery: 0, offline: 0 });
  const [liveCount, setLiveCount] = useState<number | null>(null);
  const [health, setHealth] = useState<'ok' | 'warn' | 'bad' | 'unknown'>('unknown');

  const [filter, setFilter] = useState<FilterKey>('all');
  const [selId, setSelId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState(0);

  const roleRef = useRef<string | undefined>(roleProp);

  const fetchData = async (initial = false) => {
    if (initial) { setLoading(true); setError(null); }

    // Determine role (prefer the prop from AppShell; fall back to a profile call)
    let role = roleRef.current;
    if (!role) {
      try {
        const p: any = await ProfileService.getProfile();
        role = (p?.data ?? p)?.role || '';
        roleRef.current = role;
      } catch { role = ''; }
    }
    const isAdmin = role === 'ADMIN';

    const [seniorsRes, alarmsRes, devicesRes, countsRes, healthRes] = await Promise.allSettled([
      isAdmin ? AdminService.adminGetSeniors() : SeniorService.getMySeniors(),
      isAdmin ? AdminService.adminGetAlarmEvents() : AlarmService.getAllAlarms(),
      isAdmin ? AdminService.adminGetDevices() : Promise.resolve([]),
      isAdmin ? AdminService.adminGetCounts() : Promise.resolve(null),
      ActuatorService.getHealth(),
    ]);

    if (initial && seniorsRes.status === 'rejected' && alarmsRes.status === 'rejected') {
      setError((seniorsRes.reason as any)?.message || 'The server could not be reached.');
      setLoading(false);
      return;
    }

    // Seniors — only fields present on the backend SeniorSummary
    const sMap: Record<string, CCSenior> = {};
    if (seniorsRes.status === 'fulfilled' && seniorsRes.value) {
      const arr: any[] = Array.isArray(seniorsRes.value) ? seniorsRes.value : ((seniorsRes.value as any).data ?? []);
      arr.forEach((a: any, idx: number) => {
        const key = String(a.seniorId || a.id || a.uuid || a.seniorUUID || `S${idx}`);
        const name = a.name || [a.firstName, a.lastName].filter(Boolean).join(' ') || 'Unnamed senior';
        sMap[key] = {
          key,
          name,
          age: ageFromDob(a.dateOfBirth),
          gender: a.gender || undefined,
          bloodGroup: a.bloodGroup || undefined,
          medical: a.medicalConditions || a.medical || undefined,
          allergies: a.allergies || undefined,
          hsId: a.seniorId || a.id ? String(a.seniorId || a.id) : undefined,
        };
      });
    }
    setSeniors(sMap);

    // Alarms → tickets
    const tks: CCTicket[] = [];
    if (alarmsRes.status === 'fulfilled' && alarmsRes.value) {
      const arr: any[] = Array.isArray(alarmsRes.value) ? alarmsRes.value : ((alarmsRes.value as any).data ?? []);
      arr.forEach((a: any, idx: number) => {
        const { kind, type } = classifyAlarm(a);
        const sid = a.seniorId || a.senior?.id || a.seniorUUID || null;
        const resolved = Boolean(a.isResolved ?? a.resolved ?? false);
        const device = a['device.name'] || a.deviceName || a.deviceUUID || a.ident || 'Unknown device';
        const sevRaw = String(a.severity || '').toUpperCase();
        let sev: Sev;
        if (resolved) sev = 'resolved';
        else if (sevRaw === 'CRITICAL' || sevRaw === 'HIGH') sev = 'high';
        else if (sevRaw === 'MEDIUM') sev = 'medium';
        else if (sevRaw === 'LOW') sev = 'low';
        else sev = kind === 'sos' ? 'high' : 'medium'; // fall back to type when no severity field
        const severityLabel = resolved ? 'Resolved' : (sevRaw ? sevRaw.charAt(0) + sevRaw.slice(1).toLowerCase() : (sev === 'high' ? 'High' : 'Medium'));
        tks.push({
          id: String(a.id ?? `TKT-${idx}`),
          sid: sid ? String(sid) : null,
          kind, type, sev, severityLabel,
          serial: a['device.serial.number'] || a.ident || '',
          time: relTime(a.timestamp ?? a.createdAt),
          device: String(device),
          resolved,
        });
      });
    }
    setTickets(tks);

    // Devices
    if (devicesRes.status === 'fulfilled' && devicesRes.value) {
      const arr: any[] = Array.isArray(devicesRes.value) ? devicesRes.value : ((devicesRes.value as any).data ?? []);
      let low = 0; let off = 0;
      arr.forEach((d: any) => {
        const b = Number(d.batteryLevel);
        if (!Number.isNaN(b) && b < 20) low += 1;
        const st = String(d.status || '').toLowerCase();
        if (st.includes('offline') || st.includes('inactive') || d.online === false) off += 1;
      });
      setDeviceStats({ total: arr.length, lowBattery: low, offline: off });
    }

    // Counts
    if (countsRes.status === 'fulfilled' && countsRes.value) {
      const c: any = (countsRes.value as any).data ?? countsRes.value;
      setLiveCount(typeof c?.totalSeniors === 'number' ? c.totalSeniors : Object.keys(sMap).length);
    } else {
      setLiveCount(Object.keys(sMap).length);
    }

    // Health
    if (healthRes.status === 'fulfilled') {
      const h: any = (healthRes.value as any)?.data ?? healthRes.value;
      const status = String(h?.status || h?.health || '').toUpperCase();
      setHealth(status.includes('UP') || status.includes('OK') || status.includes('HEALTHY') ? 'ok' : status ? 'warn' : 'unknown');
    } else {
      setHealth('bad');
    }

    setSelId((prev) => prev ?? (tks[0]?.id ?? null));
    setLoading(false);
  };

  useEffect(() => {
    roleRef.current = roleProp;
    fetchData(true);
    const id = setInterval(() => fetchData(false), POLL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleProp]);

  /* ── derived (purely from backend data) ── */
  const visible = useMemo(
    () => tickets.filter((t) => {
      if (filter === 'all') return true;
      if (filter === 'resolved') return t.resolved;
      return t.kind === filter && !t.resolved;
    }),
    [tickets, filter],
  );

  const openCount = tickets.filter((t) => !t.resolved).length;
  const resolvedCount = tickets.filter((t) => t.resolved).length;
  const sel = tickets.find((t) => t.id === selId) || null;
  const selSenior = sel?.sid ? seniors[sel.sid] || null : null;

  const healthChip = health === 'ok'
    ? { label: 'All systems healthy', color: C.green, bg: C.greenBg }
    : health === 'bad' ? { label: 'Backend unreachable', color: C.red, bg: C.redBg }
    : health === 'warn' ? { label: 'Degraded', color: C.amber, bg: C.amberBg }
    : { label: 'Status unknown', color: C.muted, bg: C.muteBg };

  return (
    <DataState loading={loading} error={error} onRetry={() => fetchData(true)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: C.text, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Care Command Centre
            </Typography>
            <Typography variant="body2" sx={{ color: C.muted, fontWeight: 500, mt: 0.5 }}>
              Live resident monitoring &amp; alert response
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, alignItems: 'center' }}>
            <Chip
              size="small"
              icon={<CircleIcon sx={{ fontSize: '10px !important', color: `${healthChip.color} !important` }} />}
              label={healthChip.label}
              sx={{ bgcolor: healthChip.bg, color: healthChip.color, fontWeight: 700, fontSize: '0.72rem' }}
            />
            <Button
              variant="outlined"
              startIcon={<AutorenewIcon />}
              onClick={() => fetchData(true)}
              sx={{ px: 2, py: 1, color: C.text, borderColor: C.border, bgcolor: C.surface, fontWeight: 600, fontSize: '0.85rem', textTransform: 'none', '&:hover': { borderColor: C.primary, bgcolor: C.bg } }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Stat cards — every value is computed from backend responses */}
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><StatCard value={liveCount ?? Object.keys(seniors).length} label="Seniors live" icon={<PeopleAltIcon sx={{ fontSize: 18 }} />} color={C.green} bg={C.greenBg} onClick={() => setFilter('all')} /></Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><StatCard value={openCount} label="Open alerts" icon={<NotificationsActiveIcon sx={{ fontSize: 18 }} />} color={C.red} bg={C.redBg} onClick={() => setFilter('all')} /></Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><StatCard value={resolvedCount} label="Resolved" icon={<CheckCircleIcon sx={{ fontSize: 18 }} />} color={C.blue} bg={C.blueBg} onClick={() => setFilter('resolved')} /></Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><StatCard value={deviceStats.total - deviceStats.offline} label="Devices online" icon={<DevicesIcon sx={{ fontSize: 18 }} />} color={C.primary} bg="#FDF3E7" /></Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}><StatCard value={deviceStats.lowBattery} label="Low battery" icon={<BatteryAlertIcon sx={{ fontSize: 18 }} />} color={C.amber} bg={C.amberBg} /></Grid>
        </Grid>

        {/* Main two-column area */}
        <Grid container spacing={2.5}>
          {/* Alerts list */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ overflow: 'hidden', '&.MuiCard-root': { p: 0, border: `1px solid ${C.border}`, borderRadius: '12px', boxShadow: 'none' } }}>
              <Box sx={{ p: 2, borderBottom: `1px solid ${C.border}` }}>
                <Typography sx={{ fontWeight: 800, color: C.text, fontSize: '0.95rem', mb: 1.5 }}>Active alerts</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {FILTERS.map(([val, label]) => {
                    const on = filter === val;
                    return (
                      <Chip
                        key={val}
                        label={label}
                        size="small"
                        onClick={() => setFilter(val)}
                        sx={{
                          fontWeight: 700, fontSize: '0.72rem', height: 26, cursor: 'pointer',
                          bgcolor: on ? C.text : 'transparent',
                          color: on ? '#fff' : C.muted,
                          border: `1px solid ${on ? C.text : C.border}`,
                          '&:hover': { bgcolor: on ? C.text : C.bg },
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>

              <Box sx={{ maxHeight: 560, overflowY: 'auto', p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {visible.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8, color: C.muted }}>
                    <InboxIcon sx={{ fontSize: 42, color: '#CFC6BF', mb: 1 }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>No alerts to show</Typography>
                    <Typography variant="caption" sx={{ color: '#B8ADA6' }}>
                      {tickets.length === 0 ? 'No alarm events received from the backend yet.' : 'Try a different filter.'}
                    </Typography>
                  </Box>
                ) : (
                  visible.map((t) => {
                    const active = selId === t.id;
                    const st = sevStyle(t.resolved ? 'resolved' : t.sev);
                    const who = t.sid && seniors[t.sid] ? seniors[t.sid].name : t.device;
                    return (
                      <Card
                        key={t.id}
                        onClick={() => { setSelId(t.id); setDetailTab(0); }}
                        sx={{
                          cursor: 'pointer', opacity: t.resolved ? 0.72 : 1, transition: 'all .15s',
                          // Higher specificity than the global MuiCard theme override so the
                          // severity left-border and tighter padding actually apply.
                          '&.MuiCard-root': {
                            p: 1.5, boxShadow: 'none', borderRadius: '10px',
                            border: `1px solid ${active ? C.text : C.border}`,
                            borderLeft: `3px solid ${st.color}`,
                          },
                          '&:hover': { borderColor: active ? C.text : '#C2B8B2' },
                        }}
                      >
                        {/* Headline: alert type + severity chip */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 0.75 }}>
                          <Typography sx={{ fontWeight: 700, color: C.text, fontSize: '0.86rem', lineHeight: 1.3 }}>{t.type}</Typography>
                          <Chip size="small" label={t.severityLabel} sx={{ height: 20, fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.3px', bgcolor: st.bg, color: st.color, flexShrink: 0, '& .MuiChip-label': { px: 1 } }} />
                        </Box>
                        {/* Subline: resident-or-device + time */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                          <Typography variant="caption" sx={{ color: C.sub, fontWeight: 600, fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{who}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: C.muted, flexShrink: 0 }}>
                            <AccessTimeIcon sx={{ fontSize: 12 }} />
                            <Typography variant="caption" sx={{ fontSize: '0.66rem' }}>{t.time}</Typography>
                          </Box>
                        </Box>
                      </Card>
                    );
                  })
                )}
              </Box>
            </Card>
          </Grid>

          {/* Detail panel */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ overflow: 'hidden', minHeight: 400, '&.MuiCard-root': { p: 0, border: `1px solid ${C.border}`, borderRadius: '12px', boxShadow: 'none' } }}>
              {!sel ? (
                <Box sx={{ textAlign: 'center', py: 12, color: C.muted }}>
                  <NotificationsActiveIcon sx={{ fontSize: 46, color: '#CFC6BF', mb: 1 }} />
                  <Typography sx={{ fontWeight: 700 }}>Select an alert</Typography>
                  <Typography variant="caption" sx={{ color: '#B8ADA6' }}>Choose a ticket on the left to see details.</Typography>
                </Box>
              ) : (
                <>
                  {/* Detail header */}
                  <Box sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'center', borderBottom: `1px solid ${C.border}`, bgcolor: C.bg }}>
                    <Avatar sx={{ bgcolor: C.primary, width: 46, height: 46, fontWeight: 700, fontSize: '1rem' }}>
                      {initialsOf(selSenior?.name || sel.device)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 800, color: C.text, fontSize: '1.05rem' }}>{selSenior?.name || sel.device}</Typography>
                      <Typography variant="caption" sx={{ color: C.muted, fontWeight: 600 }}>{sel.type} · {sel.time}</Typography>
                    </Box>
                    <Chip size="small" label={sel.resolved ? 'Resolved' : 'Open'} sx={{ fontWeight: 700, fontSize: '0.7rem', bgcolor: sel.resolved ? C.greenBg : C.redBg, color: sel.resolved ? C.green : C.red }} />
                  </Box>

                  {/* Tabs */}
                  <Tabs value={detailTab} onChange={(_, v) => setDetailTab(v)} sx={{ px: 2, borderBottom: `1px solid ${C.border}`, minHeight: 42, '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.82rem', minHeight: 42, color: C.muted }, '& .Mui-selected': { color: `${C.primary} !important` }, '& .MuiTabs-indicator': { backgroundColor: C.primary } }}>
                    <Tab label="Alert" />
                    <Tab label="Resident" />
                  </Tabs>

                  <Box sx={{ p: 2.5 }}>
                    {detailTab === 0 && (
                      <>
                        <Field label="Ticket ID" value={sel.id} />
                        <Field label="Type" value={sel.type} />
                        <Field label="Severity" value={sel.severityLabel} />
                        <Field label="Status" value={sel.resolved ? 'Resolved' : 'Open'} />
                        <Field label="Device" value={sel.device} />
                        <Field label="Serial / identifier" value={sel.serial} />
                        <Field label="Reported" value={sel.time} />
                      </>
                    )}
                    {detailTab === 1 && (
                      selSenior ? (
                        <>
                          <Field label="Name" value={selSenior.name} />
                          <Field label="Age" value={selSenior.age != null ? `${selSenior.age} yrs` : null} />
                          <Field label="Gender" value={selSenior.gender} />
                          <Field label="Blood group" value={selSenior.bloodGroup} />
                          <Field label="Medical conditions" value={selSenior.medical} />
                          <Field label="Allergies" value={selSenior.allergies} />
                          <Field label="Senior ID" value={selSenior.hsId} />
                        </>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 5, color: C.muted }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>This alert isn't linked to a resident record.</Typography>
                          <Typography variant="caption" sx={{ color: '#B8ADA6' }}>The backend alarm event has no resident reference.</Typography>
                        </Box>
                      )
                    )}
                  </Box>
                </>
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DataState>
  );
};

export default CommandCentre;
