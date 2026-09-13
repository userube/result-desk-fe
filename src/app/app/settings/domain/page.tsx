import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { school } from "@/lib/demo-data";

export default function DomainSettingsPage() {
  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader><CardTitle>Portal address</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2"><Label>Subdomain</Label><Input defaultValue={school.slug} /></div>
            <div className="grid gap-2"><Label>Custom domain</Label><Input placeholder="portal.yourschool.edu.ng" /></div>
            <Button>Save domain settings</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>DNS instructions</CardTitle></CardHeader>
          <CardContent>
            <Badge className="bg-amber-50 text-amber-700">Verification pending</Badge>
            <div className="mt-4 rounded-md border border-slate-200 p-4 text-sm">
              <p><strong>Type:</strong> CNAME</p>
              <p><strong>Host:</strong> portal</p>
              <p><strong>Value:</strong> resultdesk.app</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
