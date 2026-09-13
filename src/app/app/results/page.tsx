import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { classes } from "@/lib/demo-data";

export default function ResultsPage() {
  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-3">
        {classes.map((klass, index) => (
          <Card key={klass}>
            <CardHeader><CardTitle>{klass}</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-slate-600">{index === 2 ? "Ready for approval/PDF" : "Partially completed"}</p>
              <Button asChild variant="outline"><Link href={`/app/results/${klass.toLowerCase().replaceAll(" ", "-")}`}>Open class</Link></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
