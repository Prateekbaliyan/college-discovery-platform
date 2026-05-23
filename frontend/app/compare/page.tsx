import { CompareTable } from "../../components/CompareTable";
import Link from "next/link";

export default function ComparePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">College comparison</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Compare colleges side by side</h1>
        <p className="mt-4 text-slate-600">Select up to three colleges and analyze fees, placement, rating, and location in one table.</p>
        <div className="mt-6">
          <Link href="/" className="rounded-xl bg-slate-100 px-5 py-3 text-slate-800 transition hover:bg-slate-200">Back to discover</Link>
        </div>
      </div>

      <CompareTable />
    </main>
  );
}
