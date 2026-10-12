import React from 'react';

export const PhoenixLogoIcon = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="phxFlame" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="35%" stopColor="#f97316" />
          <stop offset="70%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>

        <linearGradient id="phxWingLeft" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="40%" stopColor="#ea580c" />
          <stop offset="80%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>

        <linearGradient id="phxWingRight" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="40%" stopColor="#ea580c" />
          <stop offset="80%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>

        <linearGradient id="phxBagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#f97316" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.3" />
        </linearGradient>

        <linearGradient id="phxHandleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>

        <filter id="phxGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Bag Handle */}
      <path
        d="M42 38 C42 22, 78 22, 78 38"
        fill="none"
        stroke="url(#phxHandleGrad)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Bag Body */}
      <path
        d="M26 42 L34 100 C34 103, 37 106, 41 106 L79 106 C83 106, 86 103, 86 100 L94 42 C94.5 38.5, 91.5 36, 88 36 L32 36 C28.5 36, 25.5 38.5, 26 42 Z"
        fill="rgba(15, 23, 42, 0.55)"
        stroke="url(#phxBagGrad)"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* Bag Rim Line */}
      <path d="M29 44 L91 44" stroke="url(#phxFlame)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

      {/* Phoenix Wings - Left */}
      <path d="M60 68 C46 62, 22 52, 10 26 C22 36, 38 46, 54 58 Z" fill="url(#phxWingLeft)" filter="url(#phxGlow)" />
      <path d="M60 70 C48 66, 28 60, 16 42 C28 48, 42 56, 56 64 Z" fill="url(#phxWingLeft)" />
      <path d="M60 72 C50 70, 34 68, 24 58 C34 62, 46 66, 58 70 Z" fill="url(#phxFlame)" />

      {/* Phoenix Wings - Right */}
      <path d="M60 68 C74 62, 98 52, 110 26 C98 36, 82 46, 66 58 Z" fill="url(#phxWingRight)" filter="url(#phxGlow)" />
      <path d="M60 70 C72 66, 92 60, 104 42 C92 48, 78 56, 64 64 Z" fill="url(#phxWingRight)" />
      <path d="M60 72 C70 70, 86 68, 96 58 C86 62, 74 66, 62 70 Z" fill="url(#phxFlame)" />

      {/* Phoenix Body & Tail */}
      <path
        d="M60 48 C55 56, 53 66, 56 78 C58 86, 52 94, 46 98 C54 96, 60 90, 62 82 C65 92, 72 100, 78 104 C74 98, 70 88, 66 78 C68 66, 65 56, 60 48 Z"
        fill="url(#phxFlame)"
        filter="url(#phxGlow)"
      />

      {/* Crest & Head */}
      <path d="M60 44 C58 36, 52 30, 47 25 C53 30, 57 36, 58 40 Z" fill="#fef08a" />
      <path d="M60 44 C60 32, 60 22, 60 16 C61 24, 63 32, 62 40 Z" fill="#fef08a" />
      <path d="M60 44 C62 36, 68 30, 73 25 C67 30, 63 36, 62 40 Z" fill="#fef08a" />

      <path d="M57 44 C57 40, 63 40, 63 44 C64 47, 60 50, 57 48 Z" fill="#fef08a" />
      <polygon points="63,44 68,46 63,47" fill="#fbbf24" />
      <circle cx="59.5" cy="43.5" r="1" fill="#1e1b4b" />
    </svg>
  );
};

export default PhoenixLogoIcon;
