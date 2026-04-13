/** @format */

"use client";

/** @format */

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PaperclipIcon, SparklesIcon, UploadIcon, XIcon } from "lucide-react";

import { useCreateGeneration } from "@/hooks/use-create-generation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function GeneratePage() {
  const router = useRouter();
  const { mutate: createGeneration, isPending, error } = useCreateGeneration();

  const [prompt, setPrompt] = useState("");
  const [workflow, setWorkflow] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setAttachedFiles((prev) => [...prev, ...files]);
    // reset input so same file can be re-added if removed
    e.target.value = "";
  }

  function removeFile(index: number) {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Encode workflow JSON string as bytes if provided
    let workflowBytes: number[] | undefined;
    if (workflow.trim()) {
      workflowBytes = Array.from(new TextEncoder().encode(workflow.trim()));
    }

    createGeneration(
      {
        prompt: prompt.trim() || undefined,
        comfy_workflow: workflowBytes,
        // attachments wiring deferred — file upload to storage not yet implemented
      },
      {
        onSuccess: () => router.push("/generations"),
      },
    );
  }

  const canSubmit = (prompt.trim() || workflow.trim()) && !isPending;

  return (
    <>
      <div>
        <h1 className="text-xl font-semibold">New Generation</h1>
        <p className="text-sm text-muted-foreground">
          Describe what you want to create and optionally provide a ComfyUI
          workflow.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="resize-none"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              ComfyUI Workflow
            </CardTitle>
            <CardDescription>
              Paste your workflow JSON. Leave empty to use the default pipeline.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder='{ "nodes": [ … ] }'
              rows={8}
              value={workflow}
              onChange={(e) => setWorkflow(e.target.value)}
              className="resize-none font-mono text-xs"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Attachments</CardTitle>
            <CardDescription>
              Upload reference images or other input files.
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
              onClick={() => fileInputRef.current?.click()}
              className="self-start"
            >
              <UploadIcon data-icon="inline-start" />
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

        <Separator />

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Credit cost will be calculated at processing time.
          </p>
          <Button type="submit" disabled={!canSubmit}>
            {isPending ? (
              "Submitting…"
            ) : (
              <>
                <SparklesIcon data-icon="inline-start" />
                Submit
              </>
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
