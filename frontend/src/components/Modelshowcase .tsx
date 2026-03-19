const MODEL_CARDS = [
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
        <circle cx="8" cy="30" r="1.8" fill="#6E83B2" stroke="none" />
        <circle cx="14" cy="21" r="1.8" fill="#6E83B2" stroke="none" />
        <circle cx="19" cy="26" r="1.8" fill="#6E83B2" stroke="none" />
        <circle cx="24" cy="18" r="1.8" fill="#6E83B2" stroke="none" />
        <circle cx="32" cy="30" r="1.8" fill="#6E83B2" stroke="none" />
        <rect x="4" y="6" width="32" height="28" rx="2" />
      </svg>
    ),
    tag: "Error Metrics",
    title: "MAE ₹35L · RMSE ₹60L",
    desc: "On average, predictions deviate by ₹35 Lakhs from actual sale prices — reasonable for a market with properties ranging from ₹30L to ₹10Cr+. RMSE of ₹60L reflects sensitivity to high-end outliers.",
    stats: [
      { label: "MAE", value: "₹35 Lakhs" },
      { label: "RMSE", value: "₹60 Lakhs" },
    ],
  },
];

const ModelShowcase = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-10">
    {MODEL_CARDS.map((item, i) => (
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
              <p className="text-sm font-bold text-[#6E83B2]">{s.value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default ModelShowcase;
