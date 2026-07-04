import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LogIn, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { store, useCurrentUser, useHrmsData, todayString, type AttendanceStatus } from "@/lib/hrms-store";

export const Route = createFileRoute("/_authed/attendance")({
  component: AttendancePage,
});

function AttendancePage() {
  const user = useCurrentUser();
  const attendance = useHrmsData(() => store.attendance());
  const users = useHrmsData(() => store.users());
  const [filterUser, setFilterUser] = useState<string>("all");
  const [month, setMonth] = useState(new Date());

  if (!user) return null;

  const isAdmin = user.role === "admin";
  const scoped = isAdmin
    ? filterUser === "all"
      ? attendance
      : attendance.filter((a) => a.userId === filterUser)
    : attendance.filter((a) => a.userId === user.id);

  const today = todayString();
  const myToday = attendance.find((a) => a.userId === user.id && a.date === today);

  const checkIn = () => {
    const time = new Date().toTimeString().slice(0, 5);
    const existing = store.attendance();
    if (existing.some((a) => a.userId === user.id && a.date === today)) {
      toast.info("Already checked in today");
      return;
    }
    store.setAttendance([
      ...existing,
      { id: store.uid(), userId: user.id, date: today, checkIn: time, status: "Present" },
    ]);
    toast.success(`Checked in at ${time}`);
  };

  const checkOut = () => {
    const time = new Date().toTimeString().slice(0, 5);
    const list = store.attendance();
    const rec = list.find((a) => a.userId === user.id && a.date === today);
    if (!rec) {
      toast.error("You need to check in first");
      return;
    }
    store.setAttendance(list.map((a) => (a.id === rec.id ? { ...a, checkOut: time } : a)));
    toast.success(`Checked out at ${time}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Attendance</h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin ? "Monitor attendance across all employees." : "Manage your check-in and view your history."}
          </p>
        </div>
        {!isAdmin && (
          <div className="flex gap-2">
            <Button onClick={checkIn} disabled={!!myToday?.checkIn}>
              <LogIn className="mr-2 h-4 w-4" /> Check In
            </Button>
            <Button variant="outline" onClick={checkOut} disabled={!myToday || !!myToday?.checkOut}>
              <LogOut className="mr-2 h-4 w-4" /> Check Out
            </Button>
          </div>
        )}
      </div>

      {!isAdmin && (
        <div className="grid gap-4 sm:grid-cols-3">
          <MiniCard label="Today's Check-In" value={myToday?.checkIn ?? "—"} />
          <MiniCard label="Today's Check-Out" value={myToday?.checkOut ?? "—"} />
          <MiniCard label="Status" value={myToday?.status ?? "Not checked in"} />
        </div>
      )}

      {isAdmin && (
        <div className="flex items-center gap-3">
          <Select value={filterUser} onValueChange={setFilterUser}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All employees</SelectItem>
              {users.filter((u) => u.role === "employee").map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.fullName} ({u.employeeId})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <MonthCalendar month={month} setMonth={setMonth} records={scoped} showUser={isAdmin} users={users} />

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="font-semibold mb-3">Attendance history</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                {isAdmin && <th className="py-2 pr-4 font-medium">Employee</th>}
                <th className="py-2 pr-4 font-medium">Date</th>
                <th className="py-2 pr-4 font-medium">Check In</th>
                <th className="py-2 pr-4 font-medium">Check Out</th>
                <th className="py-2 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {scoped.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 15).map((a) => {
                const emp = users.find((u) => u.id === a.userId);
                return (
                  <tr key={a.id} className="border-b border-border/50 last:border-0">
                    {isAdmin && <td className="py-2 pr-4">{emp?.fullName ?? "—"}</td>}
                    <td className="py-2 pr-4">{a.date}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{a.checkIn ?? "—"}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{a.checkOut ?? "—"}</td>
                    <td className="py-2 pr-4"><StatusBadge status={a.status} /></td>
                  </tr>
                );
              })}
              {scoped.length === 0 && (
                <tr><td colSpan={isAdmin ? 5 : 4} className="py-6 text-center text-muted-foreground">No records</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: AttendanceStatus }) {
  const map: Record<AttendanceStatus, string> = {
    Present: "bg-emerald-500/10 text-emerald-600",
    Absent: "bg-destructive/10 text-destructive",
    "Half-Day": "bg-amber-500/10 text-amber-600",
    Leave: "bg-primary/10 text-primary",
  };
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${map[status]}`}>{status}</span>;
}

function MonthCalendar({ month, setMonth, records, showUser, users }: any) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const startDay = first.getDay();
  const monthLabel = month.toLocaleString("en", { month: "long", year: "numeric" });

  const byDate = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const r of records) {
      if (!map.has(r.date)) map.set(r.date, []);
      map.get(r.date)!.push(r);
    }
    return map;
  }, [records]);

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{monthLabel}</h3>
        <div className="flex gap-1">
          <button className="rounded-md p-1.5 hover:bg-muted" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="rounded-md p-1.5 hover:bg-muted" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} className="text-center py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const dstr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const recs = byDate.get(dstr) ?? [];
          const status = recs[0]?.status as AttendanceStatus | undefined;
          const color = status === "Present" ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-700"
            : status === "Absent" ? "bg-destructive/10 border-destructive/40 text-destructive"
            : status === "Half-Day" ? "bg-amber-500/15 border-amber-500/40 text-amber-700"
            : status === "Leave" ? "bg-primary/10 border-primary/40 text-primary"
            : "border-border text-foreground";
          return (
            <div key={i} className={`aspect-square rounded-md border p-1.5 text-xs ${color}`}>
              <div className="font-medium">{d}</div>
              {showUser && recs.length > 0 && <div className="text-[10px] opacity-70">{recs.length} rec</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
