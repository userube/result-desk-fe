"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiGet, apiPost, apiPut } from "@/lib/api";

type DomainSetting = { portalSubdomain: string; customDomain?: string | null; status: string; dnsInstructions?: { type: string; host: string; value: string; status: string } };

export default function DomainSettingsPage() {
  const [setting, setSetting] = useState<DomainSetting | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => { apiGet<DomainSetting>("/domains/settings").then(setSetting).catch((err) => setMessage(err.message)); }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const updated = await apiPut<DomainSetting, { portalSubdomain: string; customDomain: string }>("/domains/settings", {
      portalSubdomain: String(form.get("portalSubdomain") ?? ""),
      customDomain: String(form.get("customDomain") ?? "")
    });
    setSetting(updated);
    setMessage("Domain settings saved.");
  }

  async function verify() {
    const updated = await apiPost<DomainSetting, Record<string, never>>("/domains/verify", {});
    setSetting(updated);
    setMessage("Domain verification refreshed.");
  }

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader><CardTitle>Portal address</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={save}>
              <div className="grid gap-2"><Label>Subdomain</Label><Input name="portalSubdomain" defaultValue={setting?.portalSubdomain ?? ""} /></div>
              <div className="grid gap-2"><Label>Custom domain</Label><Input name="customDomain" defaultValue={setting?.customDomain ?? ""} placeholder="portal.yourschool.edu.ng" /></div>
              {message && <p className="text-sm font-medium text-brand">{message}</p>}
              <Button>Save domain settings</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>DNS instructions</CardTitle></CardHeader>
          <CardContent>
            <Badge className="bg-amber-50 text-amber-700">{setting?.status ?? "pending"}</Badge>
            <div className="mt-4 rounded-md border border-slate-200 p-4 text-sm">
              <p><strong>Type:</strong> {setting?.dnsInstructions?.type ?? "CNAME"}</p>
              <p><strong>Host:</strong> {setting?.dnsInstructions?.host ?? "portal"}</p>
              <p><strong>Value:</strong> {setting?.dnsInstructions?.value ?? "ewune.app"}</p>
            </div>
            <Button className="mt-4 w-full" variant="outline" onClick={verify}>Check verification</Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
