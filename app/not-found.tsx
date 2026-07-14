import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="card max-w-md p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary-50 text-primary-600">
          <Compass className="h-6 w-6" />
        </span>
        <p className="mt-5 font-mono text-sm text-slate-400">404</p>
        <h1 className="mt-1 text-xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          That material or page doesn&apos;t exist. Head back to the control tower.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/dashboard" className="btn-primary">
            Go to my dashboard
          </Link>
          <Link href="/" className="btn-ghost">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
