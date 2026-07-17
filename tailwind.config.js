/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Inter y no IBM Plex Sans (lo que pedía la marca v3): Plex tope en
        // peso 700 y los titulares usan 800. El stack del sistema queda de
        // respaldo mientras carga el woff2.
        sans: [
          "'Inter Variable'",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "'Apple Color Emoji'",
          "'Segoe UI Emoji'",
        ],
        mono: [
          "'JetBrains Mono Variable'",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      colors: {
        // Púrpura de marca Systemic Solutions.
        // 500 (#7A2BFA) es el oficial y se usa sobre fondos claros.
        // 400 (#9D5CFF) es la variante para fondos oscuros: el 500 sobre el
        // navy #0F172A cae a 3.02:1 y se apaga por debajo de su propia etiqueta.
        brand: {
          purple: {
            50: "#F4EDFF",
            100: "#E9DBFF",
            400: "#9D5CFF",
            500: "#7A2BFA",
            600: "#6620D6",
            700: "#5318AF",
            DEFAULT: "#7A2BFA",
          },
          // El teal de marca #14B8A6 vale para rellenos y para el logo, pero
          // como TEXTO sobre blanco da 2.49:1 y falla. Variantes:
          //   text (#0D9488) -> 3.74:1, para titulares (texto grande) e iconos
          //   deep (#0F766E) -> 5.47:1, para texto pequeño
          //   on-dark        -> sobre la banda navy
          teal: {
            DEFAULT: "#14B8A6",
            text: "#0D9488",
            deep: "#0F766E",
            "on-dark": "#2DD4BF",
          },
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}