'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

const slides = [
  {
    src: '/images/catalog/FMT-BO-BO-2025.png',
    alt: 'Batana oil bottle on a wooden table',
  },
  {
    src: '/images/catalog/FMT-TH-GL-2025.png',
    alt: 'Glass jar of guava leaf tea with fresh leaves',
  },
];

export function ImageGallery() {
  const [emblaRef] = useEmblaCarousel();

  return (
    <div
      ref={emblaRef}
      className="overflow-hidden rounded-2xl bg-muted/40 shadow-lg"
      aria-label="Product image gallery"
    >
      <div className="flex touch-pan-y touch-pinch-zoom">
        {slides.map((slide) => (
          <div key={slide.src} className="relative w-full shrink-0 basis-full">
            <Image
              src={slide.src}
              alt={slide.alt}
              width={1200}
              height={800}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
}
