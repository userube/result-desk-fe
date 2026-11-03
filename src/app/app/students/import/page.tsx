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
  const sampleCsv = sampleRows.map((row, index) => row.map((value, column) => csvCell(index && column === 4 ? classes[0]?.name ?? value : value)).join(",")).join("\n");
  const sampleHref = `data:text/csv;charset=utf-8,${encodeURIComponent(sampleCsv)}`;

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    setError("");
    setMessage("");
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try { setRows(parseCsv(text, classes)); } catch (err) { setRows([]); setError(err instanceof Error ? err.message : "Invalid CSV file"); }
  }

  async function saveRows() {
    setError("");
    setMessage("");
    if (!validRows.length || validRows.length !== rows.length) {
      setError("Resolve all preview errors before saving.");
      return;
    }
    setIsSaving(true);
    try {
      const payload = validRows.map((row) => {
        const klass = classes.find((item) => item.name.toLowerCase() === row.className.toLowerCase())!;
        return compactPayload({
          firstName: row.firstName,
          lastName: row.lastName,
          admissionNumber: row.admissionNumber,
          gender: row.gender,
          classId: klass.id,
          parentName: row.parentName,
          parentPhone: row.parentPhone,
          parentEmail: row.parentEmail,
          dateOfBirth: row.dateOfBirth
        });
      });
      const result = await apiPost<{ imported: number }, { rows: Record<string, string>[] }>("/students/import", { rows: payload });
      setRows([]);
      setMessage(`${result.imported} student records saved.`);
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
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Download the sample CSV, fill your student data, upload it here, review the records, then save them.</p>
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
            <Button disabled={!validRows.length || validRows.length !== rows.length || isSaving} onClick={saveRows}>{isSaving ? "Saving..." : "Save records"}</Button>
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
  const records = parseCsvRecords(text).filter((record) => record.some((cell) => cell.trim()));
  const expected = sampleRows[0];
  if (!records.length || expected.some((column, index) => records[0][index]?.trim() !== column)) throw new Error(`CSV columns must match the downloaded sample: ${expected.join(", ")}`);
  const body = records.slice(1);
  if (body.length > 500) throw new Error("Import up to 500 students at a time");
  const seen = new Set<string>();
  return body.map((record) => {
    const [firstName = "", lastName = "", admissionNumber = "", gender = "", className = "", parentName = "", parentPhone = "", parentEmail = "", dateOfBirth = ""] = record.map((cell) => cell.trim());
    const errors: string[] = [];
    if (record.length !== expected.length) errors.push("wrong number of columns");
    if (!firstName) errors.push("first name missing");
    if (!lastName) errors.push("last name missing");
    if (!admissionNumber) errors.push("admission missing");
    const admissionKey = admissionNumber.toLowerCase();
    if (seen.has(admissionKey)) errors.push("duplicate admission");
    seen.add(admissionKey);
    if (!gender) errors.push("gender missing");
    if (!classes.some((klass) => klass.name.toLowerCase() === className.toLowerCase())) errors.push("class not found");
    if (parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) errors.push("guardian email invalid");
    if (dateOfBirth && Number.isNaN(new Date(dateOfBirth).getTime())) errors.push("date invalid");
    return { firstName, lastName, admissionNumber, gender, className, parentName, parentPhone, parentEmail, dateOfBirth, errors };
  });
}

function csvCell(value: string) {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function parseCsvRecords(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') { cell += '"'; index++; }
      else if (quoted) quoted = false;
      else if (!cell) quoted = true;
      else throw new Error("Invalid quote in CSV file");
    } else if (char === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += char;
  }
  if (quoted) throw new Error("Unclosed quoted value in CSV file");
  if (row.length || cell) { row.push(cell); rows.push(row); }
  return rows;
}

function compactPayload(values: Record<string, string>) {
  return Object.fromEntries(Object.entries(values).filter(([, value]) => value.trim() !== ""));
}
