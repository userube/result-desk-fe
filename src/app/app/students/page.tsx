import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { students } from "@/lib/demo-data";
export default function StudentsPage() { return <AppShell><div className="grid gap-6 lg:grid-cols-[360px_1fr]"><Card><CardHeader><CardTitle>Add student</CardTitle></CardHeader><CardContent className="grid gap-3"><Input placeholder="First name" /><Input placeholder="Last name" /><Input placeholder="Admission number" /><Input placeholder="Parent phone" /><Button>Add student</Button></CardContent></Card><Card><CardHeader><CardTitle>Student records</CardTitle></CardHeader><CardContent className="grid gap-3">{students.map((student, index)=><div className="rounded-md border border-slate-200 p-4" key={student}><p className="font-medium">{student}</p><p className="text-sm text-slate-500">GCS/{String(index + 1).padStart(3, "0")} · Result history available</p></div>)}</CardContent></Card></div></AppShell>; }
