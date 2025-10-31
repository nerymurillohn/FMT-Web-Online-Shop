'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

export function ImageGallery() {
  const [emblaRef] = useEmblaCarousel();

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        <div className="embla__slide">
          <Image
            src="/images/before.jpg"
            alt="Before"
            width={500}
            height={500}
          />
        </div>
        <div className="embla__slide">
          <Image
            src="/images/after.jpg"
            alt="After"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
