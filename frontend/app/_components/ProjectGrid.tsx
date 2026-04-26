import type { ProjectCardData } from "../_data/home";
import ProjectCard from "./ProjectCard";

type ProjectGridProps = {
  projects: ProjectCardData[];
};

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
