"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, Lock, User, Building2, ArrowRight, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/config";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  const isSignup = mode === "signup";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!supabaseConfigured) {
      setError("Accounts aren't set up yet. Please try again shortly.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, company },
            emailRedirectTo:
              typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
          },
        });
        if (error) throw error;
        if (!data.session) {
          setCheckEmail(true);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <div className="text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-success-50 text-success-600">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h2 className="mt-4 text-xl font-semibold text-slate-900">Check your email</h2>
        <p className="mt-2 text-sm text-slate-500">
          We sent a confirmation link to <span className="font-medium text-slate-700">{email}</span>.
          Click it to finish creating your account.
        </p>
        <Link href="/login" className="btn-ghost mt-6">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {isSignup && (
        <>
          <Field
            icon={User}
            label="Your name"
            value={fullName}
            onChange={setFullName}
            placeholder="e.g. Ramesh Kumar"
            autoComplete="name"
            required
          />
          <Field
            icon={Building2}
            label="Company name"
            value={company}
            onChange={setCompany}
            placeholder="e.g. Vertex Construction"
            autoComplete="organization"
            required
          />
        </>
      )}
      <Field
        icon={Mail}
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@company.com"
        autoComplete="email"
        required
      />
      <Field
        icon={Lock}
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="At least 6 characters"
        autoComplete={isSignup ? "new-password" : "current-password"}
        required
        minLength={6}
      />

      {error && (
        <p className="rounded-xl border border-danger-500/20 bg-danger-50 px-4 py-2.5 text-sm font-medium text-danger-700">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full text-base">
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            {isSignup ? "Create my account" : "Log in"} <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  required,
  minLength,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <span className="flex items-center gap-2 rounded-xl border border-hairline bg-slate-50 px-3 py-2.5 transition focus-within:border-primary-300 focus-within:bg-white focus-within:shadow-soft">
        <Icon className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
      </span>
    </label>
  );
}
