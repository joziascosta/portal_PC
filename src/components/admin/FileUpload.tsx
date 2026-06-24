import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { uploadPortalFile } from "@/lib/upload";

export function FileUpload({
  value,
  onChange,
  folder,
  accept,
  label = "Arquivo",
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  accept?: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handle(f: File | null) {
    if (!f) return;
    setBusy(true);
    setErr(null);
    try {
      const url = await uploadPortalFile(f, folder);
      onChange(url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-1 flex flex-col sm:flex-row gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL do arquivo ou faça upload"
          className="flex-1 bg-muted rounded-md px-3 py-2 text-sm"
        />
        <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm cursor-pointer hover:bg-muted">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {busy ? "Enviando..." : "Upload"}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handle(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>
      {value && (
        <p className="mt-1 text-xs text-muted-foreground truncate">
          <a href={value} target="_blank" rel="noreferrer" className="text-primary hover:underline">
            {value}
          </a>
        </p>
      )}
      {err && <p className="mt-1 text-xs text-destructive">{err}</p>}
    </div>
  );
}
