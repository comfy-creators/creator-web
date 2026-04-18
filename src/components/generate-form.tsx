/** @format */

"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDownIcon,
  LogInIcon,
  RefreshCwIcon,
  SparklesIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";

import { useWorkflows } from "@/hooks/use-workflows";
import { useCreateGeneration } from "@/hooks/use-create-generation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

const IMAGE_SIZE_PRESETS = [
  { label: "Square", value: "square", width: 512, height: 512 },
  { label: "Square HD", value: "square_hd", width: 1024, height: 1024 },
  { label: "Portrait 3:4", value: "portrait_3_4", width: 768, height: 1024 },
  { label: "Portrait 9:16", value: "portrait_9_16", width: 576, height: 1024 },
  { label: "Landscape 4:3", value: "landscape_4_3", width: 1024, height: 768 },
  {
    label: "Landscape 16:9",
    value: "landscape_16_9",
    width: 1024,
    height: 576,
  },
] as const;

interface GenerateFormProps {
  workflowId: string | null;
}

export default function GenerateForm({ workflowId }: GenerateFormProps) {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const { data: workflows } = useWorkflows();
  const workflow = workflows?.find((w) => w.id === workflowId);

  const { mutate: createGeneration, isPending, error } = useCreateGeneration();

  // Config state
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [imageSizePreset, setImageSizePreset] = useState("square_hd");
  const [inferenceSteps, setInferenceSteps] = useState(8);
  const [guidanceScale, setGuidanceScale] = useState(1);
  const [seed, setSeed] = useState("");
  const [numImages, setNumImages] = useState(1);
  const [showAdditional, setShowAdditional] = useState(false);

  // Preview state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasCustomPreview, setHasCustomPreview] = useState(false);
  const previewInputRef = useRef<HTMLInputElement>(null);

  const sizePreset =
    IMAGE_SIZE_PRESETS.find((p) => p.value === imageSizePreset) ??
    IMAGE_SIZE_PRESETS[1];

  function handlePreviewFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl && hasCustomPreview) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setHasCustomPreview(true);
    e.target.value = "";
  }

  function clearPreview() {
    if (previewUrl && hasCustomPreview) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setHasCustomPreview(false);
  }

  function randomizeSeed() {
    setSeed(String(Math.floor(Math.random() * 2 ** 32)));
  }

  function handleReset() {
    setPrompt("");
    setNegativePrompt("");
    setImageSizePreset("square_hd");
    setInferenceSteps(8);
    setGuidanceScale(1);
    setSeed("");
    setNumImages(1);
    clearPreview();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignedIn) {
      const redirectUrl = workflowId
        ? `/generate?workflow=${workflowId}`
        : "/generate";
      router.push(`/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`);
      return;
    }
    createGeneration(
      { prompt: prompt.trim() || undefined },
      { onSuccess: () => router.push("/generations") },
    );
  }

  const canSubmit = !isSignedIn || (!isPending && prompt.trim().length > 0);
  const sampleImages = workflow?.sampleOutputs ?? [];
  const displaySrc = previewUrl ?? sampleImages[0] ?? null;

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col overflow-hidden border">
      {/* Body: left config + right preview */}
      <form onSubmit={handleSubmit} className="flex flex-1 overflow-hidden">
        {/* ── Left: config panel ── */}
        <div className="flex w-[45%] pt-5 shrink-0 flex-col overflow-y-auto border-r border-border scrollbar-hide">
          <div className="flex flex-col px-6 pb-4">
            {/* Prompt */}
            <ConfigSection label="Prompt">
              <Textarea
                placeholder="A serene mountain landscape at sunset with golden light"
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                autoFocus
              />
            </ConfigSection>

            {/* Additional Settings toggle */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdditional((v) => !v)}
              className="-ml-2 mb-5 w-fit font-medium"
            >
              Additional Settings
              <ChevronDownIcon
                className={`size-4 text-muted-foreground transition-transform duration-200 ${
                  showAdditional ? "rotate-180" : ""
                }`}
              />
            </Button>

            {showAdditional && (
              <>
                {/* Negative Prompt */}
                <ConfigSection label="Negative Prompt">
                  <Textarea
                    rows={3}
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                  />
                </ConfigSection>

                {/* Image Size */}
                <ConfigSection label="Image Size">
                  <div className="flex items-center gap-2">
                    <Select
                      value={imageSizePreset}
                      onValueChange={setImageSizePreset}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {IMAGE_SIZE_PRESETS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span className="rounded-md border border-border/60 px-2.5 py-1.5 font-mono tabular-nums">
                        {sizePreset.width}
                      </span>
                      <span>×</span>
                      <span className="rounded-md border border-border/60 px-2.5 py-1.5 font-mono tabular-nums">
                        {sizePreset.height}
                      </span>
                    </div>
                  </div>
                </ConfigSection>

                {/* Num Inference Steps */}
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Num Inference Steps
                    </label>
                    <span className="w-10 rounded-md border border-border/60 px-2 py-1 text-center text-sm tabular-nums">
                      {inferenceSteps}
                    </span>
                  </div>
                  <Slider
                    min={1}
                    max={50}
                    step={1}
                    value={[inferenceSteps]}
                    onValueChange={([v]) => setInferenceSteps(v)}
                  />
                </div>

                {/* Guidance Scale */}
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Guidance Scale
                    </label>
                    <span className="w-10 rounded-md border border-border/60 px-2 py-1 text-center text-sm tabular-nums">
                      {guidanceScale}
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={20}
                    step={0.1}
                    value={[guidanceScale]}
                    onValueChange={([v]) => setGuidanceScale(v)}
                  />
                </div>

                {/* Seed */}
                <ConfigSection label="Seed">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="random"
                      value={seed}
                      onChange={(e) => setSeed(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={randomizeSeed}
                      title="Randomize seed"
                    >
                      <RefreshCwIcon />
                    </Button>
                  </div>
                </ConfigSection>

                {/* Num Images */}
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium">Num Images</label>
                    <span className="w-10 rounded-md border border-border/60 px-2 py-1 text-center text-sm tabular-nums">
                      {numImages}
                    </span>
                  </div>
                  <Slider
                    min={1}
                    max={8}
                    step={1}
                    value={[numImages]}
                    onValueChange={([v]) => setNumImages(v)}
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between border-t border-border/60 px-6 py-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="-ml-2 text-muted-foreground"
            >
              Reset
            </Button>
            <Button type="submit" disabled={!canSubmit} className="gap-1.5">
              {!isSignedIn ? (
                <>
                  <LogInIcon className="size-3.5" />
                  Sign in to run
                </>
              ) : isPending ? (
                <>
                  <SparklesIcon className="size-3.5 animate-pulse" />
                  Running…
                </>
              ) : (
                <>
                  <SparklesIcon className="size-3.5" />
                  Run
                </>
              )}
            </Button>
          </div>
        </div>

        {/* ── Right: input preview ── */}
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
            onChange={handlePreviewFileChange}
            aria-label="Upload input media"
          />
        </div>
      </form>

      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertDescription>
            {(error as Error).message ??
              "Something went wrong. Please try again."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function ConfigSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
