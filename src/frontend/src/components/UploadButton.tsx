import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { usePlayerStore } from "../store/playerStore";
import type { Track } from "../types";

function formatDuration(seconds: number): number {
  return Math.round(seconds);
}

function parseAudioDuration(file: File): Promise<number> {
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

function guessArtistTitle(filename: string): { title: string; artist: string } {
  const base = filename.replace(/\.[^.]+$/, "");
  const parts = base.split(" - ");
  if (parts.length >= 2) {
    return {
      artist: parts[0].trim(),
      title: parts.slice(1).join(" - ").trim(),
    };
  }
  return { title: base.trim(), artist: "Unknown Artist" };
}

interface UploadButtonProps {
  onUploadComplete?: () => void;
}

export function UploadButton({ onUploadComplete }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const addTrack = usePlayerStore((s) => s.addTrack);
  const tracks = usePlayerStore((s) => s.tracks);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    const fileArray = Array.from(files);
    let completed = 0;

    for (const file of fileArray) {
      setProgress(Math.round((completed / fileArray.length) * 100));
      try {
        const duration = await parseAudioDuration(file);
        const blobUrl = URL.createObjectURL(file);
        const { title, artist } = guessArtistTitle(file.name);
        const newId = Date.now() + Math.random();
        const track: Track = {
          id: newId,
          title,
          artist,
          duration: formatDuration(duration),
          blobUrl,
          addedAt: Date.now(),
        };
        // Avoid duplicates by filename heuristic
        const isDuplicate = tracks.some(
          (t) => t.title === title && t.artist === artist,
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
    onUploadComplete?.();
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <input
        ref={inputRef}
        type="file"
        accept=".mp3,.wav,.ogg,.m4a,audio/mpeg,audio/wav,audio/ogg,audio/mp4"
        multiple
        className="hidden"
        data-ocid="upload.input"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button
        type="button"
        variant="default"
        className="w-full min-h-[44px] gap-2 bg-primary text-primary-foreground font-semibold rounded-full text-sm tracking-wide hover:bg-primary/90 active:scale-95 transition-smooth"
        data-ocid="upload.upload_button"
        onClick={() => inputRef.current?.click()}
        disabled={progress !== null}
      >
        {progress !== null ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        {progress !== null ? `Uploading… ${progress}%` : "Upload Music"}
      </Button>

      {progress !== null && (
        <div
          className="h-1 w-full bg-muted rounded-full overflow-hidden"
          data-ocid="upload.loading_state"
        >
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive" data-ocid="upload.error_state">
          {error}
        </p>
      )}
    </div>
  );
}
