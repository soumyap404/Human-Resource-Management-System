import { createFileRoute } from "@tanstack/react-router";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import { store, useHrmsData } from "@/lib/hrms-store";

export const Route = createFileRoute("/_authed/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const users = useHrmsData(() => store.users());
  const attendance = useHrmsData(() => store.attendance());
  const leaves = useHrmsData(() => store.leaves());

  const attTrend = [...Array(14)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dstr = d.toISOString().slice(0, 10);
    return {
      date: dstr.slice(5),
      present: attendance.filter((a) => a.date === dstr && a.status === "Present").length,
    };
  });

  const leaveMix = ["Paid Leave", "Sick Leave", "Unpaid Leave"].map((t) => ({
    type: t.replace(" Leave", ""),
    count: leaves.filter((l) => l.type === t).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">High-level insights across your workforce.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-4">Attendance trend (last 14 days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="present" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-4">Leave requests by type</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaveMix}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Kpi label="Employees" value={users.filter((u) => u.role === "employee").length} />
        <Kpi label="Attendance records" value={attendance.length} />
        <Kpi label="Leaves this year" value={leaves.length} />
        <Kpi label="Approvals pending" value={leaves.filter((l) => l.status === "Pending").length} />
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
