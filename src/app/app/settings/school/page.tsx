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
  school: { name: string; slug: string; email: string; phone?: string; address?: string };
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
    const school = await apiPatch<SetupState["school"], { name: string; email: string; phone: string; address: string }>("/schools/current", {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      address: String(form.get("address") ?? "")
    });
    setState((current) => current ? { ...current, school } : current);
    setMessage("School profile saved.");
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
              <div className="grid gap-2"><Label>School address</Label><Input name="address" defaultValue={state?.school.address ?? "Pakuro, Ogun State"} /></div>
              <div className="grid gap-2"><Label>Current academic session</Label><Input value={state?.currentSession?.name ?? "2026/2027"} readOnly /></div>
              <div className="grid gap-2"><Label>Current term</Label><Input value={state?.currentTerm?.name ?? "First Term"} readOnly /></div>
              <div className="grid gap-2 md:col-span-2"><Label>Address notes</Label><Textarea defaultValue={state?.school.address ?? "Pakuro, Ogun State"} /></div>
              {message && <p className="text-sm font-medium text-brand md:col-span-2">{message}</p>}
              <Button className="md:col-span-2">Save school profile</Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="border-slate-200 bg-[#063d35] text-white shadow-sm">
            <CardHeader><CardTitle className="text-white">Public identity</CardTitle></CardHeader>
            <CardContent>
              <div className="grid size-16 place-items-center rounded-2xl bg-white text-2xl font-bold text-brand-dark">{state?.school.name?.[0] ?? "G"}</div>
              <p className="mt-4 text-xl font-bold">{state?.school.name ?? "Greenfield Crest School"}</p>
              <p className="mt-1 text-sm text-white/65">{state?.school.slug ?? "greenfield"}.ewune.app</p>
              <p className="mt-4 text-sm leading-6 text-white/72">This identity appears on the public school page, result PDFs, and admission inquiry forms.</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader><CardTitle>Owner contact</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid gap-2"><Label>Owner email</Label><Input value={state?.owner?.email ?? "owner@greenfieldcrest.com"} readOnly /></div>
              <div className="grid gap-2"><Label>Owner first name</Label><Input value={state?.owner?.firstName ?? ""} readOnly /></div>
              <div className="grid gap-2"><Label>Owner last name</Label><Input value={state?.owner?.lastName ?? ""} readOnly /></div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader><CardTitle>Brand basics</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid gap-2"><Label>Primary color</Label><Input defaultValue="#106b5f" /></div>
              <Button variant="outline" className="bg-white">Upload school logo</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
