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

  const getIcon = (type: string) => {
    switch (type) {
      case 'title':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14l-2-16" />
          </svg>
        );
      case 'recipient':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'issuer':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'date':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        );
    }
  };

  return (
    <div
      ref={drag as any}
      className={`
        flex items-center space-x-3 p-3 rounded-lg border-2 border-dashed border-gray-300 
        cursor-move transition-all duration-200 hover:border-blue-400 hover:bg-blue-50
        ${isDragging ? 'opacity-50 border-blue-400 bg-blue-50' : 'bg-white'}
      `}
    >
      <div className="text-gray-600">
        {getIcon(type)}
      </div>
      <span className="text-sm font-medium text-gray-700">{name}</span>
    </div>
  );
};

export default SidebarItem;
