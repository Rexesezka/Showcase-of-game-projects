export type ProjectCardData = {
  id: number;
  title: string;
  score: number;
};

export type TeamMember = {
  name: string;
  role: string;
};

export type ProjectMaterial = {
  label: string;
  href: string;
};

export type ProjectDetailsData = ProjectCardData & {
  subtitle: string;
  images: string[];
  type: string;
  uploadDate: string;
  buildUrl: string;
  materials: ProjectMaterial[];
  aboutGame: string[];
  howToPlay: string[];
  team: TeamMember[];
};

export type StatData = {
  label: string;
  value: string;
};

export type FilterOptions = {
  seasons: string[];
  sortings: string[];
};

export type HomeData = {
  filterOptions: FilterOptions;
  stats: StatData[];
  projects: ProjectCardData[];
};

type BackendStat = {
  label: string;
  value: string;
};

type BackendSeason = {
  id: number;
  name: string;
};

type BackendProjectCard = {
  id: number;
  title: string;
};

type BackendProjectDetails = {
  id: number;
  title: string;
  subtitle: string;
  uploadDate: string;
  buildUrl: string;
  shortDescription: string;
  fullDescription: string;
  materials: ProjectMaterial[];
  images: string[];
};

const backendBaseUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";
const defaultImage = "/card-picture.png";

const fallbackHome: HomeData = {
  filterOptions: {
    seasons: [],
    sortings: ["По убыванию рейтинга", "По возрастанию рейтинга"],
  },
  stats: [
    { label: "Сезонов", value: "0" },
    { label: "Проектов", value: "0" },
    { label: "Студентов", value: "0" },
  ],
  projects: [],
};

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${backendBaseUrl}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Backend request failed: ${path}`);
  }
  return response.json() as Promise<T>;
}

function scoreFromProjectId(id: number): number {
  return 75 + (id % 26);
}

function normalizeImages(images: string[]): string[] {
  const localImages = images.filter((item) => item.startsWith("/"));
  return localImages.length > 0 ? localImages : [defaultImage];
}

function normalizeBuildUrl(buildUrl?: string): string {
  if (!buildUrl) {
    return "";
  }
  if (buildUrl.startsWith("http://") || buildUrl.startsWith("https://")) {
    return buildUrl;
  }
  return `${backendBaseUrl}${buildUrl}`;
}

export async function getHomeData(): Promise<HomeData> {
  try {
    const [statsResponse, seasonsResponse, projectsResponse] = await Promise.all([
      fetchJson<{ stats: BackendStat[] }>("/api/stats/"),
      fetchJson<{ items: BackendSeason[] }>("/api/seasons/"),
      fetchJson<{ items: BackendProjectCard[] }>("/api/projects/?sort=updated_desc"),
    ]);

    return {
      filterOptions: {
        seasons: seasonsResponse.items.map((item) => item.name),
        sortings: ["По убыванию рейтинга", "По возрастанию рейтинга"],
      },
      stats: statsResponse.stats,
      projects: projectsResponse.items.map((project) => ({
        id: project.id,
        title: project.title,
        score: scoreFromProjectId(project.id),
      })),
    };
  } catch {
    return fallbackHome;
  }
}

export async function getProjectById(id: number): Promise<ProjectDetailsData | null> {
  try {
    const project = await fetchJson<BackendProjectDetails>(`/api/projects/${id}/`);
    const score = scoreFromProjectId(project.id);
    return {
      id: project.id,
      title: project.title,
      subtitle: project.subtitle || project.title,
      score,
      images: normalizeImages(project.images ?? []),
      type: "WebGL",
      uploadDate: project.uploadDate,
      buildUrl: normalizeBuildUrl(project.buildUrl),
      materials: project.materials ?? [],
      aboutGame: [project.fullDescription || "Описание пока не добавлено."],
      howToPlay: [project.shortDescription || "Инструкция пока не добавлена."],
      team: [],
    };
  } catch {
    return null;
  }
}
