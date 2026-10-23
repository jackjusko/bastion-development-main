const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    environment: 'node',
    globals: true,
    fileParallelism: false,
    sequence: { concurrent: false },
    testTimeout: 15000
  }
});
