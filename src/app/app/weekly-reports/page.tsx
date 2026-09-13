import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function WeeklyReportsPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader><CardTitle>Submit weekly report</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2">
            {["Week number", "Class"].map((field) => (
              <div className="grid gap-2" key={field}><Label>{field}</Label><Input /></div>
            ))}
            {["Topics taught", "Attendance summary", "Student concerns", "Assignments/tests given", "Behaviour notes", "Needs from management", "General comment"].map((field) => (
              <div className="grid gap-2 md:col-span-2" key={field}><Label>{field}</Label><Textarea /></div>
            ))}
            <div className="flex gap-3 md:col-span-2"><Button type="button" variant="outline">Save draft</Button><Button type="button">Submit report</Button></div>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
