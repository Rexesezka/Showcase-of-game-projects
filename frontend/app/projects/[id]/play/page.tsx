import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleArrowIcon, Footer, Header } from "../../../_components";
import { getProjectById } from "../../../_data/home";
import GamePlaySection from "./_components/GamePlaySection";

type ProjectPlayPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPlayPage({ params }: ProjectPlayPageProps) {
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId)) {
    notFound();
  }

  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }

  if (!project.buildUrl) {
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
          <Link href={`/projects/${project.id}`} className="hover:text-white">
            {project.title}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white/80">Игра</span>
        </div>

        <Link
          href={`/projects/${project.id}`}
          className="mt-3 inline-flex items-center gap-2 text-sm text-white/75 hover:text-white"
        >
          <CircleArrowIcon aria-hidden className="h-5 w-5" />
          Вернуться к описанию
        </Link>

        <section className="mt-6">
          <GamePlaySection project={project} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
