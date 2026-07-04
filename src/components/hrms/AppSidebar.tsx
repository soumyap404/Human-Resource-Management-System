import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  User,
  CalendarCheck,
  FileText,
  Wallet,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useCurrentUser } from "@/lib/hrms-store";

type Item = { to: string; label: string; icon: React.ElementType };

const employeeNav: Item[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/leave", label: "Leave Requests", icon: FileText },
  { to: "/payroll", label: "Payroll", icon: Wallet },
];

const adminNav: Item[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/leave-management", label: "Leave Management", icon: ClipboardList },
  { to: "/payroll", label: "Payroll", icon: Wallet },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const items = user?.role === "admin" ? adminNav : employeeNav;

  const handleLogout = () => {
    signOut();
    navigate({ to: "/login" });
  };

  return (
    <aside className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold">Zenith HR</div>
          <div className="text-xs text-sidebar-foreground/60">
            {user?.role === "admin" ? "Admin Portal" : "Employee Portal"}
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        {user && (
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 mb-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-xs font-semibold">
              {user.fullName.split(" ").map((s) => s[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{user.fullName}</div>
              <div className="truncate text-xs text-sidebar-foreground/60">{user.employeeId}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
