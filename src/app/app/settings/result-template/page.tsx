"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiGet, apiPut } from "@/lib/api";
import { school } from "@/lib/demo-data";

type Template = { title: string; showPosition: boolean; showAttendance: boolean; principalName?: string | null; closingNote?: string | null };

export default function ResultTemplatePage() {
  const [template, setTemplate] = useState<Template>({ title: "Term Result", showPosition: false, showAttendance: true, principalName: "", closingNote: "" });
  const [message, setMessage] = useState("");

  useEffect(() => { apiGet<Template>("/settings/result-template").then(setTemplate); }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const updated = await apiPut<Template, Template>("/settings/result-template", {
      title: String(form.get("title") ?? ""),
      showPosition: form.get("showPosition") === "on",
      showAttendance: form.get("showAttendance") === "on",
      principalName: String(form.get("principalName") ?? ""),
      closingNote: String(form.get("closingNote") ?? "")
    });
    setTemplate(updated);
    setMessage("Result template saved.");
  }

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Settings</p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">Result template</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Control what appears on parent-ready PDF results before management generates final copies.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader><CardTitle>Template settings</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={save}>
              <div className="grid gap-2"><Label>Template title</Label><Input name="title" defaultValue={template.title} /></div>
              <div className="grid gap-2"><Label>Principal/head teacher name</Label><Input name="principalName" defaultValue={template.principalName ?? ""} /></div>
              <div className="grid gap-2"><Label>Closing note</Label><Textarea name="closingNote" defaultValue={template.closingNote ?? ""} /></div>
              <label className="flex items-center gap-2 text-sm"><input name="showAttendance" type="checkbox" defaultChecked={template.showAttendance} /> Show attendance</label>
              <label className="flex items-center gap-2 text-sm"><input name="showPosition" type="checkbox" defaultChecked={template.showPosition} /> Show class position</label>
              {message && <p className="rounded-xl bg-brand-soft p-3 text-sm text-brand-dark">{message}</p>}
              <Button>Save result template</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle>PDF preview</CardTitle><Badge>Live template</Badge></CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-slate-200 bg-[#fbfcfa] p-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div><p className="text-xl font-bold text-brand-dark">{school.name}</p><p className="text-sm text-slate-500">{school.location}</p></div>
                <span className="grid size-12 place-items-center rounded-xl bg-brand-dark font-bold text-white">G</span>
              </div>
              <div className="mt-5 grid gap-3 text-sm">
                <p className="font-bold text-brand-dark">{template.title}</p>
                <p><strong>Student:</strong> Amina Bello</p>
                <p><strong>Class:</strong> Primary 1 · <strong>Term:</strong> First Term</p>
                {template.showAttendance && <p><strong>Attendance:</strong> 58/62 days</p>}
                {template.showPosition && <p><strong>Position:</strong> 3rd</p>}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {["Mathematics 92 A", "English 88 B", "Creative Work 95 A"].map((row) => <p className="border-b border-slate-100 px-4 py-3 last:border-b-0" key={row}>{row}</p>)}
                </div>
                <p className="rounded-xl bg-brand-soft p-3 text-brand-dark">{template.closingNote || "This result is valid after management approval and school stamp."}</p>
                <p className="text-slate-500">Approved by {template.principalName || "Head Teacher"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
