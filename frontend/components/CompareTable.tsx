"use client";

import { useEffect, useState } from "react";

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

export function CompareTable() {
  const [ids, setIds] = useState("1,2");
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`${apiBase}/api/compare?ids=${ids}`)
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load comparison data");
        return res.json();
      })
      .then((payload) => setColleges(payload.colleges ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [ids]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Compare colleges by IDs
          <input value={ids} onChange={(event) => setIds(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2" placeholder="e.g. 1,2,3" />
        </label>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-6 text-center text-slate-700 shadow-sm">Loading comparison...</div>
      ) : error ? (
        <div className="rounded-3xl bg-rose-50 p-6 text-center text-rose-700 shadow-sm">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-3xl bg-white p-6 shadow-sm">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border-b border-slate-200 px-4 py-3">Attribute</th>
                {colleges.map((college) => (
                  <th key={college.id} className="border-b border-slate-200 px-4 py-3">{college.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Location", "location"],
                ["Fees", "fees"],
                ["Rating", "rating"],
                ["Placement %", "placement_percent"],
                ["Top course", "top_course"],
              ].map(([label, key]) => (
                <tr key={label} className="even:bg-slate-50">
                  <td className="border-b border-slate-200 px-4 py-3 font-medium text-slate-700">{label}</td>
                  {colleges.map((college) => (
                    <td key={`${college.id}-${label}`} className="border-b border-slate-200 px-4 py-3 text-slate-600">
                      {String((college as any)[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
