/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          background: "#0D1117",
          card: "#1A1F26",
          cardHover: "#1E242C",
          accent: "#3B82F6"
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#94A3B8",
          accent: "#3B82F6",
          balance: "#CBD5E1"
        },
        button: {
          primary: {
            DEFAULT: "#3B82F6",
            hover: "#2563EB",
            disabled: "#1E293B"
          },
          secondary: {
            DEFAULT: "#1E293B",
            hover: "#2D3748"
          }
        },
        token: {
          avax: {
            background: "#E84142",
            text: "#FFFFFF"
          }
        }
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        full: "9999px"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem"
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700"
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} 