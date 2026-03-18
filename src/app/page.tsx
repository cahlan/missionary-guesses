"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { US_MISSIONS, WORLD_MISSIONS } from "@/lib/missions";
import { getMissionsByState, getMissionsByCountry } from "@/lib/mission-regions";
import { USMap } from "@/components/USMap";
import { WorldMap } from "@/components/WorldMap";

type Screen = "home" | "select";
type MapType = "us" | "world";

export default function Home() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("home");
  const [mapType, setMapType] = useState<MapType>("us");
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const missionsByState = useMemo(() => getMissionsByState(), []);
  const missionsByCountry = useMemo(() => getMissionsByCountry(), []);

  const statesWithMissions = useMemo(
    () => new Set(Object.keys(missionsByState)),
    [missionsByState]
  );
  const countriesWithMissions = useMemo(
    () => new Set(Object.keys(missionsByCountry)),
    [missionsByCountry]
  );

  const missions = mapType === "us" ? US_MISSIONS : WORLD_MISSIONS;
  const regionMissions =
    mapType === "us"
      ? selectedRegion
        ? missionsByState[selectedRegion] || []
        : null
      : selectedRegion
      ? missionsByCountry[selectedRegion] || []
      : null;

  const baseMissions = regionMissions || missions;
  const filtered = search
    ? baseMissions.filter((m) => m.toLowerCase().includes(search.toLowerCase()))
    : baseMissions;

  async function submitGuess() {
    if (!selected) return;
    setSubmitting(true);
    await fetch("/api/guesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ missionName: selected }),
    });
    setSubmitting(false);
    setShowConfirm(false);
    setSelected(null);
    setSearch("");
    setSelectedRegion(null);
    router.push("/results");
  }

  // Home screen
  if (screen === "home") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
          Mission Call Guesses
        </h1>
        <p className="text-lg text-gray-600 mb-12 text-center">
          Where do you think he&apos;ll be called to serve?
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => {
              setMapType("us");
              setScreen("select");
            }}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-8 w-72 border-2 border-transparent hover:border-blue-500 cursor-pointer"
          >
            <div className="text-6xl mb-4 text-center">🇺🇸</div>
            <h2 className="text-2xl font-semibold text-gray-900 text-center">
              United States
            </h2>
            <p className="text-gray-500 mt-2 text-center text-sm">
              {US_MISSIONS.length} missions
            </p>
          </button>

          <button
            onClick={() => {
              setMapType("world");
              setScreen("select");
            }}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-8 w-72 border-2 border-transparent hover:border-blue-500 cursor-pointer"
          >
            <div className="text-6xl mb-4 text-center">🌍</div>
            <h2 className="text-2xl font-semibold text-gray-900 text-center">
              World
            </h2>
            <p className="text-gray-500 mt-2 text-center text-sm">
              {WORLD_MISSIONS.length} missions
            </p>
          </button>
        </div>

        <Link
          href="/results"
          className="mt-12 text-blue-600 hover:text-blue-800 underline text-sm"
        >
          View current guesses
        </Link>
      </div>
    );
  }

  // Selection screen
  if (screen === "select") {
    return (
      <div className="min-h-screen flex flex-col p-4 md:p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => {
              setScreen("home");
              setSearch("");
              setSelected(null);
              setSelectedRegion(null);
            }}
            className="text-gray-500 hover:text-gray-900 text-sm cursor-pointer"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {mapType === "us" ? "🇺🇸 US Missions" : "🌍 World Missions"}
          </h1>
        </div>

        {/* Map */}
        <div className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden">
          {mapType === "us" ? (
            <USMap
              statesWithMissions={statesWithMissions}
              selectedState={selectedRegion}
              onSelectState={setSelectedRegion}
            />
          ) : (
            <WorldMap
              countriesWithMissions={countriesWithMissions}
              selectedCountry={selectedRegion}
              onSelectCountry={setSelectedRegion}
            />
          )}
        </div>

        {/* Region indicator */}
        {selectedRegion && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-600">
              Showing missions in <strong>{selectedRegion}</strong>
            </span>
            <button
              onClick={() => setSelectedRegion(null)}
              className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
            >
              Show all
            </button>
          </div>
        )}

        {/* Search */}
        <input
          type="text"
          placeholder="Search missions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none mb-4 text-lg"
        />

        {/* Mission list */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white max-h-80">
          {filtered.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">No missions found</p>
          ) : (
            filtered.map((mission) => (
              <button
                key={mission}
                onClick={() => {
                  setSelected(mission);
                  setShowConfirm(true);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer ${
                  selected === mission
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-800"
                }`}
              >
                {mission}
              </button>
            ))
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirm && selected && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Confirm Your Guess
              </h2>
              <p className="text-gray-600 mb-6">You&apos;re guessing:</p>
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <p className="text-xl font-semibold text-blue-800 text-center">
                  {selected}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setSelected(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={submitGuess}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {submitting ? "Submitting..." : "Submit Guess"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
