"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiGet, apiPut } from "@/lib/api";

type GradeBand = { id?: string; grade: string; minScore: number; maxScore: number; remark: string };

const defaults: GradeBand[] = [
  { grade: "A", minScore: 80, maxScore: 100, remark: "Excellent" },
  { grade: "B", minScore: 70, maxScore: 79, remark: "Very good" },
  { grade: "C", minScore: 60, maxScore: 69, remark: "Good" },
  { grade: "D", minScore: 50, maxScore: 59, remark: "Fair" },
  { grade: "E", minScore: 40, maxScore: 49, remark: "Needs support" }
];

export default function GradingSettingsPage() {
  const [bands, setBands] = useState<GradeBand[]>(defaults);
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiGet<GradeBand[]>("/settings/grading").then((data) => { if (data.length) setBands(data); });
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const items = bands.map((_, index) => ({
      grade: String(form.get(`grade-${index}`) ?? ""),
      minScore: Number(form.get(`min-${index}`) ?? 0),
      maxScore: Number(form.get(`max-${index}`) ?? 0),
      remark: String(form.get(`remark-${index}`) ?? "")
    }));
    setBands(await apiPut<GradeBand[], { items: GradeBand[] }>("/settings/grading", { items }));
    setMessage("Grading scale saved.");
  }

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Settings</p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">Grading scale</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Configure how Ewune converts totals into grades and comments.</p>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Grade bands</CardTitle><Badge>Persisted</Badge></CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={save}>
            <div className="grid gap-3">
              {bands.map((band, index) => (
                <div className="grid gap-3 rounded-xl border border-slate-200 p-3 md:grid-cols-[90px_100px_100px_1fr]" key={index}>
                  <div className="grid gap-1"><Label>Grade</Label><Input name={`grade-${index}`} defaultValue={band.grade} /></div>
                  <div className="grid gap-1"><Label>Min</Label><Input name={`min-${index}`} type="number" defaultValue={band.minScore} /></div>
                  <div className="grid gap-1"><Label>Max</Label><Input name={`max-${index}`} type="number" defaultValue={band.maxScore} /></div>
                  <div className="grid gap-1"><Label>Comment</Label><Input name={`remark-${index}`} defaultValue={band.remark} /></div>
                </div>
              ))}
            </div>
            {message && <p className="rounded-xl bg-brand-soft p-3 text-sm text-brand-dark">{message}</p>}
            <div className="flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={() => setBands([...bands, { grade: "", minScore: 0, maxScore: 0, remark: "" }])}>Add grade band</Button><Button>Save grading scale</Button></div>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
