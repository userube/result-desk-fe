import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { programs } from "@/lib/demo-data";

export default function ProgramsPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Programs</h2>
        <p className="mt-1 text-sm text-slate-600">Manage normal terms, holiday coaching, exam prep, after-school lessons, and weekend classes.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader><CardTitle>Create program</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2"><Label>Name</Label><Input placeholder="Common Entrance Prep" /></div>
            <div className="grid gap-2"><Label>Type</Label><Input placeholder="exam_prep" /></div>
            <div className="grid gap-2"><Label>Start date</Label><Input type="date" /></div>
            <div className="grid gap-2"><Label>End date</Label><Input type="date" /></div>
            <Button>Create program</Button>
          </CardContent>
        </Card>
        <div className="grid gap-4">
          {programs.map((program) => (
            <Card key={program.name}>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>{program.name}</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">{program.type}</p>
                </div>
                <Badge className={program.status === "Draft" ? "bg-amber-50 text-amber-700" : undefined}>{program.status}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{program.groups}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
