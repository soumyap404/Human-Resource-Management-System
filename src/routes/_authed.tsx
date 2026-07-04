import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AppSidebar } from "@/components/hrms/AppSidebar";
import { useCurrentUser, store } from "@/lib/hrms-store";

export const Route = createFileRoute("/_authed")({
  ssr: false,
  component: AuthedLayout,
});

function AuthedLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const user = useCurrentUser();

  useEffect(() => {
    store.seed();
    if (!store.session()) {
      navigate({ to: "/login" });
    } else {
      setReady(true);
    }
  }, [navigate]);

  if (!ready || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* desktop sidebar */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      {/* mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 z-50">
            <AppSidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/80 backdrop-blur px-4 lg:px-6">
          <button
            className="lg:hidden rounded-md p-2 hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-medium">Welcome back, {user.fullName.split(" ")[0]}</div>
            <div className="truncate text-xs text-muted-foreground">
              {user.jobTitle} · {user.department}
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {user.role === "admin" ? "HR Admin" : "Employee"}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
