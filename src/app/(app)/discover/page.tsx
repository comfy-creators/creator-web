/** @format */

"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  BookmarkIcon,
  HeartIcon,
  MessageCircleIcon,
  ZapIcon,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useWorkflows, type Workflow } from "@/hooks/use-workflows";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

function fmtCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return String(n);
}

function groupByCategory(workflows: Workflow[]) {
  const groups: Record<string, Workflow[]> = {};
  for (const w of workflows) {
    if (!groups[w.category]) groups[w.category] = [];
    groups[w.category].push(w);
  }
  return groups;
}

export default function DiscoverPage() {
  const router = useRouter();
  const { data: workflows, isLoading } = useWorkflows();
  const heroRef = useRef<HTMLDivElement>(null);

  const featured = workflows?.[0];
  const rest = workflows?.slice(1) ?? [];
  const groups = groupByCategory(rest);
  const categories = Object.keys(groups);

  // Stable context so contextSafe works for button spring handlers
  const { contextSafe } = useGSAP({ scope: heroRef });

  // Hero entrance stagger — fires once when featured data arrives
  useGSAP(
    () => {
      if (!featured) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".hero-item", {
        y: 16,
        autoAlpha: 0,
        duration: 0.4,
        stagger: 0.07,
        ease: "power3.out",
      });
    },
    { scope: heroRef, dependencies: [!!featured], revertOnUpdate: true },
  );

  // Hero CTA button spring handlers
  const onBtnEnter = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(e.currentTarget, {
      y: -2,
      scale: 1.04,
      ease: "back.out(2)",
      duration: 0.25,
      overwrite: "auto",
    });
  });
  const onBtnLeave = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      ease: "back.out(1.5)",
      duration: 0.35,
      overwrite: "auto",
    });
  });
  const onBtnDown = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(e.currentTarget, {
      scale: 0.96,
      duration: 0.1,
      ease: "power2.in",
      overwrite: "auto",
    });
  });
  const onBtnUp = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      ease: "back.out(2)",
      duration: 0.3,
      overwrite: "auto",
    });
  });

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative min-h-[58vh] w-full overflow-hidden">
        {isLoading || !featured ? (
          <Skeleton className="h-[58vh] w-full rounded-none" />
        ) : (
          <>
            <img
              src={featured.thumbnailUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Layered gradient: darken edges + heavy bottom fade */}
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-background/60 via-transparent to-transparent" />

            <div
              ref={heroRef}
              className="absolute inset-x-0 bottom-0 px-8 pb-12 md:px-14 md:pb-16"
            >
              <Badge variant="secondary" className="hero-item mb-3 text-xs">
                {featured.category}
              </Badge>
              <h1 className="hero-item max-w-lg text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                {featured.name}
              </h1>
              <p className="hero-item mt-2 max-w-md text-sm text-muted-foreground line-clamp-2">
                {featured.description}
              </p>
              {/* Stats row */}
              <div className="hero-item mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ZapIcon className="size-3" />
                  {fmtCount(featured.stats.generations)} runs
                </span>
                <span className="flex items-center gap-1">
                  <HeartIcon className="size-3" />
                  {fmtCount(featured.stats.likes)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircleIcon className="size-3" />
                  {fmtCount(featured.stats.comments)}
                </span>
                <span className="flex items-center gap-1">
                  <BookmarkIcon className="size-3" />
                  {fmtCount(featured.stats.bookmarks)}
                </span>
              </div>
              <div className="hero-item mt-6 flex flex-wrap gap-3">
                <Button
                  size="default"
                  onClick={() =>
                    router.push(`/generate?workflow=${featured.id}`)
                  }
                  onMouseEnter={onBtnEnter}
                  onMouseLeave={onBtnLeave}
                  onMouseDown={onBtnDown}
                  onMouseUp={onBtnUp}
                  className="gap-2"
                >
                  Use this workflow
                  <ArrowRightIcon className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => router.push(`/workflows/${featured.id}`)}
                  onMouseEnter={onBtnEnter}
                  onMouseLeave={onBtnLeave}
                  onMouseDown={onBtnDown}
                  onMouseUp={onBtnUp}
                >
                  View details
                </Button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ── Category rows ── */}
      <div className="flex flex-col gap-10 px-8 py-10 md:px-14">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="h-4 w-28" />
                <div className="flex gap-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton
                      key={j}
                      className="aspect-2/3 w-44 shrink-0 rounded-xl"
                    />
                  ))}
                </div>
              </div>
            ))
          : categories.map((category) => (
              <div key={category}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-semibold">{category}</h2>
                  <span className="text-xs text-muted-foreground">
                    {groups[category].length} workflow
                    {groups[category].length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {groups[category].map((workflow, i) => (
                    <WorkflowCard
                      key={workflow.id}
                      workflow={workflow}
                      featured={i === 0}
                    />
                  ))}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

function WorkflowCard({
  workflow,
  featured = false,
}: {
  workflow: Workflow;
  featured?: boolean;
}) {
  const router = useRouter();
  const cardRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;

      const reduced = () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const onMouseEnter = () => {
        if (reduced()) return;
        gsap.to(card, {
          scale: 1.04,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const onMouseMove = (e: MouseEvent) => {
        if (reduced()) return;
        const rect = card.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        gsap.to(card, {
          rotationY: dx * 6,
          rotationX: -dy * 4,
          transformPerspective: 800,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const onMouseLeave = () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          overwrite: "auto",
        });
      };

      card.addEventListener("mouseenter", onMouseEnter);
      card.addEventListener("mousemove", onMouseMove);
      card.addEventListener("mouseleave", onMouseLeave);

      return () => {
        card.removeEventListener("mouseenter", onMouseEnter);
        card.removeEventListener("mousemove", onMouseMove);
        card.removeEventListener("mouseleave", onMouseLeave);
      };
    },
    { scope: cardRef },
  );

  return (
    <button
      ref={cardRef}
      onClick={() => router.push(`/workflows/${workflow.id}`)}
      className={cn(
        "group relative shrink-0 cursor-pointer overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        featured ? "aspect-2/3 w-56" : "aspect-2/3 w-44",
      )}
      aria-label={`View ${workflow.name} workflow`}
    >
      {/* Poster image */}
      <img
        src={workflow.thumbnailUrl}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Deep gradient — heavier bottom fade for readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />

      {/* Hover shade */}
      <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Category pill — top-left, always visible */}
      <div className="absolute left-2.5 top-2.5">
        <span className="rounded-full border border-white/10 bg-black/50 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-white/70 backdrop-blur-sm">
          {workflow.category}
        </span>
      </div>

      {/* Generations count — top-right, always visible social proof */}
      <div className="absolute right-2.5 top-2.5">
        <span className="flex items-center gap-0.5 rounded-full border border-white/10 bg-black/50 px-2 py-0.5 text-[9px] font-medium text-white/70 backdrop-blur-sm">
          <ZapIcon className="size-2.5" />
          {fmtCount(workflow.stats.generations)}
        </span>
      </div>

      {/* Center "Use →" CTA — appears on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm">
          Use
          <ArrowRightIcon className="size-3" />
        </span>
      </div>

      {/* Description — fades in on hover, sits above the bottom info */}
      <div className="absolute inset-x-0 bottom-22 px-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <p className="text-[10px] leading-snug text-white/70 line-clamp-2">
          {workflow.description}
        </p>
      </div>

      {/* Name + tags + stats — always visible at card bottom */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="text-xs font-semibold text-white line-clamp-1">
          {workflow.name}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {workflow.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] leading-tight text-white/80"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* Compact stats row */}
        <div className="mt-2 flex items-center gap-2.5 text-[9px] text-white/45">
          <span className="flex items-center gap-0.5">
            <HeartIcon className="size-2.5" />
            {fmtCount(workflow.stats.likes)}
          </span>
          <span className="flex items-center gap-0.5">
            <MessageCircleIcon className="size-2.5" />
            {fmtCount(workflow.stats.comments)}
          </span>
          <span className="flex items-center gap-0.5">
            <BookmarkIcon className="size-2.5" />
            {fmtCount(workflow.stats.bookmarks)}
          </span>
        </div>
      </div>
    </button>
  );
}
