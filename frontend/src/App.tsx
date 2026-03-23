import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import PricePridiction from "./pages/PricePridiction";
import MarketTrends from "./pages/MarketTrends";
import CompareModels from "./pages/CompareModels";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PricePridiction />} />
          <Route path="/market-trends" element={<MarketTrends />} />
          <Route path="/compare" element={<CompareModels />} />
          {/* Fallback for 404 - Not Found */}
          <Route path="*" element={<h1>404 Page Not Found</h1>} />
        </Routes>
        <Analytics />
      </BrowserRouter>
    </>
  );
}

export default App;
