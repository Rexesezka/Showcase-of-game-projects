"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ArrowCircleIcon from "../../_components/ArrowCircleIcon";
import ProjectCoverImage from "../../_components/ProjectCoverImage";
import type { ProjectCardData } from "../../_data/home";
import "./ExpertsGamesCarousel.css";

type ExpertsGamesCarouselProps = {
  projects: ProjectCardData[];
};

type GameCardProps = {
  project: ProjectCardData;
  variant: "center" | "side";
  animationDirection?: "next" | "prev";
};

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function GameCard({ project, variant, animationDirection }: GameCardProps) {
  const isCenter = variant === "center";
  const cardClassName = `experts-games-card experts-games-card--${variant}`;
  const body = (
    <div
      className={
        isCenter
          ? `experts-games-card-body experts-games-center-content experts-games-center-content--${animationDirection ?? "next"}`
          : "experts-games-card-body"
      }
    >
      <ProjectCoverImage
        alt={project.title}
        className="object-cover"
        fill
        sizes="(max-width: 640px) 92vw, 420px"
        src={project.coverImage}
      />
    </div>
  );

  if (isCenter) {
    return (
      <Link
        aria-label={project.title}
        href={`/projects/${project.id}`}
        className={cardClassName}
      >
        {body}
      </Link>
    );
  }

  return <div className={cardClassName}>{body}</div>;
}

export default function ExpertsGamesCarousel({ projects }: ExpertsGamesCarouselProps) {
  const items = projects.slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  if (items.length === 0) {
    return null;
  }

  const showSides = items.length > 1;
  const prevIndex = wrapIndex(activeIndex - 1, items.length);

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setDirection("next");
      setActiveIndex((index) => wrapIndex(index + 1, items.length));
    }, 4500);

    return () => window.clearInterval(timer);
  }, [items.length]);
  const nextIndex = wrapIndex(activeIndex + 1, items.length);
  const activeProject = items[activeIndex];

  function goPrev() {
    setDirection("prev");
    setActiveIndex((index) => wrapIndex(index - 1, items.length));
  }

  function goNext() {
    setDirection("next");
    setActiveIndex((index) => wrapIndex(index + 1, items.length));
  }

  return (
    <div className="relative mx-auto mt-10 w-full max-w-[720px]">
      <p className="mb-5 text-center text-lg font-semibold text-white">Лучшие игры</p>

      <div className="relative">
        <div className="experts-games-stage">
          {showSides ? (
            <>
              <div className="experts-games-side experts-games-side--left">
                <GameCard project={items[prevIndex]} variant="side" />
              </div>
              <div className="experts-games-side experts-games-side--right">
                <GameCard project={items[nextIndex]} variant="side" />
              </div>
            </>
          ) : null}

          <div className="experts-games-center">
            <GameCard
              key={activeIndex}
              project={activeProject}
              variant="center"
              animationDirection={direction}
            />
          </div>
        </div>

        {items.length > 1 ? (
          <>
            <button
              aria-label="Предыдущий слайд"
              className="experts-games-nav experts-games-nav--prev"
              onClick={goPrev}
              type="button"
            >
              <ArrowCircleIcon className="h-10 w-10 sm:h-12 sm:w-12" />
            </button>
            <button
              aria-label="Следующий слайд"
              className="experts-games-nav experts-games-nav--next"
              onClick={goNext}
              type="button"
            >
              <ArrowCircleIcon className="h-10 w-10 rotate-180 sm:h-12 sm:w-12" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
