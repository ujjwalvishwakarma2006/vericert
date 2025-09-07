"use client";

import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Sidebar from './designer/Sidebar';
import Canvas from './designer/Canvas';
import { Component, CanvasSettings } from '@/lib/types';
import CertificateForm from './CertificateForm';

const CertificateDesigner = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings>({
    width: 850,
    height: 680,
    background: 'linear-gradient(135deg, #daa520 0%, #ffd700 50%, #daa520 100%)',
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-3xl font-bold text-gray-900">VeriCert</h1>
                  <p className="text-sm text-gray-500 mt-1">Certificate Designer & Issuer</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Ready to Design</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Components Sidebar - Left */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-fit sticky top-8">
                <Sidebar canvasSettings={canvasSettings} setCanvasSettings={setCanvasSettings} />
              </div>
            </div>

            {/* Canvas Area - Center - Wider */}
            <div className="xl:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Certificate Preview</h2>
                  <div className="text-sm text-gray-500">
                    {canvasSettings.width} × {canvasSettings.height}px
                  </div>
                </div>
                <Canvas 
                  components={components} 
                  setComponents={setComponents}
                  canvasSettings={canvasSettings}
                />
              </div>
            </div>

            {/* Options & Issue Form - Right */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-fit sticky top-8">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Issue Certificates</h3>
                  <p className="text-sm text-gray-500 mt-1">Configure and issue your certificates</p>
                </div>
                <div className="p-4">
                  <CertificateForm components={components} canvasSettings={canvasSettings} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default CertificateDesigner;
