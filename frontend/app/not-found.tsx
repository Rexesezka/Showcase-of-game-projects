import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Страница не найдена
      </h1>
      <p className="mt-3 text-sm text-neutral-600 sm:text-base">
        Похоже, ссылка устарела или была введена с ошибкой.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        Вернуться на главную
      </Link>
    </main>
  );
}
