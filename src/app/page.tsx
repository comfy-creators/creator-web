/** @format */

import Link from "next/link";
import {
  ArrowRightIcon,
  FlameIcon,
  GaugeIcon,
  ServerIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <FlameIcon className="size-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Forge</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
          <Badge variant="secondary" className="mb-5 gap-1.5">
            <SparklesIcon className="size-3" />
            AI Generation Infrastructure
          </Badge>
          <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Powerful GPU generation,{" "}
            <span className="text-primary">made simple.</span>
          </h1>
          <p className="mt-5 max-w-xl text-balance text-base text-muted-foreground">
            Submit generation requests through a clean interface. Forge handles
            resource allocation, model execution, and delivery — no
            infrastructure knowledge required.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Start generating
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </section>

        <Separator className="mx-auto max-w-5xl" />

        {/* Features split */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight">
            Two ways to create
          </h2>
          <p className="mb-12 text-center text-sm text-muted-foreground">
            Start simple. Go deeper when you need it.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <SparklesIcon className="size-5" />
                </div>
                <CardTitle className="text-base">Standard</CardTitle>
                <CardDescription>Built for everyone.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                  {[
                    "Write a prompt and upload reference files",
                    "Forge picks the best available GPU",
                    "Output delivered and stored for 7 days",
                    "Bulk submissions for efficiency",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute right-4 top-4">
                <Badge variant="secondary" className="text-xs">
                  Coming soon
                </Badge>
              </div>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <GaugeIcon className="size-5" />
                </div>
                <CardTitle className="text-base">Advanced</CardTitle>
                <CardDescription>Built for power users.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                  {[
                    "Full ComfyUI workflow control",
                    "Custom hardware profile selection",
                    "Fine-tune execution parameters",
                    "Direct container configuration",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="mx-auto max-w-5xl" />

        {/* Infrastructure callout */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: ServerIcon,
                title: "9+ GPU providers",
                desc: "Intelligently routed across vast.ai, Akash, DataCrunch, and more.",
              },
              {
                icon: ZapIcon,
                title: "Isolated containers",
                desc: "Every generation runs in its own environment — no shared resources.",
              },
              {
                icon: ShieldCheckIcon,
                title: "Credit-based pricing",
                desc: "Pay only for what you use. No subscriptions, no surprises.",
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col gap-2">
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <item.icon className="size-4" />
                </div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA banner */}
        <section className="mx-auto w-full max-w-5xl px-6 pb-20">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground">
            <FlameIcon className="size-8 opacity-90" />
            <h2 className="text-2xl font-semibold">
              Ready to start generating?
            </h2>
            <p className="max-w-md text-sm opacity-80">
              Create an account, add credits, and submit your first generation
              in under two minutes.
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/dashboard">Get started free</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex size-5 items-center justify-center rounded bg-primary text-primary-foreground">
              <FlameIcon className="size-3" />
            </div>
            <span className="text-xs font-medium">Forge</span>
          </div>
          <p className="text-xs text-muted-foreground">
            AI Generation Infrastructure
          </p>
        </div>
      </footer>
    </div>
  );
}
