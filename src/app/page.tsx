import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  ImageIcon,
  Layers3,
  School,
  Settings,
  ShieldCheck,
  Sparkles,
  type LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";

const pressurePoints = [
  "Scores arrive through WhatsApp, Excel, paper, and corridor reminders.",
  "Weekly reports sit in different notebooks, chats, and inboxes.",
  "Holiday coaching runs like a separate school with no clear record.",
  "One admin person becomes the result factory for everyone.",
  "Corrections happen late, after parents are already asking."
];

const storySteps = [
  ["Monday", "Admin opens First Term and Holiday Coaching programs."],
  ["Tuesday", "Teachers submit reports from phone or laptop."],
  ["Wednesday", "Missing scores and pending reports are visible."],
  ["Thursday", "Management reviews, approves, and comments."],
  ["Friday", "ResultDesk generates clean PDFs with an audit trail."]
];

const programCards = [
  { title: "Normal terms", detail: "First, second, and third term reporting and results.", icon: CalendarDays },
  { title: "Holiday coaching", detail: "Keep summer lessons, weekend classes, and prep groups organized.", icon: Layers3 },
  { title: "Exam preparation", detail: "Common entrance, WAEC, JAMB, and custom revision programs.", icon: FileCheck2 }
];

const modules: Array<{ title: string; copy: string; Icon: LucideIcon }> = [
  { title: "Programs", copy: "Create terms, coaching groups, exam prep, after-school lessons, and custom programs.", Icon: Layers3 },
  { title: "Weekly Reports", copy: "Teachers submit topics, attendance, concerns, tests, notes, and requests from one simple form.", Icon: ClipboardList },
  { title: "ResultDesk", copy: "Collect scores, route approvals, generate branded PDFs, and keep result actions traceable.", Icon: FileCheck2 },
  { title: "School Portal", copy: "Give each school a public page, admission inquiry form, subdomain, and future custom domain path.", Icon: School }
];

const before = ["Excel files everywhere", "WhatsApp score submissions", "Weekly reports scattered", "Coaching records separate", "No clear approval trail"];
const after = ["Teachers own submissions", "Management sees pending work", "Programs stay organized", "PDF results are approved first", "Actions are logged automatically"];

const pricing = [
  ["Pilot", "Free 14-day pilot", "One school, one program, limited teachers, sample result generation."],
  ["Starter", "₦15k/month", "Dashboard, teacher invites, programs, classes, students, weekly reports, and tracking."],
  ["ResultDesk Pack", "₦50k per term/program", "Score entry, approval workflow, branded PDFs, class batch PDFs, and result archive."],
  ["Growth", "₦30k/month", "Multiple active programs, school portal, advanced reporting, more teachers, and priority support."],
  ["Setup", "₦50k-₦150k one-time", "Teacher onboarding, result templates, grading scale, school setup, and training."],
  ["Website add-on", "₦100k-₦200k one-time", "Public school website/page, admission inquiry form, and subdomain setup."]
];

const orbitIcons: Array<{ Icon: LucideIcon; className: string; tone: string }> = [
  { Icon: Layers3, className: "left-[12%] top-[31%] rotate-[-11deg]", tone: "bg-cyan-400 text-white" },
  { Icon: ClipboardList, className: "left-[6%] bottom-[26%] rotate-[-18deg]", tone: "bg-teal-600 text-white" },
  { Icon: ImageIcon, className: "left-[28%] bottom-[34%] rotate-[-8deg]", tone: "bg-violet-500 text-white" },
  { Icon: BookOpen, className: "right-[28%] bottom-[35%] rotate-[9deg]", tone: "bg-lime-500 text-white" },
  { Icon: Layers3, className: "right-[17%] top-[34%] rotate-[12deg]", tone: "bg-green-500 text-white" },
  { Icon: GraduationCap, className: "right-[5%] bottom-[23%] rotate-[14deg]", tone: "bg-indigo-700 text-white" }
];

