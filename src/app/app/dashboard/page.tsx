import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { activity, metrics, programs } from "@/lib/demo-data";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => <Card key={metric.label}><CardHeader><CardTitle>{metric.value}</CardTitle></CardHeader><CardContent><p className="text-sm text-slate-500">{metric.label}</p></CardContent></Card>)}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader><CardTitle>Program submission status</CardTitle></CardHeader>
          <CardContent>
            <div className="h-3 rounded-full bg-slate-100"><div className="h-3 w-[72%] rounded-full bg-brand" /></div>
            <p className="mt-3 text-sm text-slate-600">First Term result work is 72% complete. Holiday Coaching reports are reviewed.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            {["Create program", "Invite teacher", "Add class/group", "Open ResultDesk"].map((item) => <Button variant="outline" key={item}>{item}</Button>)}
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {programs.map((program) => <Card key={program.name}><CardHeader><CardTitle>{program.name}</CardTitle></CardHeader><CardContent><Badge>{program.status}</Badge><p className="mt-3 text-sm text-slate-600">{program.groups}</p></CardContent></Card>)}
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <CardContent className="grid gap-3">{activity.map((item) => <p className="rounded-md bg-slate-50 p-3 text-sm" key={item}>{item}</p>)}</CardContent>
      </Card>
    </AppShell>
  );
}
