// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fontFamily } = require("tailwindcss/defaultTheme");

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
        ["overlay-light"]: "rgba(237, 242, 247, 0.2)",
      },
      fontFamily: {
        sans: ["var(--font-my-sans)", ...fontFamily.sans],
        ["sans-secondary"]: ["var(--font-my-sans-2)", ...fontFamily.sans],
        ["sans-3"]: ["var(--font-my-sans-3)", ...fontFamily.sans],
        serif: ["var(--font-my-serif)", ...fontFamily.serif],
        ["serif-secondary"]: ["var(--font-my-serif-2)", ...fontFamily.serif],
        ["serif-3"]: ["var(--font-my-serif-3)", ...fontFamily.serif],
      },
      fontSize: {
        mid: "15px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};

module.exports = config;