export default function LandingPage() {
  return (
    <main className="bg-[#f3f4f1] text-brand-text">
      <nav className="sticky top-0 z-30 border-b border-[#dfe3de] bg-[#f3f4f1]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-brand-dark">
            <span className="grid size-9 place-items-center rounded-md bg-brand-dark text-white">CP</span>
            <span>ClassPilot</span>
            <span className="hidden text-xs font-medium text-slate-500 sm:inline">by PulchriLabs</span>
          </Link>
          <div className="hidden items-center gap-7 text-sm md:flex">
            {["Story", "Programs", "Modules", "Pricing"].map((item) => <a href={`#${item.toLowerCase()}`} key={item}>{item}</a>)}
            <Link href="/login">Login</Link>
            <Button asChild size="sm"><Link href="/signup">Start free pilot</Link></Button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-4 pb-10 pt-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_65%,rgba(239,250,247,0.95),rgba(243,244,241,0)_42%)]" />
        <div className="absolute left-1/2 top-[340px] hidden h-[820px] w-[1400px] -translate-x-1/2 rounded-[50%] border border-brand/10 md:block" />
        <div className="absolute left-1/2 top-[430px] hidden h-[650px] w-[1120px] -translate-x-1/2 rounded-[50%] border border-brand/10 md:block" />
        <div className="absolute left-1/2 top-[520px] hidden h-[500px] w-[880px] -translate-x-1/2 rounded-[50%] border border-brand/10 md:block" />

        {orbitIcons.map(({ Icon, className, tone }) => (
          <div className={`absolute hidden rounded-2xl bg-white p-4 shadow-[0_18px_35px_rgba(23,23,36,0.16)] md:block ${className}`} key={className}>
            <span className={`grid size-11 place-items-center rounded-full ${tone}`}>
              <Icon size={24} />
            </span>
          </div>
        ))}

        <div className="relative mx-auto flex max-w-7xl flex-col items-center text-center">
          <p className="mt-12 inline-flex items-center gap-2 rounded-full bg-[#e2dbb5]/60 px-3 py-1 text-sm font-semibold text-brand-dark">
            <Sparkles size={15} /> Built for growing Nigerian schools
          </p>
          <h1 className="mt-8 max-w-5xl text-5xl font-bold leading-[1.05] tracking-normal md:text-7xl">
            Easy school operations for <span className="inline-flex rounded-[28px] bg-[#d7f2ef] px-4 pb-2 text-brand-dark">Programs & Results</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-500">
            Run school terms, holiday coaching, weekly teacher reports, and ResultDesk PDFs from one simple portal.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="bg-[#171724] shadow-lg hover:bg-brand-dark"><Link href="/signup"><span className="size-2 rounded-full bg-[#e2dbb5]" /> Start free pilot <ArrowRight size={18} /></Link></Button>
            <Button asChild variant="outline"><Link href="/demo">View live demo</Link></Button>
          </div>

          <div className="mt-16 w-full max-w-5xl px-2 md:mt-20">
            <DashboardPreview />
          </div>
        </div>
      </section>

      <section id="story" className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">The real school story</p>
          <h2 className="mt-3 text-3xl font-bold md:text-5xl">School work should not be trapped with one person.</h2>
          <p className="mt-5 leading-8 text-slate-600">
            At the end of a week, teachers have taught lessons, given tests, handled concerns, and collected scores. But management still has to chase the evidence. ClassPilot turns that scattered work into a visible routine.
          </p>
        </div>
        <div className="grid gap-3">
          {pressurePoints.map((point) => (
            <div className="flex items-start gap-3 rounded-lg border border-[#dfe3de] bg-white p-4" key={point}>
              <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-[#e2dbb5] text-xs font-bold text-brand-dark">!</span>
              <p className="text-sm leading-6 text-slate-700">{point}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#090a0b] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#e2dbb5]">A week with ClassPilot</p>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">From chasing teachers to checking progress.</h2>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-5">
            {storySteps.map(([day, copy]) => (
              <div className="rounded-lg border border-white/10 bg-white/5 p-5" key={day}>
                <p className="text-sm font-semibold text-[#e2dbb5]">{day}</p>
                <p className="mt-4 text-sm leading-6 text-white/80">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="programs" className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">Programs</p>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">More than normal school terms.</h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-slate-600">Use one structure for First Term, holiday coaching, summer school, common entrance prep, WAEC/JAMB classes, after-school lessons, and weekend groups.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {programCards.map(({ title, detail, icon: Icon }) => (
            <div className="rounded-xl border border-[#dfe3de] bg-white p-6" key={title}>
              <Icon className="text-brand" size={28} />
              <h3 className="mt-5 text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="modules" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">One portal, four modules</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold md:text-5xl">Each module carries one part of the school operations story.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {modules.map(({ title, copy, Icon }) => (
              <div className="rounded-xl border border-[#dfe3de] bg-[#fbfcfa] p-5" key={title}>
                <Icon className="text-brand" size={26} />
                <h3 className="mt-5 font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-16 md:grid-cols-2">
        <div className="rounded-2xl border border-[#dfe3de] bg-white p-6">
          <h2 className="text-2xl font-bold">Before ClassPilot</h2>
          <div className="mt-5 grid gap-3">{before.map((item) => <p className="rounded-md bg-slate-50 p-3 text-sm" key={item}>{item}</p>)}</div>
        </div>
        <div className="rounded-2xl border border-brand/20 bg-brand-soft p-6">
          <h2 className="text-2xl font-bold">After ClassPilot</h2>
          <div className="mt-5 grid gap-3">{after.map((item) => <p className="rounded-md bg-white p-3 text-sm" key={item}><Check className="mr-2 inline text-brand" size={16} />{item}</p>)}</div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-[28px] bg-[#090a0b] p-6 text-white md:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#e2dbb5]">Pricing</p>
          <h2 className="mt-3 text-3xl font-bold md:text-5xl">Start with visibility. Add ResultDesk when results are due.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {pricing.map(([name, price, copy]) => (
              <div className="rounded-xl border border-white/10 bg-white/5 p-5" key={name}>
                <p className="font-semibold text-[#e2dbb5]">{name}</p>
                <p className="mt-3 text-2xl font-bold">{price}</p>
                <p className="mt-4 text-sm leading-6 text-white/70">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        <div>
          <ShieldCheck className="text-brand" size={34} />
          <h2 className="mt-4 text-3xl font-bold md:text-5xl">Built to make the school look organized.</h2>
        </div>
        <p className="text-lg leading-8 text-slate-600">
          Every school-owned record carries a school ID. Program work, Weekly Reports, ResultDesk approvals, PDFs, and domain settings are logged, so management can trace what happened without relying on memory.
        </p>
      </section>

      <section className="px-4 pb-16 text-center">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-[#dfe3de] bg-white p-8 shadow-soft">
          <h2 className="text-3xl font-bold md:text-5xl">Give teachers a simple place to submit. Give management a clear place to approve.</h2>
          <Button asChild className="mt-6"><Link href="/signup">Start free pilot <ArrowRight size={18} /></Link></Button>
        </div>
      </section>
    </main>
  );
}
