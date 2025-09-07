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

  const style: CSSProperties = {
    position: 'absolute',
    left: component.left,
    top: component.top,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
    padding: '8px 12px',
    border: '2px solid #3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '4px',
    fontSize: `${component.fontSize}px`,
    fontWeight: component.fontWeight,
    color: '#1f2937',
    minWidth: '100px',
    textAlign: 'center',
    userSelect: 'none',
  };

  return (
    <div ref={drag as any} style={style}>
      {component.text}
    </div>
  );
};

export default DraggableComponent;
