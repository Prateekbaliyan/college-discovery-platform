import Link from "next/link";

type College = {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placement_percent: number;
  top_course: string;
};

export function CollegeCard({ college }: { college: College }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
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
      </div>
    </article>
  );
}
