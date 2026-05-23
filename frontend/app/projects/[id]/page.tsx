import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CircleArrowIcon,
  Footer,
  Header,
  ProjectAside,
  ProjectImageCarousel,
} from "../../_components";
import { getProjectById } from "../../_data/home";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId)) {
    notFound();
  }

  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-10 pt-24 sm:px-6 sm:pt-28">
        <div className="text-xs text-white/55">
          <Link href="/" className="hover:text-white">
            Витрина проектов
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white/80">{project.title}</span>
        </div>

        <Link href="/" className="mt-3 inline-flex items-center gap-2 text-sm text-white/75 hover:text-white">
          <CircleArrowIcon aria-hidden className="h-5 w-5" />
          Вернуться назад
        </Link>

        <section className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="min-w-0">
            <ProjectImageCarousel title={project.title} images={project.images} />

            <article className="mt-5 rounded-2xl bg-white/[0.03] p-5 text-white/70">
              <h2 className="text-xl font-semibold text-[#FFD76A]">Описание игры</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed">
                {project.aboutGame.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>

            <article className="mt-5 rounded-2xl bg-white/[0.03] p-5 text-white/70">
              <h2 className="text-xl font-semibold text-[#FFD76A]">Как играть</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed">
                {project.howToPlay.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          </div>

          <ProjectAside project={project} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
