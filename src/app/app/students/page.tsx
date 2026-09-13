import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpenCheck, FileText, Phone, Search, Upload, UserPlus } from "lucide-react";

const studentRecords = [
  { name: "Amina Bello", admission: "GCS/2026/001", klass: "Primary 1", gender: "Female", guardian: "Mrs. Bello", phone: "+234 801 111 2233", status: "Active", result: "Approved" },
  { name: "Daniel Okafor", admission: "GCS/2026/002", klass: "Primary 1", gender: "Male", guardian: "Mr. Okafor", phone: "+234 802 334 1100", status: "Active", result: "Review" },
  { name: "Tife Adebanjo", admission: "GCS/2026/003", klass: "Nursery 2", gender: "Female", guardian: "Mrs. Adebanjo", phone: "+234 803 222 1099", status: "Active", result: "Pending" },
  { name: "Samuel Bello", admission: "GCS/2026/004", klass: "Nursery 1", gender: "Male", guardian: "Mr. Bello", phone: "+234 806 781 0090", status: "Active", result: "Missing scores" }
];

const statusTone: Record<string, string> = {
  Approved: "bg-brand-soft text-brand",
  Review: "bg-[#fbf7dc] text-[#7b6417]",
  Pending: "bg-slate-100 text-slate-500",
  "Missing scores": "bg-[#fff1ed] text-[#a34a2a]"
};

export default function StudentsPage() {
  const selected = studentRecords[0];

  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Student management</p>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">Every result starts with clean student records.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Manage admissions, guardians, classes, status, and result history before teachers enter scores.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="bg-white"><Upload size={16} /> Import CSV</Button>
          <Button><UserPlus size={16} /> Add student</Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.75fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="gap-4 md:flex md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Student records</CardTitle>
              <p className="mt-1 text-sm text-slate-500">Search, filter, and review student details.</p>
            </div>
            <div className="flex gap-2">
              <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-white px-3">
                <Search size={16} className="mr-2 text-slate-400" />
                <Input className="h-8 w-36 border-0 px-0 focus:ring-0 md:w-56" placeholder="Search student" />
              </div>
              <Button variant="outline" className="bg-white">Class</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="hidden grid-cols-[1.25fr_0.9fr_0.75fr_1fr_0.9fr] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
                <span>Student</span><span>Admission no.</span><span>Class</span><span>Guardian</span><span>Result</span>
              </div>
              {studentRecords.map((student) => (
                <div className="grid gap-3 border-t border-slate-100 px-4 py-4 text-sm md:grid-cols-[1.25fr_0.9fr_0.75fr_1fr_0.9fr] md:items-center md:gap-4" key={student.admission}>
                  <div>
                    <p className="font-semibold">{student.name}</p>
                    <p className="mt-1 text-xs text-slate-500 md:hidden">{student.admission} • {student.klass}</p>
                  </div>
                  <span className="hidden text-slate-600 md:block">{student.admission}</span>
                  <span className="hidden text-slate-600 md:block">{student.klass}</span>
                  <span className="hidden text-slate-600 md:block">{student.guardian}</span>
                  <Badge className={statusTone[student.result]}>{student.result}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="border-slate-200 bg-[#063d35] text-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-white">Selected profile</CardTitle>
              <p className="text-sm text-white/70">Preview the kind of record schools expect to manage.</p>
            </CardHeader>
            <CardContent>
              <div className="grid size-14 place-items-center rounded-2xl bg-white text-xl font-bold text-brand-dark">AB</div>
              <h3 className="mt-4 text-2xl font-bold">{selected.name}</h3>
              <p className="mt-1 text-sm text-white/65">{selected.admission} • {selected.klass}</p>
              <div className="mt-5 grid gap-3 text-sm">
                <p className="flex items-center gap-2 rounded-xl bg-white/10 p-3"><Phone size={16} className="text-[#e2dbb5]" /> {selected.guardian} · {selected.phone}</p>
                <p className="flex items-center gap-2 rounded-xl bg-white/10 p-3"><BookOpenCheck size={16} className="text-[#e2dbb5]" /> First Term result approved</p>
                <p className="flex items-center gap-2 rounded-xl bg-white/10 p-3"><FileText size={16} className="text-[#e2dbb5]" /> 2 weekly concerns recorded</p>
              </div>
              <Button variant="outline" className="mt-5 w-full border-white/20 bg-white/10 text-white hover:bg-white/15">
                Open full profile
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader><CardTitle>Quick add</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid gap-2"><Label>First name</Label><Input placeholder="Amina" /></div>
              <div className="grid gap-2"><Label>Last name</Label><Input placeholder="Bello" /></div>
              <div className="grid gap-2"><Label>Admission number</Label><Input placeholder="GCS/2026/021" /></div>
              <div className="grid gap-2"><Label>Guardian phone</Label><Input placeholder="+234..." /></div>
              <Button>Add student record</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6 border-slate-200 bg-white shadow-sm">
        <CardHeader><CardTitle>Student module coverage</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          {["Basic info", "Guardian contact", "Current class", "Result history"].map((item) => (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold" key={item}>{item}</div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
