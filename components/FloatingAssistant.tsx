"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircleQuestion, X } from "lucide-react";
import { AssistantPanel } from "./AssistantPanel";

/**
 * A floating "Ask for help" button shown on every dashboard page, so the
 * assistant is always one tap away. Opens a small chat window in place.
 */
export function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const pathname = usePathname();

  // The Help page already shows the full chat, so skip the floating one there.
  if (pathname === "/dashboard/help") return null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-24 right-4 z-50 h-[70vh] max-h-[560px] w-[92vw] max-w-sm overflow-hidden rounded-3xl border border-hairline bg-white shadow-card-hover sm:right-6"
          >
            <AssistantPanel />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close help chat" : "Ask for help"}
        aria-expanded={open}
        className="fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-full bg-primary-600 px-5 py-3.5 font-semibold text-white shadow-glow transition hover:bg-primary-700 active:scale-95 sm:right-6"
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <>
            <MessageCircleQuestion className="h-5 w-5" />
            <span className="hidden sm:inline">Ask for help</span>
          </>
        )}
      </button>
    </>
  );
}
