import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { store, useHrmsData, type LeaveStatus } from "@/lib/hrms-store";
import { LeaveBadge } from "./_authed.leave";

export const Route = createFileRoute("/_authed/leave-management")({
  component: LeaveMgmt,
});

function LeaveMgmt() {
  const leaves = useHrmsData(() => store.leaves());
  const users = useHrmsData(() => store.users());
  const [tab, setTab] = useState<LeaveStatus | "All">("Pending");
  const [comments, setComments] = useState<Record<string, string>>({});

  const filtered = tab === "All" ? leaves : leaves.filter((l) => l.status === tab);

  const decide = (id: string, status: LeaveStatus) => {
    const comment = comments[id];
    store.setLeaves(store.leaves().map((l) => l.id === id ? { ...l, status, comment } : l));
    toast.success(`Leave ${status.toLowerCase()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Leave management</h1>
        <p className="text-sm text-muted-foreground">Review and act on employee leave requests.</p>
      </div>

      <div className="flex gap-2 rounded-lg bg-muted p-1 w-fit">
        {(["Pending", "Approved", "Rejected", "All"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${tab === t ? "bg-card shadow-sm" : "text-muted-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((l) => {
          const emp = users.find((u) => u.id === l.userId);
          return (
            <div key={l.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-start sm:flex sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold truncate">{emp?.fullName ?? "—"}</span>
                    <span className="text-xs text-muted-foreground">{emp?.employeeId}</span>
                    <LeaveBadge status={l.status} />
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {l.type} · {l.from} → {l.to}
                  </div>
                  <p className="mt-2 text-sm">{l.reason}</p>
                  {l.comment && (
                    <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                      <MessageSquare className="h-3.5 w-3.5 mt-0.5" /> {l.comment}
                    </div>
                  )}
                </div>
              </div>
              {l.status === "Pending" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Input
                    className="flex-1 min-w-[200px]"
                    placeholder="Add a comment (optional)"
                    value={comments[l.id] ?? ""}
                    onChange={(e) => setComments((c) => ({ ...c, [l.id]: e.target.value }))}
                  />
                  <Button onClick={() => decide(l.id, "Approved")}>
                    <Check className="mr-1.5 h-4 w-4" /> Approve
                  </Button>
                  <Button variant="outline" onClick={() => decide(l.id, "Rejected")}>
                    <X className="mr-1.5 h-4 w-4" /> Reject
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No requests in this view.
          </div>
        )}
      </div>
    </div>
  );
}
