"use client";

import { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { useGesture } from '@use-gesture/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './dialog';
import { Button } from './button';

type ImageItem = string | { src: string; alt?: string };

type DomeGalleryProps = {
  images?: ImageItem[];
  fit?: number;
  fitBasis?: 'auto' | 'min' | 'max' | 'width' | 'height';
  minRadius?: number;
  maxRadius?: number;
  padFactor?: number;
  overlayBlurColor?: string;
  maxVerticalRotationDeg?: number;
  dragSensitivity?: number;
  enlargeTransitionMs?: number;
  segments?: number;
  dragDampening?: number;
  openedImageWidth?: string;
  openedImageHeight?: string;
  imageBorderRadius?: string;
  openedImageBorderRadius?: string;
  grayscale?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

type ItemDef = {
  src: string;
  alt: string;
  x: number;
  y: number;
  sizeX: number;
  sizeY: number;
};

// University logos with details
const UNIVERSITY_DATA = [
  { src: '/uniLogos/uniOfSydney.png', name: 'University of Sydney', country: 'Australia', rank: '#3 in Australia', description: 'One of Australia\'s leading universities with excellent research programs and global recognition.' },
  { src: '/uniLogos/uniOfMelbourne.png', name: 'University of Melbourne', country: 'Australia', rank: '#1 in Australia', description: 'Prestigious university known for its academic excellence and vibrant campus life.' },
  { src: '/uniLogos/monashUni.png', name: 'Monash University', country: 'Australia', rank: '#6 in Australia', description: 'Innovative university with strong industry connections and diverse programs.' },
  { src: '/uniLogos/unsw.png', name: 'UNSW Sydney', country: 'Australia', rank: '#4 in Australia', description: 'Leading research university with cutting-edge facilities and programs.' },
  { src: '/uniLogos/uniOfQueensland.png', name: 'University of Queensland', country: 'Australia', rank: '#5 in Australia', description: 'Research-intensive university with beautiful campus and excellent student support.' },
  { src: '/uniLogos/uniOfAdelaide.png', name: 'University of Adelaide', country: 'Australia', rank: '#8 in Australia', description: 'Historic university with strong research focus and beautiful campus.' },
  { src: '/uniLogos/UTS.png', name: 'University of Technology Sydney', country: 'Australia', rank: '#9 in Australia', description: 'Modern, innovative university with strong industry partnerships.' },
  { src: '/uniLogos/griffithUni.png', name: 'Griffith University', country: 'Australia', rank: '#19 in Australia', description: 'Comprehensive university with diverse programs and multicultural environment.' }
];

// University and education related images
const DEFAULT_IMAGES: ImageItem[] = UNIVERSITY_DATA.map(uni => ({ src: uni.src, alt: uni.name }));

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 35,
  autoRotateSpeed: 0.2
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const normalizeAngle = (d: number) => ((d % 360) + 360) % 360;
const wrapAngleSigned = (deg: number) => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};

function buildItems(pool: ImageItem[], seg: number): ItemDef[] {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const totalSlots = coords.length;
  if (pool.length === 0) {
    return coords.map(c => ({ ...c, src: '', alt: '' }));
  }

  const normalizedImages = pool.map(image => {
    if (typeof image === 'string') {
      return { src: image, alt: '' };
    }
    return { src: image.src || '', alt: image.alt || '' };
  });

  const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);

  return coords.map((c, i) => ({
    ...c,
    src: usedImages[i].src,
    alt: usedImages[i].alt
  }));
}

function computeItemBaseRotation(offsetX: number, offsetY: number, sizeX: number, sizeY: number, segments: number) {
  const unit = 360 / segments / 2;
  const rotateY = unit * (offsetX + (sizeX - 1) / 2);
  const rotateX = unit * (offsetY - (sizeY - 1) / 2);
  return { rotateX, rotateY };
}

