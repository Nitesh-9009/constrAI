import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { Logo } from "@/components/ui";
import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-10">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link href="/" aria-label="ConstrAI home">
            <Logo />
          </Link>
        </div>
        <div className="card p-7 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Log in to see your materials.</p>
          <div className="mt-6">
            <Suspense fallback={null}>
              <AuthForm mode="login" />
            </Suspense>
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">
            New here?{" "}
            <Link href="/signup" className="font-semibold text-primary-600 hover:text-primary-700">
              Create an account
            </Link>
          </p>
        </div>
        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-success-500" /> Your information is safe &amp; private
        </p>
      </div>
    </div>
  );
}
