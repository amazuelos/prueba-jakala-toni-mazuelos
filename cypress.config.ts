import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'test/e2e/cypress/**/*.cy.ts',
    fixturesFolder: 'test/e2e/cypress/fixtures',
    supportFile: false,
  },
});
