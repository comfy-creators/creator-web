/** @format */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  ChevronDownIcon,
  LogInIcon,
  RefreshCwIcon,
  SparklesIcon,
} from "lucide-react";

import { useWorkflows } from "@/hooks/use-workflows";
import { useCreateGeneration } from "@/hooks/use-create-generation";

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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { PreviewPanel } from "./preview-panel";
import { DEFAULT_FORM_VALUES, IMAGE_SIZE_PRESETS } from "./types";

interface GenerateFormProps {
  workflowId: string | null;
}

export default function GenerateForm({ workflowId }: GenerateFormProps) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [showAdditional, setShowAdditional] = useState(false);

  const { data: workflows } = useWorkflows();
  const workflow = workflows?.find((w) => w.id === workflowId);

  const { mutate: createGeneration, isPending, error } = useCreateGeneration();

  useEffect(() => {
    if (error) {
      toast.error(
        (error as Error).message ?? "Something went wrong. Please try again.",
      );
    }
  }, [error]);

  const form = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
    onSubmit: ({ value }) => {
      if (!isSignedIn) {
        const redirectUrl = workflowId
          ? `/generate?workflow=${workflowId}`
          : "/generate";
        router.push(`/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`);
        return;
      }
      createGeneration(
        { prompt: value.prompt.trim() || undefined },
        { onSuccess: () => router.push("/generations") },
      );
    },
  });

  const sampleImages = workflow?.sampleOutputs ?? [];

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col overflow-hidden border">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-1 overflow-hidden"
      >
        {/* Left: Config */}
        <div className="flex w-[45%] shrink-0 flex-col overflow-y-auto border-r border-border pt-5 scrollbar-hide">
          <div className="px-6 pb-4">
            {/* Prompt */}
            <FieldGroup className="mb-5">
              <form.Field name="prompt">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Prompt</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        placeholder="A serene mountain landscape at sunset with golden light"
                        rows={5}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                        autoFocus
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>

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
              <FieldGroup>
                {/* Negative Prompt */}
                <form.Field name="negativePrompt">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Negative Prompt
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          rows={3}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                {/* Image Size */}
                <form.Field name="imageSizePreset">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    const preset =
                      IMAGE_SIZE_PRESETS.find(
                        (p) => p.value === field.state.value,
                      ) ?? IMAGE_SIZE_PRESETS[1];
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Image Size</FieldLabel>
                        <div className="flex items-center gap-2">
                          <Select
                            name={field.name}
                            value={field.state.value}
                            onValueChange={(v) => field.handleChange(v)}
                          >
                            <SelectTrigger
                              id={field.name}
                              className="flex-1"
                              aria-invalid={isInvalid}
                            >
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
                              {preset.width}
                            </span>
                            <span>×</span>
                            <span className="rounded-md border border-border/60 px-2.5 py-1.5 font-mono tabular-nums">
                              {preset.height}
                            </span>
                          </div>
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                {/* Num Inference Steps */}
                <form.Field name="inferenceSteps">
                  {(field) => (
                    <Field>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor={field.name}>
                          Num Inference Steps
                        </FieldLabel>
                        <span className="w-10 rounded-md border border-border/60 px-2 py-1 text-center text-sm tabular-nums">
                          {field.state.value}
                        </span>
                      </div>
                      <Slider
                        id={field.name}
                        min={1}
                        max={50}
                        step={1}
                        value={[field.state.value]}
                        onValueChange={([v]) => field.handleChange(v)}
                      />
                    </Field>
                  )}
                </form.Field>

                {/* Guidance Scale */}
                <form.Field name="guidanceScale">
                  {(field) => (
                    <Field>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor={field.name}>
                          Guidance Scale
                        </FieldLabel>
                        <span className="w-10 rounded-md border border-border/60 px-2 py-1 text-center text-sm tabular-nums">
                          {field.state.value}
                        </span>
                      </div>
                      <Slider
                        id={field.name}
                        min={0}
                        max={20}
                        step={0.1}
                        value={[field.state.value]}
                        onValueChange={([v]) => field.handleChange(v)}
                      />
                    </Field>
                  )}
                </form.Field>

                {/* Seed */}
                <form.Field name="seed">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Seed</FieldLabel>
                        <div className="flex items-center gap-2">
                          <Input
                            id={field.name}
                            name={field.name}
                            type="number"
                            placeholder="random"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            aria-invalid={isInvalid}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            onClick={() =>
                              field.handleChange(
                                String(Math.floor(Math.random() * 2 ** 32)),
                              )
                            }
                            title="Randomize seed"
                          >
                            <RefreshCwIcon />
                          </Button>
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                {/* Num Images */}
                <form.Field name="numImages">
                  {(field) => (
                    <Field>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor={field.name}>Num Images</FieldLabel>
                        <span className="w-10 rounded-md border border-border/60 px-2 py-1 text-center text-sm tabular-nums">
                          {field.state.value}
                        </span>
                      </div>
                      <Slider
                        id={field.name}
                        min={1}
                        max={8}
                        step={1}
                        value={[field.state.value]}
                        onValueChange={([v]) => field.handleChange(v)}
                      />
                    </Field>
                  )}
                </form.Field>
              </FieldGroup>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between border-t border-border px-6 py-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => form.reset()}
              className="-ml-2 text-muted-foreground"
            >
              Reset
            </Button>
            <form.Subscribe
              selector={(s) => [s.values.prompt, s.isSubmitting] as const}
            >
              {([prompt, isSubmitting]) => {
                const canSubmit =
                  !isSignedIn ||
                  (!isPending && !isSubmitting && prompt.trim().length > 0);
                return (
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="gap-1.5"
                  >
                    {!isSignedIn ? (
                      <>
                        <LogInIcon className="size-3.5" />
                        Sign in to run
                      </>
                    ) : isPending || isSubmitting ? (
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
                );
              }}
            </form.Subscribe>
          </div>
        </div>

        {/* Right: Preview */}
        <PreviewPanel sampleImages={sampleImages} />
      </form>
    </div>
  );
}

interface GenerateFormProps {
  workflowId: string | null;
}
