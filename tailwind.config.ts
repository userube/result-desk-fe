import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#106b5f",
          dark: "#063d35",
          soft: "#effaf7",
          text: "#171724"
        }
      },
      boxShadow: {
        soft: "0 18px 60px rgba(16, 107, 95, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
