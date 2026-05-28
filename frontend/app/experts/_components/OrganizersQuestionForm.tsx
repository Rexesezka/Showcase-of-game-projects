"use client";

import Image from "next/image";
import { useState } from "react";
import { organizerContacts } from "../../_data/experts";

type ContactChannel = "telegram" | "vk" | "email";

const contactIcons = {
  telegram: { src: "/logos_telegram.svg", width: 16, height: 16 },
  vk: { src: "/VK%20Logo%201.svg", width: 16, height: 16 },
  email: { src: "/mail_logo.svg", width: 19, height: 15 },
} as const;

function ContactIcon({ channel }: { channel: ContactChannel }) {
  const icon = contactIcons[channel];

  return (
    <Image
      alt=""
      aria-hidden
      className="h-5 w-auto shrink-0"
      height={icon.height}
      src={icon.src}
      width={icon.width}
    />
  );
}

function buildContactHref(channel: ContactChannel, question: string): string {
  const text = question.trim() || "Вопрос организаторам";
  const encodedText = encodeURIComponent(text);

  if (channel === "email") {
    const subject = encodeURIComponent("Вопрос организаторам");
    return `mailto:${organizerContacts.email}?subject=${subject}&body=${encodedText}`;
  }

  if (channel === "telegram") {
    try {
      const telegramUrl = new URL(organizerContacts.telegram);
      const username = telegramUrl.pathname.replace(/\//g, "");
      if (username) {
        return `https://t.me/${username}?text=${encodedText}`;
      }
    } catch {
      // Fallback to share URL
    }

    return `https://t.me/share/url?text=${encodedText}`;
  }

  try {
    const vkUrl = new URL(organizerContacts.vk);
    const profile = vkUrl.pathname.replace(/\//g, "");
    if (profile) {
      const idMatch = profile.match(/^id(\d+)$/i);
      const peer = idMatch ? idMatch[1] : profile;
      return `https://vk.com/im?sel=${encodeURIComponent(peer)}&text=${encodedText}`;
    }
  } catch {
    // Fallback to share URL
  }

  return `https://vk.com/share.php?comment=${encodedText}`;
}

type ContactButtonProps = {
  channel: ContactChannel;
  question: string;
  label: string;
};

const gradientBorderStyle = {
  background: "linear-gradient(150.37deg, #8FD1E7 18.13%, #61B6CB 50%, #5FA8D3 81.87%)",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
} as const;

function ContactButton({ channel, question, label }: ContactButtonProps) {
  const href = buildContactHref(channel, question);

  async function handleClick() {
    const text = (question.trim() || "Вопрос организаторам").trim();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard can be unavailable in some browsers.
    }

    if (channel === "email") {
      window.location.href = href;
      return;
    }

    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="group relative inline-block min-w-[9.5rem] rounded-full">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full p-[2px]"
        style={gradientBorderStyle}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: gradientBorderStyle.background }}
      />
      <button
        className="relative z-10 flex w-full items-center justify-center gap-2 rounded-full bg-[#1F1F1F4D] px-5 py-2.5 text-sm font-medium text-white transition group-hover:bg-transparent group-hover:text-black"
        onClick={handleClick}
        type="button"
      >
        <ContactIcon channel={channel} />
        {label}
      </button>
    </div>
  );
}

export default function OrganizersQuestionForm() {
  const [question, setQuestion] = useState("");

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h2 className="text-center text-2xl font-semibold leading-tight sm:text-3xl">
        <span className="text-[#A2EBFF]">Остались вопросы?</span>{" "}
        <span className="text-white">Задай их организаторам</span>
      </h2>

      <div className="mt-10">
        <label className="block">
          <span className="mb-2 block text-sm text-white/80">Задайте вопрос</span>
          <textarea
            className="min-h-36 w-full resize-y rounded-2xl border-0 bg-white px-5 py-4 text-sm text-[#262526] outline-none transition focus:ring-2 focus:ring-[#31B2D3]"
            name="question"
            onChange={(event) => setQuestion(event.target.value)}
            placeholder=""
            value={question}
          />
        </label>

        <p className="mt-6 text-left text-sm text-white/80">Отправить через:</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <ContactButton channel="telegram" label="Telegram" question={question} />
          <ContactButton channel="vk" label="Вконтакте" question={question} />
          <ContactButton channel="email" label="Email" question={question} />
        </div>
      </div>
    </section>
  );
}
