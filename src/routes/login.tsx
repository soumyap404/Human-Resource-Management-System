import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, type Role } from "@/lib/hrms-store";

export const Route = createFileRoute("/login")({
  ssr: false,
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("employee");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const user = signIn(email, password, role);
      setLoading(false);
      if (!user) {
        toast.error("Invalid credentials or role mismatch");
        return;
      }
      toast.success(`Welcome back, ${user.fullName.split(" ")[0]}`);
      navigate({ to: "/dashboard" });
    }, 350);
  };

  const fillDemo = (r: Role) => {
    setRole(r);
    if (r === "admin") {
      setEmail("admin@hrms.com");
      setPassword("admin123");
    } else {
      setEmail("john@hrms.com");
      setPassword("employee123");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="text-lg font-semibold">Zenith HR</div>
        </div>
        <div className="space-y-5">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Everything HR, in one calm workspace.
          </h1>
          <p className="text-sidebar-foreground/70 max-w-md">
            Manage attendance, leave requests, payroll and your entire team — from a single elegant dashboard.
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-md pt-4">
            {["Attendance", "Leaves", "Payroll"].map((k) => (
              <div key={k} className="rounded-lg border border-sidebar-border p-3 text-xs text-sidebar-foreground/80">
                {k}
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-sidebar-foreground/50">© Zenith HR 2026</div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="text-base font-semibold">Zenith HR</div>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Sign in to your account</h2>
          <p className="mt-1 text-sm text-muted-foreground">Access your HRMS workspace.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
              {(["employee", "admin"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-md py-2 text-sm font-medium transition ${role === r ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
                >
                  {r === "employee" ? "Employee" : "Admin / HR"}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground space-y-1">
            <div className="font-medium text-foreground">Demo credentials</div>
            <button type="button" className="underline underline-offset-2 hover:text-primary block" onClick={() => fillDemo("admin")}>
              admin@hrms.com / admin123 (Admin)
            </button>
            <button type="button" className="underline underline-offset-2 hover:text-primary block" onClick={() => fillDemo("employee")}>
              john@hrms.com / employee123 (Employee)
            </button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
