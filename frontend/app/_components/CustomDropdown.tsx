"use client";

import { useEffect, useRef, useState } from "react";

type CustomDropdownProps = {
  options: string[];
  label: string;
};

export default function CustomDropdown({ options, label }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0] ?? "");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerBaseClass =
    "flex h-[50px] w-full items-center justify-center gap-5 rounded-[28px] border border-white/80 bg-[#565656CC] px-5 text-m text-white shadow-[inset_0_0_68px_0_rgba(255,255,255,0.05),inset_0_4px_4px_0_rgba(255,255,255,0.15)] backdrop-blur-xl";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative w-full max-w-[300px]">
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`${triggerBaseClass} ${
          isOpen ? "pointer-events-none invisible" : "transition-colors hover:border-white"
        } relative`}
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
         {label} {selected}
        </span>
        <svg
          aria-hidden
          className="absolute right-5 h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
        </svg>
      </button>

      {isOpen ? (
        <div className="absolute inset-x-0 top-0 z-30 overflow-hidden rounded-[28px] border border-white/80 bg-[#565656CC] shadow-[inset_0_0_68px_0_rgba(255,255,255,0.05),inset_0_4px_4px_0_rgba(255,255,255,0.15)] backdrop-blur-xl">
          <button
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            className="relative flex h-[35px] w-[95%] mt-2 mx-2 mb-1 items-center border rounded-[11px] border-[#8C8C8C80] justify-center text-m text-white"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
              {label} {selected}
            </span>
            <svg
              aria-hidden
              className="absolute right-5 h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path d="M6 15L12 9L18 15" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
            </svg>
          </button>

          <ul
            aria-label={label}
            className="border rounded-[11px] border-[#8C8C8C80] mx-2 mb-3 px-2 text-center"
            role="listbox"
          >
            {options.map((option, index) => (
              <li key={option} className={index > 0 ? "border-t border-[#8C8C8C80]" : ""}>
                <button
                  aria-selected={selected === option}
                  className={`w-full whitespace-nowrap py-1 text-m transition ${
                    selected === option ? "text-[#FFE278]" : "text-white/95 hover:text-white"
                  }`}
                  role="option"
                  type="button"
                  onClick={() => {
                    setSelected(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
