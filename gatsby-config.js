const { useGatsbyConfig } = require("gatsby-plugin-ts-config");
require("dotenv").config();
module.exports = useGatsbyConfig(
  () => {
    return {
      siteMetadata: {
        title: `Gatsby Default Starter`,
        description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
        author: `@gatsbyjs`,
      },
      plugins: [
        {
          resolve: `gatsby-plugin-typescript`,
          options: {
            isTSX: true, // defaults to false
            jsxPragma: `jsx`, // defaults to "React"
            allExtensions: true, // defaults to false
          },
        },
        {
          resolve: `gatsby-plugin-manifest`,
          options: {
            name: `巴士到站預報 App`,
            icon: "./src/images/logo512.png",
            description: `巴士預報（純享版），資料來源為資料一線通 data.gov.hk`,
            short_name: `巴士預報`,
            start_url: `/`,
            background_color: `#fedb00`,
            theme_color: `#fedb00`,
            display: `standalone`,
          },
        },
        {
          resolve: `gatsby-plugin-offline`,
          options: {
            precachePages: [`/*`],
            workboxConfig: {
              globPatterns: ["**/icon-path*"],
            },
          },
        },
      ],
    };
  },
  {
    type: "ts-node",
  }
);
