"use client";

import { memo, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { TOPO_TO_COUNTRY } from "@/lib/mission-regions";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface HeatMapProps {
  countsByTopoCountry: Record<string, number>;
}

function getHeatColor(count: number, maxCount: number): string {
  if (count === 0) return "#e5e7eb";
  const intensity = Math.min(count / maxCount, 1);
  // Gradient from light blue to deep blue
  if (intensity < 0.2) return "#dbeafe";
  if (intensity < 0.4) return "#93c5fd";
  if (intensity < 0.6) return "#60a5fa";
  if (intensity < 0.8) return "#3b82f6";
  return "#1d4ed8";
}

function HeatMapInner({ countsByTopoCountry }: HeatMapProps) {
  const maxCount = useMemo(
    () => Math.max(1, ...Object.values(countsByTopoCountry)),
    [countsByTopoCountry]
  );

  return (
    <div>
      <ComposableMap
        projectionConfig={{ scale: 147 }}
        width={800}
        height={400}
        className="w-full h-auto"
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const topoName = geo.properties.name;
                const countryKey = TOPO_TO_COUNTRY[topoName] || "";
                const count = countsByTopoCountry[topoName] || 0;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={
                      countryKey
                        ? getHeatColor(count, maxCount)
                        : "#f3f4f6"
                    }
                    stroke="#fff"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: countryKey ? getHeatColor(count, maxCount) : "#f3f4f6" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {/* Legend */}
      <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500">
        <span>Fewer</span>
        <div className="flex gap-0.5">
          {["#dbeafe", "#93c5fd", "#60a5fa", "#3b82f6", "#1d4ed8"].map((c) => (
            <div
              key={c}
              className="w-6 h-3 rounded-sm"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <span>More guesses</span>
      </div>
    </div>
  );
}

export const HeatMap = memo(HeatMapInner);
