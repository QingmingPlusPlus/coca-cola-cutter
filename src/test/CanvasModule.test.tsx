import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CanvasModule } from '../components/canvas/CanvasModule';
import { ImageMeta, Slice } from '../types';

const mockImageMeta: ImageMeta = {
  name: 'test-image.jpg',
  width: 800,
  height: 600,
  size: 102400,
  type: 'image/jpeg',
  url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
};

const mockSlices: Slice[] = [
  { id: '1', x: 100, y: 100, w: 200, h: 150 },
  { id: '2', x: 400, y: 300, w: 100, h: 100 },
];

describe('CanvasModule', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0,
      top: 0,
      width: 800,
      height: 600,
      x: 0,
      y: 0,
    });
  });

  it('renders without image meta and shows placeholder', () => {
    render(
      <CanvasModule
        imageMeta={null}
        slices={[]}
      />
    );
    expect(screen.getByText('No image loaded')).toBeInTheDocument();
  });

  it('renders with image meta and displays image', () => {
    render(
      <CanvasModule
        imageMeta={mockImageMeta}
        slices={[]}
      />
    );
    const img = screen.getByAltText('Source');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockImageMeta.url);
  });

  it('renders existing slices correctly', () => {
    render(
      <CanvasModule
        imageMeta={mockImageMeta}
        slices={mockSlices}
      />
    );
    expect(screen.getByTestId('slice-1')).toBeInTheDocument();
    expect(screen.getByTestId('slice-2')).toBeInTheDocument();
  });

  it('does not crash when rendered without onAddSlice callback', () => {
    render(
      <CanvasModule
        imageMeta={mockImageMeta}
        slices={[]}
      />
    );
    expect(screen.getByTestId('canvas-container')).toBeInTheDocument();
  });

  it('handles mouse events gracefully without image', () => {
    render(
      <CanvasModule
        imageMeta={null}
        slices={[]}
      />
    );
    expect(screen.getByText('No image loaded')).toBeInTheDocument();
  });

  describe('Slice mode', () => {
    it('creates slice on mouse drag in slice mode', () => {
      const onAddSlice = vi.fn();
      render(
        <CanvasModule
          imageMeta={mockImageMeta}
          slices={[]}
          mode="slice"
          onAddSlice={onAddSlice}
        />
      );
      const container = screen.getByTestId('canvas-container');

      fireEvent.mouseDown(container, { clientX: 10, clientY: 10 });
      fireEvent.mouseMove(container, { clientX: 50, clientY: 50 });
      fireEvent.mouseUp(container);

      expect(onAddSlice).toHaveBeenCalledWith({ x: 10, y: 10, w: 40, h: 40 });
    });

    it('does not create slice when drag is too small', () => {
      const onAddSlice = vi.fn();
      render(
        <CanvasModule
          imageMeta={mockImageMeta}
          slices={[]}
          mode="slice"
          onAddSlice={onAddSlice}
        />
      );
      const container = screen.getByTestId('canvas-container');

      fireEvent.mouseDown(container, { clientX: 10, clientY: 10 });
      fireEvent.mouseMove(container, { clientX: 11, clientY: 11 });
      fireEvent.mouseUp(container);

      expect(onAddSlice).not.toHaveBeenCalled();
    });
  });

  describe('Vertical guide mode', () => {
    it('creates vertical guide line on click', () => {
      const onAddGuideLine = vi.fn();
      render(
        <CanvasModule
          imageMeta={mockImageMeta}
          slices={[]}
          mode="verticalGuide"
          onAddGuideLine={onAddGuideLine}
        />
      );
      const container = screen.getByTestId('canvas-container');

      fireEvent.mouseDown(container, { clientX: 150, clientY: 200 });

      expect(onAddGuideLine).toHaveBeenCalledWith({ orientation: 'vertical', position: 150 });
    });

    it('shows preview line on mouse move', () => {
      render(
        <CanvasModule
          imageMeta={mockImageMeta}
          slices={[]}
          mode="verticalGuide"
        />
      );
      const container = screen.getByTestId('canvas-container');

      fireEvent.mouseMove(container, { clientX: 300, clientY: 100 });

      expect(screen.getByTestId('guide-preview')).toBeInTheDocument();
    });

    it('clears preview on mouse leave', () => {
      render(
        <CanvasModule
          imageMeta={mockImageMeta}
          slices={[]}
          mode="verticalGuide"
        />
      );
      const container = screen.getByTestId('canvas-container');

      fireEvent.mouseMove(container, { clientX: 300, clientY: 100 });
      expect(screen.getByTestId('guide-preview')).toBeInTheDocument();

      fireEvent.mouseLeave(container);
      expect(screen.queryByTestId('guide-preview')).not.toBeInTheDocument();
    });

    it('does not call onAddSlice in vertical guide mode', () => {
      const onAddSlice = vi.fn();
      render(
        <CanvasModule
          imageMeta={mockImageMeta}
          slices={[]}
          mode="verticalGuide"
          onAddSlice={onAddSlice}
        />
      );
      const container = screen.getByTestId('canvas-container');

      fireEvent.mouseDown(container, { clientX: 10, clientY: 10 });
      fireEvent.mouseMove(container, { clientX: 50, clientY: 50 });
      fireEvent.mouseUp(container);

      expect(onAddSlice).not.toHaveBeenCalled();
    });
  });

  describe('Horizontal guide mode', () => {
    it('creates horizontal guide line on click', () => {
      const onAddGuideLine = vi.fn();
      render(
        <CanvasModule
          imageMeta={mockImageMeta}
          slices={[]}
          mode="horizontalGuide"
          onAddGuideLine={onAddGuideLine}
        />
      );
      const container = screen.getByTestId('canvas-container');

      fireEvent.mouseDown(container, { clientX: 150, clientY: 200 });

      expect(onAddGuideLine).toHaveBeenCalledWith({ orientation: 'horizontal', position: 200 });
    });

    it('shows preview line on mouse move', () => {
      render(
        <CanvasModule
          imageMeta={mockImageMeta}
          slices={[]}
          mode="horizontalGuide"
        />
      );
      const container = screen.getByTestId('canvas-container');

      fireEvent.mouseMove(container, { clientX: 300, clientY: 100 });

      expect(screen.getByTestId('guide-preview')).toBeInTheDocument();
    });
  });

  describe('Cursor styles', () => {
    it('uses cursor-crosshair in slice mode', () => {
      render(
        <CanvasModule
          imageMeta={mockImageMeta}
          slices={[]}
          mode="slice"
        />
      );
      const container = screen.getByTestId('canvas-container');
      expect(container).toHaveClass('cursor-crosshair');
    });

    it('uses cursor-col-resize in vertical guide mode', () => {
      render(
        <CanvasModule
          imageMeta={mockImageMeta}
          slices={[]}
          mode="verticalGuide"
        />
      );
      const container = screen.getByTestId('canvas-container');
      expect(container).toHaveClass('cursor-col-resize');
    });

    it('uses cursor-row-resize in horizontal guide mode', () => {
      render(
        <CanvasModule
          imageMeta={mockImageMeta}
          slices={[]}
          mode="horizontalGuide"
        />
      );
      const container = screen.getByTestId('canvas-container');
      expect(container).toHaveClass('cursor-row-resize');
    });
  });

  describe('Guide lines rendering', () => {
    it('renders guide lines', () => {
      render(
        <CanvasModule
          imageMeta={mockImageMeta}
          slices={[]}
          guideLines={[
            { id: 'g1', orientation: 'vertical', position: 150 },
            { id: 'g2', orientation: 'horizontal', position: 200 },
          ]}
        />
      );
      expect(screen.getByTestId('guide-line-g1')).toBeInTheDocument();
      expect(screen.getByTestId('guide-line-g2')).toBeInTheDocument();
    });

    it('renders selected guide line with different style', () => {
      render(
        <CanvasModule
          imageMeta={mockImageMeta}
          slices={[]}
          guideLines={[
            { id: 'g1', orientation: 'vertical', position: 150 },
          ]}
          selectedItem={{ type: 'guideLine', id: 'g1' }}
        />
      );
      const line = screen.getByTestId('guide-line-g1');
      expect(line).toHaveStyle({ backgroundColor: 'rgba(0, 255, 230, 1.0)' });
    });
  });
});
