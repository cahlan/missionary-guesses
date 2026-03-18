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
                      ? "#2563eb"
                      : hasMissions
                      ? "#93c5fd"
                      : "#e5e7eb"
                  }
                  stroke="#fff"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: {
                      outline: "none",
                      fill: hasMissions
                        ? isSelected
                          ? "#1d4ed8"
                          : "#60a5fa"
                        : "#d1d5db",
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
