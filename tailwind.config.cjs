/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        xxxs: ".1rem",
        xxs: ".25rem",
        xs: ".5rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "6rem",
        "2.5xl": "7.5rem",
        "3xl": "9rem",
      },
      colors: {
        ["my-success"]: "hsl(154 61% 92%)",
        ["my-success-content"]: "hsl(160 83.8% 33.9%)",
        ["my-alert"]: "hsl(0 84% 91.1%)",
        ["my-alert-content"]: "hsl(0 84% 63.1%)",
        ["my-error"]: "hsl(28 94.4% 92.9%)",
        ["my-error-content"]: "hsl(16 100% 56.1%)",
        ["my-subtle-info"]: "hsl(217 10 64)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};

module.exports = config;
