module.exports = {
  presets: ["babel-preset-expo"], // or react-native preset
  plugins: [
    "react-native-reanimated/plugin", // DO NOT put version here manually
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: ".env",
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
