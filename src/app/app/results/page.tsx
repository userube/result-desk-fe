"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuthUser, hasAnyRole, apiGet, apiGetBlob, apiPatch, apiPost } from "@/lib/api";

type Klass = { id: string; name: string };
type Subject = { id: string; name: string };
type Student = { id: string; firstName: string; lastName: string; admissionNumber: string; class?: Klass };
type Score = { id: string; studentId: string; subjectId: string; termId?: string; caScore: number; examScore: number; componentScores?: Record<string, number>; teacherRemark?: string; principalRemark?: string; attendancePresent?: number; attendanceTotal?: number; total: number; status: string; student?: Student; subject?: Subject };
type ResultBatch = { id: string; classId: string; termId: string; status: string; class?: Klass; program?: { name: string } | null; approvals?: Array<{ status: string; comment?: string | null; createdAt: string }>; generatedResults?: Array<{ pdfUrl?: string }> };
type Term = { id: string; name: string; isCurrent: boolean; academicSession?: { name: string } };
type Component = { id: string; name: string; maxScore: number };
type TeacherMe = { roles: Array<{ role: string }>; classes: Array<{ class: Klass }>; subjects: Array<{ subject: Subject }> };
type Review = { batch: { id: string }; summary: { students: number; subjects: number; submitted: number; incomplete: number }; rows: Array<{ studentId: string; student: string; admissionNumber: string; subject: string; total: number | null; status: string; grade: string | null; teacherRemark: string | null; principalRemark: string | null }> };

