"use client";

import { useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

type College = {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placement_percent: number;
  top_course: string;
};

export function PredictorTool() {
  const [rank, setRank] = useState("");
  const [exam, setExam] = useState("JEE");
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const rankValue = Number(rank);
    if (!rankValue) {
      setError("Please enter a valid rank.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiBase}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exam, rank: rankValue }),
      });
      if (!response.ok) throw new Error("Prediction failed");
      const payload = await response.json();
      setColleges(payload.prediction);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Simple predictor</h2>
        <p className="mt-2 text-sm text-slate-600">Enter your exam and rank to find colleges that are a good fit.</p>

        <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Exam
            <select value={exam} onChange={(event) => setExam(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <option>JEE</option>
              <option>NEET</option>
              <option>Other</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Rank
            <input value={rank} onChange={(event) => setRank(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2" placeholder="e.g. 4500" />
          </label>

          <button type="submit" className="rounded-2xl bg-indigo-600 px-5 py-3 text-white transition hover:bg-indigo-700">Predict</button>
        </form>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-6 text-center text-slate-700 shadow-sm">Running prediction...</div>
      ) : error ? (
        <div className="rounded-3xl bg-rose-50 p-6 text-center text-rose-700 shadow-sm">{error}</div>
      ) : colleges.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {colleges.map((college) => (
            <div key={college.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{college.name}</h3>
              <p className="mt-2 text-sm text-slate-500">{college.location}</p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p><strong>Fees:</strong> ₹{college.fees.toLocaleString()}</p>
                <p><strong>Rating:</strong> {college.rating}</p>
                <p><strong>Placement:</strong> {college.placement_percent}%</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-50 p-6 text-slate-600 shadow-sm">No predicted colleges yet. Submit your rank to see options.</div>
      )}
    </div>
  );
}
