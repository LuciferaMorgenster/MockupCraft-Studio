import { SampleLogo } from '../types/mockup';

// Pre-built SVG logos encoded as Data URLs
function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export const SAMPLE_LOGOS: SampleLogo[] = [
  {
    id: 'coffee-roasters',
    name: 'Summit Coffee Co.',
    category: 'Cafe & Food',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <circle cx="200" cy="200" r="185" fill="none" stroke="#1f2937" stroke-width="12" stroke-dasharray="8 6"/>
        <circle cx="200" cy="200" r="160" fill="none" stroke="#1f2937" stroke-width="6"/>
        <path d="M120 220 L200 110 L280 220 Z" fill="#1f2937"/>
        <path d="M165 220 L200 170 L235 220 Z" fill="#ffffff"/>
        <circle cx="200" cy="100" r="14" fill="#d97706"/>
        <path d="M140 260 Q200 240 260 260" stroke="#1f2937" stroke-width="6" fill="none"/>
        <text x="200" y="295" font-family="'Inter', sans-serif" font-weight="900" font-size="28" fill="#1f2937" text-anchor="middle" letter-spacing="4">SUMMIT</text>
        <text x="200" y="325" font-family="'Inter', sans-serif" font-weight="600" font-size="16" fill="#6b7280" text-anchor="middle" letter-spacing="6">ROASTERY • 1984</text>
      </svg>
    `),
  },
  {
    id: 'cyber-pulse',
    name: 'CyberPulse Tech',
    category: 'Tech & Modern',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3b82f6"/>
            <stop offset="50%" stop-color="#8b5cf6"/>
            <stop offset="100%" stop-color="#ec4899"/>
          </linearGradient>
        </defs>
        <rect x="80" y="80" width="240" height="240" rx="40" fill="url(#cyberGrad)"/>
        <path d="M130 200 L170 200 L190 140 L210 260 L230 200 L270 200" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="200" cy="200" r="8" fill="#ffffff"/>
        <text x="200" y="355" font-family="'Inter', sans-serif" font-weight="800" font-size="24" fill="#111827" text-anchor="middle" letter-spacing="3">CYBERPULSE</text>
      </svg>
    `),
  },
  {
    id: 'wildwood-outdoors',
    name: 'Wildwood Outdoor',
    category: 'Adventure',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <polygon points="200,40 360,320 40,320" fill="none" stroke="#166534" stroke-width="12" stroke-linejoin="round"/>
        <!-- Pine trees inside triangle -->
        <path d="M200 90 L230 140 L215 140 L245 190 L225 190 L260 250 L140 250 L175 190 L155 190 L185 140 L170 140 Z" fill="#166534"/>
        <rect x="193" y="250" width="14" height="30" fill="#166534"/>
        <!-- Sun -->
        <circle cx="270" cy="110" r="22" fill="#eab308"/>
        <text x="200" y="365" font-family="'Inter', sans-serif" font-weight="900" font-size="24" fill="#166534" text-anchor="middle" letter-spacing="5">WILDWOOD</text>
        <text x="200" y="388" font-family="'Inter', sans-serif" font-weight="600" font-size="13" fill="#65a30d" text-anchor="middle" letter-spacing="3">EXPEDITION OUTFITTERS</text>
      </svg>
    `),
  },
  {
    id: 'monogram-luxe',
    name: 'Atelier Maison',
    category: 'Luxury Minimal',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <circle cx="200" cy="200" r="150" fill="none" stroke="#b45309" stroke-width="4"/>
        <text x="200" y="225" font-family="'Cinzel', 'Playfair Display', serif" font-weight="600" font-size="110" fill="#b45309" text-anchor="middle">AM</text>
        <path d="M120 200 L140 200 M260 200 L280 200" stroke="#b45309" stroke-width="3"/>
        <text x="200" y="280" font-family="'Inter', sans-serif" font-weight="600" font-size="15" fill="#78350f" text-anchor="middle" letter-spacing="8">ATELIER MAISON</text>
        <text x="200" y="300" font-family="'Inter', sans-serif" font-weight="400" font-size="11" fill="#92400e" text-anchor="middle" letter-spacing="5">PARIS • NEW YORK</text>
      </svg>
    `),
  },
  {
    id: 'neon-athletics',
    name: 'Aero Athletics',
    category: 'Sports & Active',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <path d="M60 260 L180 80 L230 80 L140 260 Z" fill="#ef4444"/>
        <path d="M190 260 L290 110 L340 110 L270 260 Z" fill="#1e293b"/>
        <text x="200" y="325" font-family="'Inter', sans-serif" font-weight="900" font-size="32" font-style="italic" fill="#0f172a" text-anchor="middle" letter-spacing="3">AERO</text>
        <text x="200" y="355" font-family="'Inter', sans-serif" font-weight="700" font-size="14" fill="#ef4444" text-anchor="middle" letter-spacing="6">PERFORMANCE GEAR</text>
      </svg>
    `),
  },
  {
    id: 'botanica-organics',
    name: 'Botanica Organics',
    category: 'Wellness & Eco',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <path d="M200 70 C240 120 280 180 280 240 C280 290 245 330 200 330 C155 330 120 290 120 240 C120 180 160 120 200 70 Z" fill="none" stroke="#047857" stroke-width="8"/>
        <path d="M200 130 C200 210 200 290 200 310" stroke="#047857" stroke-width="6"/>
        <path d="M200 190 Q240 170 250 150" stroke="#047857" stroke-width="6" fill="none"/>
        <path d="M200 240 Q160 220 150 200" stroke="#047857" stroke-width="6" fill="none"/>
        <text x="200" y="365" font-family="'Inter', sans-serif" font-weight="700" font-size="20" fill="#065f46" text-anchor="middle" letter-spacing="4">BOTANICA</text>
        <text x="200" y="388" font-family="'Inter', sans-serif" font-weight="500" font-size="12" fill="#059669" text-anchor="middle" letter-spacing="3">PURE &amp; ORGANIC</text>
      </svg>
    `),
  },
];
