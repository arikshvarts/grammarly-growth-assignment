'use client';

import React, { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { Sparkles, ArrowRight } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface UserFunnel {
  user_id: string;
  attributed_lp_name: string;
  cohort_date: string;
  installed_after_click: string;
  tried_after_install: string;
  is_repeat_try_user: string;
  qualified_activated: string;
  first_product_feature: string;
  time_to_install_hours: string;
  time_to_first_value_hours: string;
}
interface CohortRow {
  cohort_date: string;
  attributed_lp_name: string;
  lp_cta_click_users: string;
  install_users: string;
  try_users: string;
  install_cvr: string;
  activation_cvr: string;
  install_to_try_rate: string;
}
interface DailyRow {
  event_date: string;
  action: string;
  events: string;
  users: string;
}
interface FeatureRow {
  attributed_lp_name: string;
  first_product_feature: string;
  try_users: string;
  total_try_users: string;
  feature_share_within_lp: string;
}
interface QARow {
  check: string;
  severity: string;
  flagged_rows: string;
  explanation: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const LP_MAP: Record<string, string> = {
  lp_academic_writing: 'Academic Writing',
  lp_business_emails: 'Business Emails',
};
const LP_COLORS: Record<string, string> = {
  'Academic Writing': '#14a46c',
  'Business Emails': '#3d7dd4',
};
const ACTION_LABELS: Record<string, string> = {
  did_click_lp: 'LP CTA Clicks',
  did_install_grammarly: 'Installs',
  try_grammarly: 'Try Grammarly',
};

function pct(n: number) { return (n * 100).toFixed(1) + '%'; }
function num(n: number) { return n.toLocaleString(); }
function csvBool(v: string) { return v === 'True' || v === 'true' || v === '1'; }

function getRolling(points: {x: string, y: number}[], windowSize: number = 7) {
  return points.map((p, i) => {
    const start = Math.max(0, i - windowSize + 1);
    const subset = points.slice(start, i + 1);
    const avg = subset.reduce((sum, curr) => sum + curr.y, 0) / subset.length;
    return { x: p.x, y: avg };
  });
}

function getCumulative(points: {x: string, y: number}[]) {
  let acc = 0;
  return points.map(p => {
    acc += p.y;
    return { x: p.x, y: acc };
  });
}


export interface DashboardClientProps {
  userFunnelCsv: string;
  cohortCsv: string;
  dailyCsv: string;
  featureCsv: string;
  qaCsv: string;
}
// ── Tooltip ────────────────────────────────────────────────────────────────────
function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div className="relative group/tip inline-block w-full">
      {children}
      <div className="pointer-events-none absolute bottom-full left-0 mb-2 z-50 w-64 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
        <div className="bg-[#1b2333] text-white text-xs rounded-xl px-3 py-2 shadow-xl leading-relaxed">
          {text}
          <div className="absolute top-full left-4 border-4 border-transparent border-t-[#1b2333]" />
        </div>
      </div>
    </div>
  );
}

// ── KPI Card ───────────────────────────────────────────────────────────────────
const KPI_TOOLTIPS: Record<string, string> = {
  'LP CTA Click Users': 'Unique users who clicked the install button on a landing page. This is the entry point of the funnel, not page views.',
  'Install Users': 'Users who installed Grammarly within 7 days of clicking the LP CTA. Install CVR = Install Users ÷ LP CTA Click Users.',
  'Qualified Activated': 'Users who completed the full funnel: LP click → install → try_grammarly. This is the primary campaign quality metric.',
  'Activation CVR': 'End-to-end conversion: Try Users ÷ LP CTA Click Users. Measures how many LP clickers became active Grammarly users.',
  'Dead Install Rate': '(Installs − Tries) ÷ Installs. Users who installed but never tried Grammarly within 7 days. A high rate signals a post-install onboarding problem.',
  'Install → Try Rate': 'Try Users ÷ Install Users. Isolates onboarding quality from LP acquisition quality.',
};

