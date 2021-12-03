# Contributing

Thank you for your interest in contributing to the project!

To get up and running, follow these steps:
1. Clone the repository
2. Install dependencies: `yarn install`
3. Build the example documentation included in this repository (used for tests): `yarn --cwd packages/example-docs build`
4. Run tests: `yarn test`
5. Run end to end tests using Playwright:
   ```bash
   yarn --cwd packages/example-docs serve
   # in another terminal:
   yarn test:e2e # add --debug to step through the tests
   ```
