export interface Slice {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface ImageMeta {
    name: string;
    width: number;
    height: number;
    size: number;
    type: string;
    url: string;
}

export type CanvasMode = 'slice' | 'verticalGuide' | 'horizontalGuide';

export interface GuideLine {
    id: string;
    orientation: 'vertical' | 'horizontal';
    position: number;
}
