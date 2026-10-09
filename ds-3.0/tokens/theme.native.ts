// Sintonía DS 3.0 · tema para React Native / Expo.
// GENERADO por scripts/export_native.py desde tokens/tokens.json. No editar a mano.
// Fuente: Sintonía DS 3.0 · E3 — formato DTCG. Generado por scripts/export_tokens.py.
//
// Fuentes (cárgalas con useFonts antes de mostrar texto):
//   import { Archivo_700Bold, Archivo_800ExtraBold } from "@expo-google-fonts/archivo";
//   import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
//   import { JetBrainsMono_500Medium, JetBrainsMono_700Bold, JetBrainsMono_800ExtraBold } from "@expo-google-fonts/jetbrains-mono";

export const colors = {
  light: {
    bg: {
      canvas: "#faf9f6",
      surface: "#ffffff",
      surfaceMuted: "#efede7",
      surfaceHover: "#ece9e1",
      inverse: "#1f2226",
      brand: "#1f4b7a",
      brandHover: "#173a60",
      brandSoft: "#dce6f2",
      brandDeep: "#0f2843",
      accent: "#b8800f",
      accentHover: "#9c6c0b",
      accentSoft: "#fbefd2",
      danger: "#bf4f5c",
      dangerSoft: "#fbe6e9",
      critical: "#a11f1a",
      criticalSoft: "#fbe4e2",
      bakeliteSoft: "#efede7",
    },
    text: {
      primary: "#1f2226",
      secondary: "#47494d",
      disabled: "#8e8c86",
      brand: "#1f4b7a",
      accentStrong: "#654404",
      danger: "#7a2d3a",
      critical: "#8a1d17",
      onBrand: "#ffffff",
      onAccent: "#1f2226",
      onCritical: "#ffffff",
      onDeep: "#ffffff",
      inverse: "#ffffff",
      bakelite: "#47494d",
    },
    icon: {
      primary: "#1f2226",
      secondary: "#47494d",
      brand: "#1f4b7a",
      onBrand: "#ffffff",
      danger: "#7a2d3a",
    },
    border: {
      default: "#e6e3dc",
      strong: "#827d73",
      brand: "#1f4b7a",
      accent: "#9c6c0b",
      danger: "#bf4f5c",
      focus: "#1f4b7a",
      critical: "#a11f1a",
      warning: "#ebc46a",
    },
    signal: {
      searching: "#b8800f",
      live: "#2f639b",
      locked: "#173a60",
      off: "#a11f1a",
      glow: "#b7cbe3",
    },
    chat: {
      canvas: "#faf9f6",
      bubbleIn: "#efede7",
      bubbleOut: "#dce6f2",
      meta: "#47494d",
    },
    data: {
      bar: "#1f4b7a",
      track: "#ece9e1",
    },
    radio: {
      display: "#efede7",
      displayInk: "#654404",
      displayLive: "#1f4b7a",
      chrome: "#dad6cc",
      grille: "#dad6cc",
      valveGlass: "#fbefd2",
      valveCore: "#fbefd2",
    },
    shadow: {
      soft: "#1f212614",
      strong: "#1f21262e",
      inner: "#1f21261f",
    },
  },
  dark: {
    bg: {
      canvas: "#0e1116",
      surface: "#141920",
      surfaceMuted: "#1a2029",
      surfaceHover: "#212833",
      inverse: "#e8ecf1",
      brand: "#8db1dd",
      brandHover: "#b7cbe3",
      brandSoft: "#1a3150",
      brandDeep: "#1f4b7a",
      accent: "#ebc46a",
      accentHover: "#f3d791",
      accentSoft: "#3a2c0e",
      danger: "#e8939e",
      dangerSoft: "#3d1e25",
      critical: "#f28b82",
      criticalSoft: "#3f1a18",
      bakeliteSoft: "#1a2029",
    },
    text: {
      primary: "#e8ecf1",
      secondary: "#c7ced7",
      disabled: "#6f7886",
      brand: "#b7cbe3",
      accentStrong: "#f3d791",
      danger: "#f2b8c0",
      critical: "#f6a8a1",
      onBrand: "#0e1116",
      onAccent: "#0e1116",
      onCritical: "#0e1116",
      onDeep: "#ffffff",
      inverse: "#0e1116",
      bakelite: "#c7ced7",
    },
    icon: {
      primary: "#e8ecf1",
      secondary: "#a9b2be",
      brand: "#b7cbe3",
      onBrand: "#0e1116",
      danger: "#f2b8c0",
    },
    border: {
      default: "#2c3440",
      strong: "#6f7886",
      brand: "#8db1dd",
      accent: "#ebc46a",
      danger: "#e8939e",
      focus: "#b7cbe3",
      critical: "#f28b82",
      warning: "#ebc46a",
    },
    signal: {
      searching: "#ebc46a",
      live: "#8db1dd",
      locked: "#b7cbe3",
      off: "#f28b82",
      glow: "#1a3150",
    },
    chat: {
      canvas: "#0e1116",
      bubbleIn: "#1a2029",
      bubbleOut: "#1a3150",
      meta: "#c7ced7",
    },
    data: {
      bar: "#8db1dd",
      track: "#2c3440",
    },
    radio: {
      display: "#0a0d11",
      displayInk: "#f3d791",
      displayLive: "#b7cbe3",
      chrome: "#3a4350",
      grille: "#2c3440",
      valveGlass: "#b8800f",
      valveCore: "#fbefd2",
    },
    shadow: {
      soft: "#00000073",
      strong: "#00000099",
      inner: "#00000080",
    },
  },
} as const;

