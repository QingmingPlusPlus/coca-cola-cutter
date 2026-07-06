import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { Slice, ImageMeta, CanvasMode } from "../../types";

interface SelectedItem {
    type: "slice" | "guideLine";
    id: string;
}

interface PreviewGalleryProps {
    slices: Slice[];
    imageMeta: ImageMeta | null;
    mode?: CanvasMode;
    selectedItem?: SelectedItem | null;
    onRename?: (id: string, name: string) => void;
}

const MODE_INFO: Record<CanvasMode, { name: string; shortcuts: string[] }> = {
    slice: {
        name: "Slice Mode",
        shortcuts: [
            "Click & drag to create slice",
            "v - Vertical guide mode",
            "h - Horizontal guide mode",
            "s - Select mode",
        ],
    },
    verticalGuide: {
        name: "Vertical Guide Mode",
        shortcuts: [
            "Click to place vertical guide",
            "s - Select mode",
            "Escape - Slice mode",
        ],
    },
    horizontalGuide: {
        name: "Horizontal Guide Mode",
        shortcuts: [
            "Click to place horizontal guide",
            "s - Select mode",
            "Escape - Slice mode",
        ],
    },
    select: {
        name: "Select Mode",
        shortcuts: [
            "Click slice/guide to select",
            "Drag to move selected item",
            "d - Delete selected item",
            "Escape - Deselect / Slice mode",
        ],
    },
};

export function PreviewGallery({
    slices,
    imageMeta,
    mode = "slice",
    selectedItem = null,
    onRename,
}: PreviewGalleryProps) {
    const info = MODE_INFO[mode];
    const [editingId, setEditingId] = useState<string | null>(null);
    const [draftName, setDraftName] = useState("");

    const beginEditing = (slice: Slice) => {
        setEditingId(slice.id);
        setDraftName(slice.name);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setDraftName("");
    };

    const commitEditing = (slice: Slice) => {
        const nextName = draftName.trim() || slice.name;
        onRename?.(slice.id, nextName);
        cancelEditing();
    };

    return (
        <div className="h-1/2 flex flex-col bg-background">
            <div className="p-4 border-b border-border bg-muted/40">
                <h2 className="font-semibold text-sm">Preview Gallery</h2>
            </div>
            <div className="flex-1 overflow-auto p-4 flex flex-col gap-2">
                {slices.map((slice) => {
                    const maxDim = Math.max(slice.w, slice.h, 1);
                    const scale = Math.min(1, 64 / maxDim);
                    const isSelected =
                        selectedItem?.type === "slice" && selectedItem?.id === slice.id;
                    return (
                        <div
                            data-testid="preview-row"
                            key={slice.id}
                            className="flex items-center gap-3"
                        >
                            <div
                                data-testid="preview-thumb"
                                className={`border border-border bg-white shadow-sm overflow-hidden relative flex-shrink-0 ${
                                    isSelected ? "ring-2 ring-yellow-400" : ""
                                }`}
                                style={{
                                    width: Math.max(1, Math.round(slice.w * scale)),
                                    height: Math.max(1, Math.round(slice.h * scale)),
                                }}
                            >
                                {imageMeta && (
                                    <div
                                        style={{
                                            width: imageMeta.width * scale,
                                            height: imageMeta.height * scale,
                                            backgroundImage: `url(${imageMeta.url})`,
                                            backgroundPosition: `-${Math.round(slice.x * scale)}px -${Math.round(slice.y * scale)}px`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize: `${imageMeta.width * scale}px ${imageMeta.height * scale}px`,
                                        }}
                                    />
                                )}
                            </div>
                            {editingId === slice.id ? (
                                <div className="flex items-center gap-1 w-[150px]">
                                    <input
                                        value={draftName}
                                        onChange={(e) => setDraftName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                commitEditing(slice);
                                            } else if (e.key === "Escape") {
                                                cancelEditing();
                                            }
                                        }}
                                        className="min-w-0 flex-1 border border-border rounded px-2 py-1 text-xs bg-background"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => commitEditing(slice)}
                                        className="p-1 rounded hover:bg-muted text-green-600"
                                        title="Save name"
                                        aria-label="Save name"
                                    >
                                        <Check size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelEditing}
                                        className="p-1 rounded hover:bg-muted text-muted-foreground"
                                        title="Cancel rename"
                                        aria-label="Cancel rename"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 max-w-[150px]">
                                    <span
                                        className="min-w-0 truncate text-xs text-muted-foreground font-mono"
                                        title={slice.name}
                                    >
                                        {slice.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => beginEditing(slice)}
                                        className="p-1 rounded hover:bg-muted text-muted-foreground"
                                        title="Rename slice"
                                        aria-label={`Rename ${slice.name}`}
                                    >
                                        <Pencil size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
                {slices.length === 0 && (
                    <div className="w-full text-center text-muted-foreground text-xs py-8">
                        No previews available.
                    </div>
                )}
            </div>
            {/* Mode Info Panel */}
            <div className="border-t border-border bg-muted/30 p-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                        {info.name}
                    </span>
                    {selectedItem && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-600 border border-yellow-500/30">
                            {selectedItem.type === "slice" ? "Slice" : "Guide"} selected
                        </span>
                    )}
                </div>
                <div className="space-y-1">
                    {info.shortcuts.map((shortcut, index) => (
                        <div
                            key={index}
                            className="text-[10px] text-muted-foreground flex items-center gap-2"
                        >
                            <span className="w-1 h-1 rounded-full bg-primary/60 flex-shrink-0" />
                            {shortcut}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
