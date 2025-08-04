// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["@swc/jest", {
      jsc: {
        parser: {
          syntax: "ecmascript", // or "typescript" if using TS
          jsx: true,             // ✅ enable JSX parsing
        },
        transform: {
          react: {
            runtime: "automatic" // ✅ for React 17+ / Next.js
          }
        }
      }
    }],
  },
  moduleFileExtensions: ["js", "jsx", "json", "node"],
};
