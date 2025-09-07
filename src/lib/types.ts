export const ItemTypes = {
  COMPONENT: 'component',
};

export interface Component {
  id: string;
  type: string;
  text: string;
  top: number;
  left: number;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
}

export interface DragItem {
  type: string;
  id?: string;
  top: number;
  left: number;
}

export interface CanvasSettings {
  width: number;
  height: number;
  background: string;
}

export const CANVAS_SIZES = [
  { name: 'Certificate Standard (8.5×11)', width: 850, height: 680 },
  { name: 'Certificate Landscape (11×8.5)', width: 1100, height: 680 },
  { name: 'Certificate Large (16×12)', width: 1200, height: 900 },
  { name: 'Certificate Square (10×10)', width: 800, height: 800 },
  { name: 'Award Certificate (14×11)', width: 1120, height: 880 },
  { name: 'Diploma Size (17×14)', width: 1360, height: 1120 },
  { name: 'A4 Landscape', width: 1200, height: 850 },
  { name: 'A4 Portrait', width: 850, height: 1200 },
  { name: 'Letter Landscape', width: 1100, height: 850 },
  { name: 'Letter Portrait', width: 850, height: 1100 },
];

export const BACKGROUND_OPTIONS = [
  { name: 'Classic White', value: '#ffffff' },
  { name: 'Ivory Cream', value: '#fefcf3' },
  { name: 'Pearl Gray', value: '#f8f9fa' },
  { name: 'Soft Blue', value: '#e3f2fd' },
  { name: 'Royal Blue Gradient', value: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' },
  { name: 'Gold Elegance', value: 'linear-gradient(135deg, #daa520 0%, #ffd700 50%, #daa520 100%)' },
  { name: 'Emerald Professional', value: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
  { name: 'Certificate Border', value: 'radial-gradient(circle at center, #ffffff 60%, #f0f0f0 100%)' },
  { name: 'Vintage Parchment', value: 'linear-gradient(45deg, #f4f1de 0%, #e9c46a 100%)' },
];
