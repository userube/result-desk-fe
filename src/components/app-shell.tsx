import Link from "next/link";
import { BarChart3, BookOpenCheck, ClipboardList, Globe2, Home, Layers3, Settings, ShieldCheck, UserPlus, Users, type LucideIcon } from "lucide-react";

const items: Array<{ label: string; href: `/app/${string}`; Icon: LucideIcon }> = [
  { label: "Dashboard", href: "/app/dashboard", Icon: Home },
  { label: "Programs", href: "/app/programs", Icon: Layers3 },
  { label: "Classes", href: "/app/classes", Icon: BookOpenCheck },
  { label: "Teachers", href: "/app/teachers", Icon: Users },
  { label: "Weekly Reports", href: "/app/weekly-reports", Icon: ClipboardList },
  { label: "ResultDesk", href: "/app/results", Icon: ShieldCheck },
  { label: "School Portal", href: "/app/settings/domain", Icon: Globe2 },
  { label: "Settings", href: "/app/settings/school", Icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f7f4] pb-20 text-brand-text md:pb-0">
      <aside className="fixed left-0 top-0 hidden h-full w-72 border-r border-slate-200 bg-white p-5 md:block">
        <Link href="/app/dashboard" className="flex items-center gap-3 font-bold text-brand-dark">
          <span className="grid size-10 place-items-center rounded-xl bg-brand-dark text-white">E</span>
          <span>
            <span className="block">Ewune</span>
            <span className="block text-xs font-medium text-slate-500">Greenfield Crest</span>
          </span>
        </Link>
        <div className="mt-6 rounded-2xl bg-[#effaf7] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Result week</p>
          <p className="mt-2 text-2xl font-bold">72%</p>
          <div className="mt-3 h-2 rounded-full bg-white"><div className="h-2 w-[72%] rounded-full bg-brand" /></div>
          <p className="mt-3 text-xs leading-5 text-slate-600">Primary 1 batch is waiting for management review.</p>
        </div>
        <nav className="mt-6 grid gap-1">
          {items.map(({ label, href, Icon }) => (
            <Link className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-soft hover:text-brand-dark" href={href} key={href}>
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-semibold">Invite teachers</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Bring score entry closer to the classroom.</p>
          <Link className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand" href="/app/teachers">
            <UserPlus size={15} /> Send invite
          </Link>
        </div>
      </aside>
      <div className="md:pl-72">
        <header className="border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">Greenfield Crest School</p>
              <h1 className="text-xl font-bold">School workspace</h1>
              <p className="mt-1 hidden text-sm text-slate-500 sm:block">First Term, Holiday Coaching, and ResultDesk approvals in one place.</p>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">greenfield.ewune.app</span>
              <span className="grid size-10 place-items-center rounded-xl bg-[#effaf7] text-brand"><BarChart3 size={20} /></span>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 grid grid-cols-5 border-t border-slate-200 bg-white md:hidden">
        {items.slice(0, 5).map(({ label, href, Icon }) => (
          <Link className="flex flex-col items-center gap-1 px-1 py-2 text-[11px]" href={href} key={href}>
            <Icon size={18} /> {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
