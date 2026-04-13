/** @format */

"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeftIcon,
  PaperclipIcon,
  SparklesIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";

import { useWorkflows } from "@/hooks/use-workflows";
import { useCreateGeneration } from "@/hooks/use-create-generation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function GeneratePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workflowId = searchParams.get("workflow");

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
    createGeneration(
      { prompt: prompt.trim() || undefined },
      { onSuccess: () => router.push("/generations") },
    );
  }

  const canSubmit = prompt.trim().length > 0 && !isPending;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-8">
      {/* Back */}
      <div>
        <button
          type="button"
          onClick={() =>
            router.push(workflowId ? `/workflows/${workflowId}` : "/discover")
          }
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
        >
          <ArrowLeftIcon className="size-4" />
          {workflow ? workflow.name : "Discover"}
        </button>
      </div>

      {/* Workflow context banner */}
      {workflow && (
        <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-border/50 bg-muted/30 p-4">
          <img
            src={workflow.thumbnailUrl}
            alt={workflow.name}
            className="h-16 w-12 shrink-0 rounded-lg object-cover"
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-semibold">New generation</h1>
          <p className="text-sm text-muted-foreground">
            Describe what you want to create.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Prompt</CardTitle>
            <CardDescription>
              Describe the image you want to generate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="A cinematic wide shot of a neon-lit city at dusk, rain-soaked streets reflecting the lights…"
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="resize-none"
              autoFocus
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Attachments</CardTitle>
            <CardDescription>
              Upload reference images or input files.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
              aria-label="Upload attachment files"
            />

            {attachedFiles.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {attachedFiles.map((file, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/30 px-3 py-1.5 text-xs"
                  >
                    <PaperclipIcon className="size-3 shrink-0 text-muted-foreground" />
                    <span className="flex-1 truncate">{file.name}</span>
                    <span className="text-muted-foreground">
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

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon className="size-3.5" />
              Add files
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {(error as Error).message ??
                "Something went wrong. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={!canSubmit} className="gap-2">
          <SparklesIcon className="size-4" />
          {isPending ? "Generating…" : "Generate"}
        </Button>
      </form>
    </div>
  );
}
