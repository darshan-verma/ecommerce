'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageZoomProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageZoom({ src, alt, isOpen, onClose }: ImageZoomProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.5, 1));
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    
    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;
    
    if (imageRef.current) {
      const { width, height } = imageRef.current.getBoundingClientRect();
      const maxX = (width * (scale - 1)) / 2;
      const maxY = (height * (scale - 1)) / 2;
      
      setPosition({
        x: Math.max(Math.min(newX, maxX), -maxX),
        y: Math.max(Math.min(newY, maxY), -maxY),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) => Math.max(1, Math.min(prev + delta, 3)));
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onWheel={handleWheel}
    >
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={zoomIn}
          className="bg-black/50 hover:bg-black/70 text-white border-white/20"
          disabled={scale >= 3}
        >
          <ZoomIn className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={zoomOut}
          className="bg-black/50 hover:bg-black/70 text-white border-white/20"
          disabled={scale <= 1}
        >
          <ZoomOut className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={resetZoom}
          className="bg-black/50 hover:bg-black/70 text-white border-white/20"
          disabled={scale === 1}
        >
          <Move className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onClose}
          className="bg-black/50 hover:bg-black/70 text-white border-white/20"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div 
        ref={imageRef}
        className="relative max-w-full max-h-[90vh] overflow-hidden"
        style={{
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
          transform: `scale(${scale})`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="w-full h-full bg-gray-200">
          {/* Image will be rendered here */}
        </div>
      </div>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {`${Math.round(scale * 100)}%`} • Use mouse wheel to zoom, drag to pan • Press ESC to close
      </div>
    </div>
  );
}
