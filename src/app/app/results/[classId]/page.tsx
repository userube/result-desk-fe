import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { students } from "@/lib/demo-data";

export default function ClassResultsPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader><CardTitle>Mobile score entry</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          {students.map((student, index) => (
            <div className="grid gap-3 rounded-md border border-slate-200 p-3 sm:grid-cols-[1fr_90px_90px]" key={student}>
              <div><p className="font-medium">{student}</p><Badge className={index < 4 ? undefined : "bg-amber-50 text-amber-700"}>{index < 4 ? "saved" : "missing"}</Badge></div>
              <Input placeholder="CA" />
              <Input placeholder="Exam" />
            </div>
          ))}
          <div className="flex flex-wrap gap-3"><Button variant="outline">Save draft</Button><Button>Request approval</Button><Button variant="outline">Draft PDF preview</Button></div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
