
interface ImageDisplayProps {
    src: string | null;
}

export function ImageDisplay({ src }: ImageDisplayProps) {
    if (!src) return null;

    return (
        <div className="mt-4 border rounded p-2">
            <img src={src} alt="Uploaded" className="max-w-full h-auto" />
        </div>
    );
}
