import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authed/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [company, setCompany] = useState("Zenith Corp");
  const [email, setEmail] = useState("hr@zenith.com");
  const [notif, setNotif] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your HRMS workspace.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="font-semibold">Organization</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Company name</Label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Contact email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="font-semibold">Preferences</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Email notifications</div>
            <div className="text-xs text-muted-foreground">Send email alerts for new leave requests.</div>
          </div>
          <Switch checked={notif} onCheckedChange={setNotif} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Auto-approve short leaves</div>
            <div className="text-xs text-muted-foreground">Requests under 2 days are auto-approved.</div>
          </div>
          <Switch checked={autoApprove} onCheckedChange={setAutoApprove} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => toast.success("Settings saved")}>Save changes</Button>
      </div>
    </div>
  );
}
