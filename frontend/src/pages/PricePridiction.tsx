import React, { useState } from "react";
import assets from "../assets/assets";

// ── Area Data ──────────────────────────────────────────────
export const ahmedabadFlatAreas: Record<string, string[]> = {
  "Premium / Luxury": [
    "Satellite",
    "Bodakdev",
    "Prahlad Nagar",
    "Vastrapur",
    "Navrangpura",
    "Ambawadi",
    "Paldi",
    "Ellisbridge",
    "Ashram Road",
    "Drive In Road",
    "Judges Bungalow Road",
    "Sindhu Bhavan Marg",
    "SG Highway",
    "Science City",
    "Ambli",
    "Thaltej",
  ],
  "Mid Segment": [
    "Bopal",
    "Gota",
    "South Bopal",
    "Ghatlodiya",
    "Sola",
    "Naranpura",
    "Memnagar",
    "Gurukul",
    "Vasna",
    "Jivraj Park",
    "Maninagar",
    "Chandkheda",
    "Motera",
    "Shahibaug",
    "Vaishnodevi Circle",
    "Iscon Ambli Road",
    "Sarkhej",
    "Shela",
    "Shilaj",
    "Ghuma",
  ],
  "Affordable / Budget": [
    "Nikol",
    "Naroda",
    "Nava Naroda",
    "Vastral",
    "Vatva",
    "Narolgam",
    "Jagatpur",
    "Ghodasar",
    "Isanpur",
    "Narol",
    "Odhav",
    "Bapunagar",
    "Amraiwadi",
    "Saraspur",
    "Juhapura",
    "Nikol Naroda Road",
    "Tragad",
    "Chandlodiya",
    "New Ranip",
    "Ranip",
    "Nava Vadaj",
    "Hathijan",
  ],
  "Emerging / Upcoming": [
    "Ognaj",
    "Zundal",
    "Bhadaj",
    "Hebatpur",
    "Chharodi",
    "Sanand",
    "Daskroi",
    "Kathwada",
    "Lambha",
    "Sanathal",
    "Godhavi",
    "Changodar",
    "Sughad",
    "Bhat",
    "Moraiya",
    "Hansol",
    "Godrej Garden City",
    "Nandej",
    "Kuha",
  ],
  "Old City / Central": [
    "Kalupur",
    "Shahpur",
    "Khanpur",
    "Dariyapur",
    "Jamalpur",
    "Behrampura",
    "Khadia",
    "Sarangpur",
    "Usmanpura",
    "Meghaninagar",
    "Sabarmati",
    "Naroda Road",
    "Law Garden",
    "CG Road",
  ],
};

// ── BHK minimum sqft rules ─────────────────────────────────
const BHK_MIN_SQFT: Record<string, number> = {
  "1 BHK": 350,
  "2 BHK": 650,
  "3 BHK": 950,
  "4 BHK": 1300,
  "5 BHK": 1700,
};

// ── Types ──────────────────────────────────────────────────
interface PredictionResult {
  price: string;
  rangeLow: string;
  rangeHigh: string;
  sqftRate: string;
  conf: number;
}

interface FormErrors {
  location?: string;
  area?: string;
  bhk?: string;
  furnishing?: string;
  sqftMin?: string;
  floorNo?: string;
  totalFloors?: string;
  floorExceeds?: string;
}

// ── Nav data ───────────────────────────────────────────────
const navItems = [
  {
    label: "Price Prediction",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4 flex-shrink-0"
      >
        <path d="M8 1L1 7v8h5v-4h4v4h5V7L8 1z" />
      </svg>
    ),
    badge: "AI",
    badgeHot: true,
    active: true,
  },
  {
    label: "Market Trends",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="w-4 h-4 flex-shrink-0"
      >
        <rect x="2" y="2" width="5" height="5" rx="1" />
        <rect x="9" y="2" width="5" height="5" rx="1" />
        <rect x="2" y="9" width="5" height="5" rx="1" />
        <rect x="9" y="9" width="5" height="5" rx="1" />
      </svg>
    ),
    active: false,
  },
];

const exploreItems = [
  {
    label: "Compare Models",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="w-4 h-4 flex-shrink-0"
      >
        <path d="M8 1v14M1 8h14" />
      </svg>
    ),
  },
];

