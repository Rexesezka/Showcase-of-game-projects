export type ProjectCardData = {
  id: number;
  title: string;
  score: number;
  coverImage: string;
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
  teamName: string;
  materials: ProjectMaterial[];
  aboutGame: string[];
  howToPlay: string[];
  team: TeamMember[];
};

export type StatData = {
  label: string;
  value: string;
};

export type SeasonOption = {
  id: number;
  name: string;
};

export type FilterOptions = {
  seasons: SeasonOption[];
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
  score: number | null;
  coverImage?: string;
  images?: string[];
};

type BackendProjectDetails = {
  id: number;
  title: string;
  subtitle: string;
  uploadDate: string;
  buildUrl: string;
  score: number | null;
  teamName: string;
  shortDescription: string;
  fullDescription: string;
  materials: ProjectMaterial[];
  images: string[];
  team: TeamMember[];
};

const backendBaseUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";
const defaultImage = "/card-picture.png";

const fallbackHome: HomeData = {
  filterOptions: {
    seasons: [{ id: 1, name: "Весна 2026" }],
    sortings: ["По убыванию рейтинга", "По возрастанию рейтинга"],
  },
  stats: [
    { label: "Сезонов", value: "1" },
    { label: "Проектов", value: "0" },
    { label: "Кураторов", value: "0" },
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

function normalizeScore(score: number | null | undefined, projectId: number): number {
  if (typeof score === "number" && Number.isFinite(score)) {
    return score;
  }
  return 75 + (projectId % 26);
}

function isExternalHttpUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export function normalizeMediaUrl(url?: string | null): string {
  if (!url?.trim()) {
    return defaultImage;
  }

  const trimmed = url.trim();

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return `${backendBaseUrl}${trimmed}`;
  }

  if (isExternalHttpUrl(trimmed)) {
    return trimmed;
  }

  return defaultImage;
}

export function mapProjectCards(items: BackendProjectCard[]): ProjectCardData[] {
  return items.map((project) => ({
    id: project.id,
    title: project.title,
    score: normalizeScore(project.score, project.id),
    coverImage: resolveCoverImage(project),
  }));
}

function resolveCoverImage(project: BackendProjectCard): string {
  if (project.coverImage) {
    return normalizeMediaUrl(project.coverImage);
  }

  const firstImage = project.images?.find((item) => item.trim());
  return normalizeMediaUrl(firstImage);
}

function normalizeImages(images: string[]): string[] {
  const normalized = (images ?? [])
    .map((item) => normalizeMediaUrl(item))
    .filter((item) => item !== defaultImage);

  return normalized.length > 0 ? normalized : [defaultImage];
}

export async function getTopProjects(limit = 5): Promise<ProjectCardData[]> {
  try {
    const response = await fetchJson<{ items: BackendProjectCard[] }>(
      `/api/projects/top/?limit=${limit}`,
    );
    return mapProjectCards(response.items);
  } catch {
    return [];
  }
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
      fetchJson<{ items: BackendProjectCard[] }>("/api/projects/?sort=score_desc"),
    ]);

    const projects = mapProjectCards(projectsResponse.items);

    return {
      filterOptions: {
        seasons:
          seasonsResponse.items.length > 0
            ? seasonsResponse.items.map((item) => ({ id: item.id, name: item.name }))
            : fallbackHome.filterOptions.seasons,
        sortings: ["По убыванию рейтинга", "По возрастанию рейтинга"],
      },
      stats: statsResponse.stats.some((item) => item.value !== "0")
        ? statsResponse.stats
        : fallbackHome.stats,
      projects,
    };
  } catch {
    return fallbackHome;
  }
}

export async function getProjectById(id: number): Promise<ProjectDetailsData | null> {
  try {
    const project = await fetchJson<BackendProjectDetails>(`/api/projects/${id}/`);
    return {
      id: project.id,
      title: project.title,
      subtitle: project.subtitle || project.title,
      score: normalizeScore(project.score, project.id),
      coverImage: resolveCoverImage({
        id: project.id,
        title: project.title,
        score: project.score,
        images: project.images,
      }),
      images: normalizeImages(project.images ?? []),
      type: "WebGL",
      uploadDate: project.uploadDate,
      buildUrl: normalizeBuildUrl(project.buildUrl),
      teamName: project.teamName ?? "",
      materials: project.materials ?? [],
      aboutGame: [project.fullDescription || "Описание пока не добавлено."],
      howToPlay: [project.shortDescription || "Инструкция пока не добавлена."],
      team: project.team ?? [],
    };
  } catch {
    return null;
  }
}
