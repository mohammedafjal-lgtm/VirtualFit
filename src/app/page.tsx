import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import { Shirt, Sparkles, User } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          VirtualFit
        </div>
        <nav className="flex items-center gap-3">
          <Suspense
            fallback={
              <div className="h-9 w-32 rounded-lg bg-slate-200 animate-pulse" />
            }
          >
            <AuthButtons />
          </Suspense>
        </nav>
      </header>

      <section className="max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
          Try on clothes{" "}
          <span className="text-indigo-600">without trying them on</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          Upload your clothes. Upload a portrait. Let AI generate a full‑body
          look — instantly, in the browser.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Suspense
            fallback={
              <div className="h-12 w-48 rounded-lg bg-slate-200 animate-pulse" />
            }
          >
            <HeroCta />
          </Suspense>
          <Link
            href="/login"
            className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
          >
            I already have an account
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <Feature
            icon={<Shirt className="h-5 w-5 text-indigo-600" />}
            title="Smart wardrobe"
            body="Upload each piece — AI tags category, color, and style automatically."
          />
          <Feature
            icon={<User className="h-5 w-5 text-indigo-600" />}
            title="Your portrait"
            body="One photo is all AI needs to fit every outfit onto your body."
          />
          <Feature
            icon={<Sparkles className="h-5 w-5 text-indigo-600" />}
            title="Instant try‑on"
            body="Select multiple items and generate a photorealistic full‑body look."
          />
        </div>
      </section>
    </main>
  );
}

async function AuthButtons() {
  await connection(); // ← request-bound: everything below runs per-request
  const session = await auth();

  if (session?.user) {
    return (
      <Link
        href="/dashboard"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700"
      >
        Go to dashboard
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="text-sm font-medium text-slate-700 hover:text-slate-900"
      >
        Log in
      </Link>
      <Link
        href="/register"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700"
      >
        Get started
      </Link>
    </>
  );
}

async function HeroCta() {
  await connection(); // ← request-bound
  const session = await auth();

  return (
    <Link
      href={session?.user ? "/dashboard" : "/register"}
      className="rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700"
    >
      {session?.user ? "Open dashboard" : "Create your wardrobe"}
    </Link>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{body}</p>
    </div>
  );
}