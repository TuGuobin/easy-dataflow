export type Color = "blue" | "green" | "orange" | "purple" | "indigo" | "red" | "yellow" | "pink" | "amber" | "teal" | "cyan" | "lime" | "emerald" | "fuchsia" | "rose" | "gray"

export interface ThemeConfig {
  primary: string
  border: string
  bg: string
  bgLight: string
  bgLighter: string
  bgDark: string
  bgDarker: string
  text: string
  textLight: string
  textLighter: string
  textDark: string
  textDarker: string
  borderLight: string
  borderDark: string
  borderDarker: string
  hoverBg: string
  hoverBgLight: string
  hoverBgDark: string
  hoverBorder: string
  activeBg: string
  activeBgDark: string
  activeBorder: string
  handleBg: string
  handleBorder: string
}

export const AlertColors = {
  info: {
    icon: "text-blue-500",
    header: "from-blue-500 to-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  success: {
    icon: "text-green-500",
    header: "from-green-500 to-green-600",
    button: "bg-green-600 hover:bg-green-700",
  },
  warning: {
    icon: "text-yellow-500",
    header: "from-yellow-500 to-yellow-600",
    button: "bg-yellow-600 hover:bg-yellow-700",
  },
  error: {
    icon: "text-red-500",
    header: "from-red-500 to-red-600",
    button: "bg-red-600 hover:bg-red-700",
  },
  confirm: {
    icon: "text-blue-500",
    header: "from-blue-500 to-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
  },
} as const

export const createThemeConfig = (color: Color): ThemeConfig => {
  const colorMap: Record<Color, { handleBg: string; handleBorder: string }> = {
    blue: { handleBg: "#3b82f6", handleBorder: "#1d4ed8" },
    green: { handleBg: "#10b981", handleBorder: "#059669" },
    orange: { handleBg: "#f59e0b", handleBorder: "#d97706" },
    purple: { handleBg: "#8b5cf6", handleBorder: "#7c3aed" },
    red: { handleBg: "#ef4444", handleBorder: "#dc2626" },
    indigo: { handleBg: "#6366f1", handleBorder: "#4f46e5" },
    yellow: { handleBg: "#f59e0b", handleBorder: "#d97706" },
    pink: { handleBg: "#ec4899", handleBorder: "#db2777" },
    amber: { handleBg: "#f59e0b", handleBorder: "#d97706" },
    teal: { handleBg: "#14b8a6", handleBorder: "#0d9488" },
    cyan: { handleBg: "#06b6d4", handleBorder: "#0891b2" },
    lime: { handleBg: "#84cc16", handleBorder: "#65a30d" },
    emerald: { handleBg: "#10b981", handleBorder: "#059669" },
    fuchsia: { handleBg: "#d946ef", handleBorder: "#c026d3" },
    rose: { handleBg: "#f43f5e", handleBorder: "#e11d48" },
    gray: { handleBg: "#6b7280", handleBorder: "#4b5563" },
  }

  const handleColors = colorMap[color]

  return {
    primary: color,
    border: `border-${color}-500`,
    bg: `bg-${color}-200`,
    bgLight: `bg-${color}-100`,
    bgLighter: `bg-${color}-50`,
    bgDark: `bg-${color}-500`,
    bgDarker: `bg-${color}-700`,
    text: `text-${color}-500`,
    textLight: `text-${color}-300`,
    textLighter: `text-${color}-100`,
    textDark: `text-${color}-700`,
    textDarker: `text-${color}-900`,
    borderLight: `border-${color}-200`,
    borderDark: `border-${color}-700`,
    borderDarker: `border-${color}-900`,
    hoverBg: `hover:bg-${color}-300`,
    hoverBgLight: `hover:bg-${color}-100`,
    hoverBgDark: `hover:bg-${color}-400`,
    hoverBorder: `hover:border-${color}-400`,
    activeBg: `active:bg-${color}-400`,
    activeBgDark: `active:bg-${color}-600`,
    activeBorder: `active:border-${color}-500`,
    handleBg: handleColors.handleBg,
    handleBorder: handleColors.handleBorder,
  }
}

export const getThemeConfig = (color: Color): ThemeConfig => {
  return createThemeConfig(color)
}
