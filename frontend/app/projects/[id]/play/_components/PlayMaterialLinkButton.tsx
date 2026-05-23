import type { ProjectMaterial } from "../../../../_data/home";

const GRADIENT_BORDER_STYLE = {
  background: "linear-gradient(150.37deg, #8FD1E7 18.13%, #61B6CB 50%, #5FA8D3 81.87%)",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
} as const;

const GRADIENT_FILL_STYLE = {
  background: "linear-gradient(150.37deg, #8FD1E7 18.13%, #61B6CB 50%, #5FA8D3 81.87%)",
} as const;

type PlayMaterialLinkButtonProps = {
  material: ProjectMaterial;
};

export default function PlayMaterialLinkButton({ material }: PlayMaterialLinkButtonProps) {
  return (
    <a
      href={material.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-block rounded-lg"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg p-[2px]"
        style={GRADIENT_BORDER_STYLE}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
        style={GRADIENT_FILL_STYLE}
      />
      <span className="relative z-10 inline-block whitespace-nowrap rounded-[6px] bg-[#1F1F1F4D] px-4 py-2 text-sm font-semibold text-white/85 transition group-hover:bg-transparent group-hover:text-black">
        {material.label}
      </span>
    </a>
  );
}
