import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { setupItems } from "@/lib/demo-data";

export default function SetupPage() {
  return (
    <AppShell>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Setup checklist</h2>
          <p className="mt-1 text-sm text-slate-600">Everything Greenfield Crest needs before first result generation.</p>
        </div>
        <Badge>5 of 6 complete</Badge>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardContent className="grid gap-3 pt-5">
            {setupItems.map((item) => (
              <div className="flex items-center justify-between rounded-md border border-slate-200 p-4" key={item.label}>
                <span className="font-medium">{item.label}</span>
                <Badge className={item.done ? undefined : "bg-amber-50 text-amber-700"}>{item.done ? "Done" : "Pending"}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Next best action</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-600">Finish the result template so approved batches can be generated as final PDFs.</p>
            <Button className="mt-4">Open template settings</Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
