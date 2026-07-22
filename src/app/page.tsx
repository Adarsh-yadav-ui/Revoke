"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useAuth, useUser, UserButton } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Workflow,
  Zap,
  Blocks,
  Brain,
  Webhook,
  Server,
  Menu,
  ArrowRight,
  Star,
  CheckCircle2,
} from "lucide-react"

function Logo() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-8 w-24" />
  }

  return (
    <Image
      src={resolvedTheme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
      alt="Revoke"
      width={120}
      height={32}
      priority
      className="h-8 w-auto"
    />
  )
}

const features = [
  {
    icon: Workflow,
    title: "Visual Workflow Builder",
    description:
      "Design complex automations with a drag-and-drop canvas. Connect nodes, set conditions, and build powerful flows without writing a single line of code.",
  },
  {
    icon: Zap,
    title: "400+ Integrations",
    description:
      "Connect to the tools you already use — Slack, Gmail, GitHub, databases, APIs, and hundreds more out of the box.",
  },
  {
    icon: Brain,
    title: "AI-Powered Workflows",
    description:
      "Embed AI agents, LLM calls, and smart routing into your automations. Let your workflows think, decide, and act autonomously.",
  },
  {
    icon: Webhook,
    title: "Webhooks & Triggers",
    description:
      "Trigger workflows from any event — webhooks, cron schedules, database changes, or real-time file system events.",
  },
  {
    icon: Blocks,
    title: "Self-Hosted & Open",
    description:
      "Run Revoke on your own infrastructure. Full control over your data, deployments, and scaling with Docker and Kubernetes support.",
  },
  {
    icon: Server,
    title: "Robust Execution Engine",
    description:
      "Battle-tested runtime with automatic retries, error handling, logging, and observability built into every execution.",
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO, TechFlow",
    content:
      "Revoke replaced three separate automation tools for us. The visual builder is intuitive, and self-hosting means we keep full control of our data pipelines.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Engineering Lead, CloudBase",
    content:
      "The 400+ integrations and AI workflow nodes are a game-changer. We automated our entire onboarding pipeline in a single afternoon.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "DevOps Lead, DataShield",
    content:
      "Finally an automation platform that scales with us. The execution engine handles thousands of concurrent workflows without breaking a sweat.",
    rating: 5,
  },
]

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "400+", label: "Integrations" },
  { value: "50M+", label: "Workflows Run" },
  { value: "99.9%", label: "Uptime" },
]

export default function LandingPage() {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const currentUser = useQuery(api.users.current)
  const storeUser = useMutation(api.users.store)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (isSignedIn && user && currentUser !== undefined && currentUser === null) {
      storeUser({
        email: user.primaryEmailAddress?.emailAddress ?? "",
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        username: user.username ?? undefined,
        imageUrl: user.imageUrl ?? undefined,
      }).catch(() => {})
    }
  }, [isSignedIn, user, currentUser, storeUser])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ModeToggle />
            {isSignedIn ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <UserButton />
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile nav */}
          <div className="flex items-center gap-2 md:hidden">
            <ModeToggle />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <Menu className="size-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 px-4">
                  <Link
                    href="#features"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    Features
                  </Link>
                  <Link
                    href="#testimonials"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    Testimonials
                  </Link>
                  <Link
                    href="#pricing"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </div>
                <div className="mt-auto flex flex-col gap-2 px-4 pb-4">
                  {isSignedIn ? (
                    <>
                      <Button asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                      <div className="flex justify-center pt-2">
                        <UserButton />
                      </div>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" asChild>
                        <Link href="/sign-in">Sign In</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/sign-up">Get Started</Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:py-40">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
                <CheckCircle2 className="size-3.5 text-green-500" />
                Now in public beta
              </div>
              <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Automate anything{" "}
                <span className="text-primary">with visual workflows</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Revoke is an open-source automation platform that lets you connect
                apps, build workflows on a visual canvas, and run them at scale —
                no code required.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                {isSignedIn ? (
                  <Button size="lg" asChild>
                    <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" asChild>
                      <Link href="/sign-up">
                        Get Started Free
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Gradient background */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,var(--primary)/5,transparent)]" />
        </section>

        {/* Stats */}
        <section className="border-y bg-muted/30">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-3xl font-bold">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to automate
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A powerful automation platform with everything you need to
                connect, build, and scale your workflows.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border bg-card p-6 transition-colors hover:bg-muted/50"
                >
                  <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="size-5 text-primary" />
                  </div>
                  <h3 className="font-heading text-base font-medium">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="border-y bg-muted/30 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Loved by developers
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                See what teams around the world are saying about Revoke.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col rounded-xl border bg-card p-6"
                >
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Start for free, scale when you&apos;re ready.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-2">
              {/* Free */}
              <div className="flex flex-col rounded-xl border bg-card p-8">
                <h3 className="font-heading text-lg font-medium">Free</h3>
                <div className="mt-4">
                  <span className="font-heading text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Perfect for personal projects and prototyping.
                </p>
                <ul className="mt-8 space-y-3 text-sm">
                  {[
                    "Unlimited workflows",
                    "Up to 2 team members",
                    "Community integrations",
                    "Community support",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="mt-8 w-full" asChild>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </div>
              {/* Pro */}
              <div className="relative flex flex-col rounded-xl border bg-card p-8 ring-2 ring-primary">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Most Popular
                  </span>
                </div>
                <h3 className="font-heading text-lg font-medium">Pro</h3>
                <div className="mt-4">
                  <span className="font-heading text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  For growing teams that need more integrations and support.
                </p>
                <ul className="mt-8 space-y-3 text-sm">
                  {[
                    "Unlimited workflows & executions",
                    "Up to 25 team members",
                    "All 400+ integrations",
                    "Priority support",
                    "AI workflow nodes",
                    "Audit logs & observability",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full" asChild>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-muted/30 py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to automate?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of teams using Revoke to automate their workflows and save hours every week.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isSignedIn ? (
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link href="/sign-up">
                      Start Free Trial
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Open-source workflow automation for modern teams.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-medium">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Docs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-medium">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-medium">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Revoke. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <ModeToggle />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
