/** @format */

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewPanelProps {
  sampleImages: string[];
}

export function PreviewPanel({ sampleImages }: PreviewPanelProps) {
  const previewInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const hasCustomPreview = previewUrl !== null;

  function clearPreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    clearPreview();
    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = "";
  }

  const displaySrc = previewUrl ?? sampleImages[0] ?? null;

  return (
    <div className="flex w-[55%] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Input Preview
        </p>
        {hasCustomPreview && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearPreview}
            className="text-muted-foreground"
          >
            <XIcon />
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        {displaySrc ? (
          <>
            <div className="relative max-h-full overflow-hidden rounded-lg">
              <Image
                src={displaySrc}
                alt="Input preview"
                width={800}
                height={800}
                className="max-h-[calc(100svh-200px)] w-auto rounded-lg object-contain"
                unoptimized={hasCustomPreview}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => previewInputRef.current?.click()}
              className="text-muted-foreground"
            >
              <UploadIcon />
              {hasCustomPreview ? "Replace media" : "Upload input media"}
            </Button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => previewInputRef.current?.click()}
            className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/50 px-14 py-16 text-center transition-colors hover:border-border hover:bg-muted/20"
          >
            <UploadIcon className="size-8 text-muted-foreground/40" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Upload input media
              </p>
              <p className="mt-1 text-xs text-muted-foreground/50">
                Image or video for reference
              </p>
            </div>
          </button>
        )}
      </div>

      <input
        ref={previewInputRef}
        type="file"
        accept="image/*,video/*"
        className="sr-only"
        onChange={handleFileChange}
        aria-label="Upload input media"
      />
    </div>
  );
}
