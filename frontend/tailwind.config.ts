import type { Config } from 'tailwindcss'

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [{
      wsapp: {
        ...require("daisyui/src/theming/themes")["[data-theme=cupcake]"],
        accent: '#ff3e3e',

      }
    }],

  },
  plugins: [
    require('@tailwindcss/typography'),
    require("daisyui"),
  ],
  safelist: [
    {
      pattern: /badge-.*/,
    },
  ]
} satisfies Config

