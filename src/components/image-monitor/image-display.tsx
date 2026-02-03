import { Plus } from "lucide-react";

interface ImageDisplayProps {
    src: string | null;
    fileInfo?: { name: string; format: string; size: string } | null;
    onUploadClick?: () => void;
}

export function ImageDisplay({ src, fileInfo, onUploadClick }: ImageDisplayProps) {
    if (!src) {
        return (
            <div
                onClick={onUploadClick}
                className="mt-4 w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
                <Plus className="w-12 h-12 text-gray-400" />
            </div>
        );
    }

    return (
        <div className="mt-4 flex flex-col items-center">
            <div className="border rounded p-2 bg-white shadow-sm">
                <img src={src} alt="Uploaded" className="max-w-full max-h-[500px] h-auto rounded" />
            </div>
            {fileInfo && (
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border">
                    <span className="font-medium">File Name:</span>
                    <span className="truncate max-w-[200px]" title={fileInfo.name}>{fileInfo.name}</span>

                    <span className="font-medium">Format:</span>
                    <span>{fileInfo.format}</span>

                    <span className="font-medium">Size:</span>
                    <span>{fileInfo.size}</span>
                </div>
            )}
        </div>
    );
}
