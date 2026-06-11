import { useEffect, useRef } from "react";
import { CanvasMode } from "../types";

interface UseKeyboardShortcutsOptions {
  onSetMode: (mode: CanvasMode) => void;
  onDeleteSelected: () => void;
  currentMode: CanvasMode;
  selectedGuideId: string | null;
}

export function useKeyboardShortcuts({
  onSetMode,
  onDeleteSelected,
  currentMode,
  selectedGuideId,
}: UseKeyboardShortcutsOptions) {
  const modeRef = useRef(currentMode);
  const selectedRef = useRef(selectedGuideId);

  modeRef.current = currentMode;
  selectedRef.current = selectedGuideId;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Input protection: skip when INPUT/TEXTAREA focused
      const tag = (document.activeElement?.tagName || "").toUpperCase();
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "v" || e.key === "V") {
        onSetMode("verticalGuide");
      } else if (e.key === "h" || e.key === "H") {
        onSetMode("horizontalGuide");
      } else if (e.key === "Escape") {
        onSetMode("slice");
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedRef.current) {
          onDeleteSelected();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSetMode, onDeleteSelected]);
}
