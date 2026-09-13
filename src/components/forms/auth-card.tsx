import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthCard({ title, mode }: { title: string; mode: "login" | "signup" | "invite" | "forgot" | "reset" }) {
  const showSchool = mode === "signup";
  return (
    <main className="grid min-h-screen place-items-center bg-brand-soft px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <p className="text-sm text-slate-600">Ewune by PulchriLabs</p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            {showSchool && (
              <>
                <div className="grid gap-2"><Label>School name</Label><Input placeholder="Greenfield Crest School" /></div>
                <div className="grid gap-2"><Label>Preferred subdomain</Label><Input placeholder="greenfield" /></div>
                <div className="grid gap-2"><Label>Current academic session</Label><Input placeholder="2026/2027" /></div>
              </>
            )}
            {mode !== "reset" && <div className="grid gap-2"><Label>Email</Label><Input type="email" placeholder="admin@school.com" /></div>}
            {mode !== "forgot" && <div className="grid gap-2"><Label>Password</Label><Input type="password" placeholder="••••••••" /></div>}
            <Button type="button">{mode === "login" ? "Login" : mode === "forgot" ? "Send reset link" : "Continue"}</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
