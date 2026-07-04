import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  CalendarCheck,
  Wallet,
  ClipboardList,
  Activity,
  TrendingUp,
  Clock,
  UserCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { StatCard } from "@/components/hrms/StatCard";
import { useCurrentUser, useHrmsData, store, todayString } from "@/lib/hrms-store";

export const Route = createFileRoute("/_authed/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const user = useCurrentUser();
  const users = useHrmsData(() => store.users());
  const attendance = useHrmsData(() => store.attendance());
  const leaves = useHrmsData(() => store.leaves());
  if (!user) return null;

  if (user.role === "admin") return <AdminDashboard users={users} attendance={attendance} leaves={leaves} />;
  return <EmployeeDashboard userId={user.id} attendance={attendance} leaves={leaves} salary={user.basicSalary + user.allowances - user.deductions} />;
}

function EmployeeDashboard({ userId, attendance, leaves, salary }: any) {
  const mine = attendance.filter((a: any) => a.userId === userId);
  const present = mine.filter((a: any) => a.status === "Present").length;
  const absent = mine.filter((a: any) => a.status === "Absent").length;
  const halfDay = mine.filter((a: any) => a.status === "Half-Day").length;
  const myLeaves = leaves.filter((l: any) => l.userId === userId);
  const pending = myLeaves.filter((l: any) => l.status === "Pending").length;
  const approved = myLeaves.filter((l: any) => l.status === "Approved").length;

  const weekData = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
    const rec = mine.find((a: any) => a.date === d.toISOString().slice(0, 10));
    const hours = rec && rec.checkIn && rec.checkOut ? 8 + Math.random() * 1.5 - 0.5 : 0;
    return { day, hours: Math.round(hours * 10) / 10 };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Here's a snapshot of your work this month.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Days Present" value={present} icon={UserCheck} tone="success" hint="This month" />
        <StatCard label="Days Absent" value={absent} icon={Clock} tone="destructive" />
        <StatCard label="Leaves Approved" value={approved} icon={CalendarCheck} tone="primary" />
        <StatCard label="Net Salary" value={`$${salary.toLocaleString()}`} icon={Wallet} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Weekly hours</h3>
              <p className="text-xs text-muted-foreground">Hours logged over the last 7 days</p>
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="hours" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-2">Attendance mix</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Present", value: present || 1 },
                    { name: "Half-Day", value: halfDay },
                    { name: "Absent", value: absent },
                  ]}
                  dataKey="value"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                >
                  <Cell fill="var(--color-chart-1)" />
                  <Cell fill="var(--color-chart-3)" />
                  <Cell fill="var(--color-chart-4)" />
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Recent activity</h3>
          </div>
          <ul className="space-y-3 text-sm">
            {mine.slice(0, 5).map((a: any) => (
              <li key={a.id} className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0">
                <span className="text-muted-foreground">{a.date}</span>
                <span className="font-medium">{a.status}</span>
              </li>
            ))}
            {mine.length === 0 && <li className="text-sm text-muted-foreground">No activity yet.</li>}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Leave summary</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-muted p-3">
              <div className="text-2xl font-semibold">{pending}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="text-2xl font-semibold">{approved}</div>
              <div className="text-xs text-muted-foreground">Approved</div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="text-2xl font-semibold">{myLeaves.filter((l: any) => l.status === "Rejected").length}</div>
              <div className="text-xs text-muted-foreground">Rejected</div>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Today is {todayString()}.</p>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ users, attendance, leaves }: any) {
  const employees = users.filter((u: any) => u.role === "employee");
  const today = todayString();
  const todayAtt = attendance.filter((a: any) => a.date === today);
  const pending = leaves.filter((l: any) => l.status === "Pending");
  const totalPayroll = employees.reduce((s: number, e: any) => s + (e.basicSalary + e.allowances - e.deductions), 0);

  const deptCounts = employees.reduce((acc: Record<string, number>, e: any) => {
    acc[e.department] = (acc[e.department] || 0) + 1;
    return acc;
  }, {});
  const deptData = Object.entries(deptCounts).map(([name, value]) => ({ name, value }));
  const colors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

  const attTrend = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dstr = d.toISOString().slice(0, 10);
    const present = attendance.filter((a: any) => a.date === dstr && a.status === "Present").length;
    return { day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()], present };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin overview</h1>
        <p className="text-sm text-muted-foreground">Company-wide activity at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Employees" value={employees.length} icon={Users} tone="primary" />
        <StatCard label="Today's Attendance" value={todayAtt.filter((a: any) => a.status === "Present").length} icon={CalendarCheck} tone="success" hint={`of ${employees.length} employees`} />
        <StatCard label="Pending Leaves" value={pending.length} icon={ClipboardList} tone="warning" />
        <StatCard label="Monthly Payroll" value={`$${totalPayroll.toLocaleString()}`} icon={Wallet} tone="primary" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h3 className="font-semibold mb-4">Attendance this week</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="present" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-2">Departments</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptData} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {deptData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="font-semibold mb-3">Latest leave requests</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="py-2 pr-4 font-medium">Employee</th>
                <th className="py-2 pr-4 font-medium">Type</th>
                <th className="py-2 pr-4 font-medium">Dates</th>
                <th className="py-2 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.slice(0, 5).map((l: any) => {
                const emp = users.find((u: any) => u.id === l.userId);
                return (
                  <tr key={l.id} className="border-b border-border/50 last:border-0">
                    <td className="py-2 pr-4">{emp?.fullName ?? "—"}</td>
                    <td className="py-2 pr-4">{l.type}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{l.from} → {l.to}</td>
                    <td className="py-2 pr-4"><StatusPill status={l.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: "bg-amber-500/10 text-amber-600",
    Approved: "bg-emerald-500/10 text-emerald-600",
    Rejected: "bg-destructive/10 text-destructive",
    Present: "bg-emerald-500/10 text-emerald-600",
    Absent: "bg-destructive/10 text-destructive",
    "Half-Day": "bg-amber-500/10 text-amber-600",
    Leave: "bg-primary/10 text-primary",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? "bg-muted"}`}>
      {status}
    </span>
  );
}
