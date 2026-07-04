import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { store, useCurrentUser, useHrmsData, type User } from "@/lib/hrms-store";

export const Route = createFileRoute("/_authed/payroll")({
  component: PayrollPage,
});

function PayrollPage() {
  const user = useCurrentUser();
  const users = useHrmsData(() => store.users());
  if (!user) return null;
  if (user.role === "admin") return <AdminPayroll users={users} />;
  return <EmployeePayroll user={user} />;
}

function EmployeePayroll({ user }: { user: User }) {
  const net = user.basicSalary + user.allowances - user.deductions;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payroll</h1>
        <p className="text-sm text-muted-foreground">Your current compensation breakdown.</p>
      </div>

      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Net monthly salary</div>
            <div className="mt-1 text-4xl font-semibold tracking-tight">${net.toLocaleString()}</div>
            <div className="mt-1 text-sm text-muted-foreground">Effective from {user.joinDate}</div>
          </div>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Payslip</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <PayCard label="Basic Salary" value={user.basicSalary} />
        <PayCard label="Allowances" value={user.allowances} tone="success" />
        <PayCard label="Deductions" value={user.deductions} tone="destructive" />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="font-semibold mb-3">Breakdown</h3>
        <table className="w-full text-sm">
          <tbody>
            <Row label="Basic Salary" value={`$${user.basicSalary.toLocaleString()}`} />
            <Row label="Housing Allowance" value={`$${Math.round(user.allowances * 0.6).toLocaleString()}`} />
            <Row label="Transport Allowance" value={`$${Math.round(user.allowances * 0.4).toLocaleString()}`} />
            <Row label="Tax" value={`-$${Math.round(user.deductions * 0.7).toLocaleString()}`} />
            <Row label="Insurance" value={`-$${Math.round(user.deductions * 0.3).toLocaleString()}`} />
            <tr className="border-t-2 border-border">
              <td className="py-3 font-semibold">Net Salary</td>
              <td className="py-3 text-right font-semibold">${net.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-border/50">
      <td className="py-2 text-muted-foreground">{label}</td>
      <td className="py-2 text-right font-medium">{value}</td>
    </tr>
  );
}

function PayCard({ label, value, tone = "primary" }: { label: string; value: number; tone?: "primary" | "success" | "destructive" }) {
  const tones = { primary: "text-primary", success: "text-emerald-600", destructive: "text-destructive" };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${tones[tone]}`}>${value.toLocaleString()}</div>
    </div>
  );
}

function AdminPayroll({ users }: { users: User[] }) {
  const [editing, setEditing] = useState<User | null>(null);
  const [basic, setBasic] = useState(0);
  const [allow, setAllow] = useState(0);
  const [ded, setDed] = useState(0);

  const openEdit = (u: User) => {
    setEditing(u); setBasic(u.basicSalary); setAllow(u.allowances); setDed(u.deductions);
  };
  const save = () => {
    if (!editing) return;
    store.setUsers(store.users().map((u) => u.id === editing.id ? { ...u, basicSalary: basic, allowances: allow, deductions: ded } : u));
    toast.success("Salary updated");
    setEditing(null);
  };

  const employees = users.filter((u) => u.role === "employee");
  const total = employees.reduce((s, e) => s + (e.basicSalary + e.allowances - e.deductions), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payroll</h1>
        <p className="text-sm text-muted-foreground">Manage salaries across the company.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <PayCard label="Total Payroll" value={total} />
        <PayCard label="Employees" value={employees.length} tone="success" />
        <PayCard label="Avg. Net Salary" value={employees.length ? Math.round(total / employees.length) : 0} />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="font-semibold mb-3">Employee salaries</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="py-2 pr-4 font-medium">Employee</th>
                <th className="py-2 pr-4 font-medium">Basic</th>
                <th className="py-2 pr-4 font-medium">Allowances</th>
                <th className="py-2 pr-4 font-medium">Deductions</th>
                <th className="py-2 pr-4 font-medium">Net</th>
                <th className="py-2 pr-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((u) => (
                <tr key={u.id} className="border-b border-border/50 last:border-0">
                  <td className="py-2 pr-4">
                    <div className="font-medium">{u.fullName}</div>
                    <div className="text-xs text-muted-foreground">{u.employeeId} · {u.department}</div>
                  </td>
                  <td className="py-2 pr-4">${u.basicSalary.toLocaleString()}</td>
                  <td className="py-2 pr-4 text-emerald-600">+${u.allowances.toLocaleString()}</td>
                  <td className="py-2 pr-4 text-destructive">-${u.deductions.toLocaleString()}</td>
                  <td className="py-2 pr-4 font-semibold">${(u.basicSalary + u.allowances - u.deductions).toLocaleString()}</td>
                  <td className="py-2 pr-4">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Update salary — {editing?.fullName}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Basic Salary</Label>
              <Input type="number" value={basic} onChange={(e) => setBasic(Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label>Allowances</Label>
              <Input type="number" value={allow} onChange={(e) => setAllow(Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label>Deductions</Label>
              <Input type="number" value={ded} onChange={(e) => setDed(Number(e.target.value))} />
            </div>
            <div className="rounded-lg bg-muted p-3 text-sm">
              Net: <span className="font-semibold">${(basic + allow - ded).toLocaleString()}</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