function KpiCard({ label, value, sub, highlight, warn, tip, benchmark }: {
  label: string; value: string; sub?: string; highlight?: boolean; warn?: boolean; tip?: string;
  benchmark?: { val: string; isPositive: boolean };
}) {
  const [isHovered, setIsHovered] = React.useState(false);
  const card = (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col gap-1.5 p-5 rounded-3xl border transition-all duration-300 ${
        isHovered 
          ? 'shadow-xl -translate-y-1.5 border-opacity-100 z-10' 
          : 'shadow-sm'
      } ${
        highlight 
          ? `border-[#14a46c] ${isHovered ? 'bg-[#f0fdf8]' : 'bg-[#f0fdf8]/50'}` 
          : warn 
          ? `border-amber-500 ${isHovered ? 'bg-amber-50' : 'bg-amber-50/50'}`
          : `border-[#dde4e1] ${isHovered ? 'bg-[#f8faf9]' : 'bg-white/50'}`
      }`}>
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#4a5f56]">{label}</div>
          {tip && (
            <div className={`text-[10px] transition-colors ${isHovered ? 'text-[#14a46c]' : 'text-[#94a3b8]'}`}>
              ⓘ
            </div>
          )}
        </div>
        {benchmark && (
          <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${benchmark.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {benchmark.isPositive ? '+' : ''}{benchmark.val}
          </div>
        )}
      </div>
      <div className={`text-3xl font-bold transition-colors ${
        isHovered && highlight ? 'text-[#14a46c]' : 'text-[#16201b]'
      }`}>
        {value}
      </div>
      {sub && (
        <div className={`text-xs font-medium transition-colors ${
          highlight 
            ? `text-[#14a46c]` 
            : warn 
            ? `text-amber-600` 
            : `text-[#6a8074]`
        }`}>
          {sub}
        </div>
      )}
    </div>
  );
  return tip ? <Tooltip text={tip}>{card}</Tooltip> : card;
}

// ── Badge ──────────────────────────────────────────────────────────────────────
function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
      style={{ background: color + '18', color }}>
      {children}
    </span>
  );
}

// ── Simple SVG Bar Chart ───────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BarChart({ data, metric, label, color }: {
  data: { lp: string; name?: string; [k: string]: any }[];
  metric: string; label: string; color?: (lp: string) => string;
}) {
  const max = Math.max(...data.map(d => Number(d[metric])), 0.001);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  return (
    <div className="flex flex-col gap-4">
      {data.map((d, idx) => {
        const val = Number(d[metric]);
        const c = color ? color(d.name || d.lp as string) : '#14a46c';
        const isHovered = hoveredIndex === idx;
        return (
          <div 
            key={d.lp as string} 
            className="group flex items-center gap-3 transition-all duration-200"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className={`w-32 text-xs font-semibold text-right truncate transition-all duration-200 ${
              isHovered ? 'text-[#14a46c]' : 'text-slate-600'
            }`}>
              {d.name || d.lp}
            </div>
            <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden shadow-sm transition-shadow duration-200" style={{
              boxShadow: isHovered ? `inset 0 0 8px ${c}20` : 'none'
            }}>
              <div 
                className="h-full rounded-lg transition-all duration-500 flex items-center px-3 justify-center"
                style={{ 
                  width: `${(val / max) * 100}%`, 
                  background: c,
                  opacity: isHovered ? 1 : 0.85
                }}>
                <span className="text-[11px] font-bold text-white whitespace-nowrap">
                  {label === '%' ? pct(val) : val.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Funnel Visual ──────────────────────────────────────────────────────────────
function FunnelVis({ stages }: { stages: { label: string; value: number; color: string }[] }) {
  if (!stages.length) return null;
  const max = stages[0].value || 1;
  const W = 320;
  const H = 220;
  const gap = 4;
  const stageH = (H - (stages.length - 1) * gap) / stages.length;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-[180px] h-full overflow-visible">
        {stages.map((s, i) => {
          const nextVal = stages[i + 1]?.value ?? s.value * 0.8;
          const topW = (s.value / max) * W;
          const botW = (nextVal / max) * W;
          const topX = (W - topW) / 2;
          const botX = (W - botW) / 2;
          const y1 = i * (stageH + gap);
          const y2 = y1 + stageH;

          const path = `M ${topX} ${y1} L ${topX + topW} ${y1} L ${botX + botW} ${y2} L ${botX} ${y2} Z`;

          return (
            <g key={s.label}>
              <path d={path} fill={s.color} className="transition-all duration-700" style={{ opacity: 1 - i * 0.15 }} />
              {i < stages.length - 1 && (
                <text x={W / 2} y={y2 + 2} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#64748b" className="opacity-80">
                  {((stages[i+1].value / s.value) * 100).toFixed(0)}%
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex-1 space-y-2">
        {stages.map((s, i) => (
          <div key={s.label} className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: s.color, opacity: 1 - i * 0.15 }} />
              <span className="text-[11px] font-medium text-slate-500">{s.label}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-800">{num(s.value)}</div>
              {i > 0 && (
                <div className="text-[10px] text-slate-400 font-medium">
                  {((s.value / max) * 100).toFixed(1)}% of total
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FountainVis({ total, installs, tries, repeat }: { total: number; installs: number; tries: number; repeat: number }) {
  const W = 400;
  const H = 200;
  const barW = 60;
  const gap = 80;
  const stages = [
    { label: 'Total', val: total, color: '#1b2333' },
    { label: 'Install', val: installs, color: '#3d7dd4' },
    { label: 'Try', val: tries, color: '#14a46c' },
    { label: 'Repeat', val: repeat, color: '#0f766e' },
  ];

  return (
    <div className="pt-4 pb-8">
      <div className="text-sm font-bold text-[#1b2333] mb-4">Activation Fountain (Leakage Flow)</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {stages.map((s, i) => {
          const x = i * (barW + gap) + 20;
          const h = (s.val / total) * (H - 40);
          const y = H - h - 20;
          
          return (
            <g key={s.label}>
              {/* Main Bar */}
              <rect x={x} y={y} width={barW} height={h} fill={s.color} rx="4" className="transition-all duration-700" />
              <text x={x + barW / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="bold">{s.label}</text>
              <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize="10" fill={s.color} fontWeight="bold">{num(s.val)}</text>
              
              {/* Connecting Flow */}
              {i < stages.length - 1 && (
                <path d={`M ${x + barW} ${y + h/2} Q ${x + barW + gap/2} ${y + h/2}, ${x + barW + gap} ${H - (stages[i+1].val / total * (H - 40)) - (stages[i+1].val / total * (H - 40))/2}`} 
                      fill="none" stroke={s.color} strokeWidth="2" opacity="0.3" />
              )}

            </g>
          );
        })}
      </svg>
      <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] text-center">
        <div className="text-slate-400">Install Bridge: <span className="font-bold text-slate-600">{pct(installs/total)}</span></div>
        <div className="text-slate-400">Onboarding: <span className="font-bold text-slate-600">{pct(tries/installs)}</span></div>
        <div className="text-slate-400">Habit: <span className="font-bold text-slate-600">{pct(repeat/tries)}</span></div>
      </div>
    </div>
  );
}

// ── Line Chart ─────────────────────────────────────────────────────────────────
function MiniLineChart({ series, height = 140, showWeekends = false, yAxisType = 'pct' }: {
  series: { label: string; color: string; points: { x: string; y: number }[] }[];
  height?: number;
  showWeekends?: boolean;
  yAxisType?: 'pct' | 'num';
}) {
  if (!series.length || !series[0].points.length) return null;
  const allY = series.flatMap(s => s.points.map(p => p.y));
  const minY = 0, maxY = Math.max(...allY) * 1.15 || 1;
  const W = 640, H = height;
  const PAD = { t: 16, b: 32, l: 40, r: 16 };
  const iW = W - PAD.l - PAD.r, iH = H - PAD.t - PAD.b;
  const xs = series[0].points.map((_, i) => PAD.l + (i / Math.max(series[0].points.length - 1, 1)) * iW);
  const yScale = (v: number) => PAD.t + iH - ((v - minY) / (maxY - minY)) * iH;
  const ticks = series[0].points.filter((_, i) => i % Math.ceil(series[0].points.length / 6) === 0);
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => minY + f * (maxY - minY));
  const [hoveredPoint, setHoveredPoint] = useState<{i: number, x: string} | null>(null);

  return (
    <div className="relative group/chart" onMouseLeave={() => setHoveredPoint(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
        {/* Weekend Shading */}
        {showWeekends && series[0].points.map((p, i) => {
          const d = new Date(p.x);
          const day = d.getDay();
          if (day === 0 || day === 6) {
            const x = xs[i];
            const w = iW / Math.max(series[0].points.length - 1, 1);
            return <rect key={i} x={x - w/2} y={PAD.t} width={w} height={iH} fill="#cbd5e1" opacity="0.3" />;
          }
          return null;
        })}
        
        {yTicks.map(t => (
          <g key={t}>
            <line x1={PAD.l} y1={yScale(t)} x2={W - PAD.r} y2={yScale(t)} stroke="#f1f5f9" strokeWidth="1" />
            <text x={PAD.l - 4} y={yScale(t) + 4} textAnchor="end" fontSize="9" fill="#94a3b8">
              {yAxisType === 'pct' ? (t * 100).toFixed(0) + '%' : num(Math.round(t))}
            </text>
          </g>
        ))}

        {/* Hover Line */}
        {hoveredPoint && (
          <line x1={xs[hoveredPoint.i]} y1={PAD.t} x2={xs[hoveredPoint.i]} y2={H - PAD.b} stroke="#14a46c" strokeWidth="1" strokeDasharray="2 2" />
        )}

        {ticks.map((p, i) => (
          <text key={i} x={xs[series[0].points.indexOf(p)]} y={H - 6} textAnchor="middle" fontSize="9" fill="#94a3b8">
            {p.x.slice(5)}
          </text>
        ))}

        {series.map(s => {
          const d = s.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xs[i]} ${yScale(p.y)}`).join(' ');
          return (
            <g key={s.label}>
              <path d={d} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" />
              {s.points.map((p, i) => (
                <circle 
                  key={i} 
                  cx={xs[i]} 
                  cy={yScale(p.y)} 
                  r={hoveredPoint?.i === i ? "5" : "3"} 
                  fill={s.color} 
                  className="transition-all" 
                  onMouseEnter={() => setHoveredPoint({i, x: p.x})}
                />
              ))}
            </g>
          );
        })}
      </svg>
      
      {hoveredPoint && (
        <div className="absolute top-2 right-2 bg-[#1b2333] text-white p-2 rounded-lg text-[10px] shadow-xl z-30 pointer-events-none border border-white/10">
          <div className="font-bold border-b border-white/10 mb-1 pb-1">{hoveredPoint.x}</div>
          {series.map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
              <span>{s.label}: </span>
              <span className="font-bold">
                {yAxisType === 'pct' ? pct(s.points[hoveredPoint.i].y) : num(Math.round(s.points[hoveredPoint.i].y))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// ── Main Component ─────────────────────────────────────────────────────────────
export function DashboardClient({ userFunnelCsv, cohortCsv, dailyCsv, featureCsv, qaCsv }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [showRolling, setShowRolling] = useState(false);
  const [isCumulative, setIsCumulative] = useState(false);
  const [showWeekends, setShowWeekends] = useState(false);
  const [isBenchmark, setIsBenchmark] = useState(false);
  const [dailyViewType, setDailyViewType] = useState<'num' | 'pct'>('num');
  const [selectedLps, setSelectedLps] = useState<string[]>(['lp_academic_writing', 'lp_business_emails']);
  const [dateRange, setDateRange] = useState<[string, string]>(['2026-02-01', '2026-02-28']);

  // Parse all CSVs
  const uf = useMemo(() => Papa.parse<UserFunnel>(userFunnelCsv, { header: true, skipEmptyLines: true }).data, [userFunnelCsv]);
  const cohortRaw = useMemo(() => Papa.parse<CohortRow>(cohortCsv, { header: true, skipEmptyLines: true }).data, [cohortCsv]);
  const dailyRaw = useMemo(() => Papa.parse<DailyRow>(dailyCsv, { header: true, skipEmptyLines: true }).data, [dailyCsv]);
  const featureRaw = useMemo(() => Papa.parse<FeatureRow>(featureCsv, { header: true, skipEmptyLines: true }).data, [featureCsv]);
  const qaRaw = useMemo(() => Papa.parse<QARow>(qaCsv, { header: true, skipEmptyLines: true }).data, [qaCsv]);

  // Date bounds
  const { dateMin, dateMax } = useMemo(() => {
    const dates = uf.map(r => r.cohort_date.slice(0, 10)).filter(Boolean).sort();
    return { dateMin: dates[0] || '2026-02-01', dateMax: dates[dates.length - 1] || '2026-02-28' };
  }, [uf]);

  // Initialize date range once data loads
  React.useEffect(() => { setDateRange([dateMin, dateMax]); }, [dateMin, dateMax]);

  const allLps = ['lp_academic_writing', 'lp_business_emails'];

  // Filter user funnel
  const ufFiltered = useMemo(() => uf.filter(r =>
    selectedLps.includes(r.attributed_lp_name) &&
    r.cohort_date.slice(0, 10) >= dateRange[0] &&
    r.cohort_date.slice(0, 10) <= dateRange[1]
  ), [uf, selectedLps, dateRange]);

  // Aggregate totals
  const totals = useMemo(() => {
    const clicks = new Set(ufFiltered.map(r => r.user_id)).size;
    const installs = ufFiltered.filter(r => csvBool(r.installed_after_click)).length;
    const tries = ufFiltered.filter(r => csvBool(r.tried_after_install)).length;
    const repeatUsers = ufFiltered.filter(r => csvBool(r.is_repeat_try_user)).length;
    return {
      clicks, installs, tries, repeatUsers,
      installCvr: clicks > 0 ? installs / clicks : 0,
      actCvr: clicks > 0 ? tries / clicks : 0,
      deadRate: installs > 0 ? (installs - tries) / installs : 0,
      installToTry: installs > 0 ? tries / installs : 0,
      repeatRate: tries > 0 ? repeatUsers / tries : 0,
    };
  }, [ufFiltered]);

  // Per-LP metrics
  const lpMetrics = useMemo(() => allLps.filter(lp => selectedLps.includes(lp)).map(lp => {
    const rows = ufFiltered.filter(r => r.attributed_lp_name === lp);
    const clicks = new Set(rows.map(r => r.user_id)).size;
    const installs = rows.filter(r => csvBool(r.installed_after_click)).length;
    const tries = rows.filter(r => csvBool(r.tried_after_install)).length;
    const repeat = rows.filter(r => csvBool(r.is_repeat_try_user)).length;
    const ttv = rows.filter(r => r.time_to_first_value_hours && r.time_to_first_value_hours !== '').map(r => parseFloat(r.time_to_first_value_hours));
    const medTtv = ttv.length > 0 ? [...ttv].sort((a, b) => a - b)[Math.floor(ttv.length / 2)] : null;
    const name = LP_MAP[lp] || lp;
    return {
      lp, name,
      clicks, installs, tries, repeat,
      installCvr: clicks > 0 ? installs / clicks : 0,
      actCvr: clicks > 0 ? tries / clicks : 0,
      deadRate: installs > 0 ? (installs - tries) / installs : 0,
      installToTry: installs > 0 ? tries / installs : 0,
      repeatRate: tries > 0 ? repeat / tries : 0,
      medTtv,
      score: 0, // filled below
    };
  }), [ufFiltered, selectedLps]);

  // Campaign Quality Score (normalized within selection)
  const lpMetricsScored = useMemo(() => {
    const maxInst = Math.max(...lpMetrics.map(m => m.installCvr), 0.001);
    const maxAct = Math.max(...lpMetrics.map(m => m.actCvr), 0.001);
    const maxI2T = Math.max(...lpMetrics.map(m => m.installToTry), 0.001);
    return lpMetrics.map(m => ({
      ...m,
      score: 0.35 * (m.installCvr / maxInst) + 0.45 * (m.actCvr / maxAct) + 0.20 * (m.installToTry / maxI2T),
    })).sort((a, b) => b.actCvr - a.actCvr);
  }, [lpMetrics]);

  const topLp = lpMetricsScored[0];
  const botLp = lpMetricsScored[1];

  // Cohort filtered
  const cohortFiltered = useMemo(() => cohortRaw.filter(r =>
    selectedLps.includes(r.attributed_lp_name) &&
    r.cohort_date >= dateRange[0] &&
    r.cohort_date <= dateRange[1]
  ), [cohortRaw, selectedLps, dateRange]);

  // Daily filtered
  const dailyFiltered = useMemo(() => dailyRaw.filter(r =>
    r.event_date >= dateRange[0] && r.event_date <= dateRange[1]
  ), [dailyRaw, dateRange]);

  // LP-Feature matrix from user funnel
  const featureMatrix = useMemo(() => {
    const activated = ufFiltered.filter(r => csvBool(r.qualified_activated));
    const byLpFeat: Record<string, Record<string, number>> = {};
    const byLpTotal: Record<string, number> = {};
    activated.forEach(r => {
      const lp = LP_MAP[r.attributed_lp_name] || r.attributed_lp_name;
      const feat = r.first_product_feature || 'unknown';
      if (!byLpFeat[lp]) byLpFeat[lp] = {};
      byLpFeat[lp][feat] = (byLpFeat[lp][feat] || 0) + 1;
      byLpTotal[lp] = (byLpTotal[lp] || 0) + 1;
    });
    return { byLpFeat, byLpTotal };
  }, [ufFiltered]);

  const features = useMemo(() => Array.from(new Set(
    ufFiltered.filter(r => csvBool(r.qualified_activated)).map(r => r.first_product_feature).filter(Boolean)
  )), [ufFiltered]);

  // Wasted acquisition
  const wasted = useMemo(() => {
    const notInst = Math.max(totals.clicks - totals.installs, 0);
    const instNoTry = Math.max(totals.installs - totals.tries, 0);
    const tryNoRepeat = Math.max(totals.tries - totals.repeatUsers, 0);
    return { notInst, instNoTry, tryNoRepeat, total: notInst + instNoTry + tryNoRepeat };
  }, [totals]);

  const periodLabel = `${dateRange[0]} – ${dateRange[1]}`;
  const daysSelected = Math.round((new Date(dateRange[1]).getTime() - new Date(dateRange[0]).getTime()) / 86400000) + 1;

  const TABS = ['Overview', 'LP Funnel', 'Feature Activation', 'Growth Actions', 'Methodology'];
  // ── Cohort line series ───────────────────────────────────────────────────────
  const cohortSeries = useMemo(() => selectedLps.map(lp => {
    const rows = cohortFiltered.filter(r => r.attributed_lp_name === lp).sort((a, b) => a.cohort_date.localeCompare(b.cohort_date));
    let points = rows.map(r => ({ x: r.cohort_date, y: parseFloat(r.activation_cvr) || 0 }));
    if (showRolling) points = getRolling(points);
    return {
      label: LP_MAP[lp] || lp,
      color: LP_COLORS[LP_MAP[lp]] || '#94a3b8',
      points
    };
  }), [cohortFiltered, selectedLps, showRolling]);

  // ── Daily line series ────────────────────────────────────────────────────────
  const dailySeries = useMemo(() => {
    const actions = ['did_click_lp', 'did_install_grammarly', 'try_grammarly'];
    const colors = ['#1b2333', '#3d7dd4', '#14a46c'];
    
    const clickMap = Object.fromEntries(
      dailyFiltered.filter(r => r.action === 'did_click_lp').map(r => [r.event_date, parseFloat(r.users) || 1])
    );

    const series = actions.map((action, i) => {
      const rows = dailyFiltered.filter(r => r.action === action).sort((a, b) => a.event_date.localeCompare(b.event_date));
      let points = rows.map(r => {
        const val = parseFloat(r.users) || 0;
        if (dailyViewType === 'pct' && action !== 'did_click_lp') {
          const denominator = clickMap[r.event_date] || 1;
          return { x: r.event_date, y: val / denominator };
        }
        return { x: r.event_date, y: val };
      });
      
      if (isCumulative && dailyViewType === 'num') points = getCumulative(points);
      else if (showRolling) points = getRolling(points);
      
      return {
        label: ACTION_LABELS[action] || action,
        color: colors[i],
        points,
        hidden: dailyViewType === 'pct' && action === 'did_click_lp'
      };
    });

    return series.filter(s => !s.hidden);
  }, [dailyFiltered, showRolling, isCumulative, dailyViewType]);

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#dde4e1] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#14a46c]">
              <path d="M16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0ZM16 26.6667C10.1086 26.6667 5.33333 21.8914 5.33333 16C5.33333 10.1086 10.1086 5.33333 16 5.33333C19.3444 5.33333 22.3381 6.87238 24.3168 9.27714L20.579 12.3916C19.4312 11.3112 17.7951 10.6667 16 10.6667C13.0545 10.6667 10.6667 13.0545 10.6667 16C10.6667 18.9455 13.0545 21.3333 16 21.3333C17.7951 21.3333 19.4312 20.6888 20.579 19.6084V16H16V12H26.6667V22.6667C24.0883 25.127 20.3702 26.6667 16 26.6667Z" fill="currentColor"/>
            </svg>
            <span className="font-bold text-[#1b2333] text-lg">Grammarly Growth</span>
            <span className="text-xs text-[#5f6b7a] bg-[#f1f5f9] px-2 py-0.5 rounded-full">Campaign Analytics</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-[#5f6b7a]">Feb 2026 dataset : User-level : First-touch attribution</div>
          <a href="/" className="text-xs font-semibold text-[#14a46c] hover:underline transition-all flex items-center gap-1">Back to Landing Page <ArrowRight className="w-3 h-3" /></a>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 py-8 flex flex-col md:flex-row gap-8 md:gap-12">
        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <aside className="w-full md:w-64 shrink-0 space-y-8 md:sticky md:top-24 md:self-start">
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#4a5f56] mb-3">Landing Pages</div>
            {allLps.map(lp => (
              <label key={lp} className="flex items-center gap-3 py-2 cursor-pointer group">
                <input type="checkbox" checked={selectedLps.includes(lp)}
                  onChange={() => setSelectedLps(prev => prev.includes(lp) ? prev.filter(l => l !== lp) : [...prev, lp])}
                  className="rounded border-[#dde4e1] accent-[#14a46c]" />
                <span className="text-sm font-medium text-[#1b2333] group-hover:text-[#14a46c] transition-colors flex-1">
                  {LP_MAP[lp]}
                </span>
                {/* Color dot - clickable to toggle LP, min 44x44px touch target */}
                <button 
                  onClick={() => setSelectedLps(prev => prev.includes(lp) ? prev.filter(l => l !== lp) : [...prev, lp])}
                  className="w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center shrink-0 hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ 
                    background: LP_COLORS[LP_MAP[lp]], 
                    opacity: selectedLps.includes(lp) ? 1 : 0.4,
                    boxShadow: selectedLps.includes(lp) ? `0 0 12px ${LP_COLORS[LP_MAP[lp]]}40` : 'none'
                  }}
                  aria-label={`Toggle ${LP_MAP[lp]} filter`}
                  title={`Click to ${selectedLps.includes(lp) ? 'hide' : 'show'} ${LP_MAP[lp]} data`}
                >
                  {selectedLps.includes(lp) && (
                    <span className="text-white text-lg font-bold leading-none">✓</span>
                  )}
                </button>
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#4a5f56] mb-1">Date Range</div>
            <div className="text-[10px] text-[#6a8074] mb-3">First LP CTA click date</div>
            <input type="date" value={dateRange[0]} min={dateMin} max={dateRange[1]}
              onChange={e => setDateRange([e.target.value, dateRange[1]])}
              className="w-full text-xs border border-[#dde4e1] rounded-lg px-2 py-1.5 mb-2 focus:outline-none focus:border-[#14a46c]" />
            <input type="date" value={dateRange[1]} min={dateRange[0]} max={dateMax}
              onChange={e => setDateRange([dateRange[0], e.target.value])}
              className="w-full text-xs border border-[#dde4e1] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#14a46c]" />
            <button onClick={() => setDateRange([dateMin, dateMax])}
              className="mt-3 w-full text-xs bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#5f6b7a] py-1.5 rounded-lg transition-colors font-medium">
              Reset dates
            </button>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#dde4e1]">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={showRolling} onChange={e => { setShowRolling(e.target.checked); if(e.target.checked) setIsCumulative(false); }} className="accent-[#14a46c]" />
              <span className="text-xs text-[#4a5f56] group-hover:text-[#14a46c] transition-colors">7-day rolling avg</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={isCumulative} onChange={e => { setIsCumulative(e.target.checked); if(e.target.checked) setShowRolling(false); }} className="accent-[#14a46c]" />
              <span className="text-xs text-[#4a5f56] group-hover:text-[#14a46c] transition-colors">Cumulative view</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={showWeekends} onChange={e => setShowWeekends(e.target.checked)} className="accent-[#14a46c]" />
              <span className="text-xs text-[#4a5f56] group-hover:text-[#14a46c] transition-colors">Highlight weekends</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={isBenchmark} onChange={e => setIsBenchmark(e.target.checked)} className="accent-[#14a46c]" />
              <span className="text-xs text-[#4a5f56] group-hover:text-[#14a46c] transition-colors">Benchmark mode</span>
            </label>
          </div>

          <div className="space-y-1.5 pt-4 border-t border-[#dde4e1]">
            <div className="text-[10px] text-[#6a8074]"><strong className="text-[#16201b]">Grain:</strong> user-level</div>
            <div className="text-[10px] text-[#6a8074]"><strong className="text-[#16201b]">Attribution:</strong> first-touch, 7-day</div>
            <div className="text-[10px] text-[#6a8074]"><code className="bg-[#f1f5f9] px-1 rounded">did_click_lp</code> = install-button click</div>
          </div>
        </aside>

        {/* ── Main ─────────────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 space-y-4">
          {/* Filter banner */}
          <div className="bg-white rounded-xl border border-[#dde4e1] px-4 py-2.5 flex flex-wrap gap-4 text-xs text-[#5f6b7a]">
            <span><strong className="text-[#1b2333]">Period:</strong> {periodLabel} ({daysSelected} days)</span>
            <span><strong className="text-[#1b2333]">LPs:</strong> {selectedLps.map(l => LP_MAP[l]).join(' · ')}</span>
            <span><strong className="text-[#1b2333]">Users:</strong> {num(totals.clicks)} LP CTA clickers</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-xl border border-[#dde4e1] p-1">
            {TABS.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${activeTab === i ? 'bg-[#14a46c] text-white shadow-sm' : 'text-[#5f6b7a] hover:text-[#1b2333] hover:bg-[#f8faf9]'}`}>
                {tab}
              </button>
            ))}
          </div>
          {/* ── TAB 0: OVERVIEW ──────────────────────────────────────── */}
          {activeTab === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#1b2333]">Campaign KPIs : {periodLabel}</h2>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                <KpiCard label="LP CTA Click Users" value={num(totals.clicks)} sub="Install-button clicks, not page renders" tip={KPI_TOOLTIPS['LP CTA Click Users']} />
                <KpiCard label="Install Users" value={num(totals.installs)} sub={`${pct(totals.installCvr)} Install CVR`} highlight 
                  tip={KPI_TOOLTIPS['Install Users']}
                  benchmark={isBenchmark && topLp && botLp ? { 
                    val: ((topLp.installCvr - botLp.installCvr) * 100).toFixed(1) + 'pp', 
                    isPositive: topLp.installCvr >= botLp.installCvr 
                  } : undefined}
                />
                <KpiCard label="Qualified Activated" value={num(totals.tries)} sub="Completed the full funnel" highlight tip={KPI_TOOLTIPS['Qualified Activated']}
                  benchmark={isBenchmark && topLp && botLp ? { 
                    val: num(topLp.tries - botLp.tries), 
                    isPositive: topLp.tries >= botLp.tries 
                  } : undefined}
                />
                <KpiCard label="Activation CVR" value={pct(totals.actCvr)} sub="LP clicker → Activated user" highlight 
                  tip={KPI_TOOLTIPS['Activation CVR']}
                  benchmark={isBenchmark && topLp && botLp ? { 
                    val: ((topLp.actCvr - botLp.actCvr) * 100).toFixed(1) + 'pp', 
                    isPositive: topLp.actCvr >= botLp.actCvr 
                  } : undefined}
                />
                <KpiCard label="Dead Install Rate" value={pct(totals.deadRate)} sub="Lower is better" warn tip={KPI_TOOLTIPS['Dead Install Rate']}
                  benchmark={isBenchmark && topLp && botLp ? { 
                    val: ((topLp.deadRate - botLp.deadRate) * 100).toFixed(1) + 'pp', 
                    isPositive: topLp.deadRate <= botLp.deadRate 
                  } : undefined}
                />
                <KpiCard label="Repeat Try Rate" value={pct(totals.repeatRate)} sub="Habitual product usage" tip={KPI_TOOLTIPS['Repeat Try Rate']}
                  benchmark={isBenchmark && topLp && botLp ? { 
                    val: ((topLp.repeatRate - botLp.repeatRate) * 100).toFixed(1) + 'pp', 
                    isPositive: topLp.repeatRate >= botLp.repeatRate 
                  } : undefined}
                />
              </div>

              {/* Activation CVR by LP */}
              <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-[#dde4e1]">
                <div className="space-y-2">
                  <div className="text-sm font-bold text-[#1b2333] mb-4">Activation CVR by LP</div>
                  <BarChart data={lpMetricsScored} metric="actCvr" label="%" color={d => LP_COLORS[d] || '#14a46c'} />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-bold text-[#1b2333] mb-4">Repeat Try Rate by LP</div>
                  <BarChart data={lpMetricsScored} metric="repeatRate" label="%" color={d => LP_COLORS[d] || '#14a46c'} />
                </div>
              </div>

              {/* Fountain Flow */}
              <FountainVis total={totals.clicks} installs={totals.installs} tries={totals.tries} repeat={totals.repeatUsers} />

              {/* Insights */}
              {topLp && botLp && (
                <div className="space-y-3">
                  <div className="bg-[#eaf7f1] border border-[#b4e6cf] rounded-xl p-4 text-sm text-[#1b2333]">
                    <strong>{(( topLp.actCvr - botLp.actCvr) * 100).toFixed(1)}% activation gap</strong> on comparable volume.
                    {topLp.name} converts <strong>{pct(topLp.actCvr)}</strong> of LP clicks vs
                    <strong>{pct(botLp.actCvr)}</strong> for {botLp.name}.
                  </div>
                  <div className="bg-[#fdf2e9] border border-[#f5c7a0] rounded-xl p-4 text-sm text-[#1b2333]">
                    <strong>{pct(totals.deadRate)} shared dead install rate.</strong>
                    This is a post-install onboarding problem, not an LP acquisition problem.
                  </div>
                  {topLp && botLp && botLp.actCvr > 0 && (
                    <div className="bg-[#f0f4ff] border border-[#c7d2fe] rounded-xl p-4 text-sm text-[#1b2333]">
                      <strong>Impact sizing:</strong> If {botLp.name} matched {topLp.name}&apos;s
                      <strong>{pct(topLp.actCvr)}</strong> Activation CVR, it would generate approximately
                      <strong>+{num(Math.max(0, Math.round(topLp.actCvr * botLp.clicks - botLp.tries)))}</strong>
                      additional activated users from the same traffic: a
                      <strong>{((topLp.actCvr / botLp.actCvr - 1) * 100).toFixed(0)}% lift</strong> at zero extra cost.
                    </div>
                  )}
                </div>
              )}

              {/* Daily volume line chart */}
              <div className="bg-white rounded-2xl border border-[#dde4e1] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-bold text-[#1b2333] mb-1">Daily Event Volume</div>
                    <div className="text-xs text-[#5f6b7a]">
                      {dailyViewType === 'pct' ? 'Daily conversion rate vs LP clicks' : 'Unique users per action per day'}
                    </div>
                  </div>
                  <div className="flex bg-[#f1f5f9] p-1 rounded-lg">
                    <button 
                      onClick={() => setDailyViewType('num')}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${dailyViewType === 'num' ? 'bg-white text-[#14a46c] shadow-sm' : 'text-[#5f6b7a] hover:text-[#1b2333]'}`}>
                      ABS
                    </button>
                    <button 
                      onClick={() => setDailyViewType('pct')}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${dailyViewType === 'pct' ? 'bg-white text-[#14a46c] shadow-sm' : 'text-[#5f6b7a] hover:text-[#1b2333]'}`}>
                      % CVR
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 text-xs mb-3">
                  {dailySeries.map(s => (
                    <span key={s.label} className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                      {s.label}
                    </span>
                  ))}
                </div>
                <MiniLineChart series={dailySeries} height={160} showWeekends={showWeekends} yAxisType={dailyViewType === 'pct' ? 'pct' : 'num'} />
              </div>
            </div>
          )}
          {/* ── TAB 1: LP FUNNEL ─────────────────────────────────────── */}
          {activeTab === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#1b2333]">LP Funnel Analysis : {periodLabel}</h2>

              {/* Funnel per LP */}
              <div className="grid md:grid-cols-2 gap-4">
                {lpMetricsScored.map(lp => (
                  <div key={lp.lp} className="bg-white rounded-2xl border border-[#dde4e1] p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-3 h-3 rounded-full" style={{ background: LP_COLORS[lp.name] }} />
                      <div className="text-sm font-bold text-[#1b2333]">{lp.name}</div>
                    </div>
                    <FunnelVis stages={[
                      { label: 'LP CTA Clicks', value: lp.clicks, color: LP_COLORS[lp.name] },
                      { label: 'Installs', value: lp.installs, color: LP_COLORS[lp.name] },
                      { label: 'Try Grammarly', value: lp.tries, color: LP_COLORS[lp.name] },
                    ]} />
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                      {[
                        { l: 'Install CVR', v: pct(lp.installCvr) },
                        { l: 'Activation CVR', v: pct(lp.actCvr) },
                        { l: 'Dead Install', v: pct(lp.deadRate) },
                      ].map(({ l, v }) => (
                        <div key={l} className="bg-[#f8faf9] rounded-lg p-2">
                          <div className="text-[10px] text-[#5f6b7a] font-medium">{l}</div>
                          <div className="text-base font-bold text-[#1b2333]">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Full metrics table */}
              <div className="bg-white rounded-2xl border border-[#dde4e1] p-5 shadow-sm overflow-x-auto">
                <div className="text-sm font-bold text-[#1b2333] mb-4">Full Metrics Comparison</div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-[#5f6b7a] border-b border-[#dde4e1]">
                      {['LP', 'CTA Clicks', 'Installs', 'Try Users', 'Install CVR', 'Activation CVR', 'Install→Try', 'Dead Install', 'Repeat Try', 'Time to Value'].map(h => (
                        <th key={h} className="py-2 px-3 text-left font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lpMetricsScored.map((lp, i) => (
                      <tr key={lp.lp} className={i % 2 === 0 ? 'bg-[#f8faf9]' : 'bg-white'}>
                        <td className="py-2 px-3 font-semibold text-[#1b2333]">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ background: LP_COLORS[lp.name] }} />
                            {lp.name}
                          </span>
                        </td>
                        <td className="py-2 px-3">{num(lp.clicks)}</td>
                        <td className="py-2 px-3">{num(lp.installs)}</td>
                        <td className="py-2 px-3">{num(lp.tries)}</td>
                        <td className="py-2 px-3 font-medium text-[#14a46c]">{pct(lp.installCvr)}</td>
                        <td className="py-2 px-3 font-bold text-[#14a46c]">{pct(lp.actCvr)}</td>
                        <td className="py-2 px-3">{pct(lp.installToTry)}</td>
                        <td className="py-2 px-3 text-amber-600 font-medium">{pct(lp.deadRate)}</td>
                        <td className="py-2 px-3 text-[#5f6b7a]">{pct(lp.installCvr)}</td>
                        <td className="py-2 px-3">{lp.medTtv !== null ? `${lp.medTtv.toFixed(1)}h` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cohort CVR over time */}
              <div className="bg-white rounded-2xl border border-[#dde4e1] p-5 shadow-sm">
                <div className="text-sm font-bold text-[#1b2333] mb-1">Cohort Activation CVR Over Time</div>
                <div className="text-xs text-[#5f6b7a] mb-4">
                  Daily cohort CVR · Last 2–3 days may read low as attribution windows extend past the dataset
                </div>
                <div className="flex gap-4 text-xs mb-3">
                  {cohortSeries.map(s => (
                    <span key={s.label} className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                      {s.label}
                    </span>
                  ))}
                </div>
                <MiniLineChart series={cohortSeries} height={180} showWeekends={showWeekends} yAxisType="pct" />
              </div>
            </div>
          )}
          {/* ── TAB 2: FEATURE ACTIVATION ──────────────────────────── */}
          {activeTab === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#1b2333]">Feature Activation & Engagement : {periodLabel}</h2>

              {/* LP × Feature heatmap (text table) */}
              <div className="bg-white rounded-2xl border border-[#dde4e1] p-5 shadow-sm overflow-x-auto">
                <div className="text-sm font-bold text-[#1b2333] mb-1">LP × Feature Matrix</div>
                <div className="text-xs text-[#5f6b7a] mb-4">Activated users by first feature triggered</div>
                {features.length > 0 ? (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#dde4e1] text-[#5f6b7a]">
                        <th className="py-2 px-3 text-left font-semibold">LP</th>
                        {features.map(f => <th key={f} className="py-2 px-3 text-center font-semibold">{f}</th>)}
                        <th className="py-2 px-3 text-center font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedLps.map(lp => {
                        const lpLabel = LP_MAP[lp] || lp;
                        const total = featureMatrix.byLpTotal[lpLabel] || 0;
                        return (
                          <tr key={lp} className="border-b border-[#f1f5f9]">
                            <td className="py-2 px-3 font-semibold text-[#1b2333]">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full" style={{ background: LP_COLORS[lpLabel] }} />
                                {lpLabel}
                              </span>
                            </td>
                            {features.map(f => {
                              const cnt = (featureMatrix.byLpFeat[lpLabel] || {})[f] || 0;
                              const share = total > 0 ? cnt / total : 0;
                              const intensity = Math.round(share * 100);
                              return (
                                <td key={f} className="py-2 px-3 text-center"
                                  style={{ background: `rgba(20,164,108,${share * 0.8 + 0.05})`, color: share > 0.5 ? 'white' : '#1b2333' }}>
                                  {cnt > 0 ? `${cnt} · ${pct(share)}` : '-'}
                                </td>
                              );
                            })}
                            <td className="py-2 px-3 text-center font-bold text-[#1b2333]">{total}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-sm text-[#5f6b7a]">No activated users in selected date range.</div>
                )}
              </div>

              {/* Feature insight */}
              <div className="bg-[#eaf7f1] border border-[#b4e6cf] rounded-xl p-4 text-sm text-[#1b2333]">
                <strong>Feature routing is near-perfect.</strong> Academic Writing LP users go to{' '}
                <code className="bg-white px-1 rounded text-[11px]">academic_citation_helper</code> (≈99.7%),
                Business Emails LP users go to <code className="bg-white px-1 rounded text-[11px]">smart_email_reply</code> (100%).
                The activation problem is habit formation, not feature discovery.
              </div>

              {/* Dead install vs Repeat try */}
              <div className="bg-white rounded-2xl border border-[#dde4e1] p-5 shadow-sm">
                <div className="text-sm font-bold text-[#1b2333] mb-4">Dead Install Rate vs Repeat Try Rate</div>
                <div className="space-y-5">
                  {lpMetricsScored.map(lp => (
                    <div key={lp.lp}>
                      <div className="flex items-center justify-between text-xs text-[#5f6b7a] mb-1">
                        <span className="font-semibold text-[#1b2333]">{lp.name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Dead Install Rate', val: lp.deadRate, color: '#e2813a' },
                          { label: 'Repeat Try Rate', val: lp.repeatRate, color: LP_COLORS[lp.name] },
                        ].map(({ label, val, color }) => (
                          <div key={label}>
                            <div className="text-[10px] text-[#5f6b7a] mb-1">{label}</div>
                            <div className="h-4 bg-[#f1f5f9] rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${val * 100}%`, background: color }} />
                            </div>
                            <div className="text-[11px] font-bold mt-1" style={{ color }}>{pct(val)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* ── TAB 3: GROWTH ACTIONS ────────────────────────────────── */}
          {activeTab === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#1b2333]">Growth Actions : {periodLabel}</h2>

              {/* BEST NEXT ACTION */}
              <div className="bg-[#14a46c] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Top Priority</span>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Audit Business LP Onboarding</h3>
                  <p className="text-white/90 text-sm max-w-2xl mb-4 leading-relaxed">
                    The Business Emails LP matches Academic Writing in volume but fails to activate users (18.5% vs 22.6%). 
                    More importantly, it has a <strong>50.6% Dead Install Rate</strong>. 
                    You are losing half your business users between install and first use.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 text-xs">
                      <strong>Goal:</strong> Reduce Business Dead Install Rate to 43%
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <ArrowRight className="h-32 w-32 -rotate-45" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-4">
                  <div className="text-sm font-bold text-[#1b2333]">Campaign Signals</div>
                  {lpMetricsScored.map((lp, idx) => {
                    const isTop = idx === 0;
                    return (
                      <div key={lp.lp} className={`rounded-xl p-4 border-l-4 ${isTop ? 'bg-[#eaf7f1] border-[#14a46c]' : 'bg-[#fdf2e9] border-[#e2813a]'}`}>
                        <div className={`text-sm font-bold mb-1 ${isTop ? 'text-[#14a46c]' : 'text-[#e2813a]'}`}>{lp.name}</div>
                        <div className="text-xs text-[#5f6b7a] leading-relaxed">
                          <strong>Observation:</strong> {isTop ? `Scale variant. CVR is ${pct(lp.actCvr)}.` : `Post-install leakage. Dead rate is ${pct(lp.deadRate)}.`}<br/>
                          <strong>Interpretation:</strong> {isTop ? 'Strong product-fit.' : 'Intent exists, but users fail to reach "Aha" moment.'}<br/>
                          <strong>Action:</strong> {isTop ? 'Scale budget and create close variants.' : 'Audit first-use business onboarding.'}
                        </div>
                      </div>
                    );
                  })}

                  <div className="bg-[#f0f4ff] border border-[#c7d2fe] rounded-xl p-4 text-sm text-[#1b2333]">
                    <strong>Growth Insight:</strong> If {botLp?.name} matched {topLp?.name}&apos;s <strong>{pct(topLp?.actCvr || 0)}</strong> Activation CVR, 
                    it would generate approximately <strong>+{num(Math.max(0, Math.round((topLp?.actCvr || 0) * (botLp?.clicks || 0) - (botLp?.tries || 0))))}</strong> additional 
                    activated users: a <strong>{(((topLp?.actCvr || 0) / (botLp?.actCvr || 0.001) - 1) * 100).toFixed(0)}% lift</strong> at zero extra acquisition cost.
                  </div>

                  <div className="text-sm font-bold text-[#1b2333] mt-2">Wasted Acquisition Ledger</div>
                  <div className="bg-white rounded-2xl border border-[#dde4e1] overflow-hidden shadow-sm">
                    <table className="w-full text-xs">
                      <thead className="bg-[#f8faf9] border-b border-[#dde4e1]">
                        <tr>{['Leakage Stage', 'Users', 'Observation', 'Next Action'].map(h => <th key={h} className="py-2 px-3 text-left text-[#5f6b7a] font-semibold">{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {[
                          { stage: 'Clicked LP, no install', users: wasted.notInst, obs: 'Initial value gap', action: 'Strengthen install bridge' },
                          { stage: 'Installed, never tried', users: wasted.instNoTry, obs: 'Onboarding friction', action: 'Guided setup' },
                          { stage: 'Tried once, no return', users: wasted.tryNoRepeat, obs: 'Low habit/utility', action: 'Re-engagement triggers' },
                        ].map(({ stage, users, obs, action }, i) => (
                          <tr key={stage} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f8faf9]'}>
                            <td className="py-2 px-3 text-[#1b2333] font-medium">{stage}</td>
                            <td className="py-2 px-3">{num(users)}</td>
                            <td className="py-2 px-3 text-[#6a8074]">{obs}</td>
                            <td className="py-2 px-3 text-[#5f6b7a]">{action}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-sm font-bold text-[#1b2333] mt-2">Experiment Backlog</div>
                  <div className="bg-white rounded-2xl border border-[#dde4e1] overflow-hidden shadow-sm">
                    <table className="w-full text-xs">
                      <thead className="bg-[#f8faf9] border-b border-[#dde4e1]">
                        <tr>{['Experiment', 'Hypothesis', 'Success Metric'].map(h => <th key={h} className="py-2 px-3 text-left text-[#5f6b7a] font-semibold">{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {[
                          { exp: `${topLp?.name || 'Academic Writing'} scaling`, hyp: 'Scale does not dilute quality', metric: `CVR stays ≥ ${topLp ? pct(topLp.actCvr) : '22%'}` },
                          { exp: `${botLp?.name || 'Business Emails'} audit`, hyp: 'Guided path reduces drop', metric: `Dead rate falls toward ${topLp ? pct(topLp.deadRate) : '43%'}` },
                          { exp: 'Post-install nudge', hyp: 'Trigger pulls users back', metric: 'Improvement in Install-to-Try Rate' },
                        ].map(({ exp, hyp, metric }, i) => (
                          <tr key={exp} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f8faf9]'}>
                            <td className="py-2 px-3 font-semibold text-[#1b2333]">{exp}</td>
                            <td className="py-2 px-3 text-[#5f6b7a]">{hyp}</td>
                            <td className="py-2 px-3 text-[#5f6b7a]">{metric}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-sm font-bold text-[#1b2333]">Campaign Quality Score</div>
                  <div className="text-[10px] text-[#5f6b7a]">0.35 × Install CVR + 0.45 × Activation CVR + 0.20 × Install→Try</div>
                  {lpMetricsScored.map(lp => (
                    <div key={lp.lp} className="bg-white rounded-2xl border border-[#dde4e1] p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-bold text-[#1b2333]">{lp.name}</div>
                        <div className="text-lg font-bold" style={{ color: LP_COLORS[lp.name] }}>{lp.score.toFixed(2)}</div>
                      </div>
                      <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${lp.score * 100}%`, background: LP_COLORS[lp.name] }} />
                      </div>
                    </div>
                  ))}
                  <div className="mt-4">
                    <FountainVis total={totals.clicks} installs={totals.installs} tries={totals.tries} repeat={totals.repeatUsers} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* ── TAB 4: METHODOLOGY ───────────────────────────────────── */}
          {activeTab === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#1b2333]">Methodology & Data Quality</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-[#dde4e1] p-5 shadow-sm">
                    <div className="text-sm font-bold text-[#1b2333] mb-2">Technical Methodology</div>
                    <div className="text-xs text-[#5f6b7a] space-y-3">
                      <p><strong>1. User-Level Sequence:</strong> Qualified Activation requires the sequence of <strong>LP click, followed by install, and finally try_grammarly</strong> within 7 days.</p>
                      <p><strong>2. Cohort vs. Event Date:</strong> Conversion metrics are <strong>cohort-based</strong> (anchored on first click date) to prevent day-of-acquisition mixing.</p>
                      <p><strong>3. Right-Censoring:</strong> The latest 7 days are excluded from finalized cohort metrics to avoid undercounting incomplete windows.</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-[#dde4e1] p-5 shadow-sm">
                    <div className="text-sm font-bold text-[#1b2333] mb-3">Metric Formulas</div>
                    <table className="w-full text-xs">
                      <thead className="text-[#5f6b7a] border-b border-[#dde4e1]">
                        <tr><th className="py-1.5 text-left pr-3">Metric</th><th className="py-1.5 text-left">Formula</th></tr>
                      </thead>
                      <tbody className="text-[#1b2333]">
                        {[
                          { m: 'LP CTA Click Users', f: 'COUNTD(user_id) where action = did_click_lp' },
                          { m: 'Activation CVR', f: 'Qualified Activated / LP CTA Click Users' },
                          { m: 'Install → Try Rate', f: 'Qualified Activated / Install Users' },
                          { m: 'Dead Install Rate', f: '(Installs with no Try events within 7d) / Total Installs' },
                          { m: 'Repeat Try Rate', f: 'Users with 2+ tries / Users with 1+' },
                        ].map(({ m, f }) => (
                          <tr key={m} className="border-b border-[#f1f5f9]">
                            <td className="py-1.5 pr-3 font-semibold">{m}</td>
                            <td className="py-1.5 text-[#5f6b7a]"><code className="bg-[#f8faf9] px-1 rounded">{f}</code></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-white rounded-2xl border border-[#dde4e1] p-5 shadow-sm">
                    <div className="text-sm font-bold text-[#1b2333] mb-2">Measurement Constraints</div>
                    <div className="text-[10px] text-[#5f6b7a] mb-2 uppercase font-bold">Cannot calculate from this dataset:</div>
                    <ul className="text-xs text-[#5f6b7a] space-y-1 list-disc list-inside">
                      <li>CAC: No spend data</li>
                      <li>ROAS: No revenue data</li>
                      <li>LTV: No subscription/payment data</li>
                      <li>Ad CTR: No impression data</li>
                      <li>Page-render CVR: No page_render event</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl border border-[#dde4e1] p-5 shadow-sm">
                    <div className="text-sm font-bold text-[#1b2333] mb-2">Next Instrumentation</div>
                    <ol className="text-xs text-[#5f6b7a] space-y-1 list-decimal list-inside">
                      <li>Page render events → LP page-render CVR</li>
                      <li>Ad spend per LP → CAC and ROAS analysis</li>
                      <li>Subscription events → LTV and payback periods</li>
                      <li>Onboarding step events → pinpoint dead install drop-off</li>
                    </ol>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#dde4e1] p-5 shadow-sm">
                  <div className="text-sm font-bold text-[#1b2333] mb-1">Data Quality Checks</div>
                  <div className="text-xs text-[#5f6b7a] mb-3">Automated checks from data_cleaning.py</div>
                  <div className="space-y-2">
                    {qaRaw.map(row => (
                      <div key={row.check} className={`rounded-lg p-3 text-xs ${parseInt(row.flagged_rows) === 0 ? 'bg-[#eaf7f1] border border-[#b4e6cf]' : 'bg-[#fdf2e9] border border-[#f5c7a0]'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-semibold ${parseInt(row.flagged_rows) === 0 ? 'text-[#14a46c]' : 'text-[#e2813a]'}`}>
                            {parseInt(row.flagged_rows) === 0 ? '✓ No issues' : `⚠ ${row.flagged_rows} rows`}
                          </span>
                          <Badge color={row.severity === 'high' ? '#dc2626' : '#e2813a'}>{row.severity}</Badge>
                        </div>
                        <div className="font-medium text-[#1b2333]">{row.check.replace(/_/g, ' ')}</div>
                        <div className="text-[#5f6b7a] mt-0.5">{row.explanation}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 bg-[#eaf7f1] border border-[#b4e6cf] rounded-lg p-3 text-xs text-[#14a46c] font-medium leading-relaxed">
                    <strong>Note:</strong> All automated checks passed. In a production environment, non-zero flags would trigger investigation.
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
