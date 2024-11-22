module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { node: "current" },
        modules: "auto", // Ensures module compatibility in mixed environments
      },
    ],
    "@babel/preset-react", // For React JSX/TSX support
  ],
  plugins: [
    "@babel/plugin-proposal-private-methods", // Support private methods
    "@babel/plugin-transform-runtime", // Handles helpers in Node.js and Electron
  ],
};
