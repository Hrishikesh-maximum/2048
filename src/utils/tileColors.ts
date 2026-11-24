export interface TileStyle {
  background: string;
  color: string;
  fontSize: string;
  boxShadow?: string;
  isGoldenGlow?: boolean;
}

export function getTileStyle(value: number, isDark: boolean): TileStyle {
  // Dynamic font size depending on number of digits
  let fontSize = 'text-4xl sm:text-5xl font-extrabold';
  if (value >= 100 && value < 1000) {
    fontSize = 'text-3xl sm:text-4xl font-extrabold';
  } else if (value >= 1000 && value < 10000) {
    fontSize = 'text-2xl sm:text-3xl font-bold tracking-tight';
  } else if (value >= 10000) {
    fontSize = 'text-xl sm:text-2xl font-bold tracking-tighter';
  }

  // Exact requested colors with dark mode adaptations
  switch (value) {
    case 2:
      return {
        background: isDark ? '#334155' : '#eee4da',
        color: isDark ? '#f8fafc' : '#776e65',
        fontSize,
        boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.4)' : '0 2px 4px rgba(0,0,0,0.06)',
      };
    case 4:
      return {
        background: isDark ? '#475569' : '#ede0c8',
        color: isDark ? '#f8fafc' : '#776e65',
        fontSize,
        boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.4)' : '0 2px 4px rgba(0,0,0,0.06)',
      };
    case 8:
      return {
        background: isDark ? '#d97706' : '#f2b179',
        color: '#f9f6f2',
        fontSize,
        boxShadow: isDark ? '0 4px 10px rgba(217, 119, 6, 0.3)' : '0 2px 4px rgba(0,0,0,0.08)',
      };
    case 16:
      return {
        background: isDark ? '#ea580c' : '#f59563',
        color: '#f9f6f2',
        fontSize,
        boxShadow: isDark ? '0 4px 12px rgba(234, 88, 12, 0.35)' : '0 2px 5px rgba(0,0,0,0.1)',
      };
    case 32:
      return {
        background: isDark ? '#e11d48' : '#f67c5f',
        color: '#f9f6f2',
        fontSize,
        boxShadow: isDark ? '0 4px 14px rgba(225, 29, 72, 0.4)' : '0 3px 6px rgba(0,0,0,0.12)',
      };
    case 64:
      return {
        background: isDark ? '#dc2626' : '#f65e3b',
        color: '#f9f6f2',
        fontSize,
        boxShadow: isDark ? '0 4px 16px rgba(220, 38, 38, 0.45)' : '0 3px 8px rgba(0,0,0,0.15)',
      };
    case 128:
      return {
        background: isDark ? '#eab308' : '#edcf72',
        color: '#f9f6f2',
        fontSize,
        boxShadow: '0 0 16px rgba(237, 207, 114, 0.55), 0 4px 6px rgba(0,0,0,0.12)',
      };
    case 256:
      return {
        background: isDark ? '#ca8a04' : '#edcc61',
        color: '#f9f6f2',
        fontSize,
        boxShadow: '0 0 20px rgba(237, 204, 97, 0.65), 0 4px 8px rgba(0,0,0,0.14)',
      };
    case 512:
      return {
        background: isDark ? '#b45309' : '#edc850',
        color: '#f9f6f2',
        fontSize,
        boxShadow: '0 0 24px rgba(237, 200, 80, 0.75), 0 4px 10px rgba(0,0,0,0.16)',
      };
    case 1024:
      return {
        background: isDark ? '#9a3412' : '#edc53f',
        color: '#f9f6f2',
        fontSize,
        boxShadow: '0 0 28px rgba(237, 197, 63, 0.85), 0 5px 12px rgba(0,0,0,0.18)',
      };
    case 2048:
      return {
        // Bright golden gradient with glow effect as specified
        background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)',
        color: '#ffffff',
        fontSize,
        boxShadow: '0 0 35px rgba(251, 191, 36, 0.95), 0 0 15px rgba(245, 158, 11, 0.8), inset 0 0 8px rgba(255, 255, 255, 0.5)',
        isGoldenGlow: true,
      };
    case 4096:
      return {
        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
        color: '#ffffff',
        fontSize,
        boxShadow: '0 0 30px rgba(168, 85, 247, 0.85)',
      };
    case 8192:
      return {
        background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
        color: '#ffffff',
        fontSize,
        boxShadow: '0 0 30px rgba(6, 182, 212, 0.85)',
      };
    default:
      // Beyond 8192
      return {
        background: 'linear-gradient(135deg, #0f172a 0%, #312e81 100%)',
        color: '#38bdf8',
        fontSize,
        boxShadow: '0 0 35px rgba(56, 189, 248, 0.9)',
      };
  }
}