export const spacing = {
  0: 0,
  2: 2,
  4: 4,
  6: 6,
  8: 8,
  10: 10,
  12: 12,
  14: 14,
  16: 16,
  18: 18,
  20: 20,
  24: 24,
  28: 28,
  32: 32,
  40: 40,
  48: 48,
  64: 64,
  80: 80,
} as const;

export const radius = {
  none: 0,
  "3xs": 2,
  "2xs": 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 28,
  device: 36,
  full: 9999,
} as const;

export const size = {
  touch_min: 44,
  control_md: 48,
  control_sm: 36,
  icon_sm: 16,
  icon_md: 20,
  icon_lg: 24,
} as const;

export const stroke = {
  1: 1,
  "1_5": 1.5,
  2: 2,
} as const;

/** lineHeight y letterSpacing en px (convertidos desde los % de Figma). */
export const typography = {
  docDisplay: { fontFamily: "Archivo_800ExtraBold", fontSize: 64, lineHeight: 70.4, letterSpacing: -1.28 }, // Archivo 800 · 64/110% · -2%
  docH1: { fontFamily: "Archivo_800ExtraBold", fontSize: 40, lineHeight: 46, letterSpacing: -0.6 }, // Archivo 800 · 40/115% · -1.5%
  docH2: { fontFamily: "Archivo_700Bold", fontSize: 28, lineHeight: 33.6, letterSpacing: -0.28 }, // Archivo 700 · 28/120% · -1%
  docH3: { fontFamily: "Archivo_700Bold", fontSize: 26, lineHeight: 31.2, letterSpacing: -0.26 }, // Archivo 700 · 26/120% · -1%
  docH4: { fontFamily: "Archivo_700Bold", fontSize: 24, lineHeight: 28.8, letterSpacing: -0.24 }, // Archivo 700 · 24/120% · -1%
  displayHero: { fontFamily: "Archivo_800ExtraBold", fontSize: 32, lineHeight: 36.8, letterSpacing: -0.48 }, // Archivo 800 · 32/115% · -1.5%
  brandWordmark: { fontFamily: "Archivo_800ExtraBold", fontSize: 19, lineHeight: 22.8, letterSpacing: -0.38 }, // Archivo 800 · 19/120% · -2%
  headingH2: { fontFamily: "Archivo_700Bold", fontSize: 19, lineHeight: 24.7, letterSpacing: -0.19 }, // Archivo 700 · 19/130% · -1%
  headingH3: { fontFamily: "Archivo_700Bold", fontSize: 17, lineHeight: 22.95, letterSpacing: -0.17 }, // Archivo 700 · 17/135% · -1%
  headingH4: { fontFamily: "Archivo_700Bold", fontSize: 16, lineHeight: 22.4 }, // Archivo 700 · 16/140% · 0%
  bodyChat: { fontFamily: "Inter_400Regular", fontSize: 17, lineHeight: 24 }, // Inter 400 · 17/24px · 0%
  bodyDefault: { fontFamily: "Inter_400Regular", fontSize: 16, lineHeight: 24 }, // Inter 400 · 16/150% · 0%
  bodyStrong: { fontFamily: "Inter_600SemiBold", fontSize: 16, lineHeight: 24 }, // Inter 600 · 16/150% · 0%
  bodySmall: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20.3 }, // Inter 400 · 14/145% · 0%
  bodySmallStrong: { fontFamily: "Inter_600SemiBold", fontSize: 14, lineHeight: 20.3 }, // Inter 600 · 14/145% · 0%
  captionDefault: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18.2 }, // Inter 400 · 13/140% · 0%
  labelField: { fontFamily: "Inter_600SemiBold", fontSize: 16, lineHeight: 21.6 }, // Inter 600 · 16/135% · 0%
  labelEyebrow: { fontFamily: "Inter_600SemiBold", fontSize: 13, lineHeight: 16.9, letterSpacing: 0.52 }, // Inter 600 · 13/130% · 4%
  labelCompact: { fontFamily: "Inter_600SemiBold", fontSize: 13, lineHeight: 15 }, // Inter 600 · 13/15px · 0%
  buttonDefault: { fontFamily: "Inter_700Bold", fontSize: 16, lineHeight: 20 }, // Inter 700 · 16/125% · 0%
  buttonSmall: { fontFamily: "Inter_700Bold", fontSize: 14, lineHeight: 17.5 }, // Inter 700 · 14/125% · 0%
  badgeDefault: { fontFamily: "Inter_700Bold", fontSize: 12, lineHeight: 15.6 }, // Inter 700 · 12/130% · 0%
  dataMeter: { fontFamily: "JetBrainsMono_700Bold", fontSize: 12, lineHeight: 16, letterSpacing: 0.96 }, // JetBrains Mono 700 · 12/16px · 8%
  dataTime: { fontFamily: "JetBrainsMono_700Bold", fontSize: 16, lineHeight: 22 }, // JetBrains Mono 700 · 16/22px · 0%
  dataTabular: { fontFamily: "JetBrainsMono_500Medium", fontSize: 14, lineHeight: 20 }, // JetBrains Mono 500 · 14/20px · 0%
  dataTabularStrong: { fontFamily: "JetBrainsMono_700Bold", fontSize: 14, lineHeight: 20 }, // JetBrains Mono 700 · 14/20px · 0%
  dataKpi: { fontFamily: "JetBrainsMono_800ExtraBold", fontSize: 24, lineHeight: 28.8, letterSpacing: -0.48 }, // JetBrains Mono 800 · 24/120% · -2%
  dataDisplay: { fontFamily: "JetBrainsMono_800ExtraBold", fontSize: 40, lineHeight: 44, letterSpacing: -0.8 }, // JetBrains Mono 800 · 40/110% · -2%
  dataDisplayXl: { fontFamily: "JetBrainsMono_800ExtraBold", fontSize: 64, lineHeight: 64, letterSpacing: -1.92 }, // JetBrains Mono 800 · 64/100% · -3%
} as const;

