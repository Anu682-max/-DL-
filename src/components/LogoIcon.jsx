export default function LogoIcon({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="DLシステム海 logo"
    >
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f3fa8" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="wave1Grad" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="wave2Grad" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="50%" stopColor="#dbeafe" />
          <stop offset="100%" stopColor="#bfdbfe" />
        </linearGradient>
        <clipPath id="logoClip">
          <rect width="48" height="48" rx="12" />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width="48" height="48" rx="12" fill="url(#bgGrad)" />

      {/* Waves clipped inside rounded rect */}
      <g clipPath="url(#logoClip)">
        {/* Wave layer 1 - back */}
        <path
          d="M-2 34 C4 29 10 39 16 34 C22 29 28 39 34 34 C40 29 46 39 52 34 L52 50 L-2 50 Z"
          fill="url(#wave1Grad)"
          opacity="0.45"
        />
        {/* Wave layer 2 - mid */}
        <path
          d="M-2 37.5 C3 33 9 42 15 37.5 C21 33 27 42 33 37.5 C39 33 45 42 51 37.5 L51 50 L-2 50 Z"
          fill="url(#wave2Grad)"
          opacity="0.35"
        />
        {/* Wave layer 3 - front crest */}
        <path
          d="M-2 41 C4 37 10 45 16 41 C22 37 28 45 34 41 C40 37 46 45 52 41 L52 50 L-2 50 Z"
          fill="white"
          opacity="0.18"
        />
      </g>

      {/* DL text */}
      <text
        x="5"
        y="29"
        fontFamily="'Inter', 'Arial Black', sans-serif"
        fontWeight="900"
        fontSize="20"
        fill="white"
        letterSpacing="-1"
      >
        DL
      </text>

      {/* Small sparkle top-right */}
      <circle cx="40" cy="9" r="2" fill="white" opacity="0.6" />
      <circle cx="44" cy="13" r="1.2" fill="white" opacity="0.35" />
    </svg>
  );
}
