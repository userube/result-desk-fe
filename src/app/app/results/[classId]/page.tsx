"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
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
type Score = { id: string; studentId: string; subjectId: string; caScore: number; examScore: number; total: number; status: string };
type ResultBatch = { id: string; classId: string; status: string; class?: Klass };

export default function ClassResultsPage() {
  const params = useParams<{ classId: string }>();
  const classId = params.classId;
  const [classes, setClasses] = useState<Klass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [batches, setBatches] = useState<ResultBatch[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    const [classData, subjectData, studentData, scoreData, batchData] = await Promise.all([
      apiGet<Klass[]>("/schools/classes"),
      apiGet<Subject[]>("/schools/subjects"),
      apiGet<Student[]>(`/students?classId=${classId}`),
      apiGet<Score[]>(`/scores?classId=${classId}`),
      apiGet<ResultBatch[]>("/results")
    ]);
    setClasses(classData);
    setSubjects(subjectData);
    setStudents(studentData);
    setScores(scoreData);
    setBatches(batchData);
    setSubjectId((current) => current || subjectData[0]?.id || "");
  }

  useEffect(() => { loadData().catch((err) => setError(err.message)); }, [classId]);

  const klass = classes.find((item) => item.id === classId);
  const batch = useMemo(() => batches.find((item) => item.classId === classId), [batches, classId]);

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

  async function createBatch() {
    const created = await apiPost<ResultBatch, { classId: string }>("/results", { classId });
    setMessage(`Result batch created for ${created.class?.name ?? klass?.name ?? "class"}.`);
    await loadData();
  }

  async function requestApproval() {
    if (!batch) return;
    await apiPatch(`/results/${batch.id}/request-approval`, {});
    setMessage("Approval requested.");
    await loadData();
  }

  return (
    <AppShell>
      {message && <p className="mb-4 rounded-xl bg-brand-soft p-3 text-sm font-medium text-brand-dark">{message}</p>}
      {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <Card>
        <CardHeader className="gap-4 md:flex md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>{klass?.name ?? "Class"} score entry</CardTitle>
            <p className="mt-1 text-sm text-slate-500">Enter, save, submit, and request approval for this class.</p>
          </div>
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" onChange={(event) => setSubjectId(event.target.value)} value={subjectId}>
            {subjects.map((subject) => <option value={subject.id} key={subject.id}>{subject.name}</option>)}
          </select>
        </CardHeader>
        <CardContent className="grid gap-3">
          {!students.length && <p className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">No students are enrolled in this class yet.</p>}
          {students.map((student) => {
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
          <div className="flex flex-wrap gap-3">
            {!batch ? <Button type="button" onClick={createBatch}>Create result batch</Button> : <Button type="button" onClick={requestApproval}>Request approval</Button>}
            {batch && <Badge>{batch.status}</Badge>}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
