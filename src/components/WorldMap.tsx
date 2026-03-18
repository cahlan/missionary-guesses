"use client";

import { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { TOPO_TO_COUNTRY } from "@/lib/mission-regions";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  countriesWithMissions: Set<string>;
  selectedCountry: string | null;
  onSelectCountry: (country: string | null) => void;
}

function WorldMapInner({
  countriesWithMissions,
  selectedCountry,
  onSelectCountry,
}: WorldMapProps) {
  return (
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
              const countryKey = TOPO_TO_COUNTRY[geo.properties.name] || "";
              const hasMissions =
                countryKey !== "" && countriesWithMissions.has(countryKey);
              const isSelected = selectedCountry === countryKey;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => {
                    if (hasMissions) {
                      onSelectCountry(isSelected ? null : countryKey);
                    }
                  }}
                  fill={
                    isSelected
                      ? "#34d399"
                      : hasMissions
                      ? "#065f46"
                      : "#1f2937"
                  }
                  stroke="#374151"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: {
                      outline: "none",
                      fill: hasMissions
                        ? isSelected
                          ? "#6ee7b7"
                          : "#10b981"
                        : "#374151",
                    },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}

export const WorldMap = memo(WorldMapInner);
