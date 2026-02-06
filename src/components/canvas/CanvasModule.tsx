import React from "react";
import { Slice, ImageMeta } from "../../types";

interface CanvasModuleProps {
    imageMeta: ImageMeta | null;
    slices: Slice[];
    onAddSlice?: (rect: { x: number, y: number, w: number, h: number }) => void;
}

export function CanvasModule({ imageMeta, slices, onAddSlice }: CanvasModuleProps) {
    const [isDrawing, setIsDrawing] = React.useState(false);
    const [startPos, setStartPos] = React.useState<{ x: number, y: number } | null>(null);
    const [currentPos, setCurrentPos] = React.useState<{ x: number, y: number } | null>(null);

    const containerRef = React.useRef<HTMLDivElement>(null);

    const getRelativeCoords = (e: React.MouseEvent) => {
        if (!containerRef.current) return { x: 0, y: 0 };
        const rect = containerRef.current.getBoundingClientRect();
        const scrollTop = containerRef.current.scrollTop;
        const scrollLeft = containerRef.current.scrollLeft;

        return {
            x: e.clientX - rect.left + scrollLeft,
            y: e.clientY - rect.top + scrollTop,
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!imageMeta || !onAddSlice) return;
        // Prevent drawing if clicking on an existing slice (optional, maybe we want to select it?)
        // For now, simple drawing.
        e.preventDefault(); // Prevent image drag
        const coords = getRelativeCoords(e);
        setIsDrawing(true);
        setStartPos(coords);
        setCurrentPos(coords);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        setCurrentPos(getRelativeCoords(e));
    };

    const handleMouseUp = () => {
        if (!isDrawing || !startPos || !currentPos || !onAddSlice) return;
        setIsDrawing(false);

        const x = Math.min(startPos.x, currentPos.x);
        const y = Math.min(startPos.y, currentPos.y);
        const w = Math.abs(currentPos.x - startPos.x);
        const h = Math.abs(currentPos.y - startPos.y);

        if (w > 2 && h > 2) { // Minimal threshold
            onAddSlice({
                x: Math.round(x),
                y: Math.round(y),
                w: Math.round(w),
                h: Math.round(h)
            });
        }
        setStartPos(null);
        setCurrentPos(null);
    };

    // Calculate drawing rect
    const drawingRect = isDrawing && startPos && currentPos ? {
        x: Math.min(startPos.x, currentPos.x),
        y: Math.min(startPos.y, currentPos.y),
        w: Math.abs(currentPos.x - startPos.x),
        h: Math.abs(currentPos.y - startPos.y),
    } : null;

    return (
        <div className="flex-1 overflow-auto bg-checkerboard relative flex items-center justify-center select-none">
            {/* Checkerboard pattern simulation with Tailwind for now if svg missing, or just a gray background placeholder */}
            {imageMeta ? (
<div
                    data-testid="canvas-container"
                    ref={containerRef}
                    className="relative shadow-lg cursor-crosshair"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => isDrawing && setIsDrawing(false)}
                >
                    {/* Image */}
                    <img src={imageMeta.url} alt="Source" className="max-w-none pointer-events-none display-block" />

                    {/* Slices Overlay */}
{slices.map((slice) => (
                        <div
                            data-testid={`slice-${slice.id}`}
                            key={slice.id}
                            className="absolute border-2 border-red-500 bg-red-500/20 pointer-events-none"
                            style={{
                                left: slice.x,
                                top: slice.y,
                                width: slice.w,
                                height: slice.h,
                            }}
                        />
                    ))}

                    {/* Drawing Rect */}
                    {drawingRect && (
                        <div
                            className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none"
                            style={{
                                left: drawingRect.x,
                                top: drawingRect.y,
                                width: drawingRect.w,
                                height: drawingRect.h,
                            }}
                        />
                    )}

                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground p-8">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mb-4 opacity-50"
                    >
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    <p>No image loaded</p>
                </div>
            )}
        </div>
    );
}
