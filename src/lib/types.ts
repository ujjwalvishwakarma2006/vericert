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
  { name: 'A4 Landscape', width: 1200, height: 850 },
  { name: 'A4 Portrait', width: 850, height: 1200 },
  { name: 'Letter Landscape', width: 1100, height: 850 },
  { name: 'Letter Portrait', width: 850, height: 1100 },
  { name: 'Custom', width: 1000, height: 700 },
];

export const BACKGROUND_OPTIONS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Light Gray', value: '#f8f9fa' },
  { name: 'Cream', value: '#fefcf3' },
  { name: 'Light Blue', value: '#e3f2fd' },
  { name: 'Gradient Blue', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Gradient Gold', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Certificate Pattern', value: 'url("https://www.transparenttextures.com/patterns/asfalt-light.png"), linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
];
