import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeachersPage() {
  return <AppShell><Card><CardHeader><CardTitle>Teachers</CardTitle></CardHeader><CardContent><Button>Invite teacher</Button><p className="mt-4 text-sm text-slate-600">Assign teachers to classes and subjects after they accept their invitation.</p></CardContent></Card></AppShell>;
}
