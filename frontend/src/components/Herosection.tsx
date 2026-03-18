import React from "react";
import assets from "../assets/assets";

const HeroSection = () => (
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
);

export default HeroSection;
