import Link from "next/link";
import { CollegeSearch } from "../components/CollegeSearch";

export default function Home() {
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
          <CollegeSearch />
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
                <p className="mt-1">Browse colleges with fees under Rs. 1.8L per year.</p>
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
