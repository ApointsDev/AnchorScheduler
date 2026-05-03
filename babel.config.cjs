module.exports = {
  presets: [
    ["@babel/preset-env", {
      "modules": false
    }],
    "@babel/preset-typescript"
  ],
  plugins: [
    [
      "module-resolver",
      {
        extensions: [".js", ".ts", ".json"],
        resolvePath: (sourcePath, currentFile, opts) => {
          // Add .js extension for relative imports if missing
          if ((sourcePath.startsWith('./') || sourcePath.startsWith('../')) && !sourcePath.includes('node_modules')) {
             if (!sourcePath.endsWith('.js') && !sourcePath.endsWith('.ts')) {
                return sourcePath + '.js';
             }
          }
          return sourcePath;
        }
      }
    ]
  ]
};