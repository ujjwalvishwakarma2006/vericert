"use client";

import { useDrag } from 'react-dnd';
import { ItemTypes, Component as ComponentType } from '@/lib/types';
import { FC, CSSProperties } from 'react';

interface DraggableComponentProps {
  component: ComponentType;
}

const DraggableComponent: FC<DraggableComponentProps> = ({ component }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,
    item: { id: component.id, left: component.left, top: component.top, type: ItemTypes.COMPONENT },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getStyleForType = (type: string): CSSProperties => {
    const baseStyle: CSSProperties = {
      position: 'absolute',
      left: component.left,
      top: component.top,
      opacity: isDragging ? 0.5 : 1,
      cursor: 'move',
      userSelect: 'none',
      textAlign: 'center',
      lineHeight: '1.2',
    };

    switch (type) {
      case 'title':
        return {
          ...baseStyle,
          fontSize: `${component.fontSize || 36}px`,
          fontWeight: 'bold',
          color: '#1a202c',
          fontFamily: 'serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          border: '2px dashed #d69e2e',
          backgroundColor: 'rgba(237, 137, 54, 0.1)',
          padding: '12px 24px',
          borderRadius: '8px',
          minWidth: '300px',
        };
      case 'recipient':
        return {
          ...baseStyle,
          fontSize: `${component.fontSize || 28}px`,
          fontWeight: 'bold',
          color: '#2d3748',
          fontFamily: 'serif',
          textDecoration: 'underline',
          textDecorationColor: '#e53e3e',
          border: '2px dashed #e53e3e',
          backgroundColor: 'rgba(229, 62, 62, 0.1)',
          padding: '10px 20px',
          borderRadius: '6px',
          minWidth: '250px',
        };
      case 'issuer':
        return {
          ...baseStyle,
          fontSize: `${component.fontSize || 18}px`,
          fontWeight: '600',
          color: '#4a5568',
          fontFamily: 'sans-serif',
          border: '2px dashed #38a169',
          backgroundColor: 'rgba(56, 161, 105, 0.1)',
          padding: '8px 16px',
          borderRadius: '4px',
          minWidth: '200px',
        };
      case 'date':
        return {
          ...baseStyle,
          fontSize: `${component.fontSize || 16}px`,
          fontWeight: 'normal',
          color: '#718096',
          fontFamily: 'sans-serif',
          fontStyle: 'italic',
          border: '2px dashed #805ad5',
          backgroundColor: 'rgba(128, 90, 213, 0.1)',
          padding: '6px 12px',
          borderRadius: '4px',
          minWidth: '150px',
        };
      default:
        return {
          ...baseStyle,
          fontSize: `${component.fontSize || 16}px`,
          fontWeight: component.fontWeight || 'normal',
          color: '#4a5568',
          border: '2px dashed #3182ce',
          backgroundColor: 'rgba(49, 130, 206, 0.1)',
          padding: '8px 12px',
          borderRadius: '4px',
          minWidth: '120px',
        };
    }
  };

  return (
    <div ref={drag as any} style={getStyleForType(component.type)}>
      {component.text}
    </div>
  );
};

export default DraggableComponent;
