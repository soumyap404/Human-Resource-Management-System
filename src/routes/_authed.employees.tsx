import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { store, useHrmsData } from "@/lib/hrms-store";

export const Route = createFileRoute("/_authed/employees")({
  component: EmployeesPage,
});

function EmployeesPage() {
  const users = useHrmsData(() => store.users());
  const [q, setQ] = useState("");
  const employees = users.filter((u) => u.role === "employee");
  const filtered = employees.filter((u) =>
    (u.fullName + u.employeeId + u.email + u.department).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
        <p className="text-sm text-muted-foreground">All active employees in your organization.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search employees…" className="pl-9" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((u) => {
          const initials = u.fullName.split(" ").map((s) => s[0]).slice(0, 2).join("");
          return (
            <div key={u.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 text-primary font-semibold">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{u.fullName}</div>
                  <div className="text-xs text-muted-foreground">{u.jobTitle}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{u.employeeId}</div>
                </div>
              </div>
              <div className="mt-4 space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                  <Mail className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{u.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{u.phone ?? "—"}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{u.department}</span>
                <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs">Since {u.joinDate.slice(0, 4)}</span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No employees found.
          </div>
        )}
      </div>
    </div>
  );
}
