import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../_components";
import { faqItems, participationSteps, whyCards } from "../_data/experts";
import { getHomeData } from "../_data/home";
import ExpertApplicationForm from "./_components/ExpertApplicationForm";
import ExpertsGamesCarousel from "./_components/ExpertsGamesCarousel";

export const metadata: Metadata = {
  title: "Экспертам | Project Showcase",
  description: "Станьте экспертом студенческих игровых проектов УрФУ",
};

function ChevronIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4 shrink-0 text-white/60"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function StepArrowDown() {
  return (
    <svg
      aria-hidden
      className="h-6 w-6 text-[#FFE278]"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3v16M12 19l-4.5-4.5M12 19l4.5-4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default async function ExpertsPage() {
  const homeData = await getHomeData();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-10 sm:pb-20">
        <section className="relative isolate overflow-x-clip rounded-b-[24px] border-b border-white/10 bg-[#5656564D] px-5 pb-10 pt-20 sm:px-10 sm:pt-24">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-b-[24px]">
            <div
              className="absolute left-[24%] bottom-[28%] h-72 w-72 rounded-full"
              style={{ backgroundColor: "#E87E00", filter: "blur(200px)", opacity: 1 }}
            />
            <div
              className="absolute right-[24%] bottom-[28%] h-72 w-72 rounded-full"
              style={{ backgroundColor: "#E87E00", filter: "blur(200px)", opacity: 1 }}
            />
            <div
              className="absolute left-[18%] top-[-6%] h-72 w-72 rounded-full"
              style={{ backgroundColor: "#2BC3E8", filter: "blur(200px)", opacity: 1 }}
            />
            <div
              className="absolute right-[18%] top-[-6%] h-72 w-72 rounded-full"
              style={{ backgroundColor: "#2BC3E8", filter: "blur(200px)", opacity: 1 }}
            />
          </div>

          <div className="relative mx-auto max-w-5xl text-center sm:mt-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Станьте экспертом
              <span className="mt-1 block text-[#FFE278]">студенческих игровых проектов</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
              Делитесь опытом с командами студентов, участвуйте в защите проектов и помогайте
              формировать новое поколение разработчиков игр.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                className="rounded-full px-10 py-3 text-sm font-semibold text-black transition hover:brightness-105"
                href="#apply"
                style={{
                  background:
                    "linear-gradient(180deg, #FFFEA9 -40.62%, #2FD6FF 45.63%, #2797D9 161.34%)",
                }}
              >
                Стать экспертом
              </Link>
              <div className="group relative inline-block rounded-full">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full p-[2px]"
                  style={{
                    background:
                      "linear-gradient(150.37deg, #8FD1E7 18.13%, #61B6CB 50%, #5FA8D3 81.87%)",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(150.37deg, #8FD1E7 18.13%, #61B6CB 50%, #5FA8D3 81.87%)",
                  }}
                />
                <Link
                  className="relative z-10 block rounded-full bg-[#1F1F1F4D] px-10 py-3 text-sm font-medium text-white transition group-hover:bg-transparent group-hover:text-black"
                  href="/"
                >
                  Смотреть проекты
                </Link>
              </div>
            </div>

            <ExpertsGamesCarousel projects={homeData.projects} />
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-center text-3xl font-semibold text-[#FFE278] sm:text-4xl">
            Зачем становиться экспертом?
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((card) => (
              <article
                key={card.title}
                className="rounded-2xl bg-[#5656564D] p-5 text-center shadow-[inset_0_0_68px_0_rgba(255,255,255,0.05),inset_0_4px_4px_0_rgba(255,255,255,0.15)] backdrop-blur-xl"
              >
                <h3 className="text-lg font-semibold text-[#2BC3E8]">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-28 mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12"
        >
          <h2 className="text-center text-3xl font-semibold text-[#FFE278] sm:text-4xl">
            Как проходит участие
          </h2>
          <ol className="mt-10 flex w-full list-none flex-col items-center p-0">
            {participationSteps.flatMap((step, index) => {
              const items = [
                <li key={step.title} className="w-full">
                  <article className="w-full rounded-2xl bg-[#5656564D] px-5 py-4 shadow-[inset_0_0_68px_0_rgba(255,255,255,0.05),inset_0_4px_4px_0_rgba(255,255,255,0.15)] backdrop-blur-xl">
                    <div className="flex gap-4 sm:gap-5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFE278] text-2xl font-bold text-[#262526] sm:h-14 sm:w-14 sm:text-2xl">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/65">
                          {step.description}
                        </p>
                        {step.details ? (
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-white/65">
                            {step.details.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  </article>
                </li>,
              ];

              if (index < participationSteps.length - 1) {
                items.push(
                  <li
                    key={`arrow-${index}`}
                    aria-hidden
                    className="flex justify-center py-3"
                  >
                    <StepArrowDown />
                  </li>,
                );
              }

              return items;
            })}
          </ol>
        </section>

        <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
          <h2 className="text-center text-3xl font-semibold text-[#A2EBFF] sm:text-4xl">
            Часто задаваемые вопросы
          </h2>
          <div className="mt-10 space-y-3">
            {faqItems.map((item, index) => (
              <details
                key={item.question}
                className="group rounded-2xl bg-[#5656564D] shadow-[inset_0_0_68px_0_rgba(255,255,255,0.05),inset_0_4px_4px_0_rgba(255,255,255,0.15)] backdrop-blur-xl"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-white sm:text-base [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <ChevronIcon />
                </summary>
                <p className="border-t border-white/10 px-5 pb-4 pt-3 text-sm leading-relaxed text-white/65">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section
          id="apply"
          className="scroll-mt-28 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12"
        >
          <h2 className="text-center text-3xl font-semibold sm:text-4xl">
            <span className="text-white">Форма заявки: </span>
            <span className="text-[#FFE278]">Стать экспертом</span>
          </h2>
          <div className="mt-10">
            <ExpertApplicationForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
