import React, { useState } from "react";
import { MainLayout } from "./components/layout/MainLayout";
import { CanvasModule } from "./components/canvas/CanvasModule";
import { ControlBar } from "./components/controls/ControlBar";
import { SliceList } from "./components/editor/SliceList";
import { PreviewGallery } from "./components/preview/PreviewGallery";
import { ImageMeta, Slice, CanvasMode, GuideLine } from "./types";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

function App() {
  const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null);
  const [slices, setSlices] = useState<Slice[]>([]);
  const [mode, setMode] = useState<CanvasMode>("slice");
  const [guideLines, setGuideLines] = useState<GuideLine[]>([]);
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);

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
      setMode("slice");
      setGuideLines([]);
      setSelectedGuideId(null);
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

  const handleSetMode = (newMode: CanvasMode) => {
    setMode(newMode);
    if (newMode === "slice") {
      setSelectedGuideId(null);
    }
  };

  const handleAddGuideLine = (guideLine: { orientation: "vertical" | "horizontal"; position: number }) => {
    const newGuide: GuideLine = {
      id: crypto.randomUUID(),
      orientation: guideLine.orientation,
      position: guideLine.position,
    };
    setGuideLines([...guideLines, newGuide]);
  };

  const handleDeleteGuideLine = (id: string) => {
    setGuideLines(guideLines.filter((g) => g.id !== id));
    setSelectedGuideId(null);
  };

  const handleClearGuideLines = () => {
    setGuideLines([]);
    setSelectedGuideId(null);
  };

  const handleSelectGuideLine = (id: string | null) => {
    setSelectedGuideId(id);
  };

  useKeyboardShortcuts({
    onSetMode: handleSetMode,
    onDeleteSelected: () => {
      if (selectedGuideId) {
        handleDeleteGuideLine(selectedGuideId);
      }
    },
    currentMode: mode,
    selectedGuideId: selectedGuideId,
  });

  return (
    <MainLayout
      leftPanel={
        <>
          <CanvasModule
            imageMeta={imageMeta}
            slices={slices}
            mode={mode}
            guideLines={guideLines}
            selectedGuideId={selectedGuideId}
            onAddSlice={handleCanvasAddSlice}
            onAddGuideLine={handleAddGuideLine}
            onDeleteGuideLine={handleDeleteGuideLine}
            onSelectGuideLine={handleSelectGuideLine}
            onClearGuideLines={handleClearGuideLines}
          />
          <ControlBar imageMeta={imageMeta} onUpload={handleUpload} mode={mode} guideLines={guideLines} onClearGuideLines={handleClearGuideLines} />
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