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
    width: 1200,
    height: 850,
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar canvasSettings={canvasSettings} setCanvasSettings={setCanvasSettings} />
        <div className="flex-1 flex flex-col">
          <header className="p-4 bg-gray-800 border-b border-gray-700">
            <h1 className="text-2xl font-bold">Certificate Designer</h1>
          </header>
          <main className="flex-1">
            <Canvas 
              components={components} 
              setComponents={setComponents}
              canvasSettings={canvasSettings}
            />
          </main>
        </div>
        <div className="w-96 bg-gray-800 p-4 overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Options & Issue</h3>
            <CertificateForm components={components} canvasSettings={canvasSettings} />
        </div>
      </div>
    </DndProvider>
  );
};

export default CertificateDesigner;
