import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SliceList } from "../components/editor/SliceList";
import { ImageMeta, Slice } from "../types";

const mockImageMeta: ImageMeta = {
  name: "test-image.jpg",
  width: 800,
  height: 600,
  size: 102400,
  type: "image/jpeg",
  url: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
};

const mockSlices: Slice[] = [
  { id: "1", name: "logo", x: 100, y: 100, w: 200, h: 150 },
];

const renderSliceList = (overrides: Partial<Parameters<typeof SliceList>[0]> = {}) =>
  render(
    <SliceList
      slices={mockSlices}
      imageMeta={mockImageMeta}
      onAdd={vi.fn()}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      onRename={vi.fn()}
      onExport={vi.fn()}
      onSave={vi.fn()}
      {...overrides}
    />
  );

describe("SliceList", () => {
  it("shows slice names so they stay in sync with renames from the preview gallery", () => {
    renderSliceList();

    expect(screen.getByDisplayValue("logo")).toBeInTheDocument();
  });

  it("renames a slice from the slice list", () => {
    const onRename = vi.fn();
    renderSliceList({ onRename });

    fireEvent.change(screen.getByDisplayValue("logo"), {
      target: { value: "header-logo" },
    });

    expect(onRename).toHaveBeenCalledWith("1", "header-logo");
  });

  it("reflects the updated name after a rename", () => {
    const renamed: Slice[] = [
      { id: "1", name: "header-logo", x: 100, y: 100, w: 200, h: 150 },
    ];
    renderSliceList({ slices: renamed });

    expect(screen.getByDisplayValue("header-logo")).toBeInTheDocument();
  });
});
