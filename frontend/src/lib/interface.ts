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
