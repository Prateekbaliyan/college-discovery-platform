"use client";

import { useEffect, useMemo, useState } from "react";
import { CollegeCard } from "./CollegeCard";

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

type ResponseData = {
  colleges: College[];
  meta: { total: number; page: number; limit: number };
};

export function CollegeSearch() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location) params.set("location", location);
    if (maxFees) params.set("maxFees", maxFees);
    params.set("page", String(page));
    params.set("limit", "10");
    return params.toString();
  }, [search, location, maxFees, page]);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`${apiBase}/api/colleges?${queryString}`)
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load colleges");
        return res.json();
      })
      .then((payload: ResponseData) => {
        setData(payload);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [queryString]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Search
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2" placeholder="College name" />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Location
            <input value={location} onChange={(event) => setLocation(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2" placeholder="City or state" />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Max fees
            <input value={maxFees} onChange={(event) => setMaxFees(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2" placeholder="e.g. 180000" />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-6 text-center text-slate-700 shadow-sm">Loading colleges...</div>
      ) : error ? (
        <div className="rounded-3xl bg-rose-50 p-6 text-center text-rose-700 shadow-sm">{error}</div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">Results</p>
                <h2 className="text-xl font-semibold text-slate-900">Colleges found</h2>
              </div>
              <p className="text-sm text-slate-500">{data?.meta.total ?? 0} colleges</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-2">
            {data?.colleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>

          <div className="rounded-3xl bg-white p-6 text-slate-700 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm">Page {data?.meta.page} of {Math.max(1, Math.ceil((data?.meta.total ?? 0) / (data?.meta.limit ?? 10)))}</p>
              <div className="flex items-center gap-3">
                <button disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
                <button disabled={data && page >= Math.ceil(data.meta.total / data.meta.limit)} onClick={() => setPage((current) => current + 1)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
