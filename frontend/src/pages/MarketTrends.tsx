import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  IndianRupee,
  Ruler,
  Building2,
  MapPin,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import SidebarContent from "../components/Sidebarcontent";
import type { MarketData } from "../lib/interface";

// ── API ──
const API_URL = import.meta.env.VITE_MARKET_TRENDS_API;

function useMarketStats() {
  const [data, setData] = useState<MarketData | null>(null);
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
      .then((j: MarketData) => {
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

// ── Palette ──
const ACCENT = "#5b6ea8",
  ACC2 = "#7b8fc4",
  ACCS = "#e8eaf6";
const TEAL = "#0d9488",
  AMBER = "#d97706",
  VIOLET = "#7c3aed";
const EMERALD = "#059669",
  ROSE = "#e11d48",
  CORAL = "#f97316";
const BG = "#f0f2f8",
  CARD = "#ffffff",
  BOR = "#e2e8f0";
const TXT = "#1e293b",
  MUT = "#64748b",
  DIM = "#94a3b8";

const LOC_C = [
  "#5b6ea8",
  "#0d9488",
  "#d97706",
  "#7c3aed",
  "#059669",
  "#e11d48",
  "#f97316",
  "#0369a1",
];
const BHK_C = [
  "#5b6ea8",
  "#0d9488",
  "#d97706",
  "#7c3aed",
  "#059669",
  "#e11d48",
];
const HIST_C = [
  "#5b6ea8",
  "#0d9488",
  "#d97706",
  "#7c3aed",
  "#059669",
  "#e11d48",
  "#f97316",
  "#0369a1",
  "#be185d",
];

const KPI_CFG: {
  label: string;
  color: string;
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  bg: string;
}[] = [
  { label: "Avg Price", color: ACCENT, Icon: IndianRupee, bg: "#eef0fa" },
  { label: "Price/sq ft", color: TEAL, Icon: Ruler, bg: "#ecfdf5" },
  { label: "Listings", color: AMBER, Icon: Building2, bg: "#fffbeb" },
  { label: "Top Area", color: VIOLET, Icon: MapPin, bg: "#f5f3ff" },
];

const tip: React.CSSProperties = {
  background: "#1e293b",
  border: "none",
  borderRadius: 8,
  color: "#f1f5f9",
  fontSize: 12,
  padding: "8px 12px",
};

// ════════════════════════════════════════════
const MarketTrends: React.FC = () => {
  const { data, loading, error, refetch } = useMarketStats();
  const [activeLoc, setActiveLoc] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <div className="flex h-screen bg-white text-gray-800 font-sans overflow-hidden">
        {/* Desktop sidebar placeholder */}
        <aside className="hidden lg:flex w-[220px] min-w-[220px] bg-white border-r border-gray-100 flex-col py-6 shadow-sm z-30">
          <SidebarContent />
        </aside>
        <main className="flex-1 flex items-center justify-center bg-[#f0f2f8]">
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div className="text-center">
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
            <div style={{ fontSize: 14, color: MUT }}>Loading market data…</div>
          </div>
        </main>
      </div>
    );

  // ── Error ──
  if (error)
    return (
      <div className="flex h-screen bg-white text-gray-800 font-sans overflow-hidden">
        <aside className="hidden lg:flex w-[220px] min-w-[220px] bg-white border-r border-gray-100 flex-col py-6 shadow-sm z-30">
          <SidebarContent />
        </aside>
        <main className="flex-1 flex items-center justify-center bg-[#f0f2f8]">
          <div className="text-center p-6">
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
              Failed to load market data
            </p>
            <p style={{ fontSize: 13, color: MUT, marginBottom: 14 }}>
              {error}
            </p>
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
                Set VITE_MARKET_TRENDS_API in .env
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
        </main>
      </div>
    );

  if (!data) return null;

  // ── Data transforms ──
  const locData = Object.entries(data.locality_avg)
    .map(([l, avg]) => ({
      locality: l
        .split(" ")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" "),
      localityShort: l
        .split(" ")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ")
        .slice(0, 14),
      avg: Number(avg),
    }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 8);

  const bhkData = Object.entries(data.bhk_median)
    .map(([bhk, med], i) => ({
      name: `${parseFloat(bhk).toFixed(0)} BHK`,
      value: Number(med),
      fill: BHK_C[i % BHK_C.length],
    }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name));

  const featData = [...data.feature_importance]
    .sort((a, b) => b.importance - a.importance)
    .map((f) => ({
      feature: f.feature.replace(/_/g, " "),
      pct: f.importance * 100,
    }));
  const maxF = featData[0]?.pct ?? 1;

  const scatD = data.scatter.map((d) => ({ area: d.area, price: d.Price }));
  const scatMax = Math.ceil(Math.max(...scatD.map((d) => d.price)) * 1.1);
  const avpD = data.actual_vs_predicted.map((d) => ({
    actual: d.actual,
    predicted: d.pridicted,
  }));
  const avpMax = Math.ceil(
    Math.max(...avpD.map((d) => Math.max(d.actual, d.predicted))) * 1.1,
  );

  const kpiValues = [
    fmtP(data.kpis.avg_price_lakhs),
    `₹${Number(data.kpis.price_per_sqft).toLocaleString("en-IN")}`,
    data.kpis.total_listings.toLocaleString("en-IN"),
    data.kpis.top_locality,
  ];

  // Responsive layout values
  const chartCols = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1.4fr 1fr 1fr";
  const pageScroll = isSmall ? "auto" : "hidden";
  const pageH = isSmall ? "auto" : "100vh";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .market-root * { box-sizing: border-box; }
        .market-root ::-webkit-scrollbar { width: 4px; }
        .market-root ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        @keyframes market-slide-in { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes market-fade-in  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Outer shell — matches PricePrediction exactly ── */}
      <div
        className="market-root flex bg-white text-gray-800 font-sans"
        style={{
          height: pageH,
          overflow: pageScroll,
          fontFamily: "'DM Sans','Segoe UI',sans-serif",
        }}
      >
        {/* ════ DESKTOP SIDEBAR — identical to PricePrediction ════ */}
        <aside className="hidden lg:flex w-[220px] min-w-[220px] bg-white border-r border-gray-100 flex-col py-6 shadow-sm z-30">
          <SidebarContent />
        </aside>

        {/* ════ MOBILE DRAWER — identical pattern to PricePrediction ════ */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              style={{ animation: "market-fade-in 0.2s ease" }}
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer panel */}
            <div
              className="relative z-50 w-[260px] bg-white flex flex-col py-6 h-full shadow-2xl"
              style={{ animation: "market-slide-in 0.25s ease" }}
            >
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* ════ MAIN CONTENT ════ */}
        <main
          className="flex-1 min-w-0"
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: pageScroll,
            background: BG,
          }}
        >
          {/* ── Mobile topbar — mirrors PricePrediction mobile header ── */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
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
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
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

          {/* ── Desktop topbar ── */}
          <div
            className="hidden lg:flex items-center justify-between px-5 bg-white border-b border-gray-100"
            style={{
              height: 50,
              flexShrink: 0,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div>
              <span style={{ fontSize: 14, fontWeight: 700, color: TXT }}>
                Market Trends
              </span>
              <span style={{ fontSize: 13, color: MUT, marginLeft: 8 }}>
                Ahmedabad 2025–26
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: MUT }}>
                XGBoost · R² = 0.90
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

          {/* ── Dashboard body ── */}
          <div
            style={{
              flex: 1,
              padding: isMobile ? "10px" : "12px 16px",
              overflow: pageScroll,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {/* ── KPI Cards ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)",
                gap: 10,
                flexShrink: 0,
              }}
            >
              {KPI_CFG.map((k, i) => (
                <div
                  key={k.label}
                  style={{
                    background: CARD,
                    borderRadius: 12,
                    padding: "14px 16px",
                    borderLeft: `4px solid ${k.color}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: MUT,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {k.label}
                    </span>
                    <span
                      style={{
                        background: k.bg,
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <k.Icon size={15} color={k.color} strokeWidth={2} />
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? 16 : 18,
                      fontWeight: 700,
                      color: TXT,
                      lineHeight: 1.2,
                    }}
                  >
                    {kpiValues[i]}
                  </div>
                  <div
                    style={{ fontSize: 12, color: k.color, fontWeight: 500 }}
                  >
                    {["all listings", "city avg", "2025–26", "most listed"][i]}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Charts Grid ── */}
            <div
              style={{
                flex: isSmall ? "unset" : 1,
                display: "grid",
                gridTemplateColumns: chartCols,
                gridTemplateRows: isSmall ? "auto" : "290px 260px",
                gap: 10,
                minHeight: 0,
                overflow: isSmall ? "visible" : "hidden",
              }}
            >
              {/* Locality Bar */}
              <div
                style={{
                  background: CARD,
                  borderRadius: 12,
                  padding: "12px 14px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                    flexShrink: 0,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: TXT }}>
                      Avg Price by Locality
                    </div>
                    <div style={{ fontSize: 12, color: MUT }}>
                      Top 8 areas · click to highlight
                    </div>
                  </div>
                  <span
                    style={{
                      background: ACCS,
                      color: ACCENT,
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 99,
                    }}
                  >
                    Top 8
                  </span>
                </div>
                <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                  <ResponsiveContainer width="100%" height="130%">
                    <BarChart
                      data={locData}
                      margin={{
                        top: 2,
                        right: 4,
                        left: -8,
                        bottom: isMobile ? 55 : 65,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={BOR}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="localityShort"
                        tick={{ fontSize: 11, fill: MUT }}
                        axisLine={false}
                        tickLine={false}
                        angle={-40}
                        textAnchor="end"
                        interval={0}
                        height={75}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: MUT }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => fmtPs(v)}
                        width={52}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(91,110,168,0.08)" }}
                        content={({ active, payload, label }: any) =>
                          active && payload?.length ? (
                            <div style={tip}>
                              <div style={{ color: DIM, marginBottom: 2 }}>
                                {label}
                              </div>
                              <div style={{ fontWeight: 700 }}>
                                {fmtP(Number(payload[0].value))}
                              </div>
                            </div>
                          ) : null
                        }
                      />
                      <Bar
                        dataKey="avg"
                        radius={[5, 5, 0, 0]}
                        onClick={(d: any) =>
                          setActiveLoc(
                            d.locality === activeLoc ? null : d.locality,
                          )
                        }
                      >
                        {locData.map((e, i) => (
                          <Cell
                            key={e.locality}
                            fill={LOC_C[i % LOC_C.length]}
                            opacity={
                              activeLoc && activeLoc !== e.locality ? 0.22 : 1
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {activeLoc && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 4,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        background: ACCS,
                        color: ACCENT,
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 99,
                      }}
                    >
                      {activeLoc} ·{" "}
                      {fmtP(
                        locData.find((l) => l.locality === activeLoc)?.avg ?? 0,
                      )}
                    </span>
                    <button
                      onClick={() => setActiveLoc(null)}
                      style={{
                        fontSize: 12,
                        color: MUT,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      clear
                    </button>
                  </div>
                )}
              </div>

              {/* BHK Donut */}
              <div
                style={{
                  background: CARD,
                  borderRadius: 12,
                  padding: "12px 14px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: TXT,
                    marginBottom: 2,
                  }}
                >
                  Median Price by BHK
                </div>
                <div style={{ fontSize: 12, color: MUT, marginBottom: 8 }}>
                  Per bedroom config
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    minHeight: 0,
                    gap: 4,
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    <ResponsiveContainer
                      width={isMobile ? 110 : 120}
                      height={isMobile ? 110 : 130}
                    >
                      <PieChart>
                        <Pie
                          data={bhkData}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={isMobile ? 28 : 32}
                          outerRadius={isMobile ? 48 : 54}
                          paddingAngle={3}
                          startAngle={90}
                          endAngle={450}
                          label={false}
                        >
                          {bhkData.map((_, i) => (
                            <Cell key={i} fill={BHK_C[i % BHK_C.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }: any) =>
                            active && payload?.length ? (
                              <div style={tip}>
                                <div style={{ color: DIM }}>
                                  {payload[0].name}
                                </div>
                                <div style={{ fontWeight: 700 }}>
                                  {fmtP(Number(payload[0].value))}
                                </div>
                              </div>
                            ) : null
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto" }}>
                    {bhkData.map((b) => (
                      <div
                        key={b.name}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 7,
                          padding: "3px 0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <span
                            style={{
                              width: 9,
                              height: 9,
                              borderRadius: 2,
                              background: b.fill,
                              display: "inline-block",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 13,
                              color: TXT,
                              fontWeight: 500,
                            }}
                          >
                            {b.name}
                          </span>
                        </div>
                        <span
                          style={{ fontSize: 13, fontWeight: 700, color: MUT }}
                        >
                          {fmtP(b.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature Importance */}
              <div
                style={{
                  background: CARD,
                  borderRadius: 12,
                  padding: "12px 14px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                    flexShrink: 0,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: TXT }}>
                    Feature Importance
                  </div>
                  <span
                    style={{
                      background: ACCENT + "18",
                      color: ACCENT,
                      border: `1px solid ${ACCENT}33`,
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 99,
                    }}
                  >
                    Model
                  </span>
                </div>
                <div
                  style={{
                    background: `linear-gradient(135deg,${ACCENT} 0%,${ACC2} 100%)`,
                    borderRadius: 10,
                    padding: "10px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 7,
                    flexShrink: 0,
                  }}
                >
                  <div>
                    <div
                      style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}
                    >
                      {featData[0]?.feature}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}
                    >
                      top driver
                    </div>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>
                    {featData[0]?.pct.toFixed(0)}%
                  </div>
                </div>
                <div
                  style={{
                    background: TEAL + "15",
                    border: `1.5px solid ${TEAL}33`,
                    borderRadius: 9,
                    padding: "8px 12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                    flexShrink: 0,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: TXT }}>
                    {featData[1]?.feature}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: TEAL }}>
                    {featData[1]?.pct.toFixed(0)}%
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {featData.slice(2).map((f, i) => (
                    <div
                      key={f.feature}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        marginBottom: 7,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: TXT,
                          width: 120,
                          flexShrink: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap" as const,
                        }}
                      >
                        {f.feature}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 6,
                          background: "#f1f5f9",
                          borderRadius: 99,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${(f.pct / maxF) * 100}%`,
                            background: [AMBER, VIOLET, CORAL, ROSE][i % 4],
                            borderRadius: 99,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: MUT,
                          width: 32,
                          textAlign: "right" as const,
                        }}
                      >
                        {f.pct.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    padding: "7px 10px",
                    background: ACCS,
                    borderRadius: 8,
                    flexShrink: 0,
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      color: ACCENT,
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    BHK + Area explain{" "}
                    <strong>
                      {featData
                        .slice(0, 2)
                        .reduce((s, f) => s + f.pct, 0)
                        .toFixed(0)}
                      %
                    </strong>{" "}
                    of price variance
                  </p>
                </div>
              </div>

              {/* Price Distribution */}
              <div
                style={{
                  background: CARD,
                  borderRadius: 12,
                  padding: "12px 14px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                    flexShrink: 0,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: TXT }}>
                      Price Distribution
                    </div>
                    <div style={{ fontSize: 12, color: MUT }}>
                      Listings per price bracket
                    </div>
                  </div>
                  <span
                    style={{
                      background: ACCENT + "18",
                      color: ACCENT,
                      border: `1px solid ${ACCENT}33`,
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 99,
                    }}
                  >
                    {data.kpis.total_listings.toLocaleString()} total
                  </span>
                </div>
                <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                  <ResponsiveContainer width="100%" height="130%">
                    <BarChart
                      data={data.histogram}
                      margin={{
                        top: 2,
                        right: 4,
                        left: -8,
                        bottom: isMobile ? 50 : 58,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={BOR}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="range"
                        tick={{ fontSize: 11, fill: MUT }}
                        axisLine={false}
                        tickLine={false}
                        angle={-35}
                        textAnchor="end"
                        interval={0}
                        height={68}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: MUT }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) =>
                          v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`
                        }
                        width={36}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(91,110,168,0.08)" }}
                        content={({ active, payload, label }: any) =>
                          active && payload?.length ? (
                            <div style={tip}>
                              <div style={{ color: DIM }}>{label}</div>
                              <div style={{ fontWeight: 700 }}>
                                {Number(payload[0].value).toLocaleString()}{" "}
                                listings
                              </div>
                            </div>
                          ) : null
                        }
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {data.histogram.map((_: any, i: number) => (
                          <Cell key={i} fill={HIST_C[i % HIST_C.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Area vs Price Scatter */}
              <div
                style={{
                  background: CARD,
                  borderRadius: 12,
                  padding: "12px 14px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: TXT,
                    marginBottom: 2,
                    flexShrink: 0,
                  }}
                >
                  Price vs Area
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: MUT,
                    marginBottom: 8,
                    flexShrink: 0,
                  }}
                >
                  X = area (sq ft) · Y = price · teal = above ₹1Cr
                </div>
                <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 4, right: 8, left: 0, bottom: 6 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={BOR} />
                      <XAxis
                        dataKey="area"
                        type="number"
                        tick={{ fontSize: 11, fill: MUT }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        dataKey="price"
                        type="number"
                        tick={{ fontSize: 11, fill: MUT }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => fmtPs(v)}
                        domain={[0, scatMax]}
                        width={52}
                      />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        content={({ active, payload }: any) => {
                          if (!active || !payload?.length) return null;
                          const d = payload[0].payload;
                          return (
                            <div style={tip}>
                              <div style={{ color: DIM }}>{d.area} sqft</div>
                              <div style={{ fontWeight: 700 }}>
                                {fmtP(d.price)}
                              </div>
                            </div>
                          );
                        }}
                      />
                      <Scatter data={scatD} opacity={0.6}>
                        {scatD.map((d, i) => (
                          <Cell key={i} fill={d.price >= 100 ? TEAL : ACCENT} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                    marginTop: 4,
                    flexShrink: 0,
                  }}
                >
                  {[
                    { c: ACCENT, l: "< ₹1Cr" },
                    { c: TEAL, l: "≥ ₹1Cr" },
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

              {/* Actual vs Predicted */}
              <div
                style={{
                  background: CARD,
                  borderRadius: 12,
                  padding: "12px 14px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                    flexShrink: 0,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: TXT }}>
                      Actual vs Predicted
                    </div>
                    <div style={{ fontSize: 12, color: MUT }}>
                      X = actual · Y = predicted · closer to diagonal = better
                    </div>
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
                    R²=0.90
                  </span>
                </div>
                <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 4, right: 8, left: 0, bottom: 6 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={BOR} />
                      <XAxis
                        dataKey="actual"
                        type="number"
                        tick={{ fontSize: 11, fill: MUT }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => fmtPs(v)}
                        domain={[0, avpMax]}
                      />
                      <YAxis
                        dataKey="predicted"
                        type="number"
                        tick={{ fontSize: 11, fill: MUT }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => fmtPs(v)}
                        domain={[0, avpMax]}
                        width={52}
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
                      <Scatter data={avpD} opacity={0.6}>
                        {avpD.map((d, i) => {
                          const e = Math.abs(d.actual - d.predicted);
                          return (
                            <Cell
                              key={i}
                              fill={e < 50 ? ACCENT : e < 120 ? AMBER : ROSE}
                            />
                          );
                        })}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "center",
                    marginTop: 4,
                    flexShrink: 0,
                  }}
                >
                  {[
                    { c: ACCENT, l: "<₹50L" },
                    { c: AMBER, l: "<₹1.2Cr" },
                    { c: ROSE, l: ">₹1.2Cr" },
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
            </div>
            {/* end charts grid */}
          </div>
          {/* end body */}
        </main>
      </div>
    </>
  );
};

export default MarketTrends;
