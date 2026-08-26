import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        return { user: data.user, isDemo: false };
      }
    } catch {
      /* ignore */
    }

    if (typeof window !== "undefined") {
      const isDemo = window.localStorage.getItem("ffe:demo_mode") === "true";
      if (isDemo) {
        return { user: { email: "sarah.jenkins@example.com" }, isDemo: true };
      }
    }

    throw redirect({ to: "/login" });
  },
  component: () => <Outlet />,
});
