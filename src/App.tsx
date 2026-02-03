import React, { useState } from "react";
import { MainLayout } from "./components/layout/MainLayout";
import { CanvasModule } from "./components/canvas/CanvasModule";
import { ControlBar } from "./components/controls/ControlBar";
import { SliceList } from "./components/editor/SliceList";
import { PreviewGallery } from "./components/preview/PreviewGallery";
import { ImageMeta, Slice } from "./types";

function App() {
  const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null);
  const [slices, setSlices] = useState<Slice[]>([]);

  const handleUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageMeta({
        name: file.name,
        width: img.width,
        height: img.height,
        size: file.size,
        type: file.type,
        url,
      });
      // Reset slices or keep them? Resetting seems safer for now.
      setSlices([]);
    };
    img.src = url;
  };

  const handleAddSlice = () => {
    const newSlice: Slice = {
      id: crypto.randomUUID(),
      x: 0,
      y: 0,
      w: 64, // Default size
      h: 64,
    };
    setSlices([...slices, newSlice]);
  };

  const handleDeleteSlice = (id: string) => {
    setSlices(slices.filter((s) => s.id !== id));
  };

  const handleUpdateSlice = (id: string, field: keyof Slice, value: number) => {
    setSlices(
      slices.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleCanvasAddSlice = (rect: { x: number, y: number, w: number, h: number }) => {
    const newSlice: Slice = {
      id: crypto.randomUUID(),
      ...rect
    };
    setSlices([...slices, newSlice]);
  }

  return (
    <MainLayout
      leftPanel={
        <>
          <CanvasModule imageMeta={imageMeta} slices={slices} onAddSlice={handleCanvasAddSlice} />
          <ControlBar imageMeta={imageMeta} onUpload={handleUpload} />
        </>
      }
      rightPanel={
        <>
          <SliceList
            slices={slices}
            onAdd={handleAddSlice}
            onDelete={handleDeleteSlice}
            onUpdate={handleUpdateSlice}
          />
          <PreviewGallery slices={slices} imageMeta={imageMeta} />
        </>
      }
    />
  );
}

export default App;