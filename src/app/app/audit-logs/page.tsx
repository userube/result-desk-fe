import { AppShell } from "@/components/app-shell";
import { activity } from "@/lib/demo-data";
export default function AuditLogsPage() { return <AppShell><h2 className="mb-4 text-2xl font-bold">Audit logs</h2>{activity.map((item) => <p className="mb-2 rounded-md bg-white p-3 text-sm" key={item}>{item}</p>)}</AppShell>; }
