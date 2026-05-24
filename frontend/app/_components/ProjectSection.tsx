"use client";

import { useEffect, useState } from "react";
import type { DropdownOption } from "./CustomDropdown";
import CustomDropdown from "./CustomDropdown";
import ProjectGrid from "./ProjectGrid";
import type { ProjectCardData, SeasonOption } from "../_data/home";
import { mapProjectCards } from "../_data/home";

const SORT_OPTIONS: DropdownOption[] = [
  { value: "score_desc", label: "По убыванию рейтинга" },
  { value: "score_asc", label: "По возрастанию рейтинга" },
];

type ProjectSectionProps = {
  seasons: SeasonOption[];
  initialProjects: ProjectCardData[];
};

export default function ProjectSection({ seasons, initialProjects }: ProjectSectionProps) {
  const [sort, setSort] = useState("score_desc");
  const [seasonId, setSeasonId] = useState("");
  const [projects, setProjects] = useState(initialProjects);
  const [isLoading, setIsLoading] = useState(false);

  const seasonOptions: DropdownOption[] = [
    { value: "", label: "Все сезоны" },
    ...seasons.map((season) => ({ value: String(season.id), label: season.name })),
  ];

  useEffect(() => {
    const params = new URLSearchParams({ sort });
    if (seasonId) {
      params.set("season", seasonId);
    }

    let cancelled = false;
    setIsLoading(true);

    fetch(`/api/projects?${params.toString()}`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load projects");
        }
        return response.json() as Promise<{ items: Parameters<typeof mapProjectCards>[0] }>;
      })
      .then((data) => {
        if (!cancelled) {
          setProjects(mapProjectCards(data.items));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProjects([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sort, seasonId]);

  return (
    <section className="mx-auto mt-14 max-w-5xl">
      <h2 className="text-center text-3xl font-semibold tracking-tight text-white">
        Игровые проекты. <span className="text-yellow-300">Весна 2026</span>
      </h2>
      <p className="mt-2 text-center text-sm text-white/65">
        {isLoading ? "Загрузка..." : `Найдено проектов: ${projects.length}`}
      </p>

      <div className="mx-auto mt-6 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-center">
        <CustomDropdown
          label="Сезон:"
          options={seasonOptions}
          value={seasonId}
          onChange={setSeasonId}
        />
        <CustomDropdown
          label=""
          options={SORT_OPTIONS}
          value={sort}
          onChange={setSort}
        />
      </div>

      <ProjectGrid projects={projects} />
    </section>
  );
}
