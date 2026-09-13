import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { teachers } from "@/lib/demo-data";

export default function TeachersPage() {
  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader><CardTitle>Invite teacher</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-4">
              <div className="grid gap-2"><Label>Email</Label><Input placeholder="teacher@school.com" /></div>
              <div className="grid gap-2"><Label>Role</Label><Input placeholder="CLASS_TEACHER" /></div>
              <Button type="button">Send invitation</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Teacher assignments</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {teachers.map((teacher) => (
              <div className="rounded-md border border-slate-200 p-4" key={teacher.email}>
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-semibold">{teacher.name}</p>
                    <p className="text-sm text-slate-500">{teacher.email}</p>
                  </div>
                  <Badge>{teacher.role}</Badge>
                </div>
                <p className="mt-3 text-sm text-slate-600">{teacher.assignment}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
