import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
