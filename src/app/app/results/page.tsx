"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiGet, apiPatch, apiPost } from "@/lib/api";

type Klass = { id: string; name: string };
type Subject = { id: string; name: string };
type Student = { id: string; firstName: string; lastName: string; admissionNumber: string; class?: Klass };
type Score = { id: string; studentId: string; subjectId: string; caScore: number; examScore: number; total: number; status: string; student?: Student; subject?: Subject };
type ResultBatch = { id: string; classId: string; status: string; program?: { name: string } | null; generatedResults?: Array<{ pdfUrl?: string }> };

export default function ResultsPage() {
  const [classes, setClasses] = useState<Klass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [batches, setBatches] = useState<ResultBatch[]>([]);
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    const [classData, subjectData, studentData, scoreData, batchData] = await Promise.all([
      apiGet<Klass[]>("/schools/classes"),
      apiGet<Subject[]>("/schools/subjects"),
      apiGet<Student[]>("/students"),
      apiGet<Score[]>("/scores"),
      apiGet<ResultBatch[]>("/results")
    ]);
    setClasses(classData);
    setSubjects(subjectData);
    setStudents(studentData);
    setScores(scoreData);
    setBatches(batchData);
    setClassId((current) => current || classData[0]?.id || "");
    setSubjectId((current) => current || subjectData[0]?.id || "");
  }

  useEffect(() => { loadData(); }, []);

  const visibleStudents = useMemo(() => students.filter((student) => student.class?.id === classId), [students, classId]);
  const selectedBatch = batches.find((batch) => batch.classId === classId) ?? batches[0];

  function findScore(studentId: string) {
    return scores.find((score) => score.studentId === studentId && score.subjectId === subjectId);
  }

  async function saveScore(event: FormEvent<HTMLFormElement>, studentId: string) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await apiPost("/scores", {
      studentId,
      subjectId,
      caScore: Number(form.get("caScore") ?? 0),
      examScore: Number(form.get("examScore") ?? 0)
    });
    setMessage("Score saved.");
    await loadData();
  }

  async function submitScore(scoreId?: string) {
    if (!scoreId) return;
    await apiPatch(`/scores/${scoreId}/submit`, {});
    setMessage("Score submitted.");
    await loadData();
  }

  async function requestApproval(batchId?: string) {
    if (!batchId) return;
    await apiPatch(`/results/${batchId}/request-approval`, {});
    setMessage("Approval requested.");
    await loadData();
  }

  async function approve(batchId: string, status: "approved" | "rejected") {
    await apiPost(`/results/${batchId}/approval`, { status });
    setMessage(status === "approved" ? "Result approved." : "Result rejected.");
    await loadData();
  }

  async function generateBatch(batchId: string) {
    const result = await apiPost<{ pdfUrl?: string }, Record<string, never>>(`/pdf/results/${batchId}/class-batch`, {});
    setMessage(`Generated ${result.pdfUrl ?? "class batch PDF"}`);
    await loadData();
  }

  return (
    <AppShell>
      {message && <p className="mb-4 rounded-xl bg-brand-soft p-3 text-sm font-medium text-brand-dark">{message}</p>}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader className="gap-4 md:flex md:flex-row md:items-center md:justify-between">
            <div><CardTitle>Score entry</CardTitle><p className="mt-1 text-sm text-slate-500">Mobile-friendly CA and exam entry per student.</p></div>
            <div className="grid gap-2 sm:grid-cols-2">
              <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" onChange={(event) => setClassId(event.target.value)} value={classId}>
                {classes.map((klass) => <option value={klass.id} key={klass.id}>{klass.name}</option>)}
              </select>
              <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" onChange={(event) => setSubjectId(event.target.value)} value={subjectId}>
                {subjects.map((subject) => <option value={subject.id} key={subject.id}>{subject.name}</option>)}
              </select>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {visibleStudents.map((student) => {
              const score = findScore(student.id);
              return (
                <form className="grid gap-3 rounded-md border border-slate-200 p-3 sm:grid-cols-[1fr_90px_90px_auto]" key={student.id} onSubmit={(event) => saveScore(event, student.id)}>
                  <div><p className="font-medium">{student.firstName} {student.lastName}</p><p className="text-xs text-slate-500">{student.admissionNumber}</p><Badge className={score?.status === "submitted" ? undefined : "bg-amber-50 text-amber-700"}>{score?.status ?? "missing"}</Badge></div>
                  <div className="grid gap-1"><Label>CA</Label><Input name="caScore" type="number" defaultValue={score?.caScore ?? 0} /></div>
                  <div className="grid gap-1"><Label>Exam</Label><Input name="examScore" type="number" defaultValue={score?.examScore ?? 0} /></div>
                  <div className="flex flex-wrap items-end gap-2"><Button size="sm">Save</Button><Button size="sm" type="button" variant="outline" onClick={() => submitScore(score?.id)}>Submit</Button></div>
                </form>
              );
            })}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {selectedBatch && (
            <Card>
              <CardHeader><CardTitle>Approval workflow</CardTitle></CardHeader>
              <CardContent className="grid gap-3">
                <Badge>{selectedBatch.status}</Badge>
                <Button variant="outline" onClick={() => requestApproval(selectedBatch.id)}>Request approval</Button>
                <div className="grid gap-2 sm:grid-cols-2"><Button onClick={() => approve(selectedBatch.id, "approved")}>Approve</Button><Button variant="outline" onClick={() => approve(selectedBatch.id, "rejected")}>Reject</Button></div>
                <Button onClick={() => generateBatch(selectedBatch.id)}>Generate class PDF</Button>
                {selectedBatch.generatedResults?.map((result, index) => result.pdfUrl && <a className="text-sm font-semibold text-brand" href={`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001"}${result.pdfUrl}`} key={index}>Download generated PDF</a>)}
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader><CardTitle>Result batches</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              {batches.map((batch) => <button className="rounded-xl border border-slate-200 p-3 text-left text-sm hover:bg-brand-soft" key={batch.id} onClick={() => setClassId(batch.classId)}><p className="font-semibold">{batch.program?.name ?? "Result batch"}</p><p className="text-slate-500">{batch.status}</p></button>)}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
