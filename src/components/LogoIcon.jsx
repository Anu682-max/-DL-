export default function LogoIcon({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="DLシステム海 logo"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="waveGrad" x1="0" y1="0" x2="40" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.7" />
        </linearGradient>
        <clipPath id="roundedClip">
          <rect width="40" height="40" rx="10" />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width="40" height="40" rx="10" fill="url(#logoGrad)" />

      {/* Wave (海 symbol) at bottom */}
      <g clipPath="url(#roundedClip)">
        <path
          d="M0 30 Q5 26 10 30 Q15 34 20 30 Q25 26 30 30 Q35 34 40 30 L40 40 L0 40 Z"
          fill="url(#waveGrad)"
          opacity="0.35"
        />
        <path
          d="M0 33 Q5 29 10 33 Q15 37 20 33 Q25 29 30 33 Q35 37 40 33 L40 40 L0 40 Z"
          fill="white"
          opacity="0.12"
        />
      </g>

      {/* DL letters */}
      <text
        x="5"
        y="25"
        fontFamily="'Inter', 'Arial', sans-serif"
        fontWeight="800"
        fontSize="17"
        fill="white"
        letterSpacing="-0.5"
      >
        DL
      </text>

      {/* Small dot accent */}
      <circle cx="33" cy="10" r="2.5" fill="white" opacity="0.5" />
    </svg>
  );
}
