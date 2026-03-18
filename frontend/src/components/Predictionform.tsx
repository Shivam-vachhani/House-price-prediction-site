import React from "react";
import FieldError from "./Fielderror";
import { ahmedabadFlatAreas,BHK_MIN_SQFT } from "../lib/Areadata";
import type { FormErrors } from "../lib/interface";

interface PredictionFormProps {
  location: string;
  setLocation: (v: string) => void;
  area: string;
  setArea: (v: string) => void;
  bhk: string;
  setBhk: (v: string) => void;
  furnishing: string;
  setFurnishing: (v: string) => void;
  isNewFlat: boolean;
  setIsNewFlat: (v: boolean) => void;
  floorNo: string;
  setFloorNo: (v: string) => void;
  totalFloors: string;
  setTotalFloors: (v: string) => void;
  errors: FormErrors;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
  onSubmit: () => void;
}

const PredictionForm = ({
  location,
  setLocation,
  area,
  setArea,
  bhk,
  setBhk,
  furnishing,
  setFurnishing,
  isNewFlat,
  setIsNewFlat,
  floorNo,
  setFloorNo,
  totalFloors,
  setTotalFloors,
  errors,
  setErrors,
  onSubmit,
}: PredictionFormProps) => {
  const allAreas = Object.entries(ahmedabadFlatAreas);

  const inputBase =
    "bg-white border text-gray-700 text-sm px-3 py-2.5 rounded-lg outline-none transition-all placeholder:text-gray-300";
  const inputNormal = `${inputBase} border-gray-200 focus:border-[#6E83B2] focus:ring-1 focus:ring-[#6E83B2]/20`;
  const inputErr = `${inputBase} border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-200`;

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

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-6 mb-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">

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


        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">
            BHK Configuration <span className="text-red-400">*</span>
          </label>
          <select
            value={bhk}
            onChange={(e) => {
              const val = e.target.value;
              setBhk(val);
              setErrors((p) => ({ ...p, bhk: undefined, sqftMin: undefined }));
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


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">

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
            placeholder={bhk ? `min ${BHK_MIN_SQFT[bhk]} sq ft` : "e.g. 1200"}
            value={area}
            onChange={(e) => {
              setArea(e.target.value);
              setErrors((p) => ({ ...p, area: undefined, sqftMin: undefined }));
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
            className={errors.area || errors.sqftMin ? inputErr : inputNormal}
          />
          <FieldError msg={errors.area || errors.sqftMin} />
        </div>


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
              errors.floorNo || errors.floorExceeds ? inputErr : inputNormal
            }
          />
          <FieldError msg={errors.floorNo || errors.floorExceeds} />
        </div>


        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">
            Total Floors in Building <span className="text-red-400">*</span>
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
              errors.totalFloors || errors.floorExceeds ? inputErr : inputNormal
            }
          />
          <FieldError msg={errors.totalFloors} />

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
                {(parseInt(floorNo) / parseInt(totalFloors)).toFixed(4)}&nbsp; (
                {floorNo}/{totalFloors})
              </p>
            )}
        </div>
      </div>


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
            <span className="text-sm text-gray-700">New / Resell flat</span>
            {isNewFlat && (
              <span className="ml-auto text-[10px] bg-green-50 text-green-600 font-semibold px-1.5 py-0.5 rounded-full">
                +7%
              </span>
            )}
          </label>
        </div>
      </div>


      <button
        onClick={onSubmit}
        className="inline-flex items-center gap-2 bg-[#6E83B2] text-white text-sm font-semibold px-5 sm:px-6 py-2.5 rounded-lg hover:bg-[#5a6f9e] transition-colors cursor-pointer w-full sm:w-auto justify-center sm:justify-start"
      >
        <svg viewBox="0 0 14 14" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M7 0l2 5h5l-4 3 1.5 5L7 10l-4.5 3L4 8 0 5h5z" />
        </svg>
        Generate Prediction
      </button>
    </div>
  );
};

export default PredictionForm;
