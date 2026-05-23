import { PredictorTool } from "../../components/PredictorTool";
import Link from "next/link";

export default function PredictorPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">College predictor</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Find colleges for your rank</h1>
        <p className="mt-4 text-slate-600">Use a simple exam and rank prediction model to view target colleges and refine your choices.</p>
        <div className="mt-6">
          <Link href="/" className="rounded-xl bg-slate-100 px-5 py-3 text-slate-800 transition hover:bg-slate-200">Back to discover</Link>
        </div>
      </div>

      <PredictorTool />
    </main>
  );
}
