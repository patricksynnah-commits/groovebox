import { c as createLucideIcon, j as jsxRuntimeExports, M as Music2, u as usePlayerStore, r as reactExports, ai as Shuffle, L as ListMusic, aj as Repeat1, ak as Repeat } from "./index-CGKCIHSA.js";
import { X, S as ScrollArea } from "./scroll-area-CyQ8eFu-.js";
import { B as Button } from "./button-4FcoecDk.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M11 12H3", key: "51ecnj" }],
  ["path", { d: "M16 6H3", key: "1wxfjs" }],
  ["path", { d: "M16 18H3", key: "12xzn7" }],
  ["path", { d: "m19 10-4 4", key: "1tz659" }],
  ["path", { d: "m15 10 4 4", key: "1n7nei" }]
];
const ListX = createLucideIcon("list-x", __iconNode);
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
function QueueItem({
  item,
  position,
  isNowPlaying,
  onPlay,
  onRemove,
  dataOcid
}) {
  const { track } = item;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": dataOcid,
      className: [
        "flex items-center gap-3 px-4 rounded-lg transition-smooth",
        "min-h-[56px] touch-manipulation",
        isNowPlaying ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary/60 active:bg-secondary"
      ].join(" "),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onPlay,
            "aria-label": isNowPlaying ? `Now playing: ${track.title}` : `Play ${track.title}`,
            className: "flex-shrink-0 w-8 h-8 flex items-center justify-center",
            children: isNowPlaying ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-4 w-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-4 w-4 bg-primary" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono text-muted-foreground w-4 text-center select-none", children: position })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: [
              "flex-shrink-0 w-10 h-10 rounded flex items-center justify-center",
              isNowPlaying ? "bg-primary/20" : "bg-muted"
            ].join(" "),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Music2,
              {
                size: 18,
                className: isNowPlaying ? "text-primary" : "text-muted-foreground"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: onPlay,
            className: "flex-1 min-w-0 text-left py-2",
            "aria-label": `Play ${track.title} by ${track.artist}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: [
                    "text-sm font-medium truncate",
                    isNowPlaying ? "text-primary" : "text-foreground"
                  ].join(" "),
                  children: track.title
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: track.artist })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0 text-xs text-muted-foreground tabular-nums", children: formatDuration(track.duration) }),
        isNowPlaying && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider text-primary px-2 py-0.5 rounded-full border border-primary/40 hidden sm:block", children: "Playing" }),
        !isNowPlaying && onRemove && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: (e) => {
              e.stopPropagation();
              onRemove();
            },
            "aria-label": `Remove ${track.title} from queue`,
            className: "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
          }
        )
      ]
    }
  );
}
function RepeatIcon({ mode }) {
  if (mode === "one") return /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat1, { size: 14, className: "text-primary" });
  if (mode === "all") return /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { size: 14, className: "text-primary" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { size: 14, className: "text-muted-foreground" });
}
function QueuePage() {
  const queue = usePlayerStore((s) => s.queue);
  const currentQueueIndex = usePlayerStore((s) => s.currentQueueIndex);
  const shuffleMode = usePlayerStore((s) => s.shuffleMode);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const clearQueue = usePlayerStore((s) => s.clearQueue);
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);
  const playTrackAt = usePlayerStore((s) => s.playTrackAt);
  const handlePlay = reactExports.useCallback(
    (queueIndex) => {
      playTrackAt(queueIndex);
    },
    [playTrackAt]
  );
  const handleRemove = reactExports.useCallback(
    (queueIndex) => {
      removeFromQueue(queueIndex);
    },
    [removeFromQueue]
  );
  const isEmpty = queue.length === 0;
  const nowPlayingItem = currentQueueIndex >= 0 ? queue[currentQueueIndex] : null;
  const upcomingItems = queue.filter((_, i) => i !== currentQueueIndex);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "queue.page", className: "flex flex-col h-full bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 pt-5 pb-3 bg-card border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground tracking-tight", children: "Queue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: isEmpty ? "No tracks queued" : `${queue.length} track${queue.length !== 1 ? "s" : ""}` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "queue.shuffle_indicator",
            className: [
              "flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border",
              shuffleMode ? "border-primary/40 text-primary bg-primary/10" : "border-border text-muted-foreground bg-transparent"
            ].join(" "),
            "aria-label": `Shuffle is ${shuffleMode ? "on" : "off"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shuffle, { size: 11 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Shuffle" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "queue.repeat_indicator",
            className: [
              "flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border",
              repeatMode !== "none" ? "border-primary/40 text-primary bg-primary/10" : "border-border text-muted-foreground bg-transparent"
            ].join(" "),
            "aria-label": `Repeat mode: ${repeatMode}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RepeatIcon, { mode: repeatMode }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: repeatMode === "none" ? "Off" : repeatMode === "one" ? "One" : "All" })
            ]
          }
        ),
        !isEmpty && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "queue.clear_button",
            variant: "ghost",
            size: "icon",
            onClick: clearQueue,
            "aria-label": "Clear queue",
            className: "w-9 h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListX, { size: 18 })
          }
        )
      ] })
    ] }),
    isEmpty ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "queue.empty_state",
        className: "flex flex-col items-center justify-center flex-1 gap-4 px-6 py-16 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListMusic, { size: 32, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground", children: "Your queue is empty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Play a track or add songs from your library" })
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pb-6", children: [
      nowPlayingItem && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "px-1 mb-2 text-xs font-semibold uppercase tracking-widest text-primary", children: "Now Playing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          QueueItem,
          {
            item: nowPlayingItem,
            position: currentQueueIndex + 1,
            isNowPlaying: true,
            onPlay: () => handlePlay(nowPlayingItem.queueIndex),
            dataOcid: "queue.now_playing.item"
          },
          `now-${nowPlayingItem.queueIndex}`
        )
      ] }),
      upcomingItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "px-1 mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "Up Next" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "queue.list", className: "flex flex-col gap-0.5", children: upcomingItems.map((item, displayIdx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          QueueItem,
          {
            item,
            position: item.queueIndex + 1,
            isNowPlaying: false,
            onPlay: () => handlePlay(item.queueIndex),
            onRemove: () => handleRemove(item.queueIndex),
            dataOcid: `queue.item.${displayIdx + 1}`
          },
          `upcoming-${item.queueIndex}`
        )) })
      ] }),
      !nowPlayingItem && queue.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "px-1 mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "Queue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "queue.list", className: "flex flex-col gap-0.5", children: queue.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          QueueItem,
          {
            item,
            position: item.queueIndex + 1,
            isNowPlaying: false,
            onPlay: () => handlePlay(item.queueIndex),
            onRemove: () => handleRemove(item.queueIndex),
            dataOcid: `queue.item.${idx + 1}`
          },
          `q-${item.queueIndex}`
        )) })
      ] })
    ] }) })
  ] });
}
export {
  QueuePage
};
