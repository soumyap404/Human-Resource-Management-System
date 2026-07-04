import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { store, useCurrentUser, useHrmsData, type LeaveType, type LeaveStatus } from "@/lib/hrms-store";

export const Route = createFileRoute("/_authed/leave")({
  component: LeavePage,
});

function LeavePage() {
  const user = useCurrentUser();
  const leaves = useHrmsData(() => store.leaves());
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<LeaveType>("Paid Leave");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");

  if (!user) return null;
  const mine = leaves.filter((l) => l.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !reason.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    store.setLeaves([
      ...store.leaves(),
      { id: store.uid(), userId: user.id, type, from, to, reason, status: "Pending", createdAt: new Date().toISOString() },
    ]);
    toast.success("Leave request submitted");
    setOpen(false);
    setFrom(""); setTo(""); setReason(""); setType("Paid Leave");
  };

  const counts = {
    Pending: mine.filter((l) => l.status === "Pending").length,
    Approved: mine.filter((l) => l.status === "Approved").length,
    Rejected: mine.filter((l) => l.status === "Rejected").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leave requests</h1>
          <p className="text-sm text-muted-foreground">Apply for leave and track approvals.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Apply leave</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Apply for leave</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Leave Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as LeaveType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid Leave">Paid Leave</SelectItem>
                    <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                    <SelectItem value="Unpaid Leave">Unpaid Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>From</Label>
                  <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>To</Label>
                  <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Reason</Label>
                <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Briefly explain the reason" />
              </div>
              <DialogFooter>
                <Button type="submit">Submit request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {(["Pending", "Approved", "Rejected"] as LeaveStatus[]).map((s) => (
          <div key={s} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="text-xs text-muted-foreground">{s}</div>
            <div className="mt-1 text-2xl font-semibold">{counts[s]}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="font-semibold mb-3">My requests</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="py-2 pr-4 font-medium">Type</th>
                <th className="py-2 pr-4 font-medium">From</th>
                <th className="py-2 pr-4 font-medium">To</th>
                <th className="py-2 pr-4 font-medium">Reason</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Comment</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((l) => (
                <tr key={l.id} className="border-b border-border/50 last:border-0">
                  <td className="py-2 pr-4">{l.type}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{l.from}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{l.to}</td>
                  <td className="py-2 pr-4 max-w-xs truncate">{l.reason}</td>
                  <td className="py-2 pr-4"><LeaveBadge status={l.status} /></td>
                  <td className="py-2 pr-4 text-muted-foreground">{l.comment ?? "—"}</td>
                </tr>
              ))}
              {mine.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">No leave requests yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function LeaveBadge({ status }: { status: LeaveStatus }) {
  const map: Record<LeaveStatus, string> = {
    Pending: "bg-amber-500/10 text-amber-600",
    Approved: "bg-emerald-500/10 text-emerald-600",
    Rejected: "bg-destructive/10 text-destructive",
  };
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${map[status]}`}>{status}</span>;
}
