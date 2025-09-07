"use client";

import { useDrag } from 'react-dnd';
import { ItemTypes } from '@/lib/types';
import { FC } from 'react';

interface SidebarItemProps {
  name: string;
  type: string;
}

const SidebarItem: FC<SidebarItemProps> = ({ name, type }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,
    item: { type, top: 0, left: 0 },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as any}
      className="p-2 mb-2 bg-gray-700 text-white rounded cursor-move hover:bg-gray-600"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {name}
    </div>
  );
};

export default SidebarItem;
