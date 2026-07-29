import { InitialNode } from "@/components/customNodes/initialNode";
import { TriggerNode } from "@/components/customNodes/triggerNode";
import { HttpNode } from "@/components/customNodes/httpNode";
import { DelayNode } from "@/components/customNodes/delayNode";
import { ConditionNode } from "@/components/customNodes/conditionNode";

export const nodeTypes = {
  initialNode: InitialNode,
  trigger: TriggerNode,
  http: HttpNode,
  delay: DelayNode,
  condition: ConditionNode,
};
