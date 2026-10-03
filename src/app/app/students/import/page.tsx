"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiGet, apiPost } from "@/lib/api";
import { Download, Upload } from "lucide-react";

type Klass = { id: string; name: string };
type SetupState = { classes: Klass[] };
type Student = { id: string; firstName: string; lastName: string };
type ImportRow = {
  firstName: string;
  lastName: string;
  admissionNumber: string;
  gender: string;
  className: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  dateOfBirth: string;
  errors: string[];
};

const sampleRows = [
  ["firstName", "lastName", "admissionNumber", "gender", "className", "parentName", "parentPhone", "parentEmail", "dateOfBirth"],
  ["Amina", "Bello", "ADM-001", "Female", "Primary 1", "Mrs Bello", "08030000001", "parent1@yourschool.com", "2017-09-12"],
  ["Daniel", "Okafor", "ADM-002", "Male", "Primary 1", "Mr Okafor", "08030000002", "parent2@yourschool.com", "2017-11-03"]
];

const sampleCsv = sampleRows.map((row) => row.join(",")).join("\n");

export default function ImportStudentsPage() {
  const [classes, setClasses] = useState<Klass[]>([]);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    apiGet<SetupState>("/schools/setup-state").then((state) => setClasses(state.classes)).catch((err) => setError(err.message));
  }, []);

  const validRows = useMemo(() => rows.filter((row) => row.errors.length === 0), [rows]);
  const sampleHref = `data:text/csv;charset=utf-8,${encodeURIComponent(sampleCsv)}`;

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    setError("");
    setMessage("");
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setRows(parseCsv(text, classes));
  }

  async function saveRows() {
    setError("");
    setMessage("");
    if (!validRows.length) {
      setError("Upload a valid file before saving.");
      return;
    }
    setIsSaving(true);
    try {
      let saved = 0;
      for (const row of validRows) {
        const klass = classes.find((item) => item.name.toLowerCase() === row.className.toLowerCase());
        if (!klass) continue;
        await apiPost<Student, Record<string, string>>("/students", compactPayload({
          firstName: row.firstName,
          lastName: row.lastName,
          admissionNumber: row.admissionNumber,
          gender: row.gender,
          classId: klass.id,
          parentName: row.parentName,
          parentPhone: row.parentPhone,
          parentEmail: row.parentEmail,
          dateOfBirth: row.dateOfBirth
        }));
        saved += 1;
      }
      setRows([]);
      setMessage(`${saved} student records saved.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save imported students.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Student import</p>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">Preview student records before saving.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Download the sample CSV, fill your student data, upload it here, review the mock table, then save the valid rows.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="bg-white"><Link href="/app/students">Back to students</Link></Button>
          <Button asChild><a download="student-import-sample.csv" href={sampleHref}><Download size={16} /> Download sample CSV</a></Button>
        </div>
      </div>

      {message && <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader><CardTitle>Sample format</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="overflow-hidden rounded-xl border border-slate-200 text-sm">
              <div className="grid grid-cols-2 bg-slate-50 px-4 py-3 font-semibold text-slate-600"><span>Column</span><span>Example</span></div>
              {sampleRows[0].map((column, index) => (
                <div className="grid grid-cols-2 border-t border-slate-100 px-4 py-3" key={column}>
                  <span className="font-medium">{column}</span>
                  <span className="text-slate-600">{sampleRows[1][index]}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-brand-soft p-4 text-sm text-brand-dark">
              Class names must match existing classes exactly. Current classes: {classes.map((klass) => klass.name).join(", ") || "none yet"}.
            </div>
            <label className="grid cursor-pointer gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-600 hover:bg-brand-soft">
              <Upload className="mx-auto text-brand" />
              Upload completed CSV
              <Input className="hidden" accept=".csv,text/csv" type="file" onChange={handleFile} />
            </label>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="gap-3 md:flex md:flex-row md:items-center md:justify-between">
            <div><CardTitle>Upload preview</CardTitle><p className="mt-1 text-sm text-slate-500">{validRows.length} valid of {rows.length} uploaded rows</p></div>
            <Button disabled={!validRows.length || isSaving} onClick={saveRows}>{isSaving ? "Saving..." : "Save valid rows"}</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr><th className="p-3">Student</th><th className="p-3">Admission</th><th className="p-3">Class</th><th className="p-3">Guardian</th><th className="p-3">Status</th></tr>
                </thead>
                <tbody>
                  {!rows.length && <tr><td className="p-4 text-slate-500" colSpan={5}>Upload a CSV to preview records here.</td></tr>}
                  {rows.map((row, index) => (
                    <tr className="border-t border-slate-100" key={`${row.admissionNumber}-${index}`}>
                      <td className="p-3 font-medium">{row.firstName} {row.lastName}<p className="text-xs font-normal text-slate-500">{row.gender} {row.dateOfBirth ? `· ${row.dateOfBirth}` : ""}</p></td>
                      <td className="p-3">{row.admissionNumber}</td>
                      <td className="p-3">{row.className}</td>
                      <td className="p-3">{row.parentName || "No guardian"}<p className="text-xs text-slate-500">{row.parentPhone} {row.parentEmail ? `· ${row.parentEmail}` : ""}</p></td>
                      <td className="p-3">{row.errors.length ? <Badge className="bg-red-50 text-red-700">{row.errors.join(", ")}</Badge> : <Badge>Ready</Badge>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function parseCsv(text: string, classes: Klass[]): ImportRow[] {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const [header, ...body] = lines;
  const hasHeader = header?.toLowerCase().includes("firstname");
  const rows = hasHeader ? body : lines;
  return rows.map((line) => {
    const [firstName = "", lastName = "", admissionNumber = "", gender = "", className = "", parentName = "", parentPhone = "", parentEmail = "", dateOfBirth = ""] = splitCsvLine(line);
    const errors: string[] = [];
    if (!firstName) errors.push("first name missing");
    if (!lastName) errors.push("last name missing");
    if (!admissionNumber) errors.push("admission missing");
    if (!gender) errors.push("gender missing");
    if (!classes.some((klass) => klass.name.toLowerCase() === className.toLowerCase())) errors.push("class not found");
    if (parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) errors.push("guardian email invalid");
    return { firstName, lastName, admissionNumber, gender, className, parentName, parentPhone, parentEmail, dateOfBirth, errors };
  });
}

function splitCsvLine(line: string) {
  return line.split(",").map((value) => value.trim().replace(/^"|"$/g, ""));
}

function compactPayload(values: Record<string, string>) {
  return Object.fromEntries(Object.entries(values).filter(([, value]) => value.trim() !== ""));
}
