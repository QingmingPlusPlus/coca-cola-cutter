import React from "react";
import { Slice, ImageMeta, CanvasMode, GuideLine } from "../../types";

interface CanvasModuleProps {
    imageMeta: ImageMeta | null;
    slices: Slice[];
    mode?: CanvasMode;
    guideLines?: GuideLine[];
    selectedGuideId?: string | null;
    onAddSlice?: (rect: { x: number, y: number, w: number, h: number }) => void;
    onAddGuideLine?: (guideLine: { orientation: 'vertical' | 'horizontal'; position: number }) => void;
    onDeleteGuideLine?: (id: string) => void;
    onSelectGuideLine?: (id: string | null) => void;
    onClearGuideLines?: () => void;
}

export function CanvasModule({
    imageMeta,
    slices,
    mode = 'slice',
    guideLines = [],
    selectedGuideId = null,
    onAddSlice,
    onAddGuideLine,
    onSelectGuideLine,
}: CanvasModuleProps) {
    const [isDrawing, setIsDrawing] = React.useState(false);
    const [startPos, setStartPos] = React.useState<{ x: number, y: number } | null>(null);
    const [currentPos, setCurrentPos] = React.useState<{ x: number, y: number } | null>(null);
    const [guidePreviewPos, setGuidePreviewPos] = React.useState<{ x: number, y: number } | null>(null);

    const containerRef = React.useRef<HTMLDivElement>(null);

    const isGuideMode = mode === 'verticalGuide' || mode === 'horizontalGuide';

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
        if (!imageMeta) return;

        if (mode === 'slice') {
            if (!onAddSlice) return;
            e.preventDefault();
            const coords = getRelativeCoords(e);
            setIsDrawing(true);
            setStartPos(coords);
            setCurrentPos(coords);
        } else if (mode === 'verticalGuide' || mode === 'horizontalGuide') {
            if (!onAddGuideLine) return;
            const coords = getRelativeCoords(e);
            const position = mode === 'verticalGuide' ? Math.round(coords.x) : Math.round(coords.y);
            onAddGuideLine({
                orientation: mode === 'verticalGuide' ? 'vertical' : 'horizontal',
                position,
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (mode === 'slice') {
            if (!isDrawing) return;
            setCurrentPos(getRelativeCoords(e));
        } else if (mode === 'verticalGuide' || mode === 'horizontalGuide') {
            setGuidePreviewPos(getRelativeCoords(e));
        }
    };

    const handleMouseUp = () => {
        if (mode === 'slice') {
            if (!isDrawing || !startPos || !currentPos || !onAddSlice) return;
            setIsDrawing(false);

            const x = Math.min(startPos.x, currentPos.x);
            const y = Math.min(startPos.y, currentPos.y);
            const w = Math.abs(currentPos.x - startPos.x);
            const h = Math.abs(currentPos.y - startPos.y);

            if (w > 2 && h > 2) {
                onAddSlice({
                    x: Math.round(x),
                    y: Math.round(y),
                    w: Math.round(w),
                    h: Math.round(h)
                });
            }
            setStartPos(null);
            setCurrentPos(null);
        }
    };

    const handleMouseLeave = () => {
        if (mode === 'slice') {
            if (isDrawing) {
                setIsDrawing(false);
                setStartPos(null);
                setCurrentPos(null);
            }
        } else {
            setGuidePreviewPos(null);
        }
    };

    // Calculate drawing rect
    const drawingRect = isDrawing && startPos && currentPos ? {
        x: Math.min(startPos.x, currentPos.x),
        y: Math.min(startPos.y, currentPos.y),
        w: Math.abs(currentPos.x - startPos.x),
        h: Math.abs(currentPos.y - startPos.y),
    } : null;

    // Cursor class based on mode
    const cursorClass = mode === 'slice'
        ? 'cursor-crosshair'
        : mode === 'verticalGuide'
        ? 'cursor-col-resize'
        : 'cursor-row-resize';

    return (
        <div className="flex-1 overflow-auto bg-checkerboard relative flex items-start justify-start select-none">
            {imageMeta ? (
                <div
                    data-testid="canvas-container"
                    ref={containerRef}
                    className={`relative shadow-lg ${cursorClass}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => {
                        if (isGuideMode && onSelectGuideLine) {
                            onSelectGuideLine(null);
                        }
                    }}
                >
                    {/* Image */}
                    <img src={imageMeta.url} alt="Source" className="max-w-none pointer-events-none display-block" />

                    {/* Guide Lines Overlay */}
                    {guideLines.map((line) => (
                        <div
                            data-testid={`guide-line-${line.id}`}
                            key={line.id}
                            className={`absolute ${isGuideMode ? 'pointer-events-auto' : 'pointer-events-none'}`}
                            style={{
                                left: line.orientation === 'vertical' ? line.position : 0,
                                top: line.orientation === 'horizontal' ? line.position : 0,
                                width: line.orientation === 'vertical' ? (selectedGuideId === line.id ? 3 : 1) : '100%',
                                height: line.orientation === 'horizontal' ? (selectedGuideId === line.id ? 3 : 1) : '100%',
                                backgroundColor: selectedGuideId === line.id
                                    ? 'rgba(0, 255, 230, 1.0)'
                                    : 'rgba(0, 200, 180, 0.8)',
                                cursor: isGuideMode ? 'pointer' : undefined,
                            }}
                            onClick={(e) => {
                                if (isGuideMode && onSelectGuideLine) {
                                    e.stopPropagation();
                                    onSelectGuideLine(line.id);
                                }
                            }}
                        >
                            <span
                                className={`absolute text-xs font-mono text-cyan-400 bg-black/70 px-1 py-0.5 rounded pointer-events-none whitespace-nowrap ${
                                    line.orientation === 'vertical' ? 'top-0 left-1' : 'top-0 left-0 -translate-y-full'
                                }`}
                            >
                                {line.orientation === 'vertical' ? `X: ${line.position}` : `Y: ${line.position}`}
                            </span>
                        </div>
                    ))}

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

                    {/* Guide Preview Line */}
                    {guidePreviewPos && mode !== 'slice' && (
                        <div
                            data-testid="guide-preview"
                            className="absolute pointer-events-none"
                            style={{
                                left: mode === 'verticalGuide' ? guidePreviewPos.x : 0,
                                top: mode === 'horizontalGuide' ? guidePreviewPos.y : 0,
                                width: mode === 'verticalGuide' ? 1 : '100%',
                                height: mode === 'horizontalGuide' ? 1 : '100%',
                                backgroundColor: 'rgba(0, 200, 180, 0.4)',
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
