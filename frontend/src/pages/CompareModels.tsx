import React, { useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  Scale,
  Shuffle,
  MapPin,
  Target,
  Trophy,
  AlertTriangle,
  TrendingUp,
  BarChart2,
  Activity,
  CheckCircle2,
} from "lucide-react";
import SidebarContent from "../components/Sidebarcontent";

// ── API ──
const API_URL = import.meta.env.VITE_MODEL_COMPARISON_API;

// ── Types ──
interface ModelStat {
  model: string;
  train_r2: number;
  test_r2: number;
  mae_lakhs: number;
  rmse_lakhs: number;
  overfit_gap: number;
}
interface AvpPoint {
  actual: number;
  predicted: number;
}
interface ComparisonData {
  comparison: ModelStat[];
  actual_vs_predicted: Record<string, AvpPoint[]>;
}

// ── Fetch hook ──
function useComparisonData() {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const c = new AbortController();
    setLoading(true);
    setError(null);
    fetch(API_URL, { signal: c.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((j: ComparisonData) => {
        setData(j);
        setLoading(false);
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setError(e.message);
        setLoading(false);
      });
    return () => c.abort();
  }, [retry]);

  return { data, loading, error, refetch: () => setRetry((r) => r + 1) };
}

// ── Formatters ──
const fmtP = (v: number) =>
  v >= 100 ? `₹${(v / 100).toFixed(2)}Cr` : `₹${v.toFixed(1)}L`;
const fmtPs = (v: number) =>
  v >= 100 ? `₹${(v / 100).toFixed(1)}Cr` : `₹${v.toFixed(0)}L`;
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

// Winner score: 60% test accuracy + 40% generalisation
const modelScore = (m: ModelStat) =>
  m.test_r2 * 0.6 + Math.max(0, 1 - m.overfit_gap * 8) * 0.4;

// ── Design tokens ──
const ACCENT = "#5b6ea8",
  ACC2 = "#7b8fc4",
  ACCS = "#e8eaf6";
const TEAL = "#0d9488",
  AMBER = "#d97706",
  ROSE = "#e11d48";
const EMERALD = "#059669";
const BG = "#f0f2f8",
  CARD = "#ffffff",
  BOR = "#e2e8f0";
const TXT = "#1e293b",
  MUT = "#64748b",
  DIM = "#94a3b8";

const MODEL_META: Record<string, { color: string; short: string; bg: string }> =
  {
    "Linear Regression": { color: AMBER, short: "LR", bg: "#fffbeb" },
    "Random Forest": { color: TEAL, short: "RF", bg: "#ecfdf5" },
    XGBoost: { color: ACCENT, short: "XGB", bg: "#eef0fa" },
  };

const tip: React.CSSProperties = {
  background: "#1e293b",
  border: "none",
  borderRadius: 8,
  color: "#f1f5f9",
  fontSize: 12,
  padding: "8px 12px",
};

const METRIC_LABELS: Record<string, string> = {
  train_r2: "Train R²",
  test_r2: "Test R²",
  mae_lakhs: "MAE",
  rmse_lakhs: "RMSE",
  overfit_gap: "Overfit Gap",
};

const isBest = (metric: keyof ModelStat, value: number, all: ModelStat[]) => {
  const vals = all.map((m) => m[metric] as number);
  return metric === "mae_lakhs" ||
    metric === "rmse_lakhs" ||
    metric === "overfit_gap"
    ? value === Math.min(...vals)
    : value === Math.max(...vals);
};

