"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet } from "@/lib/api";

type AuditLog = { id: string; action: string; entityType: string; entityId?: string; createdAt: string };

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [error, setError] = useState("");

  useEffect(() => { apiGet<AuditLog[]>("/audit-logs").then(setLogs).catch((err) => setError(err.message)); }, []);

  return (
    <AppShell>
      <h2 className="mb-4 text-2xl font-bold">Audit logs</h2>
      {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader><CardTitle>Recent tenant activity</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          {logs.map((log) => (
            <p className="rounded-xl bg-slate-50 p-4 text-sm" key={log.id}>
              <span className="font-semibold">{log.action}</span> · {log.entityType}
            </p>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