// ── Sidebar ────────────────────────────────────────────────
const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
  <>
    <div className="px-5 pb-6 border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-[#6E83B2] rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4">
            <path
              d="M2 9L9 2L16 9V16H11V12H7V16H2V9Z"
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <div>
          <p className="text-[15px] font-bold text-gray-800 tracking-tight">
            EstateIQ
          </p>
          <p className="text-[10px] text-gray-400 tracking-widest">
            PRICE INTELLIGENCE
          </p>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-4 h-4 text-gray-500"
          >
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
      )}
    </div>

    <div className="px-3 pt-5 pb-2">
      <p className="text-[10px] text-gray-400 tracking-widest uppercase px-2 mb-1.5">
        Main
      </p>
      {navItems.map((item) => (
        <div
          key={item.label}
          onClick={onClose}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] cursor-pointer text-[13px] mb-0.5 transition-all
            ${item.active ? "bg-[#6E83B2]/10 text-[#6E83B2] font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
        >
          {item.icon}
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium
              ${item.badgeHot ? "bg-orange-50 text-orange-500" : "bg-gray-100 text-gray-500"}`}
            >
              {item.badge}
            </span>
          )}
        </div>
      ))}
    </div>

    <div className="px-3 pt-3 pb-2">
      <p className="text-[10px] text-gray-400 tracking-widest uppercase px-2 mb-1.5">
        Explore
      </p>
      {exploreItems.map((item) => (
        <div
          key={item.label}
          onClick={onClose}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] cursor-pointer text-[13px] text-gray-500 hover:bg-gray-50 hover:text-gray-800 mb-0.5 transition-all"
        >
          {item.icon}
          {item.label}
        </div>
      ))}
    </div>

    <div className="mt-auto px-3 pt-4 border-t border-gray-100">
      <a
        href="https://www.kaggle.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg hover:bg-gray-50 transition-all group"
      >
        <div className="w-7 h-7 rounded-md bg-[#20BEFF]/10 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#20BEFF">
            <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.334z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-gray-700">
              Kaggle Dataset
            </p>
            <svg
              viewBox="0 0 10 10"
              fill="none"
              className="w-2.5 h-2.5 text-gray-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M2 8l6-6M8 8V2H2" />
            </svg>
          </div>
          <p className="text-[10px] text-gray-400">Ahmedabad · 2025–26</p>
        </div>
      </a>
    </div>
  </>
);

// ── Field Error ────────────────────────────────────────────
const FieldError = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="text-[11px] text-red-500 flex items-center gap-1 mt-0.5">
      <svg
        viewBox="0 0 12 12"
        fill="currentColor"
        className="w-3 h-3 flex-shrink-0"
      >
        <path d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1zm.5 7.5h-1v-1h1v1zm0-2h-1V3h1v3.5z" />
      </svg>
      {msg}
    </p>
  ) : null;

// ── Main Component ─────────────────────────────────────────
const PricePrediction = () => {
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [bhk, setBhk] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [isNewFlat, setIsNewFlat] = useState(false);
  const [floorNo, setFloorNo] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const allAreas = Object.entries(ahmedabadFlatAreas);

  const inputBase =
    "bg-white border text-gray-700 text-sm px-3 py-2.5 rounded-lg outline-none transition-all placeholder:text-gray-300";
  const inputNormal = `${inputBase} border-gray-200 focus:border-[#6E83B2] focus:ring-1 focus:ring-[#6E83B2]/20`;
  const inputErr = `${inputBase} border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-200`;

  // live floor cross-check helper
  const checkFloorExceed = (fn: string, tf: string) => {
    const f = parseInt(fn),
      t = parseInt(tf);
    if (fn && tf && !isNaN(f) && !isNaN(t) && f > t) {
      setErrors((p) => ({
        ...p,
        floorExceeds: "Floor number cannot exceed total floors.",
      }));
    } else {
      setErrors((p) => ({ ...p, floorExceeds: undefined }));
    }
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!location) e.location = "Please select an area.";
    if (!bhk) e.bhk = "Please select BHK configuration.";
    if (!furnishing) e.furnishing = "Please select furnishing status.";

    if (!area) {
      e.area = "Please enter the area in sq ft.";
    } else {
      const sqft = parseInt(area);
      if (isNaN(sqft) || sqft <= 0) e.area = "Enter a valid area.";
      else if (bhk && sqft < BHK_MIN_SQFT[bhk])
        e.sqftMin = `Minimum ${BHK_MIN_SQFT[bhk].toLocaleString()} sq ft required for ${bhk}.`;
    }

    if (!floorNo) {
      e.floorNo = "Please enter the floor number.";
    } else if (parseInt(floorNo) < 0) {
      e.floorNo = "Floor number cannot be negative.";
    }

    if (!totalFloors) {
      e.totalFloors = "Please enter total floors in building.";
    } else if (parseInt(totalFloors) < 1) {
      e.totalFloors = "Total floors must be at least 1.";
    }

    if (floorNo && totalFloors) {
      const f = parseInt(floorNo),
        t = parseInt(totalFloors);
      if (!isNaN(f) && !isNaN(t) && f > t)
        e.floorExceeds = "Floor number cannot exceed total floors.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const runPrediction = () => {
    if (!validate()) return;

    const sqft = parseInt(area);
    const floorNumber = parseInt(floorNo);
    const totalFloorCount = parseInt(totalFloors);
    // ── compute relative floor ─────────────────────────────
    // relative_floor = floor_number / total_floors
    // Ground floor (0) → 0.0  |  Top floor → 1.0
    const relativeFloor = parseFloat(
      (floorNumber / totalFloorCount).toFixed(4),
    );

    const bhkMul: Record<string, number> = {
      "1 BHK": 0.88,
      "2 BHK": 1.0,
      "3 BHK": 1.08,
      "4 BHK": 1.14,
      "5 BHK": 1.2,
    };
    const furMul: Record<string, number> = {
      Unfurnished: 1.0,
      "Semi-Furnished": 1.05,
      Furnished: 1.12,
    };
    const newBonus = isNewFlat ? 1.07 : 1.0;

    const estimated =
      Math.round(
        (sqft *
          6867 *
          (bhkMul[bhk] ?? 1) *
          (furMul[furnishing] ?? 1) *
          newBonus) /
          1000,
      ) * 1000;
    const low = Math.round((estimated * 0.92) / 1000) * 1000;
    const high = Math.round((estimated * 1.08) / 1000) * 1000;

    // ── payload ready to send to backend ──────────────────
    const backendPayload = {
      area: location,
      bhk,
      area_sqft: sqft,
      furnishing,
      is_new_flat: Number(isNewFlat),
      floor_number: floorNumber,
      total_floors: totalFloorCount,
    };

    // ── console output ─────────────────────────────────────
    console.log("─────────────────────────────────────────────");
    console.log("📦 Backend Payload :", backendPayload);
    console.groupEnd();

    setResult({
      price: "₹" + estimated.toLocaleString("en-IN"),
      rangeLow: "₹" + low.toLocaleString("en-IN"),
      rangeHigh: "₹" + high.toLocaleString("en-IN"),
      sqftRate: "₹" + Math.round(estimated / sqft).toLocaleString("en-IN"),
      conf: 88,
    });
  };

  return (
    <div className="flex h-screen bg-white text-gray-800 font-sans overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-[220px] min-w-[220px] bg-white border-r border-gray-100 flex-col py-6 shadow-sm z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile Drawer ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50 w-[260px] bg-white flex flex-col py-6 h-full shadow-2xl animate-slide-in">
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto flex flex-col bg-white min-w-0">
        {/* Mobile Top Bar */}
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

        {/* ── Hero Section ── */}
        <div className="relative h-[280px] sm:h-[340px] lg:h-[380px] w-full bg-gradient-to-r from-[#6E83B2] to-[#96A7C5] text-white flex items-center overflow-hidden flex-shrink-0">
          <div className="ml-6 sm:ml-10 lg:ml-14 z-10 max-w-[55%] sm:max-w-[50%]">
            <p className="text-[10px] sm:text-xs tracking-widest uppercase text-white/60 mb-2">
              XGBoost · Machine Learning Project
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              House Price
              <br />
              Prediction Model
            </h1>
            <p className="mt-3 opacity-80 text-xs sm:text-sm leading-relaxed max-w-xs hidden sm:block">
              An ML model trained on real Ahmedabad property data from 2025–26.
              Achieves an R² of 0.90 and a test score of 94.39% with minimal
              overfitting.
            </p>
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button className="bg-white text-[#6E83B2] text-xs sm:text-sm font-semibold px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                Try Prediction
              </button>
              <button className="border border-white/40 text-white text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                View Model Stats
              </button>
            </div>
          </div>
          <img
            className="absolute right-0 lg:top-1/2 bottom-[-50px] -translate-y-1/3 w-[55%] sm:w-[55%] lg:w-[600px] drop-shadow-2xl"
            src={assets.houseimge}
            alt="house_image"
          />
        </div>

        {/* ── Content ── */}
        <div className="px-4 sm:px-8 lg:px-12 py-7 sm:py-10 flex-1 bg-white">
          <div className="mb-5 sm:mb-7">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              What we are offering
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Fill in all property details below to generate an AI-powered price
              estimate
            </p>
          </div>

          {/* ── Prediction Form ── */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-6 mb-6">
            {/* Row 1 — Area · BHK · Furnishing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
              {/* Area dropdown */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">
                  Area <span className="text-red-400">*</span>
                </label>
                <select
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setErrors((p) => ({ ...p, location: undefined }));
                  }}
                  className={errors.location ? inputErr : inputNormal}
                >
                  <option value="">Select area…</option>
                  {allAreas.map(([category, areas]) => (
                    <optgroup key={category} label={`── ${category}`}>
                      {areas.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <FieldError msg={errors.location} />
              </div>

              {/* BHK */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">
                  BHK Configuration <span className="text-red-400">*</span>
                </label>
                <select
                  value={bhk}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBhk(val);
                    setErrors((p) => ({
                      ...p,
                      bhk: undefined,
                      sqftMin: undefined,
                    }));
                    if (area && val) {
                      const sqft = parseInt(area);
                      const min = BHK_MIN_SQFT[val];
                      if (!isNaN(sqft) && sqft < min)
                        setErrors((p) => ({
                          ...p,
                          sqftMin: `Minimum ${min.toLocaleString()} sq ft required for ${val}.`,
                        }));
                    }
                  }}
                  className={errors.bhk ? inputErr : inputNormal}
                >
                  <option value="">Select BHK…</option>
                  <option>1 BHK</option>
                  <option>2 BHK</option>
                  <option>3 BHK</option>
                  <option>4 BHK</option>
                  <option>5 BHK</option>
                </select>
                <FieldError msg={errors.bhk} />
              </div>

              {/* Furnishing */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">
                  Furnishing Status <span className="text-red-400">*</span>
                </label>
                <select
                  value={furnishing}
                  onChange={(e) => {
                    setFurnishing(e.target.value);
                    setErrors((p) => ({ ...p, furnishing: undefined }));
                  }}
                  className={errors.furnishing ? inputErr : inputNormal}
                >
                  <option value="">Select furnishing…</option>
                  <option>Unfurnished</option>
                  <option>Semi-Furnished</option>
                  <option>Furnished</option>
                </select>
                <FieldError msg={errors.furnishing} />
              </div>
            </div>

            {/* Row 2 — Sq ft · Floor Number · Total Floors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
              {/* Sq ft */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">
                  Area (sq ft) <span className="text-red-400">*</span>
                  {bhk && (
                    <span className="ml-1 text-[10px] text-[#6E83B2] font-normal">
                      min {BHK_MIN_SQFT[bhk].toLocaleString()} for {bhk}
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  placeholder={
                    bhk ? `min ${BHK_MIN_SQFT[bhk]} sq ft` : "e.g. 1200"
                  }
                  value={area}
                  onChange={(e) => {
                    setArea(e.target.value);
                    setErrors((p) => ({
                      ...p,
                      area: undefined,
                      sqftMin: undefined,
                    }));
                    if (bhk && e.target.value) {
                      const sqft = parseInt(e.target.value);
                      const min = BHK_MIN_SQFT[bhk];
                      if (!isNaN(sqft) && sqft < min)
                        setErrors((p) => ({
                          ...p,
                          sqftMin: `Minimum ${min.toLocaleString()} sq ft required for ${bhk}.`,
                        }));
                    }
                  }}
                  className={
                    errors.area || errors.sqftMin ? inputErr : inputNormal
                  }
                />
                <FieldError msg={errors.area || errors.sqftMin} />
              </div>

              {/* Floor Number */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">
                  Floor Number <span className="text-red-400">*</span>
                  <span className="ml-1 text-[10px] text-gray-400 font-normal">
                    (0 = Ground)
                  </span>
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 3"
                  value={floorNo}
                  onChange={(e) => {
                    setFloorNo(e.target.value);
                    setErrors((p) => ({ ...p, floorNo: undefined }));
                    checkFloorExceed(e.target.value, totalFloors);
                  }}
                  className={
                    errors.floorNo || errors.floorExceeds
                      ? inputErr
                      : inputNormal
                  }
                />
                <FieldError msg={errors.floorNo || errors.floorExceeds} />
              </div>

              {/* Total Floors */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">
                  Total Floors in Building{" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="e.g. 10"
                  value={totalFloors}
                  onChange={(e) => {
                    setTotalFloors(e.target.value);
                    setErrors((p) => ({ ...p, totalFloors: undefined }));
                    checkFloorExceed(floorNo, e.target.value);
                  }}
                  className={
                    errors.totalFloors || errors.floorExceeds
                      ? inputErr
                      : inputNormal
                  }
                />
                <FieldError msg={errors.totalFloors} />

                {/* Relative floor live preview */}
                {floorNo &&
                  totalFloors &&
                  !errors.floorExceeds &&
                  parseInt(totalFloors) >= 1 && (
                    <p className="text-[11px] text-[#6E83B2] mt-0.5 flex items-center gap-1">
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="#6E83B2"
                        strokeWidth="1.4"
                        className="w-3 h-3"
                      >
                        <circle cx="6" cy="6" r="5" />
                        <path d="M6 4v3M6 8.5v.5" />
                      </svg>
                      Relative floor ={" "}
                      {(parseInt(floorNo) / parseInt(totalFloors)).toFixed(4)}
                      &nbsp;({floorNo}/{totalFloors})
                    </p>
                  )}
              </div>
            </div>

            {/* Row 3 — New flat checkbox */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-5">
              <div className="flex flex-col gap-1 justify-end pb-0.5">
                <label className="text-xs font-medium text-gray-500">
                  Property Condition
                </label>
                <label className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-lg px-3 py-2.5 cursor-pointer hover:border-[#6E83B2]/40 transition-all select-none">
                  <input
                    type="checkbox"
                    checked={isNewFlat}
                    onChange={(e) => setIsNewFlat(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#6E83B2] cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">
                    New / Under-construction flat
                  </span>
                  {isNewFlat && (
                    <span className="ml-auto text-[10px] bg-green-50 text-green-600 font-semibold px-1.5 py-0.5 rounded-full">
                      +7%
                    </span>
                  )}
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={runPrediction}
              className="inline-flex items-center gap-2 bg-[#6E83B2] text-white text-sm font-semibold px-5 sm:px-6 py-2.5 rounded-lg hover:bg-[#5a6f9e] transition-colors cursor-pointer w-full sm:w-auto justify-center sm:justify-start"
            >
              <svg
                viewBox="0 0 14 14"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path d="M7 0l2 5h5l-4 3 1.5 5L7 10l-4.5 3L4 8 0 5h5z" />
              </svg>
              Generate Prediction
            </button>
          </div>

          {/* ── Result Panel ── */}
          {result && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="sm:col-span-2 bg-[#6E83B2] rounded-2xl p-5 sm:p-6 text-white">
                <p className="text-[10px] sm:text-xs tracking-widest uppercase text-white/60 mb-2">
                  Estimated Market Value
                </p>
                <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {result.price}
                </p>
                <p className="text-xs sm:text-sm text-white/60 mt-1">
                  Range: {result.rangeLow} — {result.rangeHigh}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                    {location}
                  </span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                    {bhk}
                  </span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                    {furnishing}
                  </span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                    Floor {floorNo}/{totalFloors}
                  </span>
                  {isNewFlat && (
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                      New Flat
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-white/60 mb-1.5">
                    <span>Confidence Score</span>
                    <span>{result.conf}%</span>
                  </div>
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-700"
                      style={{ width: `${result.conf}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5">
                <div className="w-9 h-9 bg-[#6E83B2]/10 rounded-lg flex items-center justify-center mb-3">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="w-4 h-4"
                    stroke="#6E83B2"
                    strokeWidth="1.5"
                  >
                    <rect x="1" y="1" width="14" height="14" rx="2" />
                    <path d="M5 11l6-6M5 5h.01M11 11h.01" />
                  </svg>
                </div>
                <p className="text-xl font-bold text-gray-800">
                  {result.sqftRate}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Price per sq ft</p>
                <p className="text-xs text-green-500 mt-2 font-medium">
                  ↑ 4.2% vs last quarter
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5">
                <div className="w-9 h-9 bg-[#6E83B2]/10 rounded-lg flex items-center justify-center mb-3">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="w-4 h-4"
                    stroke="#6E83B2"
                    strokeWidth="1.5"
                  >
                    <path d="M2 12l4-4 3 3 5-7" />
                  </svg>
                </div>
                <p className="text-xl font-bold text-gray-800">High</p>
                <p className="text-xs text-gray-400 mt-0.5">Demand Index</p>
                <p className="text-xs text-green-500 mt-2 font-medium">
                  ↑ Active buyer zone
                </p>
              </div>
            </div>
          )}

          {/* ── Model Showcase ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-10">
            {[
              {
                icon: (
                  <svg
                    viewBox="0 0 40 40"
                    fill="none"
                    className="w-9 h-9"
                    stroke="#6E83B2"
                    strokeWidth="1.5"
                  >
                    <rect x="4" y="6" width="32" height="28" rx="2" />
                    <path d="M4 14h32M13 14v20M22 14v20M10 21h6M19 21h6M10 25h6M19 25h6" />
                  </svg>
                ),
                tag: "Algorithm",
                title: "Powered by XGBoost",
                desc: "Built on XGBoost — a high-performance gradient boosting algorithm. Trained on real Ahmedabad property data from 2025–26 with engineered features including area, BHK, furnished, and property age.",
                stats: [
                  { label: "Train Score", value: "95.06%" },
                  { label: "Test Score", value: "94.39%" },
                ],
              },
              {
                icon: (
                  <svg
                    viewBox="0 0 40 40"
                    fill="none"
                    className="w-9 h-9"
                    stroke="#6E83B2"
                    strokeWidth="1.5"
                  >
                    <circle cx="20" cy="20" r="13" strokeDasharray="3 2" />
                    <circle cx="20" cy="20" r="7" />
                    <path d="M20 7v4M20 29v4M7 20h4M29 20h4" />
                  </svg>
                ),
                tag: "Accuracy",
                title: "R² Score of 0.9042",
                desc: "The model explains over 90% of price variance in unseen data. With a near-zero train/test gap of just 0.01, it generalises well without overfitting — reliable across different localities and property types.",
                stats: [
                  { label: "R² Score", value: "0.9042" },
                  { label: "Overfit Gap", value: "0.01" },
                ],
              },
              {
                icon: (
                  <svg
                    viewBox="0 0 40 40"
                    fill="none"
                    className="w-9 h-9"
                    stroke="#6E83B2"
                    strokeWidth="1.5"
                  >
                    <path d="M8 30l6-9 5 5 5-8 8 12" />
                    <circle
                      cx="8"
                      cy="30"
                      r="1.8"
                      fill="#6E83B2"
                      stroke="none"
                    />
                    <circle
                      cx="14"
                      cy="21"
                      r="1.8"
                      fill="#6E83B2"
                      stroke="none"
                    />
                    <circle
                      cx="19"
                      cy="26"
                      r="1.8"
                      fill="#6E83B2"
                      stroke="none"
                    />
                    <circle
                      cx="24"
                      cy="18"
                      r="1.8"
                      fill="#6E83B2"
                      stroke="none"
                    />
                    <circle
                      cx="32"
                      cy="30"
                      r="1.8"
                      fill="#6E83B2"
                      stroke="none"
                    />
                    <rect x="4" y="6" width="32" height="28" rx="2" />
                  </svg>
                ),
                tag: "Error Metrics",
                title: "MAE ₹35L · RMSE ₹60L",
                desc: "On average, predictions deviate by ₹35 Lakhs from actual sale prices — reasonable for a market with properties ranging from ₹30L to ₹10Cr+. RMSE of ₹60L reflects sensitivity to high-end outliers.",
                stats: [
                  { label: "MAE", value: "₹35 Lacs" },
                  { label: "RMSE", value: "₹60 Lacs" },
                ],
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  {item.icon}
                  <span className="text-[10px] font-semibold text-[#6E83B2] bg-[#6E83B2]/10 px-2 py-0.5 rounded-full tracking-wide">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4 flex-1">
                  {item.desc}
                </p>
                <div className="flex gap-3 pt-3 border-t border-gray-200">
                  {item.stats.map((s, j) => (
                    <div
                      key={j}
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-center"
                    >
                      <p className="text-sm font-bold text-[#6E83B2]">
                        {s.value}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PricePrediction;
