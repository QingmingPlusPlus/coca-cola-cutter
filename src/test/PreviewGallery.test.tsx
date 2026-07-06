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

  it("renders one row per slice", () => {
    const twoSlices: Slice[] = [
      { id: "1", name: "logo", x: 100, y: 100, w: 200, h: 150 },
      { id: "2", name: "banner", x: 0, y: 0, w: 400, h: 300 },
    ];

    render(<PreviewGallery slices={twoSlices} imageMeta={mockImageMeta} />);

    expect(screen.getAllByTestId("preview-row")).toHaveLength(2);
  });

  it("thumbnail is scaled to fit and not cropped", () => {
    const bigSlice: Slice[] = [
      { id: "1", name: "big", x: 0, y: 0, w: 800, h: 600 },
    ];

    render(<PreviewGallery slices={bigSlice} imageMeta={mockImageMeta} />);

    const thumb = screen.getByTestId("preview-thumb");
    // scale = min(1, 64/800) = 0.08; container = round(800*0.08) x round(600*0.08) = 64 x 48
    expect(thumb.style.width).toBe("64px");
    expect(thumb.style.height).toBe("48px");

    const bgDiv = thumb.querySelector("div");
    expect(bgDiv).not.toBeNull();
    expect(bgDiv!.style.width).toBe("64px"); // imageW*scale = 800*0.08 = 64
  });

  it("degenerate slice does not produce NaN", () => {
    const degenerateSlice: Slice[] = [
      { id: "1", name: "zero", x: 0, y: 0, w: 0, h: 0 },
    ];

    render(
      <PreviewGallery slices={degenerateSlice} imageMeta={mockImageMeta} />
    );

    const thumb = screen.getByTestId("preview-thumb");
    // maxDim = max(0,0,1) = 1; scale = min(1, 64/1) = 1;
    // container = max(1, round(0*1)) x max(1, round(0*1)) = 1 x 1
    // parseFloat used because style.width is a CSS string like "1px";
    // Number("1px") is NaN, but parseFloat("1px") is 1 — the intent is to
    // verify the Math.max(1,...) clamp produces a finite 1px size, not NaN/Infinity.
    expect(parseFloat(thumb.style.width)).not.toBeNaN();
    expect(parseFloat(thumb.style.height)).not.toBeNaN();
    expect(parseFloat(thumb.style.width)).toBe(1);
    expect(parseFloat(thumb.style.height)).toBe(1);
  });
});