export default function DomeGallery({
  images = DEFAULT_IMAGES,
  fit = 0.35,
  fitBasis = 'auto',
  minRadius = 300,
  maxRadius = 600,
  padFactor = 0.25,
  overlayBlurColor = 'rgba(240, 248, 242, 0.8)',
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  dragDampening = 2,
  openedImageWidth = '400px',
  openedImageHeight = '400px',
  imageBorderRadius = '20px',
  openedImageBorderRadius = '20px',
  grayscale = false,
  autoRotate = true,
  autoRotateSpeed = DEFAULTS.autoRotateSpeed
}: DomeGalleryProps) {
  const [selectedUniversity, setSelectedUniversity] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const autoRotationRef = useRef(0);
  const draggingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  const applyTransform = (xDeg: number, yDeg: number) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  };

  const handleImageClick = useCallback((imageSrc: string) => {
    const university = UNIVERSITY_DATA.find(uni => uni.src === imageSrc);
    if (university) {
      setSelectedUniversity(university);
      setIsModalOpen(true);
    }
  }, []);

  // Auto rotation effect
  useEffect(() => {
    if (!autoRotate) return;

    const animate = () => {
      if (!draggingRef.current) {
        autoRotationRef.current += autoRotateSpeed;
        const newY = rotationRef.current.y + autoRotateSpeed;
        rotationRef.current = { ...rotationRef.current, y: newY };
        applyTransform(rotationRef.current.x, newY);
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [autoRotate, autoRotateSpeed]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width),
        h = Math.max(1, cr.height);
      const minDim = Math.min(w, h),
        maxDim = Math.max(w, h),
        aspect = w / h;
      
      let basis: number;
      switch (fitBasis) {
        case 'min':
          basis = minDim;
          break;
        case 'max':
          basis = maxDim;
          break;
        case 'width':
          basis = w;
          break;
        case 'height':
          basis = h;
          break;
        default:
          basis = aspect >= 1.3 ? w : minDim;
      }
      
      let radius = basis * fit;
      const heightGuard = h * 1.35;
      radius = Math.min(radius, heightGuard);
      radius = clamp(radius, minRadius, maxRadius);

      const viewerPad = Math.max(8, Math.round(minDim * padFactor));
      root.style.setProperty('--radius', `${Math.round(radius)}px`);
      root.style.setProperty('--viewer-pad', `${viewerPad}px`);
      root.style.setProperty('--overlay-blur-color', overlayBlurColor);
      root.style.setProperty('--tile-radius', imageBorderRadius);
      root.style.setProperty('--enlarge-radius', openedImageBorderRadius);
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
      
      applyTransform(rotationRef.current.x, rotationRef.current.y);
    });
    
    ro.observe(root);
    return () => ro.disconnect();
  }, [
    fit,
    fitBasis,
    minRadius,
    maxRadius,
    padFactor,
    overlayBlurColor,
    grayscale,
    imageBorderRadius,
    openedImageBorderRadius,
    openedImageWidth,
    openedImageHeight
  ]);

  useGesture(
    {
      onDragStart: () => {
        draggingRef.current = true;
      },
      onDrag: ({ movement: [mx, my] }) => {
        if (!draggingRef.current) return;

        const nextX = clamp(
          rotationRef.current.x - my / dragSensitivity,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg
        );
        const nextY = rotationRef.current.y + mx / dragSensitivity;

        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
      },
      onDragEnd: () => {
        draggingRef.current = false;
      }
    },
    { target: mainRef, eventOptions: { passive: false } }
  );

  const cssStyles = `
    .sphere-root {
      --radius: 400px;
      --viewer-pad: 72px;
      --circ: calc(var(--radius) * 3.14);
      --rot-y: calc((360deg / var(--segments-x)) / 2);
      --rot-x: calc((360deg / var(--segments-y)) / 2);
      --item-width: calc(var(--circ) / var(--segments-x));
      --item-height: calc(var(--circ) / var(--segments-y));
    }
    
    .sphere-root * { box-sizing: border-box; }
    .sphere, .sphere-item, .item__image { transform-style: preserve-3d; }
    
    .stage {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      position: absolute;
      inset: 0;
      margin: auto;
      perspective: calc(var(--radius) * 2);
      perspective-origin: 50% 50%;
    }
    
    .sphere {
      transform: translateZ(calc(var(--radius) * -1));
      will-change: transform;
      position: absolute;
    }
    
    .sphere-item {
      width: calc(var(--item-width) * var(--item-size-x));
      height: calc(var(--item-height) * var(--item-size-y));
      position: absolute;
      top: -999px;
      bottom: -999px;
      left: -999px;
      right: -999px;
      margin: auto;
      transform-origin: 50% 50%;
      backface-visibility: hidden;
      transition: transform 300ms;
      transform: rotateY(calc(var(--rot-y) * (var(--offset-x) + ((var(--item-size-x) - 1) / 2)))) 
                 rotateX(calc(var(--rot-x) * (var(--offset-y) - ((var(--item-size-y) - 1) / 2)))) 
                 translateZ(var(--radius));
    }
    
    .item__image {
      position: absolute;
      inset: 5px;
      border-radius: var(--tile-radius, 12px);
      overflow: hidden;
      cursor: pointer;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      transition: transform 300ms;
      pointer-events: auto;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
      <div
        ref={rootRef}
        className="sphere-root relative w-full h-full"
        style={
          {
            ['--segments-x' as any]: segments,
            ['--segments-y' as any]: segments,
            ['--overlay-blur-color' as any]: overlayBlurColor,
            ['--tile-radius' as any]: imageBorderRadius,
            ['--enlarge-radius' as any]: openedImageBorderRadius,
            ['--image-filter' as any]: grayscale ? 'grayscale(1)' : 'none'
          } as React.CSSProperties
        }
      >
        <main
          ref={mainRef}
          className="absolute inset-0 grid place-items-center overflow-hidden select-none bg-transparent"
          style={{
            touchAction: 'none',
            WebkitUserSelect: 'none'
          }}
        >
          <div className="stage">
            <div ref={sphereRef} className="sphere">
              {items.map((it, i) => (
                <div
                  key={`${it.x},${it.y},${i}`}
                  className="sphere-item absolute m-auto"
                  data-src={it.src}
                  data-alt={it.alt}
                  data-offset-x={it.x}
                  data-offset-y={it.y}
                  data-size-x={it.sizeX}
                  data-size-y={it.sizeY}
                  style={
                    {
                      ['--offset-x' as any]: it.x,
                      ['--offset-y' as any]: it.y,
                      ['--item-size-x' as any]: it.sizeX,
                      ['--item-size-y' as any]: it.sizeY,
                      top: '-999px',
                      bottom: '-999px',
                      left: '-999px',
                      right: '-999px'
                    } as React.CSSProperties
                  }
                >
                  <div 
                    className="item__image absolute block overflow-hidden cursor-pointer bg-gray-200 transition-transform duration-300 hover:scale-105"
                    onClick={() => handleImageClick(it.src)}
                  >
                    <img
                      src={it.src}
                      draggable={false}
                      alt={it.alt}
                      className="w-full h-full object-cover pointer-events-none"
                      style={{
                        backfaceVisibility: 'hidden',
                        filter: `var(--image-filter, ${grayscale ? 'grayscale(1)' : 'none'})`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overlay effects */}
          <div
            className="absolute inset-0 m-auto z-[3] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(rgba(235, 235, 235, 0) 65%, var(--overlay-blur-color, ${overlayBlurColor}) 100%)`
            }}
          />
        </main>
      </div>

      {/* University Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md mx-auto bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl">
          {selectedUniversity && (
            <>
              <DialogHeader className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <img 
                    src={selectedUniversity.src} 
                    alt={selectedUniversity.name}
                    className="w-16 h-16 object-contain rounded-lg bg-white p-2 shadow-md"
                  />
                </div>
                <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
                  {selectedUniversity.name}
                </DialogTitle>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {selectedUniversity.country}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {selectedUniversity.rank}
                  </span>
                </div>
              </DialogHeader>
              
              <DialogDescription className="text-gray-700 leading-relaxed text-center">
                {selectedUniversity.description}
              </DialogDescription>
              
              <DialogFooter className="flex justify-center pt-4">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-full font-semibold transition-all duration-200 transform hover:scale-105"
                  onClick={() => setIsModalOpen(false)}
                >
                  Apply Now
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}