"use client";

import { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { TOPO_TO_STATE } from "@/lib/mission-regions";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface USMapProps {
  statesWithMissions: Set<string>;
  selectedState: string | null;
  onSelectState: (state: string | null) => void;
}

function USMapInner({ statesWithMissions, selectedState, onSelectState }: USMapProps) {
  return (
    <ComposableMap
      projection="geoAlbersUsa"
      projectionConfig={{ scale: 1000 }}
      width={800}
      height={500}
      className="w-full h-auto"
    >
      <ZoomableGroup>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = TOPO_TO_STATE[geo.properties.name] || geo.properties.name;
              const hasMissions = statesWithMissions.has(stateName);
              const isSelected = selectedState === stateName;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => {
                    if (hasMissions) {
                      onSelectState(isSelected ? null : stateName);
                    }
                  }}
                  fill={
                    isSelected
                      ? "#3b82f6"
                      : hasMissions
                      ? "#1e3a5f"
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
                          ? "#2563eb"
                          : "#2563eb80"
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

export const USMap = memo(USMapInner);
