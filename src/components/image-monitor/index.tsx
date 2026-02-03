import { useRef, useState } from "react"
import { Button } from "../ui/button"
import { ImageDisplay } from "./image-display"

function ImageMonitor() {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [fileInfo, setFileInfo] = useState<{ name: string; format: string; size: string } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const processFile = (file: File) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            setImageSrc(e.target?.result as string)
            setFileInfo({
                name: file.name,
                format: file.type,
                size: formatSize(file.size)
            })
        }
        reader.readAsDataURL(file)
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            processFile(file)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const file = e.dataTransfer.files?.[0]
        if (file && file.type.startsWith('image/')) {
            processFile(file)
        }
    }

    return (
        <div
            className="grow flex flex-col items-center justify-center p-4 bg-background"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
            />

            <ImageDisplay
                src={imageSrc}
                fileInfo={fileInfo}
                onUploadClick={handleUploadClick}
            />
            {/* Show standalone upload button only if no image is loaded to avoid redundancy, 
                or keep it if preferred. For now I'll hide it if image is present as the plan implied a cleaner UI 
                but user requirements said "loading image then show info", "empty state show plus". 
                I will keep it visible or conditional? 
                User said: "missing upload picture show blank plus icon... click also show upload popup".
                This implies the plus icon REPLACES the empty state content.
                Let's keep the button for now as a fallback or remove it if the UI is self-contained.
                Given "drag to page also upload", the entire area is drop zone.
                I'll remove the button if image is present to let the UI focus on display, 
                but actually the user request didn't explicitly say "remove the button".
                However, "modify image display... no upload picture show blank plus icon" suggests the main interaction moves there.
                I will pass the handler to ImageDisplay.
            */}
            {!imageSrc && <div className="mt-4 text-muted-foreground text-sm">Drag & drop or use the + button above</div>}
        </div>
    )
}

export default ImageMonitor