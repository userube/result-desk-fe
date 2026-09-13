import Link from "next/link";
import { BarChart3, BookOpenCheck, ClipboardList, Home, Settings, Users, type LucideIcon } from "lucide-react";

const items: Array<{ label: string; href: `/app/${string}`; Icon: LucideIcon }> = [
  { label: "Dashboard", href: "/app/dashboard", Icon: Home },
  { label: "Teachers", href: "/app/teachers", Icon: Users },
  { label: "Reports", href: "/app/weekly-reports", Icon: ClipboardList },
  { label: "Results", href: "/app/results", Icon: BookOpenCheck },
  { label: "Settings", href: "/app/settings/school", Icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-brand-text md:pb-0">
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-slate-200 bg-white p-5 md:block">
        <Link href="/app/dashboard" className="font-bold text-brand-dark">ResultDesk</Link>
        <nav className="mt-8 grid gap-1">
          {items.map(({ label, href, Icon }) => (
            <Link className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-brand-soft" href={href} key={href}>
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="md:pl-64">
        <header className="border-b border-slate-200 bg-white px-4 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-brand">Greenfield Crest School</p>
              <h1 className="text-xl font-bold">School workspace</h1>
            </div>
            <BarChart3 className="text-brand" />
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 grid grid-cols-5 border-t border-slate-200 bg-white md:hidden">
        {items.map(({ label, href, Icon }) => (
          <Link className="flex flex-col items-center gap-1 px-1 py-2 text-[11px]" href={href} key={href}>
            <Icon size={18} /> {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
