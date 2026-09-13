import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const students = ["Amina Bello", "Daniel Okafor", "Tife Adebanjo", "Mariam Yusuf"];

export default function ClassResultsPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader><CardTitle>Mobile score entry</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          {students.map((student) => (
            <div className="grid gap-3 rounded-md border border-slate-200 p-3 sm:grid-cols-[1fr_90px_90px]" key={student}>
              <p className="font-medium">{student}</p>
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
