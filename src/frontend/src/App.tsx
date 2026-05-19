import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const LibraryPage = lazy(() =>
  import("@/pages/LibraryPage").then((m) => ({ default: m.LibraryPage })),
);
const PlaylistsPage = lazy(() =>
  import("@/pages/PlaylistsPage").then((m) => ({ default: m.PlaylistsPage })),
);
const QueuePage = lazy(() =>
  import("@/pages/QueuePage").then((m) => ({ default: m.QueuePage })),
);

// ─── Route tree ────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <Suspense
      fallback={
        <div className="flex flex-col gap-3 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            <Skeleton key={i} className="h-14 w-full rounded-xl bg-muted" />
          ))}
        </div>
      }
    >
      <Layout />
    </Suspense>
  ),
});

const libraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LibraryPage,
});

const playlistsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/playlists",
  component: PlaylistsPage,
});

const queueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/queue",
  component: QueuePage,
});

const routeTree = rootRoute.addChildren([
  libraryRoute,
  playlistsRoute,
  queueRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
