import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export default function CircleArrowIcon({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 19 19"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="9.5" cy="9.5" r="8.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.8 6.6L7.9 9.5L10.8 12.4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}
