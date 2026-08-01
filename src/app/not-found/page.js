import { PublicShell } from "@/components";

export default function NotFoundPage() {
  return (
    <PublicShell>
      <section className="py-12">
        <div className="app-container">
          <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Page not found</p>
            <h1 className="mt-6 text-3xl font-semibold text-slate-900">We couldn’t find that page.</h1>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              The link you followed may be broken, or the page may have been removed.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
