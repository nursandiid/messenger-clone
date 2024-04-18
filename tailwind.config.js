import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
    "./storage/framework/views/*.php",
    "./resources/views/**/*.blade.php",
    "./resources/js/**/*.tsx",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Figtree", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        primary: {
          DEFAULT: colors.blue[600],
          dark: colors.blue[700],
        },
        success: {
          DEFAULT: colors.emerald[600],
          dark: colors.emerald[700],
        },
        danger: {
          DEFAULT: colors.red[600],
          dark: colors.red[700],
        },
      },
    },
  },

  darkMode: ["class"],

  plugins: [forms],
};