const INSIGHTS: {
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  color: string;
  bg: string;
  title: string;
  desc: string;
}[] = [
  {
    Icon: Scale,
    color: "#5b6ea8",
    bg: "#eef0fa",
    title: "Lowest overfit gap",
    desc: "XGBoost's L1/L2 regularisation prevents memorising training data. A gap of 0.015 vs RF's 0.061 means consistent results on truly new listings.",
  },
  {
    Icon: Shuffle,
    color: "#0d9488",
    bg: "#ecfdf5",
    title: "Captures non-linearity",
    desc: "Price doesn't scale linearly with area. A 3000 sqft flat isn't 3× a 1000 sqft flat. XGBoost models these curves; Linear Regression can't.",
  },
  {
    Icon: MapPin,
    color: "#d97706",
    bg: "#fffbeb",
    title: "Locality interactions",
    desc: "Same area, very different price in Shela vs Bodakdev. XGBoost learns these joint feature patterns that pure tree ensembles handle best.",
  },
  {
    Icon: Target,
    color: "#7c3aed",
    bg: "#f5f3ff",
    title: "Sequential error correction",
    desc: "Each boosting round targets the properties the previous round got wrong — tightening predictions on outliers and high-value flats.",
  },
];

// ── Loading / Error shells ──
const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen bg-white font-sans overflow-hidden">
    <aside className="hidden lg:flex w-[220px] min-w-[220px] bg-white border-r border-gray-100 flex-col py-6 shadow-sm z-30">
      <SidebarContent />
    </aside>
    <main className="flex-1 flex items-center justify-center bg-[#f0f2f8]">
      {children}
    </main>
  </div>
);

