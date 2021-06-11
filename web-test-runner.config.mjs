import { playwrightLauncher } from "@web/test-runner-playwright";
import { esbuildPlugin } from "@web/dev-server-esbuild";

const browsers = {
  chromium: playwrightLauncher({ product: "chromium" }),
  firefox: playwrightLauncher({ product: "firefox" }),
};

const noBrowser = (b) => {
  throw new Error(`No browser configured named '${b}'; using defaults`);
};
let commandLineBrowsers;
try {
  commandLineBrowsers = process.env.BROWSERS?.split(",").map(
    (b) => browsers[b] ?? noBrowser(b)
  );
} catch (e) {
  console.warn(e);
}

// test-runner configuration: https://modern-web.dev/docs/test-runner/cli-and-configuration/
export default {
  testsStartTimeout: 30000,
  rootDir: ".",
  files: ["./src/__test__/**/*.test.ts"],
  nodeResolve: true,
  preserveSymlinks: true,
  browsers: commandLineBrowsers ?? Object.values(browsers),
  testFramework: {
    // mocha testframework documentation: https://mochajs.org/api/mocha
    config: {
      ui: "tdd",
    },
  },
  plugins: [
    esbuildPlugin({ loaders: { ".ts": "ts", ".data": "json" } }),
  ],
};