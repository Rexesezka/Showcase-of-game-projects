import type { FilterOptions, ProjectCardData } from "../_data/home";
import CustomDropdown from "./CustomDropdown";
import ProjectGrid from "./ProjectGrid";

type ProjectSectionProps = {
  filterOptions: FilterOptions;
  projects: ProjectCardData[];
};

export default function ProjectSection({ filterOptions, projects }: ProjectSectionProps) {
  return (
    <section className="mx-auto mt-14 max-w-5xl">
      <h2 className="text-center text-3xl font-semibold tracking-tight text-white">
        Игровые проекты. <span className="text-yellow-300">Весна 2026</span>
      </h2>
      <p className="mt-2 text-center text-sm text-white/65">Найдено проектов: 16</p>

      <div className="mx-auto mt-6 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-center">
        <CustomDropdown label="Сезон:" options={filterOptions.seasons} />
        <CustomDropdown label="" options={filterOptions.sortings} />
      </div>

      <ProjectGrid projects={projects} />
    </section>
  );
}
