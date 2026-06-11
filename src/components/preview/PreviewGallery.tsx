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

export function PreviewGallery({ slices, imageMeta, mode = "slice", selectedItem = null }: PreviewGalleryProps) {
    const info = MODE_INFO[mode];

    return (
        <div className="h-1/2 flex flex-col bg-background">
            <div className="p-4 border-b border-border bg-muted/40">
                <h2 className="font-semibold text-sm">Preview Gallery</h2>
            </div>
            <div className="flex-1 overflow-auto p-4 flex flex-wrap content-start gap-4">
                {slices.map((slice, index) => (
                    <div key={slice.id} className="flex flex-col items-center space-y-2">
                        <div
                            className="border border-border bg-white shadow-sm overflow-hidden relative"
                            style={{
                                width: slice.w,
                                height: slice.h,
                                // Cap max size for preview to avoid explosion, or use a transform scale if it's too big
                                maxWidth: '150px',
                                maxHeight: '150px',
                            }}
                        >
                            {imageMeta && (
                                <div
                                    style={{
                                        width: imageMeta.width,
                                        height: imageMeta.height,
                                        backgroundImage: `url(${imageMeta.url})`,
                                        backgroundPosition: `-${slice.x}px -${slice.y}px`,
                                        backgroundRepeat: 'no-repeat',
                                        transform: 'none' // TODO: handle scaling if slice > container
                                    }}
                                />
                            )}
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">#{index + 1}</span>
                    </div>
                ))}
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
