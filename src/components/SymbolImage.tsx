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
      try {
        // Clear previous content
        containerRef.current.innerHTML = '';
        
        const symbol = new ms.Symbol(sidc, {
          size,
          ...options
        });
        
        if (!symbol.isValid()) {
          console.warn(`Invalid SIDC in SymbolImage: ${sidc}`);
        }

        // Use asSVG() and convert to data URL for maximum reliability
        const svg = symbol.asSVG();
        const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
        
        const img = document.createElement('img');
        img.src = dataUrl;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.referrerPolicy = 'no-referrer';
        containerRef.current.appendChild(img);
      } catch (error) {
        console.error('Error rendering milsymbol:', error);
        containerRef.current.innerText = '⚠️';
      }
    }
  }, [sidc, size, options]);

  return (
    <div 
      ref={containerRef} 
      className={`inline-flex items-center justify-center overflow-visible ${className}`}
      style={{ 
        width: size ? `${size}px` : '100%', 
        height: size ? `${size}px` : '100%',
        maxWidth: '100%',
        maxHeight: '100%'
      }}
    />
  );
};
