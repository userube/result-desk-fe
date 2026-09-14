import Link from "next/link";
import { ArrowRight, CheckCircle2, GraduationCap, LockKeyhole, Mail, MapPin, Phone, School, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "login" | "signup" | "invite" | "forgot" | "reset";

const storySteps = [
  "Create the school portal",
  "Invite teachers and assign work",
  "Approve submissions before PDFs"
];

const modeCopy: Record<AuthMode, { eyebrow: string; title: string; copy: string; cta: string; href: string; sideTitle: string }> = {
  login: {
    eyebrow: "Welcome back",
    title: "Continue your school operations story.",
    copy: "Open your workspace to review teacher submissions, pending approvals, and ResultDesk PDF readiness.",
    cta: "Open workspace",
    href: "/app/dashboard",
    sideTitle: "Pick up from the last school day"
  },
  signup: {
    eyebrow: "Start free pilot",
    title: "Set up your school portal in a few minutes.",
    copy: "Tell us the school identity, choose a portal slug, and start the guided checklist for teachers, classes, students, grading, and results.",
    cta: "Create school workspace",
    href: "/app/setup",
    sideTitle: "From scattered submissions to a clear result desk"
  },
  invite: {
    eyebrow: "Teacher invite",
    title: "Join your school workspace.",
    copy: "Accept the invitation, create your password, and see only the classes and subjects assigned to you.",
    cta: "Accept invite",
    href: "/app/dashboard",
    sideTitle: "Teachers get one simple place to submit"
  },
  forgot: {
    eyebrow: "Password help",
    title: "Get a secure reset link.",
    copy: "Enter your school email and Ewune will send a reset link if the account exists.",
    cta: "Send reset link",
    href: "/reset-password",
    sideTitle: "Keep school access protected"
  },
  reset: {
    eyebrow: "New password",
    title: "Create a fresh password.",
    copy: "Use a strong password before returning to your school workspace.",
    cta: "Update password",
    href: "/login",
    sideTitle: "Secure access for every role"
  }
};

export function AuthCard({ mode }: { title?: string; mode: AuthMode }) {
  const copy = modeCopy[mode];
  const isSignup = mode === "signup";
  const isLogin = mode === "login";
  const showEmail = mode !== "reset";
  const showPassword = mode !== "forgot";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f4f1] px-4 py-8 text-brand-text sm:py-10 md:px-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[24px] border border-[#dfe3de] bg-white shadow-[0_24px_70px_rgba(23,23,36,0.12)] lg:grid-cols-[0.86fr_1.14fr]">
        <section className="relative overflow-hidden bg-[#063d35] p-5 text-white sm:p-7 md:p-8">
          <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute bottom-[-160px] right-[-120px] h-96 w-96 rounded-full border border-white/10" />
          <Link href="/" className="relative inline-flex items-center gap-2 font-bold">
            <span className="grid size-9 place-items-center rounded-xl bg-white text-brand-dark">E</span>
            <span>Ewune</span>
            <span className="hidden text-xs font-medium text-white/60 sm:inline">by PulchriLabs</span>
          </Link>

          <div className="relative mt-8 max-w-lg md:mt-10">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-[#e2dbb5]">
              <Sparkles size={15} /> {copy.sideTitle}
            </p>
            <h1 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              Teachers submit. Management approves. Results are ready.
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/72 md:text-base">
              Ewune gives growing schools one practical flow for programs, weekly teacher reports, result approvals, and parent-ready PDFs.
            </p>
          </div>

          <div className="relative mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {storySteps.map((step, index) => (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 p-3" key={step}>
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#e2dbb5] text-sm font-bold text-brand-dark">{index + 1}</span>
                <span className="text-xs font-medium leading-5 text-white/86 sm:text-sm">{step}</span>
              </div>
            ))}
          </div>

          <Card className="relative mt-6 border-white/10 bg-white/10 text-white shadow-none">
            <CardContent className="p-4">
              <p className="text-sm text-white/65">Demo school</p>
              <p className="mt-2 text-lg font-bold">Greenfield Crest School</p>
              <p className="mt-1 text-sm text-white/65">greenfield.ewune.app</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                {["20 students", "4 teachers", "72% ready"].map((item) => (
                  <span className="rounded-xl bg-white/10 px-2 py-2.5" key={item}>{item}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="flex items-center justify-center bg-[#fbfcfa] p-5 sm:p-7 md:p-8">
          <div className="w-full max-w-xl">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">{copy.eyebrow}</p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{copy.title}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{copy.copy}</p>
            </div>

            <form className="grid gap-4">
              {isSignup && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field icon={School} label="School name" placeholder="Greenfield Crest School" />
                  <Field icon={Mail} label="School email" placeholder="hello@greenfieldcrest.com" type="email" />
                  <Field icon={Phone} label="Phone number" placeholder="+234 801 234 5678" />
                  <Field icon={MapPin} label="Preferred subdomain" prefix="ewune.app/" placeholder="greenfield" />
                  <div className="sm:col-span-2">
                    <Field icon={GraduationCap} label="Current academic session" placeholder="2026/2027 First Term" />
                  </div>
                </div>
              )}

              {showEmail && !isSignup && <Field icon={Mail} label="Email address" placeholder={isLogin ? "admin@greenfieldcrest.com" : "teacher@greenfieldcrest.com"} type="email" />}
              {showPassword && <Field icon={LockKeyhole} label={mode === "reset" ? "New password" : "Password"} placeholder="At least 8 characters" type="password" />}
              {mode === "reset" && <Field icon={ShieldCheck} label="Confirm password" placeholder="Repeat new password" type="password" />}

              <Button asChild className="mt-2 h-12 rounded-xl text-base">
                <Link href={copy.href}>{copy.cta} <ArrowRight size={18} /></Link>
              </Button>
            </form>

            <div className="mt-6 grid gap-3 rounded-2xl border border-[#dfe3de] bg-white p-4 text-sm text-slate-600">
              {[
                "Every school gets its own protected workspace.",
                "Teachers only see assigned classes and subjects.",
                "Final PDFs require management approval."
              ].map((item) => (
                <p className="flex items-center gap-2" key={item}><CheckCircle2 size={16} className="text-brand" /> {item}</p>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              {isLogin ? "New school?" : "Already have an account?"}{" "}
              <Link href={isLogin ? "/signup" : "/login"} className="font-semibold text-brand-dark">
                {isLogin ? "Start a free pilot" : "Login instead"}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  icon: Icon,
  label,
  placeholder,
  prefix,
  type = "text"
}: {
  icon: typeof School;
  label: string;
  placeholder: string;
  prefix?: string;
  type?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label className="text-sm font-semibold text-brand-text">{label}</Label>
      <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
        <Icon size={17} className="mr-2 shrink-0 text-brand" />
        {prefix && <span className="mr-1 text-sm text-slate-400">{prefix}</span>}
        <Input
          className="h-10 border-0 bg-transparent px-0 shadow-none focus:border-0 focus:ring-0"
          placeholder={placeholder}
          type={type}
        />
      </div>
    </div>
  );
}
