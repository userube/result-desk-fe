import Link from "next/link";
import { ArrowRight, Check, ClipboardList, FileCheck2, School, ShieldCheck, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";

const problems = [
  "Result work depends on one person",
  "Teachers submit scores manually",
  "Management chases teachers",
  "Corrections become stressful",
  "Parents expect clean, timely results"
];

const steps = [
  "School signs up",
  "School chooses subdomain",
  "Admin invites teachers",
  "Teachers enter scores/reports",
  "Management approves",
  "PDF results are generated"
];

const features: Array<{ title: string; copy: string; Icon: LucideIcon }> = [
  {
    title: "Weekly teacher reports",
    copy: "Topics taught, attendance summary, student concerns, assignments, and needs from management.",
    Icon: ClipboardList
  },
  {
    title: "Result generation",
    copy: "CA plus exam scores, auto totals, grading scale, teacher comments, approval, and batch PDFs.",
    Icon: FileCheck2
  },
  {
    title: "School portal",
    copy: "Each school gets a public page, admission inquiry form, subdomain, and future custom domain support.",
    Icon: School
  }
];

export default function LandingPage() {
  return (
    <main className="bg-[#f7fbfa] text-brand-text">
      <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-bold text-brand-dark">ResultDesk <span className="text-xs font-medium text-slate-500">by PulchriLabs</span></Link>
          <div className="hidden items-center gap-6 text-sm md:flex">
            {["Product", "Features", "Pricing", "Demo"].map((item) => <a href={`#${item.toLowerCase()}`} key={item}>{item}</a>)}
            <Link href="/login">Login</Link>
            <Button asChild size="sm"><Link href="/signup">Start free pilot</Link></Button>
          </div>
        </div>
      </nav>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:pt-20">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand">Built for Nigerian nursery, primary, and secondary schools</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-normal md:text-6xl">Teachers enter scores. Management approves. Results are ready.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">ResultDesk helps growing schools collect teacher scores, receive weekly reports, and generate clean PDF results without depending on one admin person.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild><Link href="/signup">Start free pilot <ArrowRight size={18} /></Link></Button>
            <Button asChild variant="outline"><Link href="/demo">View demo</Link></Button>
          </div>
        </div>
        <DashboardPreview />
      </section>
      <section id="product" className="bg-white py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">The result bottleneck finally has a system.</h2>
            <p className="mt-3 text-slate-600">ResultDesk moves every teacher, class, score, report, approval, and PDF into one tenant-safe workflow.</p>
          </div>
          <div className="grid gap-3">
            {problems.map((problem) => <div className="flex items-center gap-3 rounded-md border border-slate-200 p-3" key={problem}><Check className="text-brand" size={18} /> {problem}</div>)}
          </div>
        </div>
      </section>
      <section id="features" className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map(({ title, copy, Icon }) => (
            <div className="rounded-lg border border-slate-200 bg-white p-5" key={title}>
              <Icon className="mb-4 text-brand" size={26} />
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-brand-dark py-14 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold">How it works</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-6">
            {steps.map((step, index) => <div className="rounded-md bg-white/10 p-4 text-sm" key={step}><span className="mb-3 block text-2xl font-bold">{index + 1}</span>{step}</div>)}
          </div>
        </div>
      </section>
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold">Simple term pricing</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["Free 14-day pilot", "Starter: ₦50k per term", "Growth: ₦100k per term"].map((plan) => <div className="rounded-lg border border-slate-200 bg-white p-5 font-semibold" key={plan}>{plan}</div>)}
        </div>
        <p className="mt-4 text-sm text-slate-600">Setup/template customization: ₦50k-₦150k one-time. School website add-on: ₦100k-₦200k.</p>
      </section>
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2">
          <div>
            <ShieldCheck className="text-brand" size={32} />
            <h2 className="mt-4 text-3xl font-bold">Tenant-safe by design</h2>
            <p className="mt-3 text-slate-600">Every school-owned record carries a school ID, and the backend guards every sensitive workflow with roles, audit logs, and school isolation.</p>
          </div>
          <div className="rounded-lg bg-brand-soft p-6">
            <h3 className="font-semibold">FAQ</h3>
            <p className="mt-3 text-sm text-slate-700">Can teachers use it on phones? Yes. Teacher dashboards, weekly reports, and score entry are designed mobile-first.</p>
            <p className="mt-3 text-sm text-slate-700">Can we use our school domain? Yes. DNS instructions and verification status are included, with automation planned.</p>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 text-center">
        <h2 className="text-3xl font-bold">Ready to remove the result bottleneck?</h2>
        <Button asChild className="mt-6"><Link href="/signup">Start free pilot</Link></Button>
      </section>
    </main>
  );
}
