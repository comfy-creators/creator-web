/** @format */

"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  LogInIcon,
  PaperclipIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import { useWorkflows } from "@/hooks/use-workflows";
import { useCreateGeneration } from "@/hooks/use-create-generation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface GenerateFormProps {
  workflowId: string | null;
}

export default function GenerateForm({ workflowId }: GenerateFormProps) {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const { data: workflows } = useWorkflows();
  const workflow = workflows?.find((w) => w.id === workflowId);

  const { mutate: createGeneration, isPending, error } = useCreateGeneration();

  const [prompt, setPrompt] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setAttachedFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  }

  function removeFile(index: number) {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
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

  const canSubmit = !isSignedIn || (prompt.trim().length > 0 && !isPending);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-8">
      {/* Back */}
      <button
        type="button"
        onClick={() =>
          router.push(workflowId ? `/workflows/${workflowId}` : "/discover")
        }
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
      >
        <ArrowLeftIcon className="size-4" />
        {workflow ? workflow.name : "Discover"}
      </button>

      {/* Workflow context banner */}
      {workflow && (
        <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-border/50 bg-muted/30 p-4">
          <Image
            src={workflow.thumbnailUrl}
            alt={workflow.name}
            className="h-16 w-12 shrink-0 rounded-lg object-cover"
            width={480}
            height={640}
          />
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap gap-1.5">
              {workflow.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-sm font-semibold">{workflow.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
              {workflow.description}
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="mb-1">
          <h1 className="text-xl font-semibold">New generation</h1>
          <p className="text-sm text-muted-foreground">
            Describe what you want to create.
          </p>
        </div>

        {/* Compose box */}
        <div className="rounded-xl border border-border bg-background shadow-sm focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/30 transition-shadow">
          <textarea
            placeholder="A cinematic wide shot of a neon-lit city at dusk, rain-soaked streets reflecting the lights…"
            rows={6}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            autoFocus
            className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm outline-none placeholder:text-muted-foreground/60"
          />

          {/* Attached files list */}
          {attachedFiles.length > 0 && (
            <ul className="mx-4 mb-2 flex flex-col gap-1">
              {attachedFiles.map((file, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/40 px-2.5 py-1.5 text-xs"
                >
                  <PaperclipIcon className="size-3 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate">{file.name}</span>
                  <span className="text-muted-foreground/70">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="ml-1 rounded text-muted-foreground hover:text-foreground"
                    aria-label={`Remove ${file.name}`}
                  >
                    <XIcon className="size-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between border-t border-border/60 px-3 py-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Attach files"
            >
              <PaperclipIcon className="size-3.5" />
              Attach
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
              aria-label="Upload attachment files"
            />

            <Button
              type="submit"
              size="sm"
              disabled={!canSubmit}
              className="gap-1.5"
            >
              {!isSignedIn ? (
                <>
                  <LogInIcon className="size-3.5" />
                  Login and Generate
                </>
              ) : isPending ? (
                <>
                  <SparklesIcon className="size-3.5 animate-pulse" />
                  Generating…
                </>
              ) : (
                <>
                  <SparklesIcon className="size-3.5" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {(error as Error).message ??
                "Something went wrong. Please try again."}
            </AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
}
