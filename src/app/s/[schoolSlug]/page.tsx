import Link from "next/link";
import { Button } from "@/components/ui/button";
import { school } from "@/lib/demo-data";

export default function SchoolPortalPage() {
  return (
    <main className="min-h-screen bg-brand-soft px-4 py-10 text-brand-text">
      <section className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold text-brand">{school.portal}</p>
        <h1 className="mt-2 text-4xl font-bold">{school.name}</h1>
        <p className="mt-4 text-slate-600">A friendly nursery, primary, and secondary school in {school.location}.</p>
        <p className="mt-4 text-sm">{school.email} · {school.phone}</p>
        <Button asChild className="mt-6"><Link href="/s/greenfield/admission">Admission inquiry</Link></Button>
      </section>
    </main>
  );
}
