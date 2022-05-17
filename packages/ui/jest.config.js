/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  globals: {
    "ts-jest": {
      // babelConfig: true,
      tsconfig: '__tests__/tsconfig.jest.json',
      diagnostics: {
        ignoreCodes: ['TS151001'],
      },
    }
  },
  transform: {
    "^.+\\.(ts|tsx|jsx|js)$": "ts-jest"
  },
  moduleDirectories: ['<rootDir>/node_modules', '<rootDir>/src', '<rootDir>/.']
}
