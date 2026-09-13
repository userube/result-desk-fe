import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { school } from "@/lib/demo-data";

export default function SchoolSettingsPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Settings</p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">School profile</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Keep the details that appear on the school portal, reports, PDF results, and admission inquiries.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader><CardTitle>Basic information</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2"><Label>School name</Label><Input defaultValue={school.name} /></div>
            <div className="grid gap-2"><Label>School email</Label><Input defaultValue={school.email} /></div>
            <div className="grid gap-2"><Label>Phone number</Label><Input defaultValue={school.phone} /></div>
            <div className="grid gap-2"><Label>Location</Label><Input defaultValue={school.location} /></div>
            <div className="grid gap-2"><Label>Current session</Label><Input defaultValue="2026/2027" /></div>
            <div className="grid gap-2"><Label>Current term/program</Label><Input defaultValue="First Term" /></div>
            <div className="grid gap-2 md:col-span-2"><Label>Address</Label><Textarea defaultValue="Pakuro, Ogun State, Nigeria" /></div>
            <Button className="md:col-span-2">Save school profile</Button>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="border-slate-200 bg-[#063d35] text-white shadow-sm">
            <CardHeader><CardTitle className="text-white">Public identity</CardTitle></CardHeader>
            <CardContent>
              <div className="grid size-16 place-items-center rounded-2xl bg-white text-2xl font-bold text-brand-dark">G</div>
              <p className="mt-4 text-xl font-bold">{school.name}</p>
              <p className="mt-1 text-sm text-white/65">{school.portal}</p>
              <p className="mt-4 text-sm leading-6 text-white/72">This identity appears on the public school page, result PDFs, and admission inquiry forms.</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader><CardTitle>Brand basics</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid gap-2"><Label>Primary color</Label><Input defaultValue="#106b5f" /></div>
              <Button variant="outline" className="bg-white">Upload school logo</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
