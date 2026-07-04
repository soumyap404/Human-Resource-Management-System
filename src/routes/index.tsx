import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { store } from "@/lib/hrms-store";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    store.seed();
    navigate({ to: store.session() ? "/dashboard" : "/login" });
  }, [navigate]);
  return (
    <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
      Loading…
    </div>
  );
}
