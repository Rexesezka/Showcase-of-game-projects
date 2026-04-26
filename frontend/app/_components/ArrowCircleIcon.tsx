import type { SVGProps } from "react";

interface ArrowCircleIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export default function ArrowCircleIcon({
  className = "h-14 w-14",
  ...props
}: ArrowCircleIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 56 56"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="28" cy="28" r="28" fill="white" fillOpacity={0.5} />
      <path
        d="M41 28H15M15 28L24.75 38M15 28L24.75 18"
        stroke="#262526"
        strokeOpacity={0.7}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
