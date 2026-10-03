"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiGet, apiPatch } from "@/lib/api";

type SetupState = {
  school: { name: string; slug: string; email: string; phone?: string; address?: string; about?: string; logoUrl?: string; primaryColor?: string };
  currentSession?: { name: string } | null;
  currentTerm?: { name: string } | null;
  owner?: { email: string; firstName: string; lastName: string } | null;
};

export default function SchoolSettingsPage() {
  const [state, setState] = useState<SetupState | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiGet<SetupState>("/schools/setup-state").then(setState).catch((err) => setMessage(err.message));
  }, []);

  async function saveSchool(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const updated = await apiPatch<SetupState, {
      name: string;
      email: string;
      phone: string;
      address: string;
      currentAcademicSession: string;
      currentTerm: string;
      ownerEmail: string;
      ownerFirstName: string;
      about: string;
      logoUrl: string;
      primaryColor: string;
    }>("/schools/current", {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      address: String(form.get("address") ?? ""),
      currentAcademicSession: String(form.get("currentAcademicSession") ?? ""),
      currentTerm: String(form.get("currentTerm") ?? ""),
      ownerEmail: String(form.get("ownerEmail") ?? ""),
      ownerFirstName: String(form.get("ownerFirstName") ?? ""),
      about: String(form.get("about") ?? ""),
      logoUrl: String(form.get("logoUrl") ?? ""),
      primaryColor: String(form.get("primaryColor") ?? "")
    });
    setState(updated);
    setMessage("School profile saved.");
  }

  async function readLogo(file?: File) {
    if (!file) return;
    if (file.size > 350_000) {
      setMessage("Logo file is too large. Use an image under 350 KB.");
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("Could not read logo file."));
      reader.readAsDataURL(file);
    });
    setState((current) => current ? { ...current, school: { ...current.school, logoUrl: dataUrl } } : current);
    setMessage("Logo ready. Save the profile to publish it.");
  }

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Settings</p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">School profile</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Keep the details that appear on the school portal, reports, PDF results, and admission inquiries.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader><CardTitle>Basic information</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={saveSchool}>
              <div className="grid gap-2"><Label>School name</Label><Input name="name" defaultValue={state?.school.name ?? ""} /></div>
              <div className="grid gap-2"><Label>School email</Label><Input name="email" defaultValue={state?.school.email ?? ""} /></div>
              <div className="grid gap-2"><Label>Phone number</Label><Input name="phone" defaultValue={state?.school.phone ?? ""} /></div>
              <div className="grid gap-2"><Label>School address</Label><Input name="address" defaultValue={state?.school.address ?? ""} /></div>
              <div className="grid gap-2"><Label>Current academic session</Label><Input name="currentAcademicSession" defaultValue={state?.currentSession?.name ?? ""} /></div>
              <div className="grid gap-2"><Label>Current term</Label><Input name="currentTerm" defaultValue={state?.currentTerm?.name ?? ""} /></div>
              <div className="grid gap-2"><Label>Owner email</Label><Input name="ownerEmail" defaultValue={state?.owner?.email ?? ""} type="email" /></div>
              <div className="grid gap-2"><Label>Owner first name</Label><Input name="ownerFirstName" defaultValue={state?.owner?.firstName ?? ""} /></div>
              <input name="logoUrl" type="hidden" value={state?.school.logoUrl ?? ""} readOnly />
              <div className="grid gap-2"><Label>Primary color</Label><Input name="primaryColor" defaultValue={state?.school.primaryColor ?? "#106b5f"} /></div>
              <div className="grid gap-2 md:col-span-2"><Label>About the school</Label><Textarea name="about" defaultValue={state?.school.about ?? ""} /></div>
              {message && <p className="text-sm font-medium text-brand md:col-span-2">{message}</p>}
              <Button className="md:col-span-2">Save school profile</Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="border-slate-200 bg-[#063d35] text-white shadow-sm">
            <CardHeader><CardTitle className="text-white">Public identity</CardTitle></CardHeader>
            <CardContent>
              {state?.school.logoUrl ? <img alt="School logo" className="size-16 rounded-2xl bg-white object-cover" src={state.school.logoUrl} /> : <div className="grid size-16 place-items-center rounded-2xl bg-white text-2xl font-bold text-brand-dark">{state?.school.name?.[0] ?? "S"}</div>}
              <p className="mt-4 text-xl font-bold">{state?.school.name ?? "School name"}</p>
              <p className="mt-1 text-sm text-white/65">{state?.school.slug ? `${state.school.slug}.ewune.app` : "portal pending"}</p>
              <p className="mt-4 text-sm leading-6 text-white/72">{state?.school.about || "This identity appears on the public school page, result PDFs, and admission inquiry forms."}</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader><CardTitle>Brand basics</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid gap-2">
                <Label>Logo image</Label>
                <Input accept="image/png,image/jpeg,image/webp" type="file" onChange={(event) => readLogo(event.target.files?.[0])} />
              </div>
              <p className="text-xs text-slate-500">Upload a square PNG, JPEG, or WebP under 350 KB, then save the school profile.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
