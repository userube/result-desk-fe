"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet, apiPost } from "@/lib/api";

type ResultBatch = { id: string; classId: string; status: string; program?: { name: string } | null; generatedResults?: unknown[] };

export default function ResultsPage() {
  const [batches, setBatches] = useState<ResultBatch[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => { apiGet<ResultBatch[]>("/results").then(setBatches); }, []);

  async function generateBatch(batchId: string) {
    const result = await apiPost<{ pdfUrl?: string }, Record<string, never>>(`/pdf/results/${batchId}/class-batch`, {});
    setMessage(`Generated ${result.pdfUrl ?? "class batch PDF"}`);
  }

  return (
    <AppShell>
      {message && <p className="mb-4 rounded-xl bg-brand-soft p-3 text-sm font-medium text-brand-dark">{message}</p>}
      <div className="grid gap-4 md:grid-cols-3">
        {batches.map((batch) => (
          <Card key={batch.id}>
            <CardHeader><CardTitle>{batch.program?.name ?? "Result batch"}</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-2 text-sm text-slate-600">Class ID: {batch.classId}</p>
              <p className="mb-4 text-sm text-slate-600">Status: {batch.status}</p>
              <Button variant="outline" onClick={() => generateBatch(batch.id)}>Generate class PDF</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
