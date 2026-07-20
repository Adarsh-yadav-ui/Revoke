"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/mode-toggle"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Kbd } from "@/components/ui/kbd"
import {
  Sun,
  Moon,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Bell,
  Code,
  Mail,
  Lock,
} from "lucide-react"

const invoices = [
  { invoice: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },
  { invoice: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },
  { invoice: "INV003", status: "Processing", method: "Bank Transfer", amount: "$350.00" },
]

export default function ComponentsShowcase() {
  const [progress, setProgress] = React.useState(13)
  const [sliderValue, setSliderValue] = React.useState([50])
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({
    terms: false,
    marketing: false,
  })
  const [radioValue, setRadioValue] = React.useState("comfortable")
  const [switches, setSwitches] = React.useState<Record<string, boolean>>({
    notifications: true,
    emails: false,
    sms: true,
  })

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + Math.random() * 5))
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h1 className="fonwt-heading text-lg font-semibold">Component Showcase</h1>
            <Badge variant="secondary">shadcn/ui</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Info">
                  <Info className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Press <Kbd>D</Kbd> to toggle dark/light mode
              </TooltipContent>
            </Tooltip>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-16 p-6">
        {/* Theme Toggle Section */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold">Theme Toggle</h2>
          <p className="text-sm text-muted-foreground">
            Press <Kbd>D</Kbd> anywhere to toggle between light and dark mode. Or use the
            dropdown above.
          </p>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sun className="size-4" />
              <span>/</span>
              <Moon className="size-4" />
              <span className="ml-1">
                Press <Kbd>D</Kbd> to toggle
              </span>
            </div>
          </div>
        </section>

        <Separator />

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold">Buttons</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon-sm">
              <Bell className="size-4" />
            </Button>
            <Button size="icon">
              <Mail className="size-4" />
            </Button>
          </div>
        </section>

        <Separator />

        {/* Badges */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold">Badges</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </section>

        <Separator />

        {/* Avatars */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold">Avatars</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Avatar size="sm">
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>LG</AvatarFallback>
            </Avatar>
          </div>
        </section>

        <Separator />

        {/* Alerts */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold">Alerts</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Alert>
              <Info className="size-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                This is an informational alert with some details.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <XCircle className="size-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Something went wrong. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        <Separator />

        {/* Toasts */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold">Sonner Toasts</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => toast("This is a default toast")}>Default</Button>
            <Button onClick={() => toast.success("Action completed successfully!")}>
              <CheckCircle2 className="size-4" />
              Success
            </Button>
            <Button onClick={() => toast.error("Something went wrong!")}>
              <XCircle className="size-4" />
              Error
            </Button>
            <Button onClick={() => toast.warning("Please be careful!")}>
              <AlertTriangle className="size-4" />
              Warning
            </Button>
            <Button onClick={() => toast.info("Here is some information.")}>
              <Info className="size-4" />
              Info
            </Button>
          </div>
        </section>

        <Separator />

        {/* Cards */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold">Cards</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-6 text-card-foreground">
              <h3 className="font-heading text-base font-medium">Card Title</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                This is a card with some content inside it. You can put anything here.
              </p>
              <div className="mt-4 flex gap-2">
                <Button size="sm">Action</Button>
                <Button size="sm" variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6 text-card-foreground">
              <h3 className="font-heading text-base font-medium">Another Card</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Cards are great for grouping related content together.
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="mt-2" />
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Form Controls */}
        <section className="space-y-6">
          <h2 className="font-heading text-2xl font-semibold">Form Controls</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Input</Label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" placeholder="Enter your email" className="pl-8" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password Input</Label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  className="pl-8"
                />
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-2">
              <Label htmlFor="message">Textarea</Label>
              <Textarea id="message" placeholder="Type your message here..." />
            </div>

            {/* Select */}
            <div className="space-y-2">
              <Label>Select</Label>
              <Select defaultValue="apple">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="cherry">Cherry</SelectItem>
                  <SelectItem value="grape">Grape</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <Label>Checkboxes</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms"
                  checked={checkedItems.terms}
                  onCheckedChange={(checked) =>
                    setCheckedItems((prev) => ({ ...prev, terms: !!checked }))
                  }
                />
                <Label htmlFor="terms" className="font-normal">
                  I agree to the terms and conditions
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="marketing"
                  checked={checkedItems.marketing}
                  onCheckedChange={(checked) =>
                    setCheckedItems((prev) => ({ ...prev, marketing: !!checked }))
                  }
                />
                <Label htmlFor="marketing" className="font-normal">
                  Send me marketing emails
                </Label>
              </div>
            </div>
          </div>

          {/* Radio Group */}
          <div className="space-y-3">
            <Label>Radio Group</Label>
            <RadioGroup value={radioValue} onValueChange={setRadioValue}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="comfortable" id="comfortable" />
                <Label htmlFor="comfortable" className="font-normal">
                  Comfortable
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="compact" id="compact" />
                <Label htmlFor="compact" className="font-normal">
                  Compact
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="spacious" id="spacious" />
                <Label htmlFor="spacious" className="font-normal">
                  Spacious
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Switches */}
          <div className="space-y-3">
            <Label>Switches</Label>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Switch
                  checked={switches.notifications}
                  onCheckedChange={(checked) =>
                    setSwitches((prev) => ({ ...prev, notifications: checked }))
                  }
                />
                <Label className="font-normal">Enable notifications</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={switches.emails}
                  onCheckedChange={(checked) =>
                    setSwitches((prev) => ({ ...prev, emails: checked }))
                  }
                />
                <Label className="font-normal">Email notifications</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={switches.sms}
                  onCheckedChange={(checked) =>
                    setSwitches((prev) => ({ ...prev, sms: checked }))
                  }
                />
                <Label className="font-normal">SMS notifications</Label>
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-3">
            <Label>Slider</Label>
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              max={100}
              className="w-full max-w-sm"
            />
            <p className="text-sm text-muted-foreground">Value: {sliderValue[0]}</p>
          </div>
        </section>

        <Separator />

        {/* Progress & Skeleton */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold">Progress & Skeleton</h2>
          <div className="space-y-4">
            <div className="max-w-md space-y-2">
              <div className="flex justify-between text-sm">
                <span>Loading...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
            <div className="flex items-center gap-3">
              <Spinner />
              <span className="text-sm text-muted-foreground">Loading</span>
            </div>
            <div className="max-w-md space-y-3">
              <Skeleton className="h-4 w-62.5" />
              <Skeleton className="h-4 w-62.5" />
              <Skeleton className="h-4 w-62.5" />
            </div>
          </div>
        </section>

        <Separator />

        {/* Tooltip */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold">Tooltips</h2>
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>This is a tooltip!</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon-sm">
                  <Info className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>More information</TooltipContent>
            </Tooltip>
          </div>
        </section>

        <Separator />

        {/* Dialog */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold">Dialog</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        <Separator />

        {/* Alert Dialog */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold">Alert Dialog</h2>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>

        <Separator />

        {/* Tabs */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold">Tabs</h2>
          <Tabs defaultValue="account" className="w-full max-w-lg">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Make changes to your account here.
              </p>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="@johndoe" />
                </div>
              </div>
              <Button>Save changes</Button>
            </TabsContent>
            <TabsContent value="password" className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Change your password here.
              </p>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </div>
              <Button>Update password</Button>
            </TabsContent>
            <TabsContent value="settings" className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Manage your settings here.
              </p>
              <div className="flex items-center gap-3">
                <Switch defaultChecked />
                <Label className="font-normal">Enable notifications</Label>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <Separator />

        {/* Accordion */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold">Accordion</h2>
          <Accordion type="single" collapsible className="w-full max-w-lg">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is this?</AccordionTrigger>
              <AccordionContent>
                This is a component showcase page displaying all the shadcn/ui components
                available in this project.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I toggle dark mode?</AccordionTrigger>
              <AccordionContent>
                Press the <Kbd>D</Kbd> key anywhere on the page, or use the theme toggle
                button in the header.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What framework is this?</AccordionTrigger>
              <AccordionContent>
                This project uses Next.js 16 with React 19 and Tailwind CSS v4.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <Separator />

        {/* Table */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold">Table</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">{invoice.invoice}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "Paid" ? "default" : "secondary"}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{invoice.method}</TableCell>
                  <TableCell className="text-right">{invoice.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <Separator />

        {/* Code / Kbd */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl font-semibold">Kbd & Code</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Kbd>D</Kbd>
            <Kbd>Ctrl</Kbd>
            <Kbd>Shift</Kbd>
            <Kbd>⌘</Kbd>
            <Kbd>⌥</Kbd>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Code className="size-4" />
            <span>
              Use <Kbd>D</Kbd> to toggle between light and dark mode.
            </span>
          </div>
        </section>

        <Separator />

        {/* Sonner Demo */}
        <section className="space-y-4 pb-16">
          <h2 className="font-heading text-2xl font-semibold">Sonner Notifications</h2>
          <p className="text-sm text-muted-foreground">
            Click the buttons below to see sonner toast notifications in action.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => toast("Event has been created")}
            >
              <Bell className="size-4" />
              Show Toast
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.success("Your settings have been saved successfully.")
              }
            >
              <CheckCircle2 className="size-4" />
              Success Toast
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.error("Failed to save changes.")}
            >
              <XCircle className="size-4" />
              Error Toast
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.warning("Your trial expires in 3 days.")
              }
            >
              <AlertTriangle className="size-4" />
              Warning Toast
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.info("A new version is available.", {
                  action: {
                    label: "Update",
                    onClick: () => toast.success("Updated!"),
                  },
                })
              }
            >
              <Info className="size-4" />
              Toast with Action
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
