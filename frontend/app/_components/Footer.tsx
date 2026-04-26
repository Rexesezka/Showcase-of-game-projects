export default function Footer() {
  return (
    <footer className="mt-12 bg-[#2B2B31] py-10">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="grid gap-8 text-white/75 sm:grid-cols-3">
          <div>
            <h3 className="text-2xl font-semibold text-white">О проекте</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Платформа студенческих игровых проектов, созданных в рамках проектного
              обучения института ИРИТ-РТФ УрФУ.
            </p>
            <p className="mt-6 text-2xl font-semibold text-white">ЛОГО</p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-white">Контакты</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li>Email: test@gmail.com</li>
              <li>VK</li>
              <li>TG</li>
              <li>Екатеринбург, УрФУ</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-white">Экспертам</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Если вы эксперт из IT-сферы, то приглашаем вас поучаствовать в защите
              проектов в составе экспертной комиссии. Либо вы можете заказать свой
              проект.
            </p>
            <a className="mt-4 inline-block text-sm text-white underline-offset-4 hover:underline" href="#">
              Поиск экспертов
            </a>
          </div>
        </div>

        <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">
          <a className="transition hover:text-white" href="#">
            Витрина проектов
          </a>
          <a className="transition hover:text-white" href="#">
            Поиск экспертов
          </a>
        </div>
      </div>
      
    </footer>
  );
}
