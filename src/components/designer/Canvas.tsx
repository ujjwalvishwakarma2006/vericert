"use client";

import { useDrop, DropTargetMonitor } from 'react-dnd';
import { ItemTypes, Component as ComponentType, DragItem, CanvasSettings } from '@/lib/types';
import DraggableComponent from './DraggableComponent';
import { FC, useCallback, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

interface CanvasProps {
  components: ComponentType[];
  setComponents: React.Dispatch<React.SetStateAction<ComponentType[]>>;
  canvasSettings: CanvasSettings;
}

const Canvas: FC<CanvasProps> = ({ components, setComponents, canvasSettings }) => {
  const [scale, setScale] = useState(1);
  
  // Provide default canvas settings if undefined
  const settings = canvasSettings || {
    width: 850,
    height: 680,
    background: 'linear-gradient(135deg, #daa520 0%, #ffd700 50%, #daa520 100%)'
  };

  // Calculate scale to fit canvas in viewport
  useEffect(() => {
    const calculateScale = () => {
      const containerWidth = window.innerWidth - 700; // Account for sidebars + padding
      const containerHeight = window.innerHeight - 300; // Account for header and padding
      
      // Add extra space for borders and padding
      const totalWidth = settings.width + 80; // 40px padding on each side
      const totalHeight = settings.height + 80; // 40px padding on top/bottom
      
      const scaleX = containerWidth / totalWidth;
      const scaleY = containerHeight / totalHeight;
      
      const newScale = Math.min(1, scaleX, scaleY, 0.9); // Max 90% of container
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    
    return () => window.removeEventListener('resize', calculateScale);
  }, [settings.width, settings.height]);

  const moveComponent = useCallback((id: string, left: number, top: number) => {
    setComponents((prev) =>
      prev.map((comp) => (comp.id === id ? { ...comp, left, top } : comp))
    );
  }, [setComponents]);

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.COMPONENT,
    drop(item: DragItem, monitor: DropTargetMonitor<DragItem, void>) {
      const clientOffset = monitor.getClientOffset();
      const sourceClientOffset = monitor.getSourceClientOffset();
      
      if (!clientOffset) return;
      
      // Get canvas bounds
      const canvasElement = document.getElementById('certificate-canvas');
      if (!canvasElement) return;
      
      const canvasRect = canvasElement.getBoundingClientRect();
      const left = Math.round((clientOffset.x - canvasRect.left) / scale);
      const top = Math.round((clientOffset.y - canvasRect.top) / scale);
      
      if (!item.id) {
        // New item being dropped from sidebar
        const newComponent: ComponentType = {
          id: nanoid(),
          type: item.type,
          text: getDefaultText(item.type),
          top: Math.max(0, top - 20),
          left: Math.max(0, left - 50),
          fontSize: 24,
          fontWeight: 'normal',
        };
        setComponents((prev) => [...prev, newComponent]);
      } else {
        // Existing item being moved
        const delta = monitor.getDifferenceFromInitialOffset();
        if (delta) {
          const newLeft = Math.round(item.left + delta.x / scale);
          const newTop = Math.round(item.top + delta.y / scale);
          moveComponent(item.id, Math.max(0, newLeft), Math.max(0, newTop));
        }
      }
      return undefined;
    },
  }), [moveComponent, setComponents, scale]);

  const getDefaultText = (type: string): string => {
    switch (type) {
      case 'title':
        return 'Certificate of Excellence';
      case 'recipient':
        return '[Recipient Name]';
      case 'issuer':
        return 'Issued by [Organization Name]';
      case 'date':
        return `Awarded on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
      case 'text':
        return 'Custom Text Element';
      default:
        return `[${type.charAt(0).toUpperCase() + type.slice(1)}]`;
    }
  };

  const canvasStyle = {
    width: `${settings.width}px`,
    height: `${settings.height}px`,
    background: settings.background,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minWidth: `${settings.width}px`,
    minHeight: `${settings.height}px`,
    maxWidth: `${settings.width}px`,
    maxHeight: `${settings.height}px`,
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
  };

  return (
    <div className="flex justify-center items-center w-full overflow-visible p-8" style={{ minHeight: `${(settings.height + 80) * scale + 40}px` }}>
      <div className="relative">
        <div
          id="certificate-canvas"
          ref={drop as any}
          className="relative border-8 border-double border-amber-600 shadow-2xl bg-white"
          style={canvasStyle}
        >
          {/* Certificate Border Design */}
          <div className="absolute inset-4 border-2 border-amber-500 opacity-30"></div>
          <div className="absolute inset-8 border border-amber-400 opacity-20"></div>
          
          {/* Decorative Corner Elements */}
          <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-amber-600 opacity-40"></div>
          <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-amber-600 opacity-40"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-amber-600 opacity-40"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-amber-600 opacity-40"></div>
          
          {/* Certificate Content */}
          {components.map((component) => (
            <DraggableComponent key={component.id} component={component} />
          ))}
          
          {components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-lg font-medium text-gray-600 mb-2">Start Building Your Certificate</p>
                <p className="text-sm text-gray-500 max-w-sm">
                  Drag components from the left sidebar to design your certificate. Add titles, names, dates, and custom text.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Scale indicator */}
        {scale < 1 && (
          <div className="absolute -top-6 right-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {Math.round(scale * 100)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
