"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProjectDetailsData } from "../../../../_data/home";
import PlayMaterialLinkButton from "./PlayMaterialLinkButton";

type GamePlaySectionProps = {
  project: ProjectDetailsData;
};

function OutlineActionButton({
  children,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button className="group relative inline-block rounded-lg" onClick={onClick} type={type}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg p-[2px]"
        style={{
          background:
            "linear-gradient(150.37deg, #8FD1E7 18.13%, #61B6CB 50%, #5FA8D3 81.87%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(150.37deg, #8FD1E7 18.13%, #61B6CB 50%, #5FA8D3 81.87%)",
        }}
      />
      <span className="relative z-10 inline-flex items-center gap-2 whitespace-nowrap rounded-[6px] bg-[#1F1F1F4D] px-4 py-2 text-sm font-semibold text-white/85 transition group-hover:bg-transparent group-hover:text-black">
        {children}
      </span>
    </button>
  );
}

export default function GamePlaySection({ project }: GamePlaySectionProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === gameRef.current);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  async function toggleFullscreen() {
    const element = gameRef.current;
    if (!element) {
      return;
    }

    if (document.fullscreenElement === element) {
      await document.exitFullscreen();
      return;
    }

    await element.requestFullscreen();
  }

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">{project.title}</h1>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {project.materials.map((material) => (
            <PlayMaterialLinkButton key={`${material.label}-${material.href}`} material={material} />
          ))}
          <OutlineActionButton onClick={toggleFullscreen}>
            {isFullscreen ? (
              "Свернуть"
            ) : (
              <>
                <Image
                  alt=""
                  aria-hidden
                  className="shrink-0 transition group-hover:brightness-0"
                  height={22}
                  src="/fullWindow.svg"
                  width={22}
                />
                Развернуть
              </>
            )}
          </OutlineActionButton>
        </div>
      </div>

      <div
        ref={gameRef}
        className={`mt-5 overflow-hidden rounded-2xl border border-white/15 bg-[#141424] shadow-[0_18px_35px_rgba(0,0,0,0.35)] ${
          isFullscreen ? "rounded-none border-0" : ""
        }`}
      >
        <div
          className={`flex w-full items-center justify-center bg-gradient-to-br from-[#2a2a34] via-[#1a1a22] to-[#121218] ${
            isFullscreen ? "min-h-screen" : "aspect-video"
          }`}
        >
          <p className="text-sm text-white/45">Здесь будет запущена игра</p>
        </div>
      </div>
    </div>
  );
}
