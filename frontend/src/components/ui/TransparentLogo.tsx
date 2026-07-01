import React, { useRef, useEffect } from 'react';

interface TransparentLogoProps {
  src: string;
  className?: string;
}

export const TransparentLogo: React.FC<TransparentLogoProps> = ({ src, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        // If the pixel is very bright (close to white), make it transparent
        if (data[i] > 220 && data[i+1] > 220 && data[i+2] > 220) {
          data[i+3] = 0; 
        }
      }
      ctx.putImageData(imgData, 0, 0);
    };
  }, [src]);

  return <canvas ref={canvasRef} className={className} />;
};
