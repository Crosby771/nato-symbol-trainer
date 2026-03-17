import React, { useEffect, useRef } from 'react';
import ms from 'milsymbol';

interface SymbolImageProps {
  sidc: string;
  size?: number;
  className?: string;
  options?: any;
}

export const SymbolImage: React.FC<SymbolImageProps> = ({ 
  sidc, 
  size = 40, 
  className = '',
  options = {} 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Clear previous content
      containerRef.current.innerHTML = '';
      
      try {
        const symbol = new ms.Symbol(sidc, {
          size,
          ...options
        });
        
        const svg = symbol.asSVG();
        containerRef.current.innerHTML = svg;
      } catch (error) {
        console.error('Error rendering milsymbol:', error);
        containerRef.current.innerText = '⚠️';
      }
    }
  }, [sidc, size, options]);

  return (
    <div 
      ref={containerRef} 
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    />
  );
};
