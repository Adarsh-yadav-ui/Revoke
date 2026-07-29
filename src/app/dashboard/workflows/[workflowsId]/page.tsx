"use client";

import { useParams } from "next/navigation";
import { Editor } from "@/components/Editor";

export default function WorkflowEditorPage() {
  const params = useParams<{ workflowsId: string }>();

  return <Editor workflowId={params.workflowsId as never} />;
}
