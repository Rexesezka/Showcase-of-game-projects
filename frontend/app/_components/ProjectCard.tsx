import Image from "next/image";
import Link from "next/link";
import type { ProjectCardData } from "../_data/home";

type ProjectCardProps = {
  project: ProjectCardData;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#141424] shadow-[0_18px_35px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35">
      <Link className="block" href={`/projects/${project.id}`}>
        <div className="relative h-52 overflow-hidden">
          <Image
            src="/card-picture.png"
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/65 via-black/35 to-transparent p-4 text-white transition-transform duration-300 group-hover:translate-y-0">
            <p className="text-base font-semibold leading-tight">{project.title}</p>
            <p className="mt-1 text-base font-bold text-white/90">
              <span className="text-[#FFE278]">{project.score}</span> баллов
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
