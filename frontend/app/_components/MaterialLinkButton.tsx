import type { ProjectMaterial } from "../_data/home";

type MaterialLinkButtonProps = {
  material: ProjectMaterial;
};

export default function MaterialLinkButton({ material }: MaterialLinkButtonProps) {
  return (
    <a
      href={material.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-block rounded-full"
    >
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
      <span className="relative z-10 inline-block whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-white/85 transition group-hover:bg-transparent group-hover:text-black">
        {material.label}
      </span>
    </a>
  );
}
