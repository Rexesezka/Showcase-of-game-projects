"use client";

import { useEffect, useState } from "react";

const defaultImage = "/card-picture.png";

type ProjectCoverImageProps = {
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  src: string;
};

export default function ProjectCoverImage({
  alt,
  className = "object-cover",
  fill = false,
  priority = false,
  src,
}: ProjectCoverImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || defaultImage);

  useEffect(() => {
    setCurrentSrc(src || defaultImage);
  }, [src]);

  const imgClassName = fill ? `absolute inset-0 h-full w-full ${className}` : className;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      className={imgClassName}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      onError={() => {
        if (currentSrc !== defaultImage) {
          setCurrentSrc(defaultImage);
        }
      }}
      referrerPolicy="no-referrer"
      src={currentSrc}
    />
  );
}
