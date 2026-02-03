import React from "react";
import { ImageMeta } from "../../types";

interface ControlBarProps {
    imageMeta: ImageMeta | null;
    onUpload: (file: File) => void;
}

export function ControlBar({ imageMeta, onUpload }: ControlBarProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <div className="h-20 border-t border-border p-4 flex items-center space-x-6 bg-card">
            <div className="relative">
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                    Upload Image
                </button>
            </div>

            {imageMeta ? (
                <div className="flex space-x-6 text-sm text-foreground">
                    <div>
                        <span className="text-muted-foreground block text-xs">Filename</span>
                        <span className="font-medium">{imageMeta.name}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground block text-xs">Dimensions</span>
                        <span className="font-medium">{imageMeta.width} x {imageMeta.height}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground block text-xs">Size</span>
                        <span className="font-medium">{(imageMeta.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground block text-xs">Type</span>
                        <span className="font-medium">{imageMeta.type}</span>
                    </div>
                </div>
            ) : (
                <div className="text-sm text-muted-foreground">
                    No image selected
                </div>
            )}
        </div>
    );
}
