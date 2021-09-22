/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser#apis
 */
import type { GatsbyBrowser } from "gatsby";
const gatsbyBrowser: GatsbyBrowser = {
  registerServiceWorker: () => true,
};
const { registerServiceWorker } = gatsbyBrowser;
export { registerServiceWorker };
