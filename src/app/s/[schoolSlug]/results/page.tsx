"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL, apiPost } from "@/lib/api";

type Result = { id: string; createdAt: string; batch: { termId: string; class: { name: string } } };

export default function ParentResultsPage() {
  const { schoolSlug } = useParams<{ schoolSlug: string }>();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");
  const [student, setStudent] = useState<{ firstName: string; lastName: string } | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { setToken(sessionStorage.getItem(`guardian:${schoolSlug}`) ?? ""); }, [schoolSlug]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE_URL}/parents/results`, { headers: { Authorization: `Bearer ${token}` } }).then(async (response) => {
      if (!response.ok) throw new Error("Session expired. Request a new code.");
      return response.json();
    }).then((data) => { setStudent(data.student); setResults(data.results); }).catch((err) => { setError(err.message); setToken(""); sessionStorage.removeItem(`guardian:${schoolSlug}`); });
  }, [token, schoolSlug]);

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    try { const result = await apiPost<{ message: string }, { schoolSlug: string; email: string }>("/parents/code", { schoolSlug, email }); setMessage(result.message); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not request code"); }
  }

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    try {
      const result = await apiPost<{ accessToken: string }, { schoolSlug: string; email: string; code: string }>("/parents/verify", { schoolSlug, email, code });
      sessionStorage.setItem(`guardian:${schoolSlug}`, result.accessToken); setToken(result.accessToken); setCode("");
    } catch (err) { setError(err instanceof Error ? err.message : "Invalid code"); }
  }

  async function download(resultId: string) {
    setError("");
    const response = await fetch(`${API_BASE_URL}/parents/results/${resultId}/pdf`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) { setError("Could not download this result."); return; }
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement("a"); link.href = url; link.download = "student-result.pdf"; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <main className="min-h-screen bg-[#f5f7f4] px-4 py-10 text-slate-900">
    <div className="mx-auto max-w-2xl">
      <Link className="text-sm text-brand" href={`/s/${schoolSlug}`}>Back to school portal</Link>
      <h1 className="mt-5 text-2xl font-bold">Parent results</h1>
      {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      {!token ? <div className="mt-7 grid gap-6 sm:grid-cols-2">
        <form className="grid gap-3" onSubmit={requestCode}><label className="text-sm font-medium">Guardian email</label><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /><Button>Send access code</Button></form>
        <form className="grid gap-3" onSubmit={verify}><label className="text-sm font-medium">Six-digit code</label><Input inputMode="numeric" pattern="[0-9]{6}" value={code} onChange={(event) => setCode(event.target.value)} required /><Button variant="outline">View results</Button></form>
      </div> : <div className="mt-7">
        <p className="font-medium">{student?.firstName} {student?.lastName}</p>
        <div className="mt-4 divide-y border-y border-slate-200">
          {!results.length && <p className="py-4 text-sm text-slate-500">No approved individual results are available yet.</p>}
          {results.map((result) => <div className="flex items-center justify-between gap-3 py-4" key={result.id}><span className="text-sm">{result.batch.class.name} · {new Date(result.createdAt).toLocaleDateString()}</span><Button size="sm" variant="outline" onClick={() => download(result.id)}>Download PDF</Button></div>)}
        </div>
        <Button className="mt-6" variant="outline" onClick={() => { sessionStorage.removeItem(`guardian:${schoolSlug}`); setToken(""); setStudent(null); setResults([]); }}>Sign out</Button>
      </div>}
    </div>
  </main>;
}
