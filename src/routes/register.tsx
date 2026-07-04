import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp, type Role } from "@/lib/hrms-store";

export const Route = createFileRoute("/register")({
  ssr: false,
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    employeeId: "",
    fullName: "",
    email: "",
    password: "",
    confirm: "",
    role: "employee" as Role,
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    const res = signUp({
      employeeId: form.employeeId,
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      role: form.role,
    });
    if ("error" in res) {
      toast.error(res.error);
      return;
    }
    toast.success("Account created");
    navigate({ to: "/dashboard" });
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
        <div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">Join your team's workspace.</h1>
          <p className="mt-4 text-sidebar-foreground/70 max-w-md">Register with your employee ID and start managing your work day.</p>
        </div>
        <div className="text-xs text-sidebar-foreground/50">© Zenith HR 2026</div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold tracking-tight">Create your account</h2>
          <p className="mt-1 text-sm text-muted-foreground">It takes less than a minute.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="empId">Employee ID</Label>
                <Input id="empId" required value={form.employeeId} onChange={(e) => update("employeeId", e.target.value)} placeholder="EMP123" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="grid grid-cols-2 gap-1 rounded-md bg-muted p-1">
                  {(["employee", "admin"] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => update("role", r)}
                      className={`rounded py-1.5 text-xs font-medium ${form.role === r ? "bg-card shadow-sm" : "text-muted-foreground"}`}
                    >
                      {r === "employee" ? "Employee" : "HR"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="pass">Password</Label>
                <Input id="pass" type="password" required value={form.password} onChange={(e) => update("password", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conf">Confirm</Label>
                <Input id="conf" type="password" required value={form.confirm} onChange={(e) => update("confirm", e.target.value)} />
              </div>
            </div>
            <Button type="submit" className="w-full">Create account</Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
