/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */
import type { ETA } from "hk-bus-eta";
import fetch from "node-fetch";
import * as path from "path";
import * as fs from "fs";
import type { GatsbyNode } from "gatsby";
const content = [`/`];
const pages = [
  "/zh",
  "/en",
  "/en/board",
  "/zh/board",
  "/zh/search",
  "/en/search",
  "/zh/settings",
  "/en/settings",
];
const isDB = (value: unknown): value is ETA => true;
const gatsbyNode: GatsbyNode = {
  createPages: async ({ actions }) => {
    const db = await fetch(
      "https://hkbus.github.io/hk-bus-crawling/routeFareList.min.json"
    ).then((r) => r.json());
    if (!isDB(db)) {
      return;
    }
    const updateTime = Date.now();
    const schemaVersion = await new Promise((resolve, reject) =>
      fs.readFile("./static/schema-version.txt", "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      })
    );
    const md5 = await fetch(
      "https://hkbus.github.io/hk-bus-crawling/routeFareList.md5"
    ).then((r) => r.text());
    const { createPage } = actions;
    [...content, ...pages].forEach((p) => {
      console.log(p);
      createPage({
        path: p,
        component: path.resolve("./src/_pages/index.tsx"),
        context: {
          db: {
            ...db,
            schemaVersion: schemaVersion,
            versionMd5: md5,
            updateTime: updateTime,
          },
        },
      });
    });
    return;
    Object.keys(db.routeList)
      .map((route) =>
        route.replace(/\+/g, "-").replace(/ /g, "-").toLowerCase()
      )
      .forEach((p) => {
        console.log(p);
        createPage({
          path: `/zh/route/${p}`,
          component: path.resolve("./src/pages/index.tsx"),
          context: {
            db: db,
          },
        });
        createPage({
          path: `/en/route/${p}`,
          component: path.resolve("./src/pages/index.tsx"),
          context: {
            db: db,
          },
        });
      });
  },
};
const { createPages } = gatsbyNode;
export { createPages };
