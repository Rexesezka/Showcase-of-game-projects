export default function Header() {
  return (
    <header className="fixed inset-x-0 top-7 z-50">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-center rounded-[100px] bg-[#5656564D] opacity-100 shadow-[inset_0_0_68px_0_rgba(255,255,255,0.05),inset_0_4px_4px_0_rgba(255,255,255,0.15)] backdrop-blur-xl">
          <nav className="flex items-center gap-4 text-base text-white/80">
            <a
              className="rounded-full border border-transparent px-5 py-1.5 transition hover:border-white/20 hover:bg-[#5656564D] hover:text-white hover:shadow-[inset_0_0_68px_0_rgba(255,255,255,0.05),inset_0_4px_4px_0_rgba(255,255,255,0.15)] hover:backdrop-blur-7xl"
              href="#"
            >
              Витрина проектов
            </a>
            <a
              className="rounded-full border border-transparent px-5 py-1.5 transition hover:border-white/20 hover:bg-[#5656564D] hover:text-white hover:shadow-[inset_0_0_68px_0_rgba(255,255,255,0.05),inset_0_4px_4px_0_rgba(255,255,255,0.15)] hover:backdrop-blur-7xl"
              href="#"
            >
              Поиск экспертов
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
