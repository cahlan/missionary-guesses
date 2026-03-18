"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { HeatMap } from "@/components/HeatMap";
import { aggregateGuessesByTopoCountry } from "@/lib/mission-regions";

interface GuessCount {
  missionName: string;
  count: number;
}

export default function ResultsPage() {
  const [results, setResults] = useState<GuessCount[]>([]);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/guesses");
    const data: GuessCount[] = await res.json();
    setResults(data);
    setTotalGuesses(data.reduce((sum, g) => sum + g.count, 0));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const countsByTopoCountry = useMemo(
    () => aggregateGuessesByTopoCountry(results),
    [results]
  );

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/"
          className="text-gray-500 hover:text-gray-900 text-sm"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Guesses So Far</h1>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 mb-6 text-center">
        <p className="text-3xl font-bold text-blue-800">{totalGuesses}</p>
        <p className="text-blue-600 text-sm">total guesses</p>
      </div>

      {/* Heatmap */}
      {!loading && results.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden p-4">
          <HeatMap countsByTopoCountry={countsByTopoCountry} />
        </div>
      )}

      {/* Results list */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <p className="p-8 text-gray-500 text-center">Loading...</p>
        ) : results.length === 0 ? (
          <p className="p-8 text-gray-500 text-center">
            No guesses yet. Be the first!
          </p>
        ) : (
          results.map((r, i) => (
            <div
              key={r.missionName}
              className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm w-6 text-right">
                  {i + 1}.
                </span>
                <span className="text-gray-800">{r.missionName}</span>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {r.count}
              </span>
            </div>
          ))
        )}
      </div>

      <Link
        href="/"
        className="mt-6 w-full px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-center block"
      >
        Make a Guess
      </Link>
    </div>
  );
}
