import Link from "next/link";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";

type SchoolPortal = {
  name: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
};

export default async function SchoolPortalPage({ params }: { params: Promise<{ schoolSlug: string }> }) {
  const { schoolSlug } = await params;
  const response = await fetch(`${API_BASE_URL}/public/schools/${schoolSlug}`, { cache: "no-store" });
  const school = response.ok ? await response.json() as SchoolPortal : null;

  if (!school) {
    return (
      <main className="grid min-h-screen place-items-center bg-brand-soft px-4 py-10 text-brand-text">
        <section className="mx-auto max-w-xl rounded-lg bg-white p-6 text-center shadow-soft">
          <h1 className="text-3xl font-bold">School portal not found</h1>
          <p className="mt-3 text-sm text-slate-600">Please check the portal link and try again.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-soft px-4 py-10 text-brand-text">
      <section className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold text-brand">{school.slug}.ewune.app</p>
        <h1 className="mt-2 text-4xl font-bold">{school.name}</h1>
        <p className="mt-4 text-slate-600">{school.address ?? "A connected school portal for admissions and parent updates."}</p>
        <p className="mt-4 text-sm">{school.email}{school.phone ? ` · ${school.phone}` : ""}</p>
        <Button asChild className="mt-6"><Link href={`/s/${school.slug}/admission`}>Admission inquiry</Link></Button>
      </section>
    </main>
  );
}
