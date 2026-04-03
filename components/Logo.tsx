// Logo.tsx generado automáticamente desde el SVG
// Puedes ajustar el tamaño con las props className, width, height, etc.

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  src: string;
  width?: number | string;
  height?: number | string;
  ariaLabel?: string;
}

export default function Logo({ src, width = 224.88, height = 225, ariaLabel = 'Logo', ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-label={ariaLabel}
      width={width}
      height={height}
      {...props}
    >
      <image
        href={src}
        width={width}
        height={height}
        x="0"
        y="0"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}