export default function ResultsPage() {
  const [classes, setClasses] = useState<Klass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [batches, setBatches] = useState<ResultBatch[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [termId, setTermId] = useState("");
  const [error, setError] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [message, setMessage] = useState("");
  const [review, setReview] = useState<Review | null>(null);
  const roles = getAuthUser()?.roles ?? [];
  const canApprove = hasAnyRole(roles, ["SCHOOL_OWNER", "HEAD_TEACHER"]);

  async function loadData() {
    const [classData, subjectData, studentData, scoreData, batchData, termData, componentData] = await Promise.all([
      apiGet<Klass[]>("/schools/classes"),
      apiGet<Subject[]>("/schools/subjects"),
      apiGet<Student[]>("/students"),
      apiGet<Score[]>("/scores"),
      apiGet<ResultBatch[]>("/results"),
      apiGet<Term[]>("/terms"),
      apiGet<Component[]>("/settings/assessments")
    ]);
    const meData = await apiGet<TeacherMe>("/teachers/me").catch(() => null);
    const isAdmin = meData?.roles.some((item) => ["SCHOOL_OWNER", "SCHOOL_ADMIN", "HEAD_TEACHER"].includes(item.role)) ?? true;
    const visibleClasses = isAdmin ? classData : (meData?.classes.map((item) => item.class) ?? []);
    const visibleSubjects = isAdmin ? subjectData : (meData?.subjects.map((item) => item.subject) ?? []);
    setClasses(visibleClasses);
    setSubjects(visibleSubjects);
    setStudents(studentData);
    setScores(scoreData);
    setBatches(batchData);
    setTerms(termData);
    setComponents(componentData);
    setTermId((current) => current || termData.find((item) => item.isCurrent)?.id || termData[0]?.id || "");
    setClassId((current) => current || visibleClasses[0]?.id || "");
    setSubjectId((current) => current || visibleSubjects[0]?.id || "");
  }

  useEffect(() => { loadData().catch((err) => setError(err.message)); }, []);

  const selectedBatch = batches.find((batch) => batch.classId === classId && batch.termId === termId);
  const visibleStudents = useMemo(() => {
    if (!selectedBatch || review?.batch.id !== selectedBatch.id) return students.filter((student) => student.class?.id === classId);
    const roster = new Set(review.rows.map((row) => row.studentId));
    return students.filter((student) => roster.has(student.id));
  }, [students, classId, selectedBatch?.id, review]);

  useEffect(() => {
    if (!selectedBatch) { setReview(null); return; }
    let active = true;
    apiGet<Review>(`/results/${selectedBatch.id}/review`).then((data) => { if (active) setReview(data); }).catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [selectedBatch?.id, scores, batches]);

  function findScore(studentId: string) {
    return scores.find((score) => score.studentId === studentId && score.subjectId === subjectId && score.termId === termId);
  }

  async function saveScore(event: FormEvent<HTMLFormElement>, studentId: string) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const componentScores = Object.fromEntries((components.length ? components : [{ id: "ca", name: "CA", maxScore: 40 }, { id: "exam", name: "Exam", maxScore: 60 }]).map((item) => [item.id, Number(form.get(item.id) ?? 0)]));
    await apiPost("/scores", {
      studentId,
      subjectId,
      termId,
      componentScores,
      teacherRemark: String(form.get("teacherRemark") ?? ""),
      principalRemark: String(form.get("principalRemark") ?? ""),
      attendancePresent: form.get("attendancePresent") ? Number(form.get("attendancePresent")) : undefined,
      attendanceTotal: form.get("attendanceTotal") ? Number(form.get("attendanceTotal")) : undefined
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

  async function savePrincipalRemark(scoreId: string, form: HTMLFormElement) {
    const remark = String(new FormData(form).get("principalRemark") ?? "");
    await apiPatch(`/scores/${scoreId}/principal-remark`, { remark });
    setMessage("Principal remark saved.");
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

  async function generateStudent(batchId: string, studentId: string) {
    const result = await apiPost<{ pdfUrl: string }, Record<string, never>>(`/pdf/results/${batchId}/students/${studentId}`, {});
    setMessage("Student report generated for parent access.");
    await loadData();
    await downloadPdf(result.pdfUrl);
  }

  async function downloadPdf(url: string) {
    const blob = await apiGetBlob(url);
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "result-report.pdf";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }

  async function createBatch() {
    if (!classId) return;
    const batch = await apiPost<ResultBatch, { classId: string; termId: string }>("/results", { classId, termId });
    setMessage("Result batch created.");
    setBatches((current) => [batch, ...current.filter((item) => item.id !== batch.id)]);
    setClassId(batch.classId);
    await loadData();
  }

  return (
    <AppShell>
      {message && <p className="mb-4 rounded-xl bg-brand-soft p-3 text-sm font-medium text-brand-dark">{message}</p>}
      {error && <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader className="gap-4 md:flex md:flex-row md:items-center md:justify-between">
            <div><CardTitle>Score entry</CardTitle></div>
            <div className="grid gap-2 sm:grid-cols-3">
              <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" onChange={(event) => setTermId(event.target.value)} value={termId} aria-label="Term">
                {terms.map((term) => <option value={term.id} key={term.id}>{term.academicSession?.name} {term.name}</option>)}
              </select>
              <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" onChange={(event) => setClassId(event.target.value)} value={classId}>
                {classes.map((klass) => <option value={klass.id} key={klass.id}>{klass.name}</option>)}
              </select>
              <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" onChange={(event) => setSubjectId(event.target.value)} value={subjectId}>
                {subjects.map((subject) => <option value={subject.id} key={subject.id}>{subject.name}</option>)}
              </select>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {!subjects.length && <p className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">Add subjects before score entry.</p>}
            {subjects.length > 0 && !visibleStudents.length && <p className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">No students found for the selected class.</p>}
            {visibleStudents.map((student) => {
              const score = findScore(student.id);
              return (
                <form className="grid gap-3 rounded-md border border-slate-200 p-3 sm:grid-cols-[1fr_repeat(2,90px)_auto]" key={`${student.id}-${subjectId}-${termId}`} onSubmit={(event) => saveScore(event, student.id).catch((err) => setError(err.message))}>
                  <div><p className="font-medium">{student.firstName} {student.lastName}</p><p className="text-xs text-slate-500">{student.admissionNumber}</p><Badge className={score?.status === "submitted" ? undefined : "bg-amber-50 text-amber-700"}>{score?.status ?? "missing"}</Badge></div>
                  {(components.length ? components : [{ id: "ca", name: "CA", maxScore: 40 }, { id: "exam", name: "Exam", maxScore: 60 }]).map((item) => <div className="grid gap-1" key={item.id}><Label>{item.name} / {item.maxScore}</Label><Input name={item.id} type="number" min={0} max={item.maxScore} defaultValue={score?.componentScores?.[item.id] ?? (item.id === "ca" ? score?.caScore : score?.examScore) ?? 0} /></div>)}
                  <div className="flex flex-wrap items-end gap-2"><Button size="sm" disabled={score?.status === "submitted" || selectedBatch?.status === "approved" || selectedBatch?.status === "approval_requested"}>Save</Button><Button size="sm" type="button" variant="outline" disabled={!score || score.status === "submitted"} onClick={() => submitScore(score?.id).catch((err) => setError(err.message))}>Submit</Button></div>
                  <div className="grid gap-1"><Label>Teacher remark</Label><Input name="teacherRemark" defaultValue={score?.teacherRemark ?? ""} /></div>
                  <div className="grid gap-1"><Label>Principal remark</Label><Input name="principalRemark" defaultValue={score?.principalRemark ?? ""} disabled={!canApprove || selectedBatch?.status === "approved"} />{canApprove && score && score.status === "submitted" && selectedBatch?.status !== "approved" && <Button size="sm" type="button" variant="outline" onClick={(event) => savePrincipalRemark(score.id, event.currentTarget.form!).catch((err) => setError(err.message))}>Save remark</Button>}</div>
                  <div className="grid gap-1"><Label>Days present</Label><Input name="attendancePresent" type="number" min={0} defaultValue={score?.attendancePresent ?? ""} /></div>
                  <div className="grid gap-1"><Label>School days</Label><Input name="attendanceTotal" type="number" min={0} defaultValue={score?.attendanceTotal ?? ""} /></div>
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
                {(["draft", "rejected"].includes(selectedBatch.status)) && <Button variant="outline" onClick={() => requestApproval(selectedBatch.id).catch((err) => setError(err.message))}>Request approval</Button>}
                {canApprove && selectedBatch.status === "approval_requested" && <div className="grid gap-2 sm:grid-cols-2"><Button onClick={() => approve(selectedBatch.id, "approved").catch((err) => setError(err.message))}>Approve</Button><Button variant="outline" onClick={() => approve(selectedBatch.id, "rejected").catch((err) => setError(err.message))}>Reject</Button></div>}
                {!canApprove && <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">Only the school owner or head teacher can approve or reject results.</p>}
                {selectedBatch.status === "approved" && <Button onClick={() => generateBatch(selectedBatch.id).catch((err) => setError(err.message))}>Generate class PDF</Button>}
                {selectedBatch.generatedResults?.map((result, index) => result.pdfUrl && <Button type="button" variant="outline" key={index} onClick={() => downloadPdf(result.pdfUrl!).catch((err) => setError(err.message))}>Download PDF</Button>)}
              </CardContent>
            </Card>
          )}
          {!selectedBatch && (
            <Card>
              <CardHeader><CardTitle>Start approval workflow</CardTitle></CardHeader>
              <CardContent className="grid gap-3">
                <p className="text-sm text-slate-500">Create a result batch for the selected class before requesting approval or generating PDFs.</p>
                <Button disabled={!classId || !termId || !subjects.length || !visibleStudents.length} onClick={() => createBatch().catch((err) => setError(err.message))}>Create result batch</Button>
              </CardContent>
            </Card>
          )}
          <Card>
          <CardHeader><CardTitle>Result batches</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
              {!batches.length && <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">No result batches yet. Create one after entering scores for a class.</p>}
              {batches.map((batch) => (
                <button className="rounded-xl border border-slate-200 p-3 text-left text-sm hover:bg-brand-soft" key={batch.id} onClick={() => { setTermId(batch.termId); setClassId(batch.classId); }}>
                  <p className="font-semibold">{batch.class?.name ?? "Class batch"}</p>
                  <p className="text-slate-500">{terms.find((term) => term.id === batch.termId)?.name ?? "Term"} · {batch.program?.name ? `${batch.program.name} · ` : ""}{batch.status}</p>
                  {batch.approvals?.[0] && <p className="mt-1 text-xs text-slate-500">Latest decision: {batch.approvals[0].status}</p>}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      {review && review.batch.id === selectedBatch?.id && <section className="mt-8">
        <h2 className="text-lg font-semibold">Result review</h2>
        <p className="mt-1 text-sm text-slate-600">{review.summary.students} students · {review.summary.subjects} subjects · {review.summary.submitted} submitted · {review.summary.incomplete} incomplete</p>
        <div className="mt-4 overflow-x-auto border-y border-slate-200">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Student</th><th className="p-3">Subject</th><th className="p-3">Total</th><th className="p-3">Grade</th><th className="p-3">Status</th><th className="p-3">Remarks</th></tr></thead>
            <tbody>{review.rows.map((row) => <tr className="border-t border-slate-100" key={`${row.studentId}-${row.subject}`}><td className="p-3">{row.student}<span className="block text-xs text-slate-500">{row.admissionNumber}</span></td><td className="p-3">{row.subject}</td><td className="p-3">{row.total ?? "—"}</td><td className="p-3">{row.grade ?? "—"}</td><td className="p-3">{row.status}</td><td className="p-3">{row.teacherRemark || row.principalRemark || "—"}</td></tr>)}</tbody>
          </table>
        </div>
        {selectedBatch?.status === "approved" && <div className="mt-6">
          <h3 className="font-semibold">Individual report cards</h3>
          <div className="mt-3 divide-y border-y border-slate-200">
            {[...new Map(review.rows.map((row) => [row.studentId, row.student])).entries()].map(([studentId, name]) => <div className="flex items-center justify-between gap-3 py-3 text-sm" key={studentId}><span>{name}</span><Button size="sm" variant="outline" onClick={() => generateStudent(selectedBatch.id, studentId).catch((err) => setError(err.message))}>Generate PDF</Button></div>)}
          </div>
        </div>}
      </section>}
    </AppShell>
  );
}
