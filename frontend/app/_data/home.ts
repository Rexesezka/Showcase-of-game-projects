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

const filterOptions: FilterOptions = {
  seasons: ["Весна 2026", "Осень 2025"],
  sortings: ["По убыванию рейтинга", "По возрастанию рейтинга"],
};

const stats: StatData[] = [
  { label: "Сезонов", value: "999" },
  { label: "Проектов", value: "999" },
  { label: "Студентов", value: "999" },
];

const projects: ProjectCardData[] = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  title: "Merge Комбинаторика",
  score: 80 + ((index * 3) % 21),
}));

const projectDetails: ProjectDetailsData[] = projects.map((project, index) => ({
  ...project,
  subtitle: "Merge Комбинаторика",
  images: ["/image 117.png", "/image 123.png", "/image 124.png", "/image 125.png", "/image 126.png"],
  type: "WebGL",
  uploadDate: "20 дек. 2023 г.",
  materials: [
    { label: "Git", href: "https://github.com" },
    { label: "Figma", href: "https://www.figma.com" },
    { label: "Дизайн документ", href: "https://example.com/design-doc" },
  ],
  aboutGame: [
    "Основной геймплей игры завязан на использовании merge-механики — совмещение/слияние блоков, для решения комбинаторной задачи, которая является главной целью игрока для продвижения в игре на протяжении 14 уровней.",
    "В игре есть 3 основных вида блоков:",
    "— Числовой блок: содержит числовые значения и присвоенную переменную (n,m), на место которой число встанет при слиянии с блоками формул;",
    "— Арифметический блок: используется для создания числовых блоков, с помощью добавления арифметических операций с числами: деление/умножение, сложение/вычитание;",
    "— Блок формул: содержит основные формулы комбинаторики: P (перестановки), C (сочетания), A (размещения). Данные блоки могут стать результатом слияния арифметических блоков. Блоки формул также можно соединять с числовыми блоками, числа которых встают на место значений (n,m), к которым они принадлежат.",
    "После прохождения 14 уровней, вам откроется режим «Испытание», где вы можете проверить свои знания и посоревноваться с другими игроками.",
  ],
  howToPlay: [
    "Основной геймплей игры завязан на использовании merge-механики — совмещение/слияние блоков, для решения комбинаторной задачи, которая является главной целью игрока для продвижения в игре на протяжении 14 уровней.",
    "В игре есть 3 основных вида блоков:",
    "— Числовой блок: содержит числовые значения и присвоенную переменную (n,m), на место которой число встанет при слиянии с блоками формул;",
    "— Арифметический блок: используется для создания числовых блоков, с помощью добавления арифметических операций с числами: деление/умножение, сложение/вычитание;",
    "— Блок формул: содержит основные формулы комбинаторики: P (перестановки), C (сочетания), A (размещения). Данные блоки могут стать результатом слияния арифметических блоков. Блоки формул также можно соединять с числовыми блоками, числа которых встают на место значений (n,m), к которым они принадлежат.",
    "После прохождения 14 уровней, вам откроется режим «Испытание», где вы можете проверить свои знания и посоревноваться с другими игроками.",
  ],
  team: [
    { name: "Иванов Иван", role: "Frontend-разработчик" },
    { name: "Иванов Иван", role: "UX/UI дизайнер" },
    { name: "Иванов Иван", role: "Backend-разработчик" },
    { name: "Иванова Инна", role: "Аналитик" },
  ],
}));

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getHomeData(): Promise<HomeData> {
  await sleep(500);

  return {
    filterOptions,
    stats,
    projects,
  };
}

export async function getProjectById(id: number): Promise<ProjectDetailsData | null> {
  await sleep(150);
  return projectDetails.find((project) => project.id === id) ?? null;
}
