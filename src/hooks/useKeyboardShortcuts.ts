import { useEffect, useRef } from "react";
import { CanvasMode } from "../types";

interface SelectedItem {
  type: "slice" | "guideLine";
  id: string;
}

interface UseKeyboardShortcutsOptions {
  onSetMode: (mode: CanvasMode) => void;
  onDeleteSelected: () => void;
  currentMode: CanvasMode;
  selectedItem: SelectedItem | null;
}

export function useKeyboardShortcuts({
  onSetMode,
  onDeleteSelected,
  currentMode,
  selectedItem,
}: UseKeyboardShortcutsOptions) {
  const modeRef = useRef(currentMode);
  const selectedRef = useRef(selectedItem);

  modeRef.current = currentMode;
  selectedRef.current = selectedItem;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Input protection: skip when INPUT/TEXTAREA focused
      const tag = (document.activeElement?.tagName || "").toUpperCase();
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "v" || e.key === "V") {
        onSetMode("verticalGuide");
      } else if (e.key === "h" || e.key === "H") {
        onSetMode("horizontalGuide");
      } else if (e.key === "s" || e.key === "S") {
        onSetMode("select");
      } else if (e.key === "Escape") {
        onSetMode("slice");
      } else if (e.key === "d" || e.key === "D") {
        if (selectedRef.current) {
          onDeleteSelected();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSetMode, onDeleteSelected]);
}
