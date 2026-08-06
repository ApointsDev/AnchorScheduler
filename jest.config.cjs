module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }]
  },
  moduleFileExtensions: ['ts','js','json'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  modulePathIgnorePatterns: ["<rootDir>/server/dist/"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/server/dist/",
    "<rootDir>/devOld/",
    "<rootDir>/.codex-backups/",
  ],
};
