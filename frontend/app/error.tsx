"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Произошла ошибка
      </h1>
      <p className="mt-3 text-sm text-neutral-600 sm:text-base">
        Попробуйте обновить страницу или повторить действие.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        Попробовать снова
      </button>
    </main>
  );
}
