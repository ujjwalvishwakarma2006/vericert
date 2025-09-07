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
    width: 850,
    height: 680,
    background: 'linear-gradient(135deg, #daa520 0%, #ffd700 50%, #daa520 100%)'
  };

  return (
    <div className="p-6">
      {/* Certificate Components */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Components
        </h3>
        <div className="space-y-2">
          <SidebarItem name="Certificate Title" type="title" />
          <SidebarItem name="Recipient Name" type="recipient" />
          <SidebarItem name="Issuer Name" type="issuer" />
          <SidebarItem name="Date" type="date" />
          <SidebarItem name="Custom Text" type="text" />
        </div>
      </div>
      
      {/* Canvas Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Size
            </label>
            <select
              value={`${settings.width}x${settings.height}`}
              onChange={(e) => {
                const [width, height] = e.target.value.split('x').map(Number);
                setCanvasSettings({ ...settings, width, height });
              }}
              className="w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            >
              {CANVAS_SIZES.map((size) => (
                <option key={size.name} value={`${size.width}x${size.height}`}>
                  {size.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Style
            </label>
            <select
              value={settings.background}
              onChange={(e) => {
                setCanvasSettings({ ...settings, background: e.target.value });
              }}
              className="w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
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
    </div>
  );
};

export default Sidebar;
