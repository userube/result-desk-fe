import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { activity, metrics } from "@/lib/demo-data";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => <Card key={metric.label}><CardHeader><CardTitle>{metric.value}</CardTitle></CardHeader><CardContent><p className="text-sm text-slate-500">{metric.label}</p></CardContent></Card>)}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader><CardTitle>Result completion status</CardTitle></CardHeader>
          <CardContent>
            <div className="h-3 rounded-full bg-slate-100"><div className="h-3 w-[72%] rounded-full bg-brand" /></div>
            <p className="mt-3 text-sm text-slate-600">Primary 1 is ready for approval. Nursery 2 has missing Phonics scores.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            {["Invite teacher", "Add class", "Add student", "Generate result"].map((item) => <Button variant="outline" key={item}>{item}</Button>)}
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <CardContent className="grid gap-3">{activity.map((item) => <p className="rounded-md bg-slate-50 p-3 text-sm" key={item}>{item}</p>)}</CardContent>
      </Card>
    </AppShell>
  );
}
