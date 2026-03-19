"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { HeatMap } from "@/components/HeatMap";
import {
  aggregateGuessesByTopoCountry,
  aggregateGuessesByCountry,
} from "@/lib/mission-regions";

interface GuessCount {
  missionName: string;
  count: number;
}

interface CountryCount {
  country: string;
  count: number;
}

export default function ResultsPage() {
  const [results, setResults] = useState<GuessCount[]>([]);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [changedCountries, setChangedCountries] = useState<Set<string>>(new Set());
  const [newCountries, setNewCountries] = useState<Set<string>>(new Set());
  const prevCountryRef = useRef<Map<string, number>>(new Map());

  const fetchResults = useCallback(async () => {
    const res = await fetch("/api/guesses");
    const data: GuessCount[] = await res.json();

    // Aggregate by country for change detection
    const countryData = aggregateGuessesByCountry(data);
    const prevMap = prevCountryRef.current;

    if (prevMap.size > 0) {
      const changed = new Set<string>();
      const brand = new Set<string>();

      for (const item of countryData) {
        const prevCount = prevMap.get(item.country);
        if (prevCount === undefined) {
          brand.add(item.country);
          changed.add(item.country);
        } else if (prevCount !== item.count) {
          changed.add(item.country);
        }
      }

      if (changed.size > 0) {
        setChangedCountries(changed);
        setNewCountries(brand);
        setTimeout(() => {
          setChangedCountries(new Set());
          setNewCountries(new Set());
        }, 1500);
      }
    }

    const newMap = new Map<string, number>();
    for (const item of countryData) {
      newMap.set(item.country, item.count);
    }
    prevCountryRef.current = newMap;

    setResults(data);
    setTotalGuesses(data.reduce((sum, g) => sum + g.count, 0));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 5000);
    return () => clearInterval(interval);
  }, [fetchResults]);

  const countsByTopoCountry = useMemo(
    () => aggregateGuessesByTopoCountry(results),
    [results]
  );

  const countryResults: CountryCount[] = useMemo(
    () => aggregateGuessesByCountry(results),
    [results]
  );

  return (
    <div className="h-screen flex flex-col p-4 lg:p-6 max-w-[1600px] mx-auto overflow-hidden">
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-glow {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes flash-row {
          0% { background-color: transparent; }
          30% { background-color: rgba(52, 211, 153, 0.15); }
          100% { background-color: transparent; }
        }
        .animate-slide-in { animation: slideIn 0.5s ease-out; }
        .animate-pulse-glow { animation: pulse-glow 0.6s ease-in-out; }
        .animate-flash-row { animation: flash-row 1.5s ease-out; }
      `}</style>

      {/* Header row */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-white">Guesses So Far</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-6 py-2 text-center">
            <span className="text-2xl font-bold text-blue-400">{totalGuesses}</span>
            <span className="text-blue-400/70 text-sm ml-2">total</span>
          </div>
          <div className="hidden lg:flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2">
            <QRCodeSVG
              value="https://missionary-guesses.vercel.app/"
              size={48}
              bgColor="transparent"
              fgColor="#e5e7eb"
              level="M"
            />
            <div className="text-xs text-gray-400 leading-tight">
              <p className="font-semibold text-gray-300">Scan to guess!</p>
              <p>missionary-guesses.vercel.app</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content: side-by-side on landscape, stacked on portrait */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Heatmap */}
        {!loading && results.length > 0 && (
          <div className="lg:w-[70%] bg-gray-900 rounded-xl border border-gray-800 overflow-hidden p-4 flex flex-col justify-center shrink-0 lg:shrink">
            <div className="w-full">
              <HeatMap countsByTopoCountry={countsByTopoCountry} />
            </div>
          </div>
        )}

        {/* Results list — aggregated by country */}
        <div className="lg:w-[30%] flex-1 overflow-y-auto rounded-xl border border-gray-800 bg-gray-900 min-h-0">
          {loading ? (
            <p className="p-8 text-gray-500 text-center">Loading...</p>
          ) : countryResults.length === 0 ? (
            <p className="p-8 text-gray-500 text-center">
              No guesses yet. Be the first!
            </p>
          ) : (
            countryResults.map((r, i) => {
              const isNew = newCountries.has(r.country);
              const isChanged = changedCountries.has(r.country);

              return (
                <div
                  key={r.country}
                  className={`flex items-center justify-between px-4 py-3 border-b border-gray-800 last:border-b-0 transition-all ${
                    isNew ? "animate-slide-in" : ""
                  } ${isChanged ? "animate-flash-row" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 text-sm w-6 text-right">
                      {i + 1}.
                    </span>
                    <span className={`${isChanged ? "text-emerald-400" : "text-gray-300"} transition-colors duration-1000`}>
                      {r.country}
                    </span>
                  </div>
                  <span
                    className={`bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold ${
                      isChanged ? "animate-pulse-glow" : ""
                    }`}
                  >
                    {r.count}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Link
        href="/"
        className="mt-4 w-full px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors text-center block shrink-0 lg:hidden"
      >
        Make a Guess
      </Link>
    </div>
  );
}
