/**
 * SIGE & EduWonder Design Tokens
 * 
 * Centraliza la paleta de colores, sombras y curvas de redondeado
 * detectadas en la auditoría visual, garantizando coherencia estética.
 */

export const DESIGN_TOKENS = {
  colors: {
    // Portal corporativo y administrativo (EduAdmin Pro)
    brand: {
      primary: '#004ddb',
      accent: '#004ac6',
      dark: '#1b1c1c',
      grayText: '#434655',
      lightGrayText: '#737687',
      borderLight: '#eae8e7',
      bgWarm: '#fbf9f8',
      success: '#006e28',
      successText: '#00732a',
      danger: '#ba1a1a',
      dangerBg: '#fff2f0',
      dangerText: '#93000a',
      warning: '#b26a00',
    },
    // Portal de estudiantes gamificado (Aventura Kids)
    kids: {
      primary: '#0c70ea',
      yellow: '#fdd029',
      yellowDark: '#231b00',
      green: '#76fd94',
      greenText: '#002109',
      lightBg: '#f8f9ff',
    },
    // Estilos de la tabla y UI administrativa
    admin: {
      navyHeader: '#1f2d44',
      navyText: '#9ab0cf',
      rowSelected: '#eef4ff',
      rowHover: '#f7f9fb',
      borderMedium: '#c3c6d7',
      borderCard: '#e0e3e5',
      divider: '#d8deea',
    }
  },
  shadows: {
    // Sombra premium con tinte cromático azulado
    premium: '0px 10px 25px -5px rgba(42, 102, 255, 0.08)',
    card: '0px 1px 2px rgba(16, 24, 40, 0.04)',
  },
  radius: {
    kidsCard: '2rem',
    card: '0.75rem', // 12px
    input: '0.5rem',  // 8px
    badge: '9999px',
  }
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
