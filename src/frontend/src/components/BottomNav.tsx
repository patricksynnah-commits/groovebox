import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ListMusic, ListOrdered, Music2 } from "lucide-react";

const navItems = [
  { to: "/", icon: Music2, label: "Library" },
  { to: "/playlists", icon: ListMusic, label: "Playlists" },
  { to: "/queue", icon: ListOrdered, label: "Queue" },
];

export function BottomNav() {
  return (
    <nav
      data-ocid="bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-card/95 backdrop-blur-md md:hidden"
      aria-label="Main navigation"
    >
      {navItems.map(({ to, icon: Icon, label }) => (
        <Link
          key={to}
          to={to}
          data-ocid={`bottom-nav.${label.toLowerCase()}-link`}
          className={cn(
            "flex flex-col items-center gap-0.5 px-4 py-2 text-xs font-medium transition-colors duration-200",
            "text-muted-foreground hover:text-foreground",
            "[&.active]:text-primary",
          )}
          activeProps={{
            className: cn(
              "flex flex-col items-center gap-0.5 px-4 py-2 text-xs font-medium transition-colors duration-200 text-muted-foreground hover:text-foreground [&.active]:text-primary",
              "active",
            ),
          }}
        >
          <Icon size={22} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
