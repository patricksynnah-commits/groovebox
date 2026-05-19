import { c as createLucideIcon, j as jsxRuntimeExports, M as Music2, P as Play, r as reactExports, u as usePlayerStore, L as ListMusic, a as Music } from "./index-CGKCIHSA.js";
import { T as Trash2 } from "./trash-2-CL9SGCYd.js";
import { B as Button } from "./button-4FcoecDk.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
function formatTime(seconds) {
  if (!seconds || seconds <= 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
function TrackRow({
  track,
  index,
  isActive,
  onPlay,
  onDelete
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      className: `flex items-center gap-3 px-4 py-3 rounded-xl min-h-[64px] w-full transition-smooth cursor-pointer group text-left ${isActive ? "bg-primary/10 border border-primary/30" : "bg-card hover:bg-secondary"}`,
      "data-ocid": `library.item.${index}`,
      onClick: () => onPlay(track),
      "aria-label": `Play ${track.title} by ${track.artist}`,
      "aria-pressed": isActive,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-muted", children: [
          isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(Music2, { className: "w-4 h-4 text-primary animate-pulse" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground group-hover:hidden block", children: index }),
          !isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Play,
            {
              className: "w-4 h-4 text-primary hidden group-hover:block fill-primary",
              "aria-hidden": true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `text-sm font-semibold truncate leading-tight ${isActive ? "text-primary" : "text-foreground"}`,
              children: track.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: track.artist })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0 text-xs text-muted-foreground font-mono tabular-nums", children: formatTime(track.duration) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "flex-shrink-0 w-9 h-9 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-primary hover:bg-primary/20 transition-smooth",
            "data-ocid": `library.play_button.${index}`,
            onClick: (e) => {
              e.stopPropagation();
              onPlay(track);
            },
            "aria-label": `Play ${track.title}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4 fill-primary" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "flex-shrink-0 w-9 h-9 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth",
            "data-ocid": `library.delete_button.${index}`,
            onClick: (e) => {
              e.stopPropagation();
              onDelete(track.id);
            },
            "aria-label": `Delete ${track.title}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
          }
        )
      ]
    }
  );
}
function formatDuration(seconds) {
  return Math.round(seconds);
}
function parseAudioDuration(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      const dur = Number.isFinite(audio.duration) ? audio.duration : 0;
      URL.revokeObjectURL(url);
      resolve(dur);
    });
    audio.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      resolve(0);
    });
  });
}
function guessArtistTitle(filename) {
  const base = filename.replace(/\.[^.]+$/, "");
  const parts = base.split(" - ");
  if (parts.length >= 2) {
    return {
      artist: parts[0].trim(),
      title: parts.slice(1).join(" - ").trim()
    };
  }
  return { title: base.trim(), artist: "Unknown Artist" };
}
function UploadButton({ onUploadComplete }) {
  const inputRef = reactExports.useRef(null);
  const [progress, setProgress] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const addTrack = usePlayerStore((s) => s.addTrack);
  const tracks = usePlayerStore((s) => s.tracks);
  async function handleFiles(files) {
    if (!files || files.length === 0) return;
    setError(null);
    const fileArray = Array.from(files);
    let completed = 0;
    for (const file of fileArray) {
      setProgress(Math.round(completed / fileArray.length * 100));
      try {
        const duration = await parseAudioDuration(file);
        const blobUrl = URL.createObjectURL(file);
        const { title, artist } = guessArtistTitle(file.name);
        const newId = Date.now() + Math.random();
        const track = {
          id: newId,
          title,
          artist,
          duration: formatDuration(duration),
          blobUrl,
          addedAt: Date.now()
        };
        const isDuplicate = tracks.some(
          (t) => t.title === title && t.artist === artist
        );
        if (!isDuplicate) {
          addTrack(track);
        }
      } catch {
        setError(`Failed to process ${file.name}`);
      }
      completed++;
    }
    setProgress(null);
    onUploadComplete == null ? void 0 : onUploadComplete();
    if (inputRef.current) inputRef.current.value = "";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: inputRef,
        type: "file",
        accept: ".mp3,.wav,.ogg,.m4a,audio/mpeg,audio/wav,audio/ogg,audio/mp4",
        multiple: true,
        className: "hidden",
        "data-ocid": "upload.input",
        onChange: (e) => handleFiles(e.target.files)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        variant: "default",
        className: "w-full min-h-[44px] gap-2 bg-primary text-primary-foreground font-semibold rounded-full text-sm tracking-wide hover:bg-primary/90 active:scale-95 transition-smooth",
        "data-ocid": "upload.upload_button",
        onClick: () => {
          var _a;
          return (_a = inputRef.current) == null ? void 0 : _a.click();
        },
        disabled: progress !== null,
        children: [
          progress !== null ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
          progress !== null ? `Uploading… ${progress}%` : "Upload Music"
        ]
      }
    ),
    progress !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-1 w-full bg-muted rounded-full overflow-hidden",
        "data-ocid": "upload.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-primary transition-all duration-300",
            style: { width: `${progress}%` }
          }
        )
      }
    ),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", "data-ocid": "upload.error_state", children: error })
  ] });
}
function NowPlayingBanner() {
  var _a;
  const queue = usePlayerStore((s) => s.queue);
  const currentQueueIndex = usePlayerStore((s) => s.currentQueueIndex);
  const isPlaying = usePlayerStore((s) => s.playback.isPlaying);
  const currentTrack = ((_a = queue[currentQueueIndex]) == null ? void 0 : _a.track) ?? null;
  if (!currentTrack) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl mx-4 mt-4",
      "data-ocid": "library.now_playing_banner",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "w-4 h-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-primary mb-0.5", children: isPlaying ? "Now Playing" : "Paused" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground truncate", children: currentTrack.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: currentTrack.artist })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 flex gap-1 items-end h-5", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `block w-0.5 rounded-full bg-primary transition-all ${isPlaying ? "animate-bounce" : "opacity-40"}`,
            style: {
              height: isPlaying ? `${12 + i * 4}px` : "8px",
              animationDelay: `${i * 0.15}s`
            }
          },
          i
        )) })
      ]
    }
  );
}
function LibraryPage() {
  var _a, _b;
  const tracks = usePlayerStore((s) => s.tracks);
  const queue = usePlayerStore((s) => s.queue);
  const currentQueueIndex = usePlayerStore((s) => s.currentQueueIndex);
  const setQueue = usePlayerStore((s) => s.setQueue);
  const playTrackAt = usePlayerStore((s) => s.playTrackAt);
  const removeTrack = usePlayerStore((s) => s.removeTrack);
  const currentTrackId = ((_b = (_a = queue[currentQueueIndex]) == null ? void 0 : _a.track) == null ? void 0 : _b.id) ?? null;
  function handlePlay(track) {
    setQueue(tracks);
    const idx = tracks.findIndex((t) => t.id === track.id);
    if (idx >= 0) playTrackAt(idx);
  }
  function handleDelete(id) {
    removeTrack(id);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-full pb-4", "data-ocid": "library.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(NowPlayingBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between px-4 pt-5 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ListMusic, { className: "w-5 h-5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-foreground tracking-tight", children: "Your Library" }),
      tracks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full", children: tracks.length })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UploadButton, {}) }),
    tracks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center flex-1 px-8 py-16 gap-4 text-center",
        "data-ocid": "library.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "w-10 h-10 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-foreground", children: "No tracks yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-[260px]", children: "Upload your music files to start listening. Supports MP3, WAV, OGG, and M4A." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5 px-4", "data-ocid": "library.list", children: tracks.map((track, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      TrackRow,
      {
        track,
        index: i + 1,
        isActive: track.id === currentTrackId,
        onPlay: handlePlay,
        onDelete: handleDelete
      },
      track.id
    )) })
  ] });
}
export {
  LibraryPage
};
