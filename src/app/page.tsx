import Link from "next/link";
import { ArrowRight, Check, ClipboardList, FileCheck2, Layers3, School, ShieldCheck, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";

const problems = [
  "Teachers submit scores through Excel, paper, or WhatsApp",
  "Weekly reports are scattered",
  "Result generation depends on one admin person",
  "Holiday coaching records are handled separately",
  "Management cannot easily see who has submitted",
  "Corrections and approvals are hard to trace"
];

const steps = [
  "School signs up",
  "School chooses subdomain",
  "Admin creates term or holiday program",
  "Admin invites teachers",
  "Teachers submit reports and scores",
  "Management reviews and approves",
  "ResultDesk generates PDFs"
];

const programs = ["First, second, and third term", "Holiday coaching", "Summer school", "Common entrance prep", "JAMB/WAEC coaching", "After-school lessons"];

const modules: Array<{ title: string; copy: string; Icon: LucideIcon }> = [
  { title: "Programs", copy: "Run terms, holiday coaching, summer school, exam prep, weekend classes, and custom programs in one place.", Icon: Layers3 },
  { title: "Weekly Reports", copy: "Teachers submit topics taught, attendance, student concerns, tests, notes, and needs from management.", Icon: ClipboardList },
  { title: "ResultDesk", copy: "Handle CA, exam scores, custom components, comments, approvals, branded PDFs, and class batch results.", Icon: FileCheck2 },
  { title: "School Portal", copy: "Each school gets a public page, school subdomain, admission inquiry form, and future custom domain support.", Icon: School }
];

const before = ["Excel files everywhere", "WhatsApp score submissions", "One person generates results", "Weekly reports scattered", "Coaching records separate", "No clear approval trail"];
const after = ["Teachers submit from phone or laptop", "Management sees pending work", "Programs are organized", "Results are approved before publishing", "PDFs are generated cleanly", "Actions are tracked in audit logs"];

export default function LandingPage() {
  return (
    <main className="bg-[#f7fbfa] text-brand-text">
      <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-bold text-brand-dark">ClassPilot <span className="text-xs font-medium text-slate-500">by PulchriLabs</span></Link>
          <div className="hidden items-center gap-6 text-sm md:flex">
            {["Product", "Programs", "Pricing", "Demo"].map((item) => <a href={`#${item.toLowerCase()}`} key={item}>{item}</a>)}
            <Link href="/login">Login</Link>
            <Button asChild size="sm"><Link href="/signup">Start free pilot</Link></Button>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:pt-20">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand">ClassPilot by PulchriLabs</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-normal md:text-6xl">Run school terms, holiday coaching, and results without chasing teachers.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">ClassPilot helps growing schools collect teacher reports, manage programs, track submissions, and generate clean PDF results from one simple portal.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild><Link href="/signup">Start free pilot <ArrowRight size={18} /></Link></Button>
            <Button asChild variant="outline"><Link href="/demo">View live demo</Link></Button>
          </div>
        </div>
        <DashboardPreview />
      </section>

      <section id="product" className="bg-white py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">School work should not be trapped with one person.</h2>
            <p className="mt-3 text-slate-600">ClassPilot gives management visibility while teachers own their class, report, score, and program submissions.</p>
          </div>
          <div className="grid gap-3">
            {problems.map((problem) => <div className="flex items-center gap-3 rounded-md border border-slate-200 p-3" key={problem}><Check className="text-brand" size={18} /> {problem}</div>)}
          </div>
        </div>
      </section>

      <section className="bg-brand-dark py-14 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold">How it works</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-7">
            {steps.map((step, index) => <div className="rounded-md bg-white/10 p-4 text-sm" key={step}><span className="mb-3 block text-2xl font-bold">{index + 1}</span>{step}</div>)}
          </div>
        </div>
      </section>

      <section id="programs" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold">Manage more than normal school terms.</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {programs.map((program) => <div className="rounded-lg border border-slate-200 bg-white p-5 font-semibold" key={program}>{program}</div>)}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-4">
          {modules.map(({ title, copy, Icon }) => (
            <div className="rounded-lg border border-slate-200 bg-white p-5" key={title}>
              <Icon className="mb-4 text-brand" size={26} />
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-14 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-2xl font-bold">Before ClassPilot</h2>
          <div className="mt-4 grid gap-3">{before.map((item) => <p className="rounded-md bg-slate-50 p-3 text-sm" key={item}>{item}</p>)}</div>
        </div>
        <div className="rounded-lg border border-brand/20 bg-brand-soft p-5">
          <h2 className="text-2xl font-bold">After ClassPilot</h2>
          <div className="mt-4 grid gap-3">{after.map((item) => <p className="rounded-md bg-white p-3 text-sm" key={item}>{item}</p>)}</div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold">Hybrid pricing for terms and programs</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Pilot", "Free 14-day pilot", "One school, one program, limited teachers, sample result generation."],
            ["Starter", "₦15k/month", "School dashboard, teacher invites, programs, classes/students, weekly reports, and tracking."],
            ["ResultDesk Pack", "₦50k per term/program", "Score entry, approval workflow, branded PDFs, class batch PDFs, and result archive."],
            ["Growth", "₦30k/month", "More teachers/classes, multiple active programs, school portal, advanced reporting, priority support."],
            ["Setup and customization", "₦50k-₦150k one-time", "School setup, teacher onboarding, templates, grading scale, and training."],
            ["Website add-on", "₦100k-₦200k one-time", "Public school website/page, admission inquiry form, and subdomain setup."]
          ].map(([name, price, copy]) => <div className="rounded-lg border border-slate-200 bg-white p-5" key={name}><p className="font-semibold">{name}</p><p className="mt-2 text-2xl font-bold text-brand-dark">{price}</p><p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p></div>)}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2">
          <div>
            <ShieldCheck className="text-brand" size={32} />
            <h2 className="mt-4 text-3xl font-bold">Tenant-safe by design</h2>
            <p className="mt-3 text-slate-600">Every school-owned record carries a school ID. Program work, ResultDesk approvals, weekly reports, and domain settings are logged in the audit trail.</p>
          </div>
          <div className="rounded-lg bg-brand-soft p-6">
            <h3 className="font-semibold">FAQ</h3>
            <p className="mt-3 text-sm text-slate-700">Can teachers use it on phones? Yes. Teacher reports and score entry are designed mobile-first.</p>
            <p className="mt-3 text-sm text-slate-700">Can we track holiday coaching separately? Yes. Programs can be normal terms, coaching, exam prep, weekend classes, or custom.</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 text-center">
        <h2 className="text-3xl font-bold">Ready to organize reports, programs, and results?</h2>
        <Button asChild className="mt-6"><Link href="/signup">Start free pilot</Link></Button>
      </section>
    </main>
  );
}
