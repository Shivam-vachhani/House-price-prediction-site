import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  {
    label: "Price Prediction",
    path: "/",
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
  },
  {
    label: "Market Trends",
    path: "/market-trends",
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
  },
];

const exploreItems = [
  {
    label: "Compare Models",
    path: "/compare",
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

interface SidebarContentProps {
  onClose?: () => void;
}

const SidebarContent = ({ onClose }: SidebarContentProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    navigate(path);
    onClose?.(); // close mobile drawer if open
  };

  return (
    <>
      {/* ── Logo ── */}
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

      {/* ── Main nav ── */}
      <div className="px-3 pt-5 pb-2">
        <p className="text-[10px] text-gray-400 tracking-widest uppercase px-2 mb-1.5">
          Main
        </p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.label}
              onClick={() => handleNav(item.path)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] cursor-pointer text-[13px] mb-0.5 transition-all
                ${
                  isActive
                    ? "bg-[#6E83B2]/10 text-[#6E83B2] font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
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
          );
        })}
      </div>

      {/* ── Explore nav ── */}
      <div className="px-3 pt-3 pb-2">
        <p className="text-[10px] text-gray-400 tracking-widest uppercase px-2 mb-1.5">
          Explore
        </p>
        {exploreItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.label}
              onClick={() => handleNav(item.path)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] cursor-pointer text-[13px] mb-0.5 transition-all
                ${
                  isActive
                    ? "bg-[#6E83B2]/10 text-[#6E83B2] font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
            >
              {item.icon}
              {item.label}
            </div>
          );
        })}
      </div>

      {/* ── Kaggle footer ── */}
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
};

export default SidebarContent;
