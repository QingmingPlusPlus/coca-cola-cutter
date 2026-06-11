import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PreviewGallery } from "../components/preview/PreviewGallery";
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

describe("PreviewGallery", () => {
  it("shows slice names instead of generated indexes", () => {
    render(<PreviewGallery slices={mockSlices} imageMeta={mockImageMeta} />);

    expect(screen.getByText("logo")).toBeInTheDocument();
    expect(screen.queryByText("#1")).not.toBeInTheDocument();
  });

  it("renames a slice from the preview gallery", () => {
    const onRename = vi.fn();

    render(
      <PreviewGallery
        slices={mockSlices}
        imageMeta={mockImageMeta}
        onRename={onRename}
      />
    );

    fireEvent.click(screen.getByLabelText("Rename logo"));
    fireEvent.change(screen.getByDisplayValue("logo"), {
      target: { value: "header-logo" },
    });
    fireEvent.click(screen.getByLabelText("Save name"));

    expect(onRename).toHaveBeenCalledWith("1", "header-logo");
  });
});
