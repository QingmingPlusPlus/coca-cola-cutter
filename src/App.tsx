import { useState } from "react";
import { MainLayout } from "./components/layout/MainLayout";
import { CanvasModule } from "./components/canvas/CanvasModule";
import { ControlBar } from "./components/controls/ControlBar";
import { SliceList } from "./components/editor/SliceList";
import { PreviewGallery } from "./components/preview/PreviewGallery";
import { ImageMeta, Slice, CanvasMode, GuideLine } from "./types";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

interface SelectedItem {
  type: "slice" | "guideLine";
  id: string;
}

function App() {
  const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null);
  const [slices, setSlices] = useState<Slice[]>([]);
  const [mode, setMode] = useState<CanvasMode>("slice");
  const [guideLines, setGuideLines] = useState<GuideLine[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

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
      setSelectedItem(null);
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
    if (newMode !== "select") {
      setSelectedItem(null);
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
    setSelectedItem(null);
  };

  const handleClearGuideLines = () => {
    setGuideLines([]);
    setSelectedItem(null);
  };

  const handleSelectItem = (item: SelectedItem | null) => {
    setSelectedItem(item);
  };

  const handleDeleteSelected = () => {
    if (!selectedItem) return;
    if (selectedItem.type === "slice") {
      handleDeleteSlice(selectedItem.id);
    } else {
      handleDeleteGuideLine(selectedItem.id);
    }
    setSelectedItem(null);
  };

  const handleUpdateSlicePosition = (id: string, x: number, y: number) => {
    setSlices(slices.map((s) => (s.id === id ? { ...s, x, y } : s)));
  };

  const handleUpdateGuideLinePosition = (id: string, position: number) => {
    setGuideLines(guideLines.map((g) => (g.id === id ? { ...g, position } : g)));
  };

  useKeyboardShortcuts({
    onSetMode: handleSetMode,
    onDeleteSelected: handleDeleteSelected,
    currentMode: mode,
    selectedItem: selectedItem,
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
            selectedItem={selectedItem}
            onAddSlice={handleCanvasAddSlice}
            onAddGuideLine={handleAddGuideLine}
            onDeleteGuideLine={handleDeleteGuideLine}
            onSelectItem={handleSelectItem}
            onClearGuideLines={handleClearGuideLines}
            onUpdateSlicePosition={handleUpdateSlicePosition}
            onUpdateGuideLinePosition={handleUpdateGuideLinePosition}
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
          <PreviewGallery slices={slices} imageMeta={imageMeta} mode={mode} selectedItem={selectedItem} />
        </>
      }
    />
  );
}

export default App;