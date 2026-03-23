import type { PredictionResult } from "../lib/interface";

interface ResultPanelProps {
  result: PredictionResult;
  location: string;
  bhk: string;
  furnishing: string;
  floorNo: string;
  totalFloors: string;
  isNewFlat: boolean;
}

const ResultPanel = ({
  result,
  location,
  bhk,
  furnishing,
  floorNo,
  totalFloors,
  isNewFlat,
}: ResultPanelProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <div className="sm:col-span-2 bg-[#6E83B2] rounded-2xl p-5 sm:p-6 text-white">
      <p className="text-[10px] sm:text-xs tracking-widest uppercase text-white/60 mb-2">
        Estimated Market Value
      </p>
      <p className="text-3xl sm:text-4xl font-bold tracking-tight">
        {result.price}
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
      <p className="text-xl font-bold text-gray-800">{result.sqftRate}</p>
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
);

export default ResultPanel;
