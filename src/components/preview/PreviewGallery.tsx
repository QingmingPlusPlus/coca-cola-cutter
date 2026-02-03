import React from "react";
import { Slice, ImageMeta } from "../../types";

interface PreviewGalleryProps {
    slices: Slice[];
    imageMeta: ImageMeta | null;
}

export function PreviewGallery({ slices, imageMeta }: PreviewGalleryProps) {
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
        </div>
    );
}
