"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { US_MISSIONS, WORLD_MISSIONS } from "@/lib/missions";
import { getMissionsByState, getMissionsByCountry } from "@/lib/mission-regions";
import { USMap } from "@/components/USMap";
import { WorldMap } from "@/components/WorldMap";

function stripAccents(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

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
    ? baseMissions.filter((m) =>
        stripAccents(m.toLowerCase()).includes(stripAccents(search.toLowerCase()))
      )
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
        <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-2 border-gray-700">
          <Image
            src="/cohen.jpg"
            alt="Cohen"
            width={192}
            height={192}
            className="w-full h-full object-cover object-top"
            priority
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          Cohen&apos;s Mission Call
        </h1>
        <p className="text-lg text-gray-400 mb-12 text-center">
          Where do you think he&apos;ll be called to serve?
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => {
              setMapType("us");
              setScreen("select");
            }}
            className="group relative bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-8 w-72 border-2 border-gray-800 hover:border-blue-500 cursor-pointer"
          >
            <div className="text-6xl mb-4 text-center">🇺🇸</div>
            <h2 className="text-2xl font-semibold text-white text-center">
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
            className="group relative bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-8 w-72 border-2 border-gray-800 hover:border-blue-500 cursor-pointer"
          >
            <div className="text-6xl mb-4 text-center">🌍</div>
            <h2 className="text-2xl font-semibold text-white text-center">
              World
            </h2>
            <p className="text-gray-500 mt-2 text-center text-sm">
              {WORLD_MISSIONS.length} missions
            </p>
          </button>
        </div>

        <Link
          href="/results"
          className="mt-12 text-blue-400 hover:text-blue-300 underline text-sm"
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
            className="text-gray-500 hover:text-gray-300 text-sm cursor-pointer"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">
            {mapType === "us" ? "🇺🇸 US Missions" : "🌍 World Missions"}
          </h1>
        </div>

        {/* Map */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 mb-4 overflow-hidden">
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
            <span className="text-sm text-gray-400">
              Showing missions in <strong className="text-gray-200">{selectedRegion}</strong>
            </span>
            <button
              onClick={() => setSelectedRegion(null)}
              className="text-xs text-blue-400 hover:text-blue-300 underline cursor-pointer"
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
          className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none mb-4 text-lg"
        />

        {/* Mission list */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-gray-800 bg-gray-900 max-h-80">
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
                className={`w-full text-left px-4 py-3 hover:bg-gray-800 border-b border-gray-800 last:border-b-0 transition-colors cursor-pointer ${
                  selected === mission
                    ? "bg-gray-800 text-blue-400"
                    : "text-gray-300"
                }`}
              >
                {mission}
              </button>
            ))
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirm && selected && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-2">
                Confirm Your Guess
              </h2>
              <p className="text-gray-400 mb-6">You&apos;re guessing:</p>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                <p className="text-xl font-semibold text-blue-400 text-center">
                  {selected}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setSelected(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={submitGuess}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 disabled:opacity-50 transition-colors cursor-pointer"
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
