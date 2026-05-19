import { cn } from "@/lib/utils";
import { usePlayerStore } from "@/store/playerStore";
import { Link } from "@tanstack/react-router";
import { ListMusic, ListOrdered, Music2 } from "lucide-react";

const navItems = [
  { to: "/", icon: Music2, label: "Library" },
  { to: "/playlists", icon: ListMusic, label: "Playlists" },
  { to: "/queue", icon: ListOrdered, label: "Queue" },
];

export function SideNav() {
  const queue = usePlayerStore((s) => s.queue);
  const currentQueueIndex = usePlayerStore((s) => s.currentQueueIndex);
  const currentTrack = queue[currentQueueIndex]?.track ?? null;

  return (
    <aside
      data-ocid="side-nav"
      className="hidden md:flex flex-col w-56 min-h-0 shrink-0 bg-card border-r border-border"
      aria-label="Sidebar navigation"
    >
      {/* Branding */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <Music2 size={16} className="text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-base tracking-tight text-foreground">
          Beatwave
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            data-ocid={`side-nav.${label.toLowerCase()}-link`}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
              "text-muted-foreground hover:bg-secondary hover:text-foreground",
              "[&.active]:bg-secondary [&.active]:text-foreground [&.active]:border-l-2 [&.active]:border-primary [&.active]:pl-[10px]",
            )}
            activeProps={{
              className: cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 text-muted-foreground hover:bg-secondary hover:text-foreground [&.active]:bg-secondary [&.active]:text-foreground [&.active]:border-l-2 [&.active]:border-primary [&.active]:pl-[10px]",
                "active",
              ),
            }}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Current track footer */}
      {currentTrack && (
        <div className="px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground truncate">Now Playing</p>
          <p className="text-sm font-medium text-foreground truncate">
            {currentTrack.title}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {currentTrack.artist}
          </p>
        </div>
      )}
    </aside>
  );
}
