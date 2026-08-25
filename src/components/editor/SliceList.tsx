import { ImageMeta, Slice } from "../../types";

interface SliceListProps {
    slices: Slice[];
    imageMeta: ImageMeta | null;
    onAdd: () => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, field: "x" | "y" | "w" | "h", value: number) => void;
    onRename: (id: string, name: string) => void;
    onExport: () => void;
    onSave: () => void;
    saveStatus?: string | null;
}

export function SliceList({
    slices,
    imageMeta,
    onAdd,
    onDelete,
    onUpdate,
    onRename,
    onExport,
    onSave,
    saveStatus,
}: SliceListProps) {
    return (
        <div className="h-1/2 border-b border-border flex flex-col bg-background">
            <div className="p-4 border-b border-border flex justify-between items-center gap-3 bg-muted/40">
                <h2 className="font-semibold text-sm">Slices ({slices.length})</h2>
                <div className="flex items-center gap-2">
                    {saveStatus && (
                        <span className="text-[10px] text-muted-foreground">
                            {saveStatus}
                        </span>
                    )}
                    <button
                        onClick={onSave}
                        disabled={!imageMeta}
                        className="text-xs bg-slate-700 hover:bg-slate-800 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-white px-2 py-1 rounded"
                    >
                        Save
                    </button>
                    <button
                        onClick={onExport}
                        disabled={!imageMeta}
                        className="text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-white px-2 py-1 rounded"
                    >
                        Export JSON
                    </button>
                    <button
                        onClick={onAdd}
                        className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                    >
                        + Add Slice
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-auto p-2 space-y-2">
                {slices.map((slice, index) => (
                    <div key={slice.id} className="grid grid-cols-[auto_1fr_auto] gap-2 items-center p-2 rounded-md border bg-card text-sm">
                        <div className="text-muted-foreground font-mono text-xs w-6">
                            #{index + 1}
                        </div>

                        <div className="min-w-0 space-y-2">
                            <input
                                type="text"
                                value={slice.name}
                                onChange={(e) => onRename(slice.id, e.target.value)}
                                aria-label={`Slice ${index + 1} name`}
                                title={slice.name}
                                className="w-full min-w-0 bg-transparent border-b border-border focus:border-primary outline-none py-0 text-xs font-mono truncate"
                            />
                            <div className="grid grid-cols-4 gap-2">
                                <InputGroup label="X" value={slice.x} onChange={(v) => onUpdate(slice.id, 'x', v)} />
                                <InputGroup label="Y" value={slice.y} onChange={(v) => onUpdate(slice.id, 'y', v)} />
                                <InputGroup label="W" value={slice.w} onChange={(v) => onUpdate(slice.id, 'w', v)} />
                                <InputGroup label="H" value={slice.h} onChange={(v) => onUpdate(slice.id, 'h', v)} />
                            </div>
                        </div>

                        <button
                            onClick={() => onDelete(slice.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                        >
                            x
                        </button>
                    </div>
                ))}
                {slices.length === 0 && (
                    <div className="text-center text-muted-foreground text-xs py-8">
                        No slices defined. Add one to start.
                    </div>
                )}
            </div>
        </div>
    );
}

function InputGroup({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
    return (
        <div className="flex flex-col">
            <label className="text-[10px] text-muted-foreground uppercase">{label}</label>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full bg-transparent border-b border-border focus:border-primary outline-none p-0 text-center font-mono"
            />
        </div>
    )
}
