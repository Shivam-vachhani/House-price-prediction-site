export interface PredictionResult {
  price: string;
  sqftRate: string;
  conf: number;
}

export interface FormErrors {
  location?: string;
  area?: string;
  bhk?: string;
  furnishing?: string;
  sqftMin?: string;
  floorNo?: string;
  totalFloors?: string;
  floorExceeds?: string;
}

export interface MarketData {
  kpis: {
    avg_price_lakhs: number;
    price_per_sqft: number;
    total_listings: number;
    top_locality: string;
  };
  locality_avg: Record<string, number>;
  bhk_median: Record<string, number>;
  histogram: { range: string; count: number }[];
  scatter: { area: number; Price: number }[];
  feature_importance: { feature: string; importance: number }[];
  actual_vs_predicted: { actual: number; pridicted: number }[];
}