/** iOS usa shadow*, Android elevation; RN 0.76+ (Expo 52, nueva arquitectura) acepta boxShadow. */
export const shadows = {
  light: {
    card: {
      shadowColor: "#1f212614",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowRadius: 4,
      shadowOpacity: 1,
      elevation: 4,
      boxShadow: "0px 2px 8px 0px #1f212614",
    },
    toast: {
      shadowColor: "#1f21262e",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowRadius: 12,
      shadowOpacity: 1,
      elevation: 12,
      boxShadow: "0px 8px 24px 0px #1f21262e",
    },
  },
  dark: {
    card: {
      shadowColor: "#00000073",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowRadius: 4,
      shadowOpacity: 1,
      elevation: 4,
      boxShadow: "0px 2px 8px 0px #00000073",
    },
    toast: {
      shadowColor: "#00000099",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowRadius: 12,
      shadowOpacity: 1,
      elevation: 12,
      boxShadow: "0px 8px 24px 0px #00000099",
    },
  },
} as const;
// Sin equivalente en RN y omitidos: Shadow/Knob pressed, Focus/Ring.

export type ColorScheme = keyof typeof colors;
export const getTheme = (scheme: ColorScheme | null | undefined) => {
  const s: ColorScheme = scheme === "dark" ? "dark" : "light";
  return { scheme: s, colors: colors[s], shadows: shadows[s], spacing, radius, size, stroke, typography };
};
export type Theme = ReturnType<typeof getTheme>;
