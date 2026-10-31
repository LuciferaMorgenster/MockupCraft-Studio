export type ProductCategory = 'drinkware' | 'apparel' | 'accessories' | 'stationery';

export interface ProductConfig {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  defaultColor: string;
  availableColors: { name: string; hex: string }[];
  aspectRatio: number; // width / height
  printArea: {
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    width: number; // percentage 0-100
    height: number; // percentage 0-100
  };
  warpType: 'cylinder' | 'flat' | 'curved' | 'fabric';
  curvedDepth?: number;
}

export interface LogoTransform {
  x: number; // offset from center (-50 to 50)
  y: number; // offset from center (-50 to 50)
  scale: number; // 0.1 to 2.5
  rotation: number; // degrees -180 to 180
  opacity: number; // 0.1 to 1.0
  blendMode: 'multiply' | 'source-over' | 'overlay' | 'screen' | 'soft-light';
  effect: 'none' | 'vintage' | 'embroidery' | 'gold-foil' | 'embossed' | 'white-ink' | 'black-ink';
  invertColor: boolean;
}

export interface SampleLogo {
  id: string;
  name: string;
  category: string;
  svgDataUrl: string;
}

export interface AiGeneratedMockup {
  id: string;
  url: string;
  prompt: string;
  model: string;
  size?: '1K' | '2K' | '4K';
  aspectRatio?: string;
  timestamp: number;
  type: 'generation' | 'edit';
}
