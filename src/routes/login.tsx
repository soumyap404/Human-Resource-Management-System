import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AlignCenter, AlignJustify, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, type Role } from "@/lib/hrms-store";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "spline-viewer": SplineViewerProps;
    }
  }
}

interface SplineViewerProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  url?: string;
  loading?: "lazy" | "eager";
}

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

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer@1.12.98/build/spline-viewer.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

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
    <div className="min-h-screen grid lg:grid-cols-2 bg-black">
      <div className="absolute inset-0 lg:relative lg:inset-auto flex flex-col justify-between p-8 lg:p-12 bg-black text-white overflow-hidden">
        {/* Spline 3D Viewer Background */}
        <div className="absolute inset-0 z-0">
         <spline-viewer
  url="https://prod.spline.design/LVWiO6yI0pyTBqEB/scene.splinecode"
  style={
    {
      width: "100%",
      marginLeft: "50px",
      height: "100%",
      display: "block",
    } as React.CSSProperties
  }
/>
        </div>

        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/50 via-black/30 to-black/20 pointer-events-none" />

        {/* Content overlay */}
        <div className="relative z-20">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-500 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="text-lg font-semibold text-white">WORK SPHERE</div>
          </div>
        </div>

        <div className="relative z-20 space-y-5">
          <h1  className="text-4xl font-semibold leading-tight tracking-tight text-white">
          Work spere workspace
          </h1>
          <p className="text-gray-200 max-w-md">
            Manage attendance, leave requests, payroll and your entire team — from a single elegant dashboard.
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-md pt-4">
            {/* {["Attendance", "Leaves", "Payroll"].map((k) => (
              <div key={k} className="rounded-lg border border-gray-700 bg-gray-900/60 backdrop-blur-md p-3 text-xs text-gray-300">
                {k}
              </div>
            ))} */}
          </div>
        </div>

        <div className="relative z-20 text-xs text-gray-400">© WORK SPHERE 2026</div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="text-base font-semibold">WORK SPHERE</div>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Sign in to your account</h2>
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
              <Label htmlFor="email" style={{ color : "white"}}>Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="bg-black/40 border-gray-700 text-white placeholder-gray-400" />
            </div>
            <div className="space-y-2">
             <Label htmlFor="password" style={{ color: "white" }}>  Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-black/40 border-gray-700 text-white placeholder-gray-400" />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground space-y-1">
            <div className="font-medium text-foreground" style={{color : "white"}}>Demo credentials</div>
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
