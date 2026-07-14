import { AssistantPanel } from "@/components/AssistantPanel";
import { Reveal } from "@/components/motion";
import { MessageCircleQuestion } from "lucide-react";

export const metadata = { title: "Ask for Help" };

export default function HelpPage() {
  return (
    <div className="container-luxe max-w-3xl space-y-6 py-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-50 text-primary-600">
          <MessageCircleQuestion className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Ask for Help
          </h1>
          <p className="text-base text-slate-500">
            Type a question in plain words. Get a simple answer.
          </p>
        </div>
      </div>

      <Reveal>
        <div className="card h-[600px] overflow-hidden">
          <AssistantPanel />
        </div>
      </Reveal>

      <p className="text-center text-sm text-slate-400">
        Try asking: “What is late?” · “What should I do today?” · “When will my steel arrive?”
      </p>
    </div>
  );
}
