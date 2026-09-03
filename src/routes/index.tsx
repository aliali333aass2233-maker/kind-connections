import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  GraduationCap,
  Info,
  LineChart,
  ListChecks,
  Sliders,
  Sparkles,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RankPath — NEET Rank & College Predictor" },
      {
        name: "description",
        content:
          "Enter your NEET marks, get a confidence-banded rank range, and a Reach / Likely / Safe / Dream college shortlist with cutoff trends.",
      },
      { property: "og:title", content: "RankPath — NEET Rank & College Predictor" },
      {
        property: "og:description",
        content:
          "Marks to rank to colleges. Cutoff trend dashboards, seat and fee data, and personalised college updates.",
      },
    ],
  }),
  component: Index,
});

/* ---------- small presentational helpers ---------- */

function Nav() {
  const links = [
    ["How it works", "#how"],
    ["Features", "#features"],
    ["Dashboards", "#dashboards"],
    ["Updates", "#updates"],
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-4.5 w-4.5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">RankPath</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#predictor"
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block"
          >
            Sign in
          </a>
          <a
            href="#predictor"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Predict my rank <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

const BUCKETS = [
  { name: "Dream", tone: "bg-amber-50 text-amber-800 border-amber-200" },
  { name: "Reach", tone: "bg-rose-50 text-rose-800 border-rose-200" },
  { name: "Likely", tone: "bg-brand-soft text-primary border-primary/25" },
  { name: "Safe", tone: "bg-emerald-50 text-emerald-800 border-emerald-200" },
];

function PredictorCard() {
  const [marks, setMarks] = useState(545);

  const { low, high, percentile } = useMemo(() => {
    const pct = 100 / (1 + Math.exp(-(marks - 300) / 62));
    const rank = Math.round((1 - pct / 100) * 2_300_000);
    const span = Math.max(1200, Math.round(rank * 0.14));
    return {
      low: Math.max(1, rank - span),
      high: rank + span,
      percentile: pct,
    };
  }, [marks]);

  const fmt = (n: number) => n.toLocaleString("en-IN");

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_24px_60px_-30px_rgba(15,60,55,0.45)]">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold">Rank predictor</p>
        <span className="rounded-full border border-border bg-sand px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          NEET UG 2026
        </span>
      </div>

      <label className="mt-6 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Your marks — {marks} / 720
      </label>
      <input
        type="range"
        min={100}
        max={715}
        value={marks}
        onChange={(e) => setMarks(Number(e.target.value))}
        aria-label="NEET marks out of 720"
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
      />

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-sand p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Percentile
          </p>
          <p className="font-display text-2xl font-bold">{percentile.toFixed(3)}</p>
        </div>
        <div className="rounded-xl border border-primary/25 bg-brand-soft p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-primary">
            Rank range
          </p>
          <p className="font-display text-2xl font-bold text-primary">
            {fmt(low)}–{fmt(high)}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {[
          ["AIIMS New Delhi", "Dream", "1–58"],
          ["Maulana Azad Medical College", "Reach", "180–860"],
          ["GMC Nagpur", "Likely", "11.2k–19.4k"],
          ["SMS Medical College, Jaipur", "Safe", "22.1k–34.8k"],
        ].map(([college, bucket, band]) => {
          const tone = BUCKETS.find((b) => b.name === bucket)!.tone;
          return (
            <div
              key={college}
              className="flex items-center justify-between gap-3 rounded-xl border border-border px-3.5 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{college}</p>
                <p className="text-[11px] text-muted-foreground">Closing rank {band}</p>
              </div>
              <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${tone}`}>
                {bucket}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Demo build — cutoff data is simulated for illustration. Production ingests verified
        MCC/JoSAA releases.
      </p>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-[420px] bg-[radial-gradient(60%_60%_at_50%_50%,var(--brand-soft),transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Built on 700+ real counselling responses
          </span>
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.03] tracking-tight sm:text-6xl">
            Your NEET marks,
            <br />
            translated into a{" "}
            <span className="relative whitespace-nowrap text-primary">
              real college list
              <svg
                aria-hidden
                viewBox="0 0 300 12"
                className="absolute -bottom-1.5 left-0 w-full text-primary/35"
                preserveAspectRatio="none"
              >
                <path d="M2 8 C 80 2, 220 2, 298 7" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Marks → percentile → rank range, then every medical college you can realistically get
            with your category and quota — bucketed as Reach, Likely, Safe and Dream, with 4 years
            of cutoff trends behind each call.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#predictor"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Predict my rank <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#dashboards"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-sand"
            >
              Browse college dashboards
            </a>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
            {[
              ["220+", "colleges mapped"],
              ["4 yrs", "cutoff history"],
              ["3", "counselling rounds"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-display text-2xl font-bold">{n}</dt>
                <dd className="text-xs text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div id="predictor" className="scroll-mt-24">
          <PredictorCard />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: Target,
      title: "Enter marks or rank",
      body: "Score, category (GEN/OBC/SC/ST/EWS), quota and home state. Already have your rank? Skip straight to step two.",
    },
    {
      icon: LineChart,
      title: "Get a rank range, not a fake number",
      body: "A normalisation curve maps marks to percentile to a rank band with a confidence interval — honest by design.",
    },
    {
      icon: ListChecks,
      title: "See your college shortlist",
      body: "Every college where opening ≤ your rank ≤ closing, scored on band position, year-to-year consistency and tightness.",
    },
  ];
  return (
    <section id="how" className="scroll-mt-20 border-y border-border bg-sand">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="max-w-2xl font-display text-3xl font-bold sm:text-4xl">
          Three steps from a score sheet to a counselling plan
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-display text-sm font-bold text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: Target,
      title: "Match Meter",
      body: "“68% chance at AIIMS Delhi — rank 1,500, OBC, AIQ.” One number that reads like an answer, not a spreadsheet.",
    },
    {
      icon: Sliders,
      title: "What-if simulator",
      body: "Drag your rank and watch the entire shortlist re-order live. Plan for a better attempt before results day.",
    },
    {
      icon: BarChart3,
      title: "Category comparison",
      body: "GEN, OBC, SC, ST and EWS cutoffs on one chart per college, so a family sees the full picture at once.",
    },
    {
      icon: ListChecks,
      title: "Choice list optimiser",
      body: "An ordered preference list generated from your priorities — location, fee cap, seat safety — ready to paste into MCC.",
    },
    {
      icon: LineChart,
      title: "Cutoff trend forecast",
      body: "Round-wise opening and closing ranks across four years, extrapolated with a ± confidence band.",
    },
    {
      icon: Bell,
      title: "Personalised college feed",
      body: "Follow a college and get its updates only — round dates, seat matrix changes, fee revisions, placement news.",
    },
  ];
  return (
    <section id="features" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-xl font-display text-3xl font-bold sm:text-4xl">
            Everything counselling season throws at you, in one place
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Replaces the annual ritual of hunting scattered MCC PDFs, Telegram screenshots and
            outdated cutoff blogs.
          </p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <div key={f.title} className="bg-card p-7 transition-colors hover:bg-sand">
              <f.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-display text-base font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Dashboards() {
  const bars = [
    { year: "2023", open: 42, close: 76 },
    { year: "2024", open: 48, close: 82 },
    { year: "2025", open: 55, close: 88 },
    { year: "2026", open: 61, close: 95 },
  ];
  return (
    <section id="dashboards" className="scroll-mt-20 border-y border-border bg-sand">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            A dashboard per college, not a PDF per round
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Open any college and see its full history: opening and closing ranks by round and
            category, seats, annual fees, courses on offer, hostel and infrastructure notes, and
            verified placement stats.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Round-wise opening/closing rank timeline",
              "Seat matrix and fee breakdown by quota",
              "Courses you can apply to at your rank",
              "Placement and internship stipend charts",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_24px_60px_-34px_rgba(15,60,55,0.4)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-base font-bold">GMC Nagpur — MBBS</p>
              <p className="text-xs text-muted-foreground">AIQ · OBC · Round 2</p>
            </div>
            <span className="rounded-full border border-primary/25 bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
              Likely
            </span>
          </div>

          <div className="mt-8 flex h-44 items-end gap-6">
            {bars.map((b) => (
              <div key={b.year} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end justify-center gap-1.5">
                  <div
                    className="w-1/3 rounded-t-md bg-primary/25"
                    style={{ height: `${b.open}%` }}
                  />
                  <div className="w-1/3 rounded-t-md bg-primary" style={{ height: `${b.close}%` }} />
                </div>
                <span className="text-[11px] text-muted-foreground">{b.year}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-5 border-t border-border pt-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-primary/25" /> Opening rank
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Closing rank
            </span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              ["Seats", "200"],
              ["Fees / yr", "₹1.1L"],
              ["Trend", "↑ 6.4%"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border bg-sand p-3">
                <p className="text-[11px] text-muted-foreground">{k}</p>
                <p className="font-display text-base font-bold">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Updates() {
  const feed = [
    ["Today", "AIIMS New Delhi", "Round 2 seat matrix published — 12 UR seats added."],
    ["2 days ago", "GMC Nagpur", "Hostel fee revised to ₹18,000/yr for the 2026 batch."],
    ["Last week", "MAMC Delhi", "Placement report: 94% PG match rate, stipend up 11%."],
  ];
  return (
    <section id="updates" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 lg:grid-cols-2">
        <div className="order-2 space-y-3 lg:order-1">
          {feed.map(([when, college, body]) => (
            <div
              key={college}
              className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-sand"
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-sm font-bold">{college}</p>
                <span className="text-[11px] text-muted-foreground">{when}</span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <div className="order-1 lg:order-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Bell className="h-3.5 w-3.5 text-primary" /> Personalised
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl">
            Follow the colleges you actually care about
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Enrol into a college feed and get only its updates — counselling round dates, seat
            changes, fee revisions, campus news and eligibility deadlines. No noise from the other
            219 colleges.
          </p>
          <a
            href="#predictor"
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-sand"
          >
            Start with your rank <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="border-y border-border bg-sand">
      <div className="mx-auto max-w-4xl px-5 py-20 text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          “Predictors are useless if they hide their limits.”
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          That was the most common warning in 700+ student responses — so we built the opposite.
          Every prediction ships with its confidence band, the years of data behind it, and a plain
          statement of what is modelled versus verified.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["Rank ranges", "Never a single fake number"],
            ["Sourced cutoffs", "Round and year shown on every figure"],
            ["Open method", "The scoring logic is documented, not a black box"],
          ].map(([t, s]) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-5 text-left">
              <p className="font-display text-sm font-bold">{t}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <div className="rounded-3xl border border-border bg-primary px-8 py-16 text-center text-primary-foreground">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold sm:text-4xl">
          Counselling starts soon. Know your options before it does.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/80">
          Free during the 2026 season. No sign-up needed to run your first prediction.
        </p>
        <a
          href="#predictor"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-background px-7 py-3.5 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5"
        >
          Predict my rank <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="font-display text-sm font-bold">RankPath</span>
        </div>
        <p className="max-w-md text-[11px] leading-relaxed text-muted-foreground">
          Demo build — cutoff and rank figures are simulated for illustration. The production
          version ingests verified MCC/JoSAA source data.
        </p>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Dashboards />
        <Updates />
        <Trust />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
