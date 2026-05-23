import Link from "next/link";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

async function getCollege(id: string) {
  const res = await fetch(`${apiBase}/api/colleges/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load college details");
  return res.json();
}

export default async function CollegePage({ params }: { params: { id: string } }) {
  const college = await getCollege(params.id);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">College details</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">{college.name}</h1>
          <p className="mt-2 text-slate-600">{college.location} · ₹{college.fees.toLocaleString()} · {college.rating} ★</p>
        </div>
        <Link href="/" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-slate-300">Back to list</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
            <p className="text-slate-600">{college.overview}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Placement</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{college.placement_percent}%</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Rating</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{college.rating} ★</p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Courses offered</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {college.courses.map((course: string) => (
                <span key={course} className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 shadow-sm">{course}</span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Student reviews</h3>
            <p className="mt-3 text-slate-600">{college.review_summary}</p>
            <div className="mt-4 rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm">"Great campus, dedicated faculty, and strong placement support. Recommended for engineering aspirants."</div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Quick facts</h3>
            <dl className="mt-5 space-y-4 text-sm text-slate-600">
              <div>
                <dt className="font-medium text-slate-800">Location</dt>
                <dd>{college.location}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-800">Fees</dt>
                <dd>₹{college.fees.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-800">Top course</dt>
                <dd>{college.top_course}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl bg-indigo-600 p-6 text-white shadow-sm">
            <h3 className="text-lg font-semibold">Decision support</h3>
            <p className="mt-3 text-sm">Compare this college with other options, or use the predictor to see where your rank fits.</p>
            <div className="mt-5 space-y-3">
              <Link href="/compare" className="block rounded-2xl bg-white px-4 py-3 text-center font-semibold text-indigo-700">Compare now</Link>
              <Link href="/predictor" className="block rounded-2xl border border-white px-4 py-3 text-center text-white">Predict colleges</Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
