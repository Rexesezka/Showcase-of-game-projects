"use client";

import { useId, useState } from "react";
import ArrowCircleIcon from "./ArrowCircleIcon";
import ProjectCoverImage from "./ProjectCoverImage";
import { FreeMode, Navigation, Pagination, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

type ProjectImageCarouselProps = {
  title: string;
  images: string[];
};

export default function ProjectImageCarousel({ title, images }: ProjectImageCarouselProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const navId = useId().replace(/:/g, "");
  const prevClass = `project-carousel-prev-${navId}`;
  const nextClass = `project-carousel-next-${navId}`;

  return (
    <div className="min-w-0">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/15">
        <Swiper
          className="h-full w-full"
          modules={[Navigation, Thumbs]}
          navigation={{ prevEl: `.${prevClass}`, nextEl: `.${nextClass}` }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        >
          {images.map((src, index) => (
            <SwiperSlide key={`${src}-${index}`}>
              <div className="relative h-full w-full">
                <ProjectCoverImage
                  alt={title}
                  className="object-cover"
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  src={src}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          aria-label="Предыдущий слайд"
          className={`${prevClass} absolute left-3 top-1/2 z-20 -translate-y-1/2 transition hover:scale-105`}
          type="button"
        >
          <ArrowCircleIcon className="h-10 w-10 sm:h-12 sm:w-12" />
        </button>
        <button
          aria-label="Следующий слайд"
          className={`${nextClass} absolute right-3 top-1/2 z-20 -translate-y-1/2 transition hover:scale-105`}
          type="button"
        >
          <ArrowCircleIcon className="h-10 w-10 rotate-180 sm:h-12 sm:w-12" />
        </button>
      </div>

      <Swiper
        className="mt-3 rounded-[20px]"
        modules={[FreeMode, Thumbs]}
        onSwiper={setThumbsSwiper}
        freeMode={false}
        watchSlidesProgress
        allowTouchMove={false}
        slidesPerView={Math.max(images.length, 1)}
        spaceBetween={6}
      >
        {images.map((src, index) => (
          <SwiperSlide key={`${src}-${index}`}>
            <div className="relative aspect-[16/8] w-full cursor-pointer overflow-hidden border border-white/20">
              <ProjectCoverImage
                alt={`${title} preview ${index + 1}`}
                className="object-cover"
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 25vw, 12vw"
                src={src}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
