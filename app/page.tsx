"use client";

import { useState } from "react";
import Card from "@/components/Card";
import BulletList from "@/components/BulletList";
import DecisionCard from "@/components/DecisionCard";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

type AnalysisResult = {
  company: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  risks: string[];
  decision: "INVEST" | "PASS";
  confidence: number;
  reasoning: string;
};

export default function Home() {
  const [company, setCompany] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!company.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company }),
      });

      if (!res.ok) throw new Error("Analysis failed. Please try again.");

      const data: AnalysisResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // px-4 on mobile, px-6 on larger screens — Responsive Design
    <main className="min-h-screen bg-gray-950 text-white px-4 sm:px-6 py-10 sm:py-12 max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        AI Investment Research Agent
      </h1>
      <p className="text-gray-400 mb-8 text-sm sm:text-base">
        Enter a company name to get a structured investment analysis.
      </p>

      {/* flex-col on mobile so button doesn't get squeezed, flex-row on larger screens */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          placeholder="e.g. Apple, Tesla, NVIDIA"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                     text-white placeholder-gray-500 focus:outline-none
                     focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !company.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700
                     disabled:cursor-not-allowed text-white font-semibold
                     px-6 py-3 rounded-lg transition-colors"
        >
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </div>

      {loading && <LoadingState />}

      {error && !loading && (
        <ErrorState message={error} onRetry={handleAnalyze} />
      )}

      {!loading && !result && !error && (
        <div className="text-center py-16 sm:py-20 text-gray-600 border border-dashed border-gray-800 rounded-xl">
          Your analysis will appear here.
        </div>
      )}

      {result && !loading && (
        <div className="space-y-4">
          <Card title="Summary">
            <p className="text-gray-300 text-sm leading-relaxed">
              {result.summary}
            </p>
          </Card>

          {/* grid-cols-1 on mobile (stacked), 2 columns from sm breakpoint up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card title="✅ Pros (Strengths)">
              <BulletList items={result.strengths} />
            </Card>
            <Card title="⚠️ Cons (Weaknesses)">
              <BulletList items={result.weaknesses} />
            </Card>
            <Card title="🚀 Opportunities">
              <BulletList items={result.opportunities} />
            </Card>
            <Card title="🔴 Risks">
              <BulletList items={result.risks} />
            </Card>
          </div>

          <DecisionCard
            decision={result.decision}
            confidence={result.confidence}
            reasoning={result.reasoning}
          />
        </div>
      )}
    </main>
  );
}