/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const mode = 'jit';
export const purge = [
  './index.html',
  './src/**/*.{js,jsx,ts,tsx,vue}',
];
export const theme = {
  extend: {
    colors: { "fuschia-100": "var(--fuschia-100)", "fuschia-60": "var(--fuschia-60)", "fuschia-80": "var(--fuschia-80)", "iris-100": "var(--iris-100)", "iris-60": "var(--iris-60)", "iris-80": "var(--iris-80)", }, fontFamily: { body: "var(--body-font-family)", "header-1": "var(--header-1-font-family)", "header-2": "var(--header-2-font-family)", }
  },
};
export const plugins = [
  require('@tailwindcss/typography'),
];