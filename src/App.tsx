import { useEffect, useState } from "react";
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

const WORKSPACE_STORAGE_KEY = "coca-cola-cutter-workspace";

interface SavedWorkspace {
  imageMeta: ImageMeta;
  slices: Slice[];
}

const createSliceName = (index: number) => `slice-${index}`;

function App() {
  const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null);
  const [slices, setSlices] = useState<Slice[]>([]);
  const [mode, setMode] = useState<CanvasMode>("slice");
  const [guideLines, setGuideLines] = useState<GuideLine[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const savedWorkspace = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (!savedWorkspace) return;

    try {
      const parsed = JSON.parse(savedWorkspace) as SavedWorkspace;
      if (!parsed.imageMeta || !Array.isArray(parsed.slices)) return;

      setImageMeta(parsed.imageMeta);
      setSlices(parsed.slices);
      setMode("slice");
      setGuideLines([]);
      setSelectedItem(null);
    } catch {
      localStorage.removeItem(WORKSPACE_STORAGE_KEY);
    }
  }, []);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
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
        setSlices([]);
        setMode("slice");
        setGuideLines([]);
        setSelectedItem(null);
        setSaveStatus(null);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const handleAddSlice = () => {
    const newSlice: Slice = {
      id: crypto.randomUUID(),
      name: createSliceName(slices.length + 1),
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

  const handleUpdateSlice = (id: string, field: "x" | "y" | "w" | "h", value: number) => {
    setSlices(
      slices.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleRenameSlice = (id: string, name: string) => {
    setSlices(
      slices.map((s) => (s.id === id ? { ...s, name } : s))
    );
  };

  const handleCanvasAddSlice = (rect: { x: number, y: number, w: number, h: number }) => {
    const newSlice: Slice = {
      id: crypto.randomUUID(),
      name: createSliceName(slices.length + 1),
      ...rect
    };
    setSlices([...slices, newSlice]);
  }

  const handleExportJson = () => {
    const payload = {
      imageName: imageMeta?.name ?? null,
      slices: slices.map(({ name, x, y, w, h }) => ({ name, x, y, w, h })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const baseName = imageMeta?.name.replace(/\.[^/.]+$/, "") || "slices";
    link.href = url;
    link.download = `${baseName}-slices.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveWorkspace = () => {
    if (!imageMeta) {
      setSaveStatus("No image to save");
      return;
    }

    const workspace: SavedWorkspace = {
      imageMeta,
      slices: slices.map(({ id, name, x, y, w, h }) => ({ id, name, x, y, w, h })),
    };

    try {
      localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspace));
      setSaveStatus("Saved");
    } catch {
      setSaveStatus("Save failed");
    }
  };

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
            imageMeta={imageMeta}
            onAdd={handleAddSlice}
            onDelete={handleDeleteSlice}
            onUpdate={handleUpdateSlice}
            onExport={handleExportJson}
            onSave={handleSaveWorkspace}
            saveStatus={saveStatus}
          />
          <PreviewGallery
            slices={slices}
            imageMeta={imageMeta}
            mode={mode}
            selectedItem={selectedItem}
            onRename={handleRenameSlice}
          />
        </>
      }
    />
  );
}

export default App;
