import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { classes } from "@/lib/demo-data";
export default function ClassesPage() { return <AppShell><div className="grid gap-6 lg:grid-cols-[320px_1fr]"><Card><CardHeader><CardTitle>Add class</CardTitle></CardHeader><CardContent className="grid gap-3"><Input placeholder="Primary 2" /><Button>Add class</Button></CardContent></Card><Card><CardHeader><CardTitle>Classes</CardTitle></CardHeader><CardContent className="grid gap-3">{classes.map((klass)=><div className="rounded-md border border-slate-200 p-4 font-medium" key={klass}>{klass}</div>)}</CardContent></Card></div></AppShell>; }
