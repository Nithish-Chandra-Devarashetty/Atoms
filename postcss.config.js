export default {
  plugins: {
    'postcss-preset-env': {
      stage: 1,
      features: {
        'custom-properties': false, // Let Tailwind handle CSS variables
      },
      browsers: ['> 1%', 'last 2 versions', 'Edge >= 88'],
    },
    tailwindcss: {},
    autoprefixer: {},
  },
};
