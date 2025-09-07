"use client";

import SidebarItem from './SidebarItem';
import { CANVAS_SIZES, BACKGROUND_OPTIONS, CanvasSettings } from '@/lib/types';

interface SidebarProps {
  canvasSettings: CanvasSettings;
  setCanvasSettings: (settings: CanvasSettings) => void;
}

const Sidebar = ({ canvasSettings, setCanvasSettings }: SidebarProps) => {
  // Provide default values if canvasSettings is undefined
  const settings = canvasSettings || {
    width: 1200,
    height: 850,
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  };

  return (
    <div className="w-64 bg-gray-800 p-4 overflow-y-auto">
      <h3 className="text-lg font-bold text-white mb-4">Components</h3>
      <SidebarItem name="Certificate Title" type="title" />
      <SidebarItem name="Recipient Name" type="recipient" />
      <SidebarItem name="Issuer Name" type="issuer" />
      <SidebarItem name="Date" type="date" />
      <SidebarItem name="Custom Text" type="text" />
      
      <div className="mt-8">
        <h3 className="text-lg font-bold text-white mb-4">Canvas Settings</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Canvas Size
          </label>
          <select
            value={`${settings.width}x${settings.height}`}
            onChange={(e) => {
              const [width, height] = e.target.value.split('x').map(Number);
              setCanvasSettings({ ...settings, width, height });
            }}
            className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm p-2"
          >
            {CANVAS_SIZES.map((size) => (
              <option key={size.name} value={`${size.width}x${size.height}`}>
                {size.name} ({size.width}x{size.height})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Background
          </label>
          <select
            value={settings.background}
            onChange={(e) => {
              setCanvasSettings({ ...settings, background: e.target.value });
            }}
            className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm p-2"
          >
            {BACKGROUND_OPTIONS.map((bg) => (
              <option key={bg.name} value={bg.value}>
                {bg.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
