"use client";

import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api";

export default function AdmissionPage() {
  const params = useParams<{ schoolSlug: string }>();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await apiPost<{ inquiryId: string; schoolName: string }, Record<string, string>>(`/public/schools/${params.schoolSlug}/admission-inquiries`, {
        parentName: String(form.get("parentName") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? ""),
        childName: String(form.get("childName") ?? ""),
        classInterest: String(form.get("classInterest") ?? "")
      });
      setMessage(`Inquiry sent to ${response.schoolName}.`);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit inquiry.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-brand-soft px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader><CardTitle>Admission inquiry</CardTitle></CardHeader>
        <CardContent>
          {message && <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
          {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <form className="grid gap-4" onSubmit={submitInquiry}>
            <Field label="Parent name" name="parentName" required />
            <Field label="Phone" name="phone" required />
            <Field label="Email" name="email" type="email" />
            <Field label="Child name" name="childName" required />
            <Field label="Class interested in" name="classInterest" required />
            <Button>Submit inquiry</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return <div className="grid gap-2"><Label>{label}</Label><Input name={name} type={type} required={required} /></div>;
}
