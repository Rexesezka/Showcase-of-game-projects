import Link from "next/link";
import type { ProjectDetailsData } from "../_data/home";
import MaterialLinkButton from "./MaterialLinkButton";

const DropIcon = ({
  className = "h-4 w-3.5",
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 14 16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.21057 8L13.7634 3.4864C13.8384 3.41217 13.8979 3.32401 13.9385 3.22695C13.9791 3.1299 14 3.02587 14 2.9208C14 2.81573 13.9791 2.7117 13.9385 2.61465C13.8979 2.51759 13.8384 2.42943 13.7634 2.3552C12.2334 0.8368 10.2112 0 8.06954 0C3.61999 0 0 3.588 0 8C0 12.412 3.61999 16 8.06954 16C10.2112 16 12.2334 15.1632 13.7634 13.644C13.9147 13.494 13.9997 13.2905 13.9997 13.0784C13.9997 12.8663 13.9147 12.6628 13.7634 12.5128L9.21057 8ZM6.85911 5.5984C6.7001 5.59835 6.54265 5.56725 6.39577 5.50687C6.24889 5.4465 6.11543 5.35803 6.00303 5.24653C5.89064 5.13502 5.80149 5.00266 5.74069 4.857C5.67989 4.71134 5.64862 4.55524 5.64867 4.3976C5.64873 4.23996 5.6801 4.08388 5.741 3.93826C5.8019 3.79264 5.89113 3.66034 6.00361 3.54891C6.11608 3.43748 6.24959 3.3491 6.39651 3.28882C6.54344 3.22854 6.7009 3.19755 6.85991 3.1976C7.18104 3.19771 7.48898 3.32428 7.71598 3.54947C7.94298 3.77467 8.07045 4.08003 8.07034 4.3984C8.07024 4.71677 7.94256 5.02205 7.71541 5.24709C7.48826 5.47214 7.18024 5.59851 6.85911 5.5984Z"
      fill="currentColor"
    />
  </svg>
);

type ProjectAsideProps = {
  project: ProjectDetailsData;
  showPlayButton?: boolean;
};

export default function ProjectAside({ project, showPlayButton = true }: ProjectAsideProps) {
  return (
    <aside className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-semibold text-white">{project.subtitle}</h1>
        {showPlayButton ? (
          project.buildUrl ? (
            <Link
              className="mt-4 block w-full rounded-full bg-[#31B2D3] py-2 text-center text-sm font-semibold text-black transition hover:bg-[#52c2df]"
              href={`/projects/${project.id}/play`}
            >
              ИГРАТЬ
            </Link>
          ) : (
            <button
              className="mt-4 w-full cursor-not-allowed rounded-full bg-[#4f6570] py-2 text-sm font-semibold text-black/70"
              type="button"
              disabled
            >
              БИЛД НЕ ДОБАВЛЕН
            </button>
          )
        ) : (
          <Link
            className="mt-4 block w-full rounded-full border border-white/25 py-2 text-center text-sm font-medium text-white transition hover:border-white/50"
            href={`/projects/${project.id}`}
          >
            К описанию
          </Link>
        )}
        <p className="mt-4 text-sm text-white">Тип: {project.type}</p>
        <p className="mt-4 text-sm text-white">Загружено: {project.uploadDate}</p>
      </div>

      {project.materials.length > 0 ? (
        <div>
          <h2 className="mt-10 text-2xl font-semibold text-white">Материалы</h2>
          <div className="mt-3 flex max-w-[180px] flex-col gap-2 text-center">
            {project.materials.map((material) => (
              <MaterialLinkButton key={`${material.label}-${material.href}`} material={material} />
            ))}
          </div>
        </div>
      ) : null}

      {project.teamName || project.team.length > 0 ? (
        <div>
          <h2 className="mt-10 text-xl font-semibold text-white">О команде</h2>
          {project.teamName ? (
            <p className="mt-2 text-lg font-semibold text-white/85">{project.teamName}</p>
          ) : null}
          {project.team.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {project.team.map((member) => (
                <li key={`${member.name}-${member.role}`} className="text-[#A2EBFF]">
                  <p className="text-white/90">{member.name}</p>
                  <p className="inline-flex items-center gap-2">
                    <DropIcon /> {member.role}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
