const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          bg: "#0B0A2A",
          main: "#1C1678",
          primary: "#8576FF",
          secondary: "#7BC9FF",
          accent: "#A3FFD6",
        },
      },
      boxShadow: {
        "space-glow": "0 0 30px rgba(133,118,255,0.45)",
        "space-glow-strong": "0 0 45px rgba(123,201,255,0.6)",
        "space-submit-glow": "0 0 20px rgba(133,118,255,0.45)",
        "space-submit-glow-strong": "0 0 26px rgba(123,201,255,0.55)",
        "space-form-glow": "0 0 40px rgba(133,118,255,0.15)",
        "space-link-glow": "0 0 18px rgba(123,201,255,0.10)",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
}

export default config
