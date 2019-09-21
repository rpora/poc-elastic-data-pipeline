module.exports = {
    verbose: true,
    collectCoverage: false,
    coverageDirectory: null,
    roots: ["<rootDir>/src"],
    moduleFileExtensions: ["ts", "js", "json"],
    transform: { "^.+\\.ts$": "ts-jest" }
};
