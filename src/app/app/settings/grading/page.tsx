import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const gradeBands = [
  ["A", "80-100", "Excellent"],
  ["B", "70-79", "Very good"],
  ["C", "60-69", "Good"],
  ["D", "50-59", "Fair"],
  ["E", "40-49", "Needs support"]
];

export default function GradingSettingsPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Settings</p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">Grading scale</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Configure how teachers enter CA and exam scores, and how Ewune converts totals into grades and comments.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader><CardTitle>Assessment structure</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2"><Label>Continuous assessment</Label><Input defaultValue="40" /></div>
            <div className="grid gap-2"><Label>Exam score</Label><Input defaultValue="60" /></div>
            <div className="grid gap-2"><Label>Total score</Label><Input defaultValue="100" /></div>
            <Button>Save assessment structure</Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Grade bands</CardTitle>
            <Badge>Default Nigerian scale</Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="grid grid-cols-[0.5fr_1fr_1.4fr] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>Grade</span><span>Range</span><span>Comment</span>
              </div>
              {gradeBands.map(([grade, range, comment]) => (
                <div className="grid grid-cols-[0.5fr_1fr_1.4fr] border-t border-slate-100 px-4 py-4 text-sm" key={grade}>
                  <span className="font-bold text-brand-dark">{grade}</span>
                  <span>{range}</span>
                  <span className="text-slate-600">{comment}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 bg-white">Add grade band</Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
