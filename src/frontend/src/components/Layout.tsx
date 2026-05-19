import { usePlayerStore } from "@/store/playerStore";
import { Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { BottomNav } from "./BottomNav";
import { PlayerBar } from "./PlayerBar";
import { SideNav } from "./SideNav";

export function Layout() {
  const hydrate = usePlayerStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground font-body">
      {/* Desktop sidebar */}
      <SideNav />

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Scrollable page content */}
        <main
          data-ocid="main-content"
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="pb-20 md:pb-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <PlayerBar />
      <BottomNav />

      {/* Caffeine attribution */}
      <footer className="hidden md:flex fixed bottom-0 left-56 right-0 h-6 items-center justify-center z-30 pointer-events-none">
        <p className="text-[10px] text-muted-foreground/40 select-none">
          Powered by{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 pointer-events-auto hover:text-muted-foreground/70 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        theme="dark"
        toastOptions={{
          classNames: {
            toast: "bg-card border-border text-foreground",
            description: "text-muted-foreground",
          },
        }}
      />
    </div>
  );
}
