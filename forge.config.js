const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");
const path = require("path"); // 新增：用于路径解析

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        // certificateFile: "./cert.pfx",
        // certificatePassword: process.env.CERTIFICATE_PASSWORD,
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    // 新增：Webpack 插件配置（处理 main/renderer/preload 打包）
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        mainConfig: path.resolve(__dirname, "./webpack.main.config.js"), // 指向你的主进程webpack配置
        renderer: {
          config: path.resolve(__dirname, "./webpack.renderer.config.js"), // 指向渲染进程配置
          entryPoints: [{
            html: path.resolve(__dirname, "./src/index.html"), // 你的Vue入口html
            js: path.resolve(__dirname, "./src/renderer.js"), // 渲染进程入口（若没有则先新建空文件）
            name: "main_window", // 窗口名称，自定义即可
          }],
        },
        preload: {
          config: path.resolve(__dirname, "./webpack.preload.config.js"), // 新增preload的webpack配置
          entry: path.resolve(__dirname, "./preload.js"), // 指向根目录的preload.js
        },
      },
    },
    // 原有 FusesPlugin 保留不动
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "fire-mango",
          name: "kdjl-mango",
        },
        prerelease: false,
        draft: true,
        // 修复：原有 fetch 未定义，改为 require('node-fetch')（需先安装：npm i node-fetch）
        fetch: require("node-fetch"),
      },
    },
  ],
};