// ════════════════════════════════════════════════════════
const CompareModels: React.FC = () => {
  const { data, loading, error, refetch } = useComparisonData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModel, setActiveModel] = useState<string>("XGBoost");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isSmall = isMobile || isTablet;

  // ── Loading ──
  if (loading)
    return (
      <Shell>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: `3px solid ${ACCS}`,
              borderTop: `3px solid ${ACCENT}`,
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          <div style={{ fontSize: 14, color: MUT }}>Comparing models…</div>
        </div>
      </Shell>
    );

  // ── Error ──
  if (error)
    return (
      <Shell>
        <div style={{ textAlign: "center", padding: 24 }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: "#fff7ed",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <AlertTriangle size={26} color="#d97706" strokeWidth={2} />
          </div>
          <p
            style={{
              fontSize: 14,
              color: TXT,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Failed to load
          </p>
          <p style={{ fontSize: 13, color: MUT, marginBottom: 14 }}>{error}</p>
          {!API_URL && (
            <p
              style={{
                fontSize: 13,
                background: "#fef9c3",
                color: "#854d0e",
                padding: "6px 12px",
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              Set VITE_MODEL_COMPARISON_API in .env
            </p>
          )}
          <button
            onClick={refetch}
            style={{
              background: ACCENT,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 20px",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </Shell>
    );

  if (!data) return null;

  // ── Derived data ──
  const stats = data.comparison;
  const winner = stats.reduce(
    (best, m) => (modelScore(m) > modelScore(best) ? m : best),
    stats[0],
  );
  const avpData = data.actual_vs_predicted[activeModel] ?? [];
  const avpMax = avpData.length
    ? Math.ceil(
        Math.max(...avpData.map((d) => Math.max(d.actual, d.predicted))) * 1.1,
      )
    : 100;

  const radarData = [
    "Train R²",
    "Test R²",
    "Low MAE",
    "Low RMSE",
    "Low Overfit",
  ].map((metric, i) => {
    const entry: Record<string, any> = { metric };
    stats.forEach((m) => {
      if (i === 0) entry[m.model] = m.train_r2 * 100;
      if (i === 1) entry[m.model] = m.test_r2 * 100;
      if (i === 2) entry[m.model] = Math.max(0, 100 - m.mae_lakhs * 1.5);
      if (i === 3) entry[m.model] = Math.max(0, 100 - m.rmse_lakhs * 1.2);
      if (i === 4) entry[m.model] = Math.max(0, 100 - m.overfit_gap * 500);
    });
    return entry;
  });

  const barData = stats.map((m) => ({
    model: m.model,
    train: parseFloat((m.train_r2 * 100).toFixed(1)),
    test: parseFloat((m.test_r2 * 100).toFixed(1)),
    color: MODEL_META[m.model]?.color ?? ACCENT,
  }));

  const sortedByScore = [...stats].sort(
    (a, b) => modelScore(b) - modelScore(a),
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .cm-root * { box-sizing: border-box; }
        .cm-root ::-webkit-scrollbar { width: 5px; height: 5px; }
        .cm-root ::-webkit-scrollbar-track { background: transparent; }
        .cm-root ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        .cm-root ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @keyframes cm-slide { from { transform:translateX(-100%) } to { transform:translateX(0) } }
        @keyframes cm-fade  { from { opacity:0 } to { opacity:1 } }
        @keyframes spin     { to { transform:rotate(360deg) } }
        .mtab { transition: all 0.15s ease; cursor: pointer; }
        .mtab:hover { transform: translateY(-1px); }
      `}</style>

      <div
        className="cm-root flex bg-white"
        style={{
          height: "100vh",
          overflow: "hidden",
          fontFamily: "'DM Sans','Segoe UI',sans-serif",
        }}
      >
        {/* ════ DESKTOP SIDEBAR ════ */}
        <aside className="hidden lg:flex w-[220px] min-w-[220px] bg-white border-r border-gray-100 flex-col py-6 shadow-sm z-30">
          <SidebarContent />
        </aside>

        {/* ════ MOBILE DRAWER ════ */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              style={{ animation: "cm-fade 0.2s ease" }}
              onClick={() => setSidebarOpen(false)}
            />
            <div
              className="relative z-50 w-[260px] bg-white flex flex-col py-6 h-full shadow-2xl"
              style={{ animation: "cm-slide 0.25s ease" }}
            >
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* ════ MAIN ════ */}
        <main
          className="flex-1 min-w-0 flex flex-col"
          style={{ background: BG, overflow: "hidden" }}
        >
          {/* Mobile topbar */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#6E83B2] rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 18 18" fill="none" className="w-3.5 h-3.5">
                  <path
                    d="M2 9L9 2L16 9V16H11V12H7V16H2V9Z"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <span className="text-[15px] font-bold text-gray-800">
                EstateIQ
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-5 h-5 text-gray-600"
              >
                <path d="M3 5h14M3 10h14M3 15h14" />
              </svg>
            </button>
          </div>

          {/* Desktop topbar */}
          <div
            className="hidden lg:flex items-center justify-between px-5 bg-white border-b border-gray-100 flex-shrink-0"
            style={{ height: 50, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
          >
            <div>
              <span style={{ fontSize: 14, fontWeight: 700, color: TXT }}>
                Compare Models
              </span>
              <span style={{ fontSize: 13, color: MUT, marginLeft: 8 }}>
                Linear Regression · Random Forest · XGBoost
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  background: EMERALD + "18",
                  color: EMERALD,
                  border: `1px solid ${EMERALD}33`,
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 99,
                }}
              >
                <Trophy
                  size={13}
                  color={EMERALD}
                  strokeWidth={2}
                  style={{
                    display: "inline",
                    marginRight: 5,
                    verticalAlign: "middle",
                  }}
                />
                Best Model: {winner.model}
              </span>
              <div
                style={{
                  background: ACCS,
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  color: ACCENT,
                  fontWeight: 700,
                }}
              >
                AI
              </div>
            </div>
          </div>

          {/* ── Scrollable body ── */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              padding: isMobile ? "10px" : "12px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* ── Model selector tabs ── */}
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                flexShrink: 0,
              }}
            >
              {stats.map((m) => {
                const meta = MODEL_META[m.model] ?? {
                  color: ACCENT,
                  short: "M",
                  bg: ACCS,
                };
                const isWin = m.model === winner.model;
                const isSel = m.model === activeModel;
                return (
                  <div
                    key={m.model}
                    className="mtab"
                    onClick={() => setActiveModel(m.model)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 14px",
                      borderRadius: 10,
                      border: isSel
                        ? `2px solid ${meta.color}`
                        : `1px solid ${BOR}`,
                      background: isSel ? meta.bg : CARD,
                      boxShadow: isSel
                        ? `0 2px 12px ${meta.color}22`
                        : "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: meta.color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: isSel ? 700 : 500,
                        color: isSel ? meta.color : MUT,
                      }}
                    >
                      {m.model}
                    </span>
                    {isWin && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          fontSize: 12,
                          background: EMERALD + "18",
                          color: EMERALD,
                          border: `1px solid ${EMERALD}33`,
                          padding: "2px 6px",
                          borderRadius: 99,
                          fontWeight: 600,
                        }}
                      >
                        <CheckCircle2 size={10} strokeWidth={2.5} /> Best
                      </span>
                    )}
                    {!isWin && m.model === "Random Forest" && (
                      <span
                        style={{
                          fontSize: 12,
                          background: "#fef9c3",
                          color: "#92400e",
                          border: "1px solid #fde68a",
                          padding: "1px 6px",
                          borderRadius: 99,
                          fontWeight: 600,
                        }}
                      >
                        overfits
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: isSel ? meta.color : TXT,
                      }}
                    >
                      {pct(m.test_r2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ── Score cards row ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr 1fr"
                  : `repeat(${stats.length}, 1fr)`,
                gap: 10,
                flexShrink: 0,
              }}
            >
              {stats.map((m) => {
                const meta = MODEL_META[m.model] ?? {
                  color: ACCENT,
                  short: "M",
                  bg: ACCS,
                };
                const isWin = m.model === winner.model;
                return (
                  <div
                    key={m.model}
                    style={{
                      background: isWin
                        ? `linear-gradient(135deg, ${ACCENT} 0%, ${ACC2} 100%)`
                        : CARD,
                      border: isWin ? "none" : `1px solid ${BOR}`,
                      borderTop: isWin ? "none" : `3px solid ${meta.color}`,
                      borderRadius: 12,
                      padding: "14px 16px",
                      boxShadow: isWin
                        ? `0 4px 20px ${ACCENT}33`
                        : "0 1px 4px rgba(0,0,0,0.04)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {isWin && (
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          width: 24,
                          height: 24,
                          background: "rgba(255,255,255,0.2)",
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trophy size={13} color="#fff" strokeWidth={2} />
                      </div>
                    )}
                    {!isWin && m.model === "Random Forest" && (
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          background: "#fef9c3",
                          border: "1px solid #fde047",
                          borderRadius: 99,
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#92400e",
                          padding: "1px 7px",
                        }}
                      >
                        overfits
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: isWin ? "rgba(255,255,255,0.7)" : MUT,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.04em",
                        marginBottom: 6,
                      }}
                    >
                      {m.model}
                    </div>
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 800,
                        color: isWin ? "#fff" : meta.color,
                        lineHeight: 1,
                        marginBottom: 8,
                      }}
                    >
                      {pct(m.test_r2)}
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "4px 12px",
                      }}
                    >
                      {(
                        [
                          ["Train R²", pct(m.train_r2)],
                          ["Overfit", m.overfit_gap.toFixed(3)],
                          ["MAE", fmtP(m.mae_lakhs)],
                          ["RMSE", fmtP(m.rmse_lakhs)],
                        ] as [string, string][]
                      ).map(([label, val]) => (
                        <div key={label}>
                          <div
                            style={{
                              fontSize: 12,
                              color: isWin ? "rgba(255,255,255,0.55)" : DIM,
                              textTransform: "uppercase" as const,
                            }}
                          >
                            {label}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: isWin ? "#fff" : TXT,
                            }}
                          >
                            {val}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Middle row: table + radar + bar ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : isTablet
                    ? "1fr 1fr"
                    : "1.2fr 1fr 1fr",
                gap: 10,
              }}
            >
              {/* Metric table */}
              <div
                style={{
                  background: CARD,
                  borderRadius: 12,
                  padding: "14px 16px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  overflowX: "auto",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: TXT,
                    marginBottom: 12,
                  }}
                >
                  Metrics Breakdown
                </div>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                    minWidth: 260,
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${BOR}` }}>
                      <th
                        style={{
                          textAlign: "left" as const,
                          padding: "6px 8px",
                          color: MUT,
                          fontWeight: 600,
                          fontSize: 12,
                          textTransform: "uppercase" as const,
                        }}
                      >
                        Metric
                      </th>
                      {stats.map((m) => (
                        <th
                          key={m.model}
                          style={{
                            textAlign: "right" as const,
                            padding: "6px 8px",
                            color: MODEL_META[m.model]?.color ?? ACCENT,
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          {MODEL_META[m.model]?.short ?? m.model}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      [
                        "train_r2",
                        "test_r2",
                        "mae_lakhs",
                        "rmse_lakhs",
                        "overfit_gap",
                      ] as (keyof ModelStat)[]
                    ).map((metric, ri) => (
                      <tr
                        key={metric}
                        style={{
                          borderBottom: `1px solid ${BOR}`,
                          background: ri % 2 === 0 ? "#fafbfc" : "transparent",
                        }}
                      >
                        <td
                          style={{
                            padding: "8px 8px",
                            color: MUT,
                            fontWeight: 500,
                          }}
                        >
                          {METRIC_LABELS[metric]}
                        </td>
                        {stats.map((m) => {
                          const val = m[metric] as number;
                          const best = isBest(metric, val, stats);
                          const fmt =
                            metric === "mae_lakhs" || metric === "rmse_lakhs"
                              ? fmtP(val)
                              : metric === "overfit_gap"
                                ? val.toFixed(3)
                                : pct(val);
                          return (
                            <td
                              key={m.model}
                              style={{
                                textAlign: "right" as const,
                                padding: "8px 8px",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: best ? 700 : 400,
                                  color: best ? EMERALD : TXT,
                                  background: best
                                    ? EMERALD + "12"
                                    : "transparent",
                                  padding: "2px 6px",
                                  borderRadius: 6,
                                }}
                              >
                                {fmt}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  {stats.map((m) => (
                    <span
                      key={m.model}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 12,
                        color: MUT,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 2,
                          background: MODEL_META[m.model]?.color ?? ACCENT,
                          display: "inline-block",
                        }}
                      />
                      {MODEL_META[m.model]?.short} = {m.model}
                    </span>
                  ))}
                  <span
                    style={{ fontSize: 12, color: EMERALD, fontWeight: 600 }}
                  >
                    ■ = best value
                  </span>
                </div>
              </div>

              {/* Radar chart */}
              <div
                style={{
                  background: CARD,
                  borderRadius: 12,
                  padding: "14px 16px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: TXT,
                    marginBottom: 4,
                  }}
                >
                  Performance Radar
                </div>
                <div style={{ fontSize: 12, color: MUT, marginBottom: 8 }}>
                  Multi-metric comparison
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData} outerRadius={72}>
                    <PolarGrid stroke={BOR} />
                    <PolarAngleAxis
                      dataKey="metric"
                      tick={{ fontSize: 12, fill: MUT }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                    />
                    {stats.map((m) => (
                      <Radar
                        key={m.model}
                        name={m.model}
                        dataKey={m.model}
                        stroke={MODEL_META[m.model]?.color ?? ACCENT}
                        fill={MODEL_META[m.model]?.color ?? ACCENT}
                        fillOpacity={0.12}
                        strokeWidth={2}
                        dot={{
                          r: 3,
                          fill: MODEL_META[m.model]?.color ?? ACCENT,
                          strokeWidth: 0,
                        }}
                      />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                    marginTop: 4,
                    flexWrap: "wrap",
                  }}
                >
                  {stats.map((m) => (
                    <span
                      key={m.model}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                        color: MUT,
                      }}
                    >
                      <span
                        style={{
                          width: 14,
                          height: 3,
                          borderRadius: 2,
                          background: MODEL_META[m.model]?.color ?? ACCENT,
                          display: "inline-block",
                        }}
                      />
                      {MODEL_META[m.model]?.short}
                    </span>
                  ))}
                </div>
              </div>

              {/* R² bar chart */}
              <div
                style={{
                  background: CARD,
                  borderRadius: 12,
                  padding: "14px 16px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: TXT,
                    marginBottom: 4,
                  }}
                >
                  R² Score
                </div>
                <div style={{ fontSize: 12, color: MUT, marginBottom: 8 }}>
                  Train vs Test accuracy
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={barData}
                    margin={{ top: 4, right: 4, left: -20, bottom: 4 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={BOR}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="model"
                      tick={{ fontSize: 12, fill: MUT }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => MODEL_META[v]?.short ?? v}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 12, fill: MUT }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(91,110,168,0.06)" }}
                      content={({ active, payload, label }: any) =>
                        active && payload?.length ? (
                          <div style={tip}>
                            <div style={{ color: DIM, marginBottom: 3 }}>
                              {label}
                            </div>
                            {payload.map((p: any) => (
                              <div key={p.name} style={{ color: "#fff" }}>
                                {p.name}: <strong>{p.value}%</strong>
                              </div>
                            ))}
                          </div>
                        ) : null
                      }
                    />
                    <Bar
                      dataKey="train"
                      name="Train"
                      radius={[4, 4, 0, 0]}
                      fill={DIM}
                      opacity={0.45}
                    />
                    <Bar dataKey="test" name="Test" radius={[4, 4, 0, 0]}>
                      {barData.map((b, i) => (
                        <Cell key={i} fill={b.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                    marginTop: 4,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      color: MUT,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: DIM,
                        opacity: 0.5,
                        display: "inline-block",
                      }}
                    />
                    Train
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      color: MUT,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: ACCENT,
                        display: "inline-block",
                      }}
                    />
                    Test
                  </span>
                </div>
              </div>
            </div>

            {/* ── Bottom row: AVP scatter + Why XGBoost wins ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : isTablet
                    ? "1fr"
                    : "1.4fr 1fr",
                gap: 10,
              }}
            >
              {/* Actual vs Predicted */}
              <div
                style={{
                  background: CARD,
                  borderRadius: 12,
                  padding: "14px 16px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: TXT }}>
                      Actual vs Predicted
                    </div>
                    <div style={{ fontSize: 12, color: MUT }}>
                      Points closer to diagonal = more accurate
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {stats.map((m) => {
                      const meta = MODEL_META[m.model] ?? {
                        color: ACCENT,
                        short: "M",
                      };
                      return (
                        <button
                          key={m.model}
                          onClick={() => setActiveModel(m.model)}
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: 99,
                            cursor: "pointer",
                            border: "none",
                            background:
                              activeModel === m.model ? meta.color : BOR,
                            color: activeModel === m.model ? "#fff" : MUT,
                          }}
                        >
                          {meta.short}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={500}>
                  <ScatterChart
                    margin={{ top: 4, right: 8, left: -12, bottom: 16 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={BOR} />
                    <XAxis
                      dataKey="actual"
                      type="number"
                      tick={{ fontSize: 12, fill: MUT }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => fmtPs(v)}
                      domain={[0, avpMax]}
                      label={{
                        value: "actual",
                        position: "insideBottom",
                        offset: -6,
                        fontSize: 12,
                        fill: MUT,
                      }}
                    />
                    <YAxis
                      dataKey="predicted"
                      type="number"
                      tick={{ fontSize: 12, fill: MUT }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => fmtPs(v)}
                      domain={[0, avpMax]}
                      label={{
                        value: "predicted",
                        angle: -90,
                        position: "insideLeft",
                        offset: 18,
                        fontSize: 12,
                        fill: MUT,
                      }}
                    />
                    <Tooltip
                      content={({ active, payload }: any) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        const err = Math.abs(d.actual - d.predicted);
                        return (
                          <div style={tip}>
                            <div style={{ color: DIM }}>
                              Actual: {fmtP(d.actual)}
                            </div>
                            <div style={{ fontWeight: 700 }}>
                              Pred: {fmtP(d.predicted)}
                            </div>
                            <div
                              style={{
                                color: err < 50 ? "#4ade80" : "#fbbf24",
                              }}
                            >
                              Δ {fmtP(err)}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Scatter data={avpData} opacity={0.6}>
                      {avpData.map((d, i) => {
                        const err = Math.abs(d.actual - d.predicted);
                        const modelColor =
                          MODEL_META[activeModel]?.color ?? ACCENT;
                        return (
                          <Cell
                            key={i}
                            fill={
                              err < 50 ? modelColor : err < 120 ? AMBER : ROSE
                            }
                          />
                        );
                      })}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                    marginTop: 4,
                  }}
                >
                  {[
                    {
                      c: MODEL_META[activeModel]?.color ?? ACCENT,
                      l: "Error < ₹50L",
                    },
                    { c: AMBER, l: "< ₹1.2Cr" },
                    { c: ROSE, l: "> ₹1.2Cr" },
                  ].map((x) => (
                    <span
                      key={x.l}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                        color: MUT,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: x.c,
                          display: "inline-block",
                        }}
                      />
                      {x.l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Why XGBoost wins */}
              <div
                style={{
                  background: CARD,
                  borderRadius: 12,
                  padding: "14px 16px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TXT }}>
                    Why {winner.model} Wins
                  </div>
                  <span
                    style={{
                      background: EMERALD + "18",
                      color: EMERALD,
                      border: `1px solid ${EMERALD}33`,
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 99,
                    }}
                  >
                    Insight
                  </span>
                </div>

                {/* Scoring explanation */}
                <div
                  style={{
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                    borderRadius: 9,
                    padding: "8px 12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#92400e",
                      marginBottom: 3,
                    }}
                  >
                    How winner is determined
                  </div>
                  <div
                    style={{ fontSize: 12, color: "#b45309", lineHeight: 1.5 }}
                  >
                    Score = Test R² × 60% + Generalisation × 40%
                    <br />
                    Raw accuracy alone is misleading — overfitting hurts
                    real-world use.
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    {sortedByScore.map((m, i) => (
                      <span
                        key={m.model}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: MODEL_META[m.model]?.color ?? ACCENT,
                        }}
                      >
                        {i + 1}. {MODEL_META[m.model]?.short}{" "}
                        {modelScore(m).toFixed(3)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Insight cards */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {INSIGHTS.map((ins) => (
                    <div
                      key={ins.title}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                        padding: "8px 10px",
                        background: "#fafbfc",
                        borderRadius: 9,
                        border: `1px solid ${BOR}`,
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          background: ins.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <ins.Icon size={14} color={ins.color} strokeWidth={2} />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: TXT,
                            marginBottom: 2,
                          }}
                        >
                          {ins.title}
                        </div>
                        <div
                          style={{ fontSize: 12, color: MUT, lineHeight: 1.5 }}
                        >
                          {ins.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Verdict */}
                <div
                  style={{
                    background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACC2} 100%)`,
                    borderRadius: 10,
                    padding: "10px 14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: 3,
                    }}
                  >
                    Verdict
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.85)",
                      lineHeight: 1.5,
                    }}
                  >
                    {winner.model} wins with a balanced score: test R² of{" "}
                    {pct(winner.test_r2)} and an overfit gap of only{" "}
                    {winner.overfit_gap.toFixed(3)}. Random Forest achieves{" "}
                    {pct(
                      stats.find((m) => m.model === "Random Forest")?.test_r2 ??
                        0,
                    )}{" "}
                    test R² but its overfit gap of{" "}
                    {(
                      stats.find((m) => m.model === "Random Forest")
                        ?.overfit_gap ?? 0
                    ).toFixed(3)}{" "}
                    makes it less reliable in production.
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end scrollable body */}
        </main>
      </div>
    </>
  );
};

export default CompareModels;
