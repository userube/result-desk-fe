import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdmissionPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-brand-soft px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader><CardTitle>Admission inquiry</CardTitle></CardHeader>
        <CardContent><form className="grid gap-4">{["Parent name", "Phone", "Email", "Child name", "Class interested in"].map((field) => <div className="grid gap-2" key={field}><Label>{field}</Label><Input /></div>)}<Button type="button">Submit inquiry</Button></form></CardContent>
      </Card>
    </main>
  );
}
