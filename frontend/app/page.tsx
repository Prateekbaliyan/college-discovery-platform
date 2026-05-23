import Link from "next/link";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

async function getColleges(search = "", location = "", maxFees = "", page = 1) {
  const url = new URL(`${apiBase}/api/colleges`);
  if (search) url.searchParams.set("search", search);
  if (location) url.searchParams.set("location", location);
  if (maxFees) url.searchParams.set("maxFees", maxFees);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", "10");
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load colleges");
  return res.json();
}

export default async function Home() {
  const data = await getColleges();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 rounded-3xl bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">College discovery</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">Find the right college for your future</h1>
          <p className="mt-4 max-w-2xl text-slate-600">Search colleges by name, location, fees, and compare top options in one place.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/compare" className="rounded-xl bg-indigo-600 px-5 py-3 text-white transition hover:bg-indigo-700">Compare colleges</Link>
          <Link href="/predictor" className="rounded-xl border border-slate-200 px-5 py-3 text-slate-700 transition hover:border-slate-300">Predict colleges</Link>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Available colleges</p>
                <h2 className="text-xl font-semibold text-slate-900">Explore colleges</h2>
              </div>
              <p className="text-sm text-slate-500">{data.meta.total} results</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 p-4">
                <label className="block text-sm font-medium text-slate-700">Search</label>
                <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2" placeholder="Type college name" />
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <label className="block text-sm font-medium text-slate-700">Location</label>
                <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2" placeholder="City or state" />
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <label className="block text-sm font-medium text-slate-700">Max fees</label>
                <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2" placeholder="₹ 1,00,000" />
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-2">
            {data.colleges.map((college: any) => (
              <article key={college.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{college.name}</h3>
                    <p className="mt-2 text-sm text-slate-500">{college.location}</p>
                  </div>
                  <span className="rounded-2xl bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{college.rating} ★</span>
                </div>
                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <p><strong>Fees:</strong> ₹{college.fees.toLocaleString()}</p>
                  <p><strong>Placement:</strong> {college.placement_percent}%</p>
                  <p><strong>Top course:</strong> {college.top_course}</p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={`/college/${college.id}`} className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">View details</Link>
                  <Link href={`/compare?ids=${college.id}`} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-slate-300">Add to compare</Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Quick filters</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-800">Top rated</p>
                <p className="mt-1">Search colleges with 4.0+ ratings and strong placement records.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-800">Affordable fees</p>
                <p className="mt-1">Browse colleges with fees under ₹1.8L per year.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-indigo-600 p-6 text-white shadow-sm">
            <h2 className="text-lg font-semibold">Build your decision</h2>
            <p className="mt-3 text-sm text-slate-100">Use compare and prediction tools to decide which college fits your rank and budget.</p>
            <div className="mt-5 space-y-3">
              <Link href="/compare" className="block rounded-2xl bg-white px-4 py-3 text-center font-semibold text-indigo-700">Compare now</Link>
              <Link href="/predictor" className="block rounded-2xl border border-white px-4 py-3 text-center text-white">Predict colleges</Link>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
