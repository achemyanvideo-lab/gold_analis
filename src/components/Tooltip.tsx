import { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowStyles = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#1f1f23] border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#1f1f23] border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#1f1f23] border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#1f1f23] border-y-transparent border-l-transparent',
  };

  return (
    <div className="tooltip-wrapper">
      {children}
      <div className={`tooltip-content absolute ${positionStyles[position]} ${position === 'top' ? '' : ''}`}
        style={{
          visibility: 'hidden',
          opacity: 0,
          transition: 'opacity 0.15s, visibility 0.15s',
        }}
      >
        {content}
        <div className={`absolute w-0 h-0 border-[5px] ${arrowStyles[position]}`} />
      </div>
    </div>
  );
}
