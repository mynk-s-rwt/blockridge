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
        // App backgrounds
        app: {
          background: "#0D1117",
        },
        // Navbar
        navbar: {
          background: "transparent",
          border: "rgba(255,255,255,0.1)",
          icon: {
            DEFAULT: "#FFFFFF",
            hover: "#3B82F6"
          },
          text: {
            primary: "#FFFFFF",
            secondary: "#94A3B8"
          }
        },
        // Cards
        card: {
          bg: "#1A1F26",
          border: "rgba(255,255,255,0.1)",
          hover: "#1E242C",
          content: {
            primary: "#FFFFFF",
            secondary: "#94A3B8",
            balance: "#CBD5E1"
          },
          icon: {
            fill: "#FFFFFF",
            background: "none"
          }
        },
        // Buttons
        button: {
          primary: {
            DEFAULT: "#3B82F6",
            text: "#FFFFFF",
            hover: "#2563EB",
            active: "#1E293B",
            disabled: {
              bg: "#1E293B",
              text: "#64748B"
            },
            focus: {
              border: "#3B82F6",
              shadow: "rgba(59,130,246,0.2)"
            }
          },
          secondary: {
            DEFAULT: "#1E293B",
            text: "#FFFFFF",
            hover: "#2D3748",
            active: "#2D3748"
          }
        },
        // Inputs
        input: {
          bg: "#1A1F26",
          border: "rgba(255,255,255,0.1)",
          text: "#FFFFFF",
          placeholder: "#64748B",
          focus: {
            border: "#3B82F6",
            shadow: "rgba(59,130,246,0.2)"
          }
        },
        // Token Selector
        tokenSelector: {
          button: {
            bg: "#1A1F26",
            border: "rgba(255,255,255,0.1)",
            text: "#FFFFFF",
            icon: {
              bg: "#E84142",
              text: "#FFFFFF"
            },
            hover: "#1E242C"
          },
          dropdown: {
            bg: "#1A1F26",
            border: "rgba(255,255,255,0.1)"
          }
        },
        // Icons
        icon: {
          DEFAULT: "#FFFFFF",
          avax: {
            bg: "#E84142",
            text: "#FFFFFF"
          }
        },
        // Shadows
        shadow: {
          card: "0 4px 6px -1px rgba(0,0,0,0.1)",
          dropdown: "0 10px 15px -3px rgba(0,0,0,0.1)"
        },
        // Text
        text: {
          primary: "#FFFFFF",
          secondary: "#94A3B8",
          balance: "#CBD5E1"
        }
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        full: "9999px",
        card: "1rem",
        button: "0.5rem",
        input: "0.75rem",
        tokenSelector: "0.75rem"
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
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        card: "0 4px 6px -1px rgba(0,0,0,0.1)",
        dropdown: "0 10px 15px -3px rgba(0,0,0,0.1)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 