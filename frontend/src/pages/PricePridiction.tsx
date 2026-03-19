import { useRef, useState } from "react";

import AppShell from "../components/AppShell";
import HeroSection from "../components/Herosection";
import PredictionForm from "../components/Predictionform";
import ResultPanel from "../components/Resultpanel";
import ModelShowcase from "../components/Modelshowcase ";
import { BHK_MIN_SQFT } from "../lib/Areadata";
import type { FormErrors, PredictionResult } from "../lib/interface";

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

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!location) e.location = "Please select an area.";
    if (!bhk) e.bhk = "Please select BHK configuration.";
    if (!furnishing) e.furnishing = "Please select furnishing status.";
    if (!area) {
      e.area = "Please enter the area in sq ft.";
    } else {
      const sqft = parseInt(area);
      if (isNaN(sqft) || sqft <= 0) {
        e.area = "Enter a valid area.";
      } else if (bhk && sqft < BHK_MIN_SQFT[bhk]) {
        e.sqftMin = `Minimum ${BHK_MIN_SQFT[bhk].toLocaleString()} sq ft required for ${bhk}.`;
      }
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

  const secondSectionRef = useRef<HTMLDivElement>(null);

  const ScrollToSection = () => {
    secondSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const runPrediction = () => {
    if (!validate()) return;
    const sqft = parseInt(area);
    const payload = {
      area: location,
      bhk: Number(bhk.split(" ")[0]),
      area_sqft: sqft,
      furnishing,
      is_new_property: Number(isNewFlat),
      floor: parseInt(floorNo),
      total_floors: parseInt(totalFloors),
    };
    const backendUrl = import.meta.env.VITE_PREDICTION_URL;
    fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Server error: " + res.status);
        return res.json();
      })
      .then((data) => {
        setResult({
          price: "₹" + (data.predicted_price * 100000).toLocaleString("en-IN"),
          sqftRate:
            "₹" +
            Math.round((data.predicted_price * 100000) / sqft).toLocaleString(
              "en-IN",
            ),
          conf: 90,
        });
      })
      .catch((err) => console.warn("Backend fetch failed:", err));
  };

  // No dashboard prop → <main> uses overflow-y-auto, page scrolls freely
  return (
    <AppShell>
      <HeroSection onTryPredictClick={ScrollToSection} />
      <div className="px-4 sm:px-8 lg:px-12 py-7 sm:py-10 flex-1 bg-white">
        <div ref={secondSectionRef}>
          <div className="mb-5 sm:mb-7">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              What we are offering
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Fill in all property details below to generate an AI-powered price
              estimate
            </p>
          </div>

          <PredictionForm
            location={location}
            setLocation={setLocation}
            area={area}
            setArea={setArea}
            bhk={bhk}
            setBhk={setBhk}
            furnishing={furnishing}
            setFurnishing={setFurnishing}
            isNewFlat={isNewFlat}
            setIsNewFlat={setIsNewFlat}
            floorNo={floorNo}
            setFloorNo={setFloorNo}
            totalFloors={totalFloors}
            setTotalFloors={setTotalFloors}
            errors={errors}
            setErrors={setErrors}
            onSubmit={runPrediction}
          />
        </div>
        {result && (
          <ResultPanel
            result={result}
            location={location}
            bhk={bhk}
            furnishing={furnishing}
            floorNo={floorNo}
            totalFloors={totalFloors}
            isNewFlat={isNewFlat}
          />
        )}
        <ModelShowcase />
      </div>
    </AppShell>
  );
};

export default PricePrediction;
