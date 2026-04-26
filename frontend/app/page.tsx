import { Footer, Header, Hero, ProjectSection } from "./_components";
import { getHomeData } from "./_data/home";

export default async function Home() {
  const homeData = await getHomeData();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-10 sm:pb-20">
        <Hero stats={homeData.stats} />
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <ProjectSection
            filterOptions={homeData.filterOptions}
            projects={homeData.projects}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
