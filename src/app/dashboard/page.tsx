import { Card, CardContent } from "@/components/ui/card";
import { Workflow, Layers3, Copy, ExternalLink } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your automation workspace and recent activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Workflow className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Workflows</p>
              <p className="text-2xl font-semibold">Manage</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Layers3 className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nodes</p>
              <p className="text-2xl font-semibold">Visual builder</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Copy className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Connections</p>
              <p className="text-2xl font-semibold">Fast setup</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <ExternalLink className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="text-2xl font-semibold">Workflows</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
