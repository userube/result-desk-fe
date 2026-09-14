"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, GraduationCap, LockKeyhole, Mail, MapPin, Phone, School, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost, AuthResponse, LoginPayload, SignupPayload, storeAuthTokens } from "@/lib/api";

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
  const router = useRouter();
  const copy = modeCopy[mode];
  const isSignup = mode === "signup";
  const isLogin = mode === "login";
  const showEmail = mode !== "reset";
  const showPassword = mode !== "forgot";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (mode === "invite") setInviteToken(params.get("token") ?? "");
    if (mode === "reset") setResetToken(params.get("token") ?? "");
  }, [mode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);

    try {
      if (isSignup) {
        const payload: SignupPayload = {
          schoolName: getFormValue(form, "schoolName"),
          schoolEmail: getFormValue(form, "schoolEmail"),
          phone: getFormValue(form, "phone"),
          address: getFormValue(form, "address"),
          preferredSubdomain: getFormValue(form, "preferredSubdomain"),
          currentAcademicSession: getFormValue(form, "currentAcademicSession"),
          currentTerm: getFormValue(form, "currentTerm"),
          ownerEmail: getFormValue(form, "ownerEmail"),
          firstName: getFormValue(form, "firstName"),
          lastName: getFormValue(form, "lastName"),
          password: getFormValue(form, "password")
        };
        const tokens = await apiPost<AuthResponse, SignupPayload>("/auth/signup", payload);
        storeAuthTokens(tokens);
        router.push("/app/setup");
        return;
      }

      if (isLogin) {
        const payload: LoginPayload = {
          email: getFormValue(form, "email"),
          password: getFormValue(form, "password")
        };
        const tokens = await apiPost<AuthResponse, LoginPayload>("/auth/login", payload);
        storeAuthTokens(tokens);
        router.push("/app/dashboard");
        return;
      }

      if (mode === "invite") {
        const token = inviteToken || getFormValue(form, "token");
        const firstName = getFormValue(form, "firstName");
        const lastName = getFormValue(form, "lastName");
        const password = getFormValue(form, "password");
        await apiPost<{ email: string }, { token: string; firstName: string; lastName: string; password: string }>("/invitations/accept", { token, firstName, lastName, password });
        const tokens = await apiPost<AuthResponse, LoginPayload>("/auth/login", { email: getFormValue(form, "email"), password });
        storeAuthTokens(tokens);
        router.push("/app/dashboard");
        return;
      }

      if (mode === "forgot") {
        const response = await apiPost<{ message: string; resetUrl?: string }, { email: string }>("/auth/forgot-password", { email: getFormValue(form, "email") });
        setSuccess(response.resetUrl ? `${response.message} Demo reset link: ${response.resetUrl}` : response.message);
        return;
      }

      if (mode === "reset") {
        const password = getFormValue(form, "password");
        const confirmPassword = getFormValue(form, "confirmPassword");
        if (password !== confirmPassword) throw new Error("Passwords do not match");
        const token = resetToken || getFormValue(form, "token");
        const response = await apiPost<{ message: string }, { token: string; password: string }>("/auth/reset-password", { token, password });
        setSuccess(response.message);
        router.push("/login");
        return;
      }

      router.push(copy.href);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f4f1] px-4 py-8 text-brand-text sm:py-10 md:px-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[24px] border border-[#dfe3de] bg-white shadow-[0_24px_70px_rgba(23,23,36,0.12)] lg:grid-cols-[0.86fr_1.14fr]">
        <section className="relative hidden overflow-hidden bg-[#063d35] p-8 text-white lg:block">
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
            <Link href="/" className="mb-6 flex items-center gap-2 font-bold text-brand-dark lg:hidden">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-dark text-white">E</span>
              <span>
                <span className="block">Ewune</span>
                <span className="block text-xs font-medium text-slate-500">by PulchriLabs</span>
              </span>
            </Link>
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">{copy.eyebrow}</p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{copy.title}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{copy.copy}</p>
            </div>

            <form className="grid gap-4" onSubmit={handleSubmit}>
              {isSignup && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field icon={School} label="School name" name="schoolName" placeholder="Greenfield Crest School" required />
                  <Field icon={Mail} label="School email" name="schoolEmail" placeholder="hello@greenfieldcrest.com" type="email" required />
                  <Field icon={Phone} label="Phone number" name="phone" placeholder="+234 801 234 5678" required />
                  <Field icon={MapPin} label="Preferred subdomain" name="preferredSubdomain" prefix="ewune.app/" placeholder="greenfield" required />
                  <div className="sm:col-span-2">
                    <Field icon={MapPin} label="School address" name="address" placeholder="Pakuro, Ogun State" required />
                  </div>
                  <Field icon={GraduationCap} label="Current academic session" name="currentAcademicSession" placeholder="2026/2027" required />
                  <Field icon={GraduationCap} label="Current term" name="currentTerm" placeholder="First Term" required />
                  <Field icon={Mail} label="Owner email" name="ownerEmail" placeholder="owner@greenfieldcrest.com" type="email" required />
                  <Field icon={School} label="Owner first name" name="firstName" placeholder="Ada" required />
                  <Field icon={School} label="Owner last name" name="lastName" placeholder="Okafor" required />
                  <div className="sm:col-span-2">
                    <Field icon={LockKeyhole} label="Password" name="password" placeholder="At least 8 characters" type="password" required />
                  </div>
                </div>
              )}

              {mode === "invite" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2"><Field icon={Mail} label="Email address" name="email" placeholder="teacher@school.com" type="email" required /></div>
                  <Field icon={School} label="First name" name="firstName" placeholder="Bisi" required />
                  <Field icon={School} label="Last name" name="lastName" placeholder="Adeyemi" required />
                  <div className="sm:col-span-2"><Field icon={LockKeyhole} label="Password" name="password" placeholder="At least 8 characters" type="password" required /></div>
                  {!inviteToken && <div className="sm:col-span-2"><Field icon={ShieldCheck} label="Invite token" name="token" placeholder="Paste invite token" required /></div>}
                </div>
              )}

              {showEmail && !isSignup && mode !== "invite" && <Field icon={Mail} label="Email address" name="email" placeholder={isLogin ? "owner@greenfieldcrest.test" : "teacher@greenfieldcrest.com"} type="email" required />}
              {mode === "reset" && !resetToken && <Field icon={ShieldCheck} label="Reset token" name="token" placeholder="Paste reset token" required />}
              {showPassword && !isSignup && mode !== "invite" && <Field icon={LockKeyhole} label={mode === "reset" ? "New password" : "Password"} name="password" placeholder="At least 8 characters" type="password" required />}
              {mode === "reset" && <Field icon={ShieldCheck} label="Confirm password" name="confirmPassword" placeholder="Repeat new password" type="password" required />}

              {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}
              {success && <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">{success}</p>}

              <Button className="mt-2 h-12 rounded-xl text-base" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Please wait..." : copy.cta} {!isSubmitting && <ArrowRight size={18} />}
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
  name,
  placeholder,
  prefix,
  type = "text",
  required = false
}: {
  icon: typeof School;
  label: string;
  name: string;
  placeholder: string;
  prefix?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label className="text-sm font-semibold text-brand-text">{label}</Label>
      <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
        <Icon size={17} className="mr-2 shrink-0 text-brand" />
        {prefix && <span className="mr-1 text-sm text-slate-400">{prefix}</span>}
        <Input
          className="h-10 border-0 bg-transparent px-0 shadow-none focus:border-0 focus:ring-0"
          name={name}
          placeholder={placeholder}
          required={required}
          type={type}
        />
      </div>
    </div>
  );
}

function getFormValue(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}
