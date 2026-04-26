import type { StatData } from "../_data/home";

type HeroProps = {
  stats: StatData[];
};

export default function Hero({ stats }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden rounded-b-[24px] border-b border-white/10 bg-[#5656564D] px-5 pb-7 pt-20 sm:px-10 sm:pt-24">
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

      <div className="relative mx-auto mt-8 max-w-5xl text-center sm:mt-10">
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Витрина студенческих
          <p className="ml-2 text-[#FFE278]">игровых проектов</p>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
          Вы попали на страницу студенческих игровых проектов, которые создаются в
          рамках проектного обучения студентами 2-3 курса института ИРИТ-РТФ УрФУ.
        </p>
      </div>

      <div className="relative mx-auto mt-10 grid max-w-4xl gap-6 rounded-[24px] bg-[#5656564D] p-5 opacity-100 shadow-[inset_0_0_68px_0_rgba(255,255,255,0.05),inset_0_4px_4px_0_rgba(255,255,255,0.15)] backdrop-blur-6xl sm:grid-cols-[1.3fr_1fr] sm:p-10">
        <div>
          <p className="text-xl font-semibold text-[#A2EBFF]">Экспертам и компаниям</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
            Если вы эксперт из IT-сферы, то приглашаем вас поучаствовать в защите
            проектов в составе экспертной комиссии. Либо вы можете заказать свой
            проект.
          </p>
          <div className="group relative mt-5 inline-block rounded-full">
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
            <button
              className="relative z-10 rounded-full bg-[#1F1F1F4D] px-12 py-3 text-sm font-medium text-white transition group-hover:bg-transparent group-hover:text-black"
              type="button"
            >
              Участвовать
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm text-center text-white/60">Статистика платформы</p>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {stats.map((item) => (
              <div key={item.label}>
                <p className="text-4xl text-center font-semibold leading-none text-white">{item.value}</p>
                <p className="mt-1 text-center text-m text-[#FFE278]/65">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
