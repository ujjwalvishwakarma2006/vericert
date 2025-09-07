"use client";

import { useDrop, DropTargetMonitor } from 'react-dnd';
import { ItemTypes, Component as ComponentType, DragItem, CanvasSettings } from '@/lib/types';
import DraggableComponent from './DraggableComponent';
import { FC, useCallback } from 'react';
import { nanoid } from 'nanoid';

interface CanvasProps {
  components: ComponentType[];
  setComponents: React.Dispatch<React.SetStateAction<ComponentType[]>>;
  canvasSettings: CanvasSettings;
}

const Canvas: FC<CanvasProps> = ({ components, setComponents, canvasSettings }) => {
  // Provide default canvas settings if undefined
  const settings = canvasSettings || {
    width: 1200,
    height: 850,
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  };

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
      const left = Math.round(clientOffset.x - canvasRect.left);
      const top = Math.round(clientOffset.y - canvasRect.top);
      
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
          const newLeft = Math.round(item.left + delta.x);
          const newTop = Math.round(item.top + delta.y);
          moveComponent(item.id, Math.max(0, newLeft), Math.max(0, newTop));
        }
      }
      return undefined;
    },
  }), [moveComponent, setComponents]);

  const getDefaultText = (type: string): string => {
    switch (type) {
      case 'title':
        return 'Certificate of Achievement';
      case 'recipient':
        return '[Recipient Name]';
      case 'issuer':
        return 'Issued by: [Organization]';
      case 'date':
        return `Date: ${new Date().toLocaleDateString()}`;
      case 'text':
        return 'Custom Text';
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
  };

  return (
    <div className="flex-1 overflow-auto p-4 bg-gray-100">
      <div
        id="certificate-canvas"
        ref={drop as any}
        className="relative border-2 border-dashed border-gray-400 mx-auto shadow-lg"
        style={canvasStyle}
      >
        {components.map((component) => (
          <DraggableComponent key={component.id} component={component} />
        ))}
        {components.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg">
            Drag components here to design your certificate
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
