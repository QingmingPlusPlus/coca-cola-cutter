import { useRef, useState } from "react"
import { Button } from "../ui/button"
import { ImageDisplay } from "./image-display"

function ImageMonitor() {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setImageSrc(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="grow flex flex-col items-center justify-center p-4">
            <h2 className="text-xl mb-4">Image Monitor</h2>
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
            />

            <ImageDisplay src={imageSrc} />
            <Button onClick={handleUploadClick}>Upload</Button>
        </div>
    )
}

export default ImageMonitor