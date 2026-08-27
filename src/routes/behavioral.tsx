import { createFileRoute } from "@tanstack/react-router";
import { BehavioralPage } from "@/components/BehavioralPage";

export const Route = createFileRoute("/behavioral")({
  component: BehavioralPage,
});
