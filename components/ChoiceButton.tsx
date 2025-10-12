import React from 'react';
import { cn } from './ui/utils';

interface ChoiceButtonProps {
  children: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'compact';
}

export function ChoiceButton({ 
  children, 
  selected = false, 
  disabled = false, 
  onClick,
  className,
  variant = 'default'
}: ChoiceButtonProps) {
  const baseClasses = cn(
    // Base styling
    "inline-flex items-center justify-center rounded-full transition-all duration-200 ease-out",
    "bg-white border border-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105",
    "backdrop-blur-sm font-medium cursor-pointer whitespace-nowrap",
    
    // Size variants - more compact default sizing
    variant === 'default' && "px-3 py-2 text-sm",
    variant === 'compact' && "px-2 py-1.5 text-xs",
    
    // States
    selected && "bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-transparent shadow-blue-200/50",
    !selected && "text-slate-600 hover:border-blue-300 hover:text-blue-600",
    disabled && "opacity-50 cursor-not-allowed transform-none shadow-sm hover:shadow-sm hover:scale-100 hover:border-gray-200 hover:text-slate-600",
    
    // Enhanced shadows for selected state
    selected && "shadow-[0_8px_30px_rgb(59,130,246,0.3)]",
    
    className
  );

  return (
    <button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      {children}
    </button>
  );
}