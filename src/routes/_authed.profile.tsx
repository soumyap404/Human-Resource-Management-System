import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Briefcase, Calendar, FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { store, useCurrentUser } from "@/lib/hrms-store";

export const Route = createFileRoute("/_authed/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const user = useCurrentUser();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (user) {
      setPhone(user.phone ?? "");
      setAddress(user.address ?? "");
      setAvatar(user.avatar);
    }
  }, [user]);

  if (!user) return null;

  const save = () => {
    const users = store.users().map((u) => u.id === user.id ? { ...u, phone, address, avatar } : u);
    store.setUsers(users);
    toast.success("Profile updated");
  };

  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const initials = user.fullName.split(" ").map((s) => s[0]).slice(0, 2).join("");
  const net = user.basicSalary + user.allowances - user.deductions;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My profile</h1>
        <p className="text-sm text-muted-foreground">Keep your personal information up to date.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm text-center">
          <div className="relative mx-auto h-28 w-28">
            {avatar ? (
              <img src={avatar} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center rounded-full bg-primary/10 text-primary text-3xl font-semibold">
                {initials}
              </div>
            )}
            <label className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground cursor-pointer shadow-sm hover:opacity-90">
              <Upload className="h-4 w-4" />
              <input type="file" accept="image/*" className="hidden" onChange={upload} />
            </label>
          </div>
          <h2 className="mt-4 font-semibold">{user.fullName}</h2>
          <p className="text-sm text-muted-foreground">{user.jobTitle}</p>
          <p className="mt-1 text-xs text-muted-foreground">{user.employeeId}</p>

          <div className="mt-5 space-y-2 text-left text-sm">
            <Row icon={Mail} label={user.email} />
            <Row icon={Phone} label={phone || "—"} />
            <Row icon={MapPin} label={address || "—"} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Section title="Personal Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <ReadField label="Full Name" value={user.fullName} />
              <ReadField label="Email" value={user.email} />
              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 0000" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Address</Label>
                <Textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={save}>Save changes</Button>
            </div>
          </Section>

          <Section title="Job Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <ReadField icon={Briefcase} label="Job Title" value={user.jobTitle} />
              <ReadField label="Department" value={user.department} />
              <ReadField icon={Calendar} label="Join Date" value={user.joinDate} />
              <ReadField label="Employment" value={user.role === "admin" ? "HR / Admin" : "Full-time"} />
            </div>
          </Section>

          <Section title="Salary Information">
            <div className="grid gap-4 sm:grid-cols-4">
              <ReadField label="Basic" value={`$${user.basicSalary}`} />
              <ReadField label="Allowances" value={`$${user.allowances}`} />
              <ReadField label="Deductions" value={`-$${user.deductions}`} />
              <ReadField label="Net" value={`$${net}`} />
            </div>
          </Section>

          <Section title="Documents">
            <ul className="divide-y divide-border rounded-lg border border-border">
              {["Offer Letter.pdf", "ID Proof.pdf", "Tax Form.pdf"].map((f) => (
                <li key={f} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 truncate">{f}</span>
                  <span className="text-xs text-muted-foreground">Uploaded</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Row({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}

function ReadField({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <div className="text-xs text-muted-foreground flex items-center gap-1">
        {Icon && <Icon className="h-3 w-3" />} {label}
      </div>
      <div className="text-sm font-medium mt-0.5">{value}</div>
    </div>
  );
}
