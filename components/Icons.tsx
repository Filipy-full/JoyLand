// Iconos SVG premium personalizados para Joyland

export const OliveIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="oliveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#5a8c4a", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#2a5023", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="55" rx="28" ry="35" fill="url(#oliveGrad)" />
    <ellipse cx="50" cy="55" rx="20" ry="27" fill="#3d6d33" opacity="0.6" />
    <path d="M 50 20 Q 55 10, 60 15 T 65 25" stroke="#7ba86d" strokeWidth="2" fill="none" />
    <circle cx="45" cy="45" r="4" fill="rgba(255,255,255,0.3)" />
  </svg>
)

export const TreeIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="treeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#7ba86d", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#3d6d33", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect x="45" y="60" width="10" height="30" fill="#5a4a3a" rx="2" />
    <circle cx="50" cy="45" r="22" fill="url(#treeGrad)" />
    <circle cx="38" cy="52" r="18" fill="url(#treeGrad)" opacity="0.8" />
    <circle cx="62" cy="52" r="18" fill="url(#treeGrad)" opacity="0.8" />
    <circle cx="50" cy="35" r="15" fill="#a8ca9c" opacity="0.5" />
  </svg>
)

export const LocationIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="locGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#d4af37", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#aa8b2b", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path d="M 50 10 C 35 10, 25 22, 25 37 C 25 55, 50 80, 50 80 C 50 80, 75 55, 75 37 C 75 22, 65 10, 50 10 Z" 
          fill="url(#locGrad)" />
    <circle cx="50" cy="37" r="12" fill="white" opacity="0.9" />
    <circle cx="50" cy="37" r="6" fill="#5a8c4a" />
  </svg>
)

export const GalleryIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="galGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#7ba86d", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#5a8c4a", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect x="15" y="20" width="70" height="60" rx="5" fill="url(#galGrad)" />
    <rect x="20" y="25" width="60" height="45" fill="white" opacity="0.2" />
    <circle cx="35" cy="38" r="6" fill="#f4e4c1" />
    <path d="M 25 60 L 40 45 L 55 55 L 75 40 L 75 65 L 25 65 Z" fill="rgba(255,255,255,0.3)" />
  </svg>
)

export const GiftIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="giftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#d4af37", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#aa8b2b", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect x="25" y="45" width="50" height="40" rx="3" fill="url(#giftGrad)" />
    <rect x="25" y="35" width="50" height="12" fill="#5a8c4a" rx="2" />
    <rect x="47" y="35" width="6" height="50" fill="#3d6d33" />
    <path d="M 50 35 Q 40 20, 35 25 T 40 35" fill="#f4e4c1" />
    <path d="M 50 35 Q 60 20, 65 25 T 60 35" fill="#f4e4c1" />
  </svg>
)

export const DocumentIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="docGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#e8f0e4", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#c8ddc0", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path d="M 30 10 L 30 90 L 70 90 L 70 25 L 55 10 Z" fill="url(#docGrad)" stroke="#5a8c4a" strokeWidth="2" />
    <path d="M 55 10 L 55 25 L 70 25" fill="none" stroke="#5a8c4a" strokeWidth="2" />
    <line x1="38" y1="40" x2="62" y2="40" stroke="#3d6d33" strokeWidth="2" />
    <line x1="38" y1="50" x2="62" y2="50" stroke="#3d6d33" strokeWidth="2" />
    <line x1="38" y1="60" x2="55" y2="60" stroke="#3d6d33" strokeWidth="2" />
  </svg>
)

export const LeafIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#a8ca9c", stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: "#7ba86d", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#5a8c4a", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path d="M 50 10 Q 80 30, 85 55 Q 88 75, 70 85 Q 55 92, 50 90 Q 45 92, 30 85 Q 12 75, 15 55 Q 20 30, 50 10 Z" 
          fill="url(#leafGrad)" />
    <path d="M 50 10 Q 50 30, 50 90" stroke="#3d6d33" strokeWidth="2" opacity="0.4" />
  </svg>
)

export const HeartIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#d4af37", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#5a8c4a", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path d="M 50 85 C 50 85, 20 60, 20 40 C 20 25, 30 15, 40 20 C 45 22, 50 28, 50 28 C 50 28, 55 22, 60 20 C 70 15, 80 25, 80 40 C 80 60, 50 85, 50 85 Z" 
          fill="url(#heartGrad)" />
    <ellipse cx="38" cy="35" rx="5" ry="7" fill="rgba(255,255,255,0.3)" />
  </svg>
)

export const StarIcon = ({ className = "w-8 h-8", filled = true }: { className?: string; filled?: boolean }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#f4e4c1", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#d4af37", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path d="M 50 10 L 61 38 L 90 41 L 68 60 L 75 89 L 50 73 L 25 89 L 32 60 L 10 41 L 39 38 Z" 
          fill={filled ? "url(#starGrad)" : "none"}
          stroke="#d4af37"
          strokeWidth="2" />
  </svg>
)
