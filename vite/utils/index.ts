import { glob } from "glob";
const fs = require("fs");
import { resolve } from "path";
import { buildSetting } from "../setting/buildSetting";
var colors = require("colors");

export const rollupInput = (
  command: "build" | "serve",
  port: number | string
) => {
  // 读取全部的main文件路径
  const allEntry = glob.sync("./src/packages/**/main.ts"),
    // 读取html模版信息
    temp = fs
      .readFileSync(resolve(__dirname, "../../src/template/index.html"))
      .toString(),
    // 初始化入口文件配置
    entryPage = {};
  // 初始化模版文件内容
  let content = "";

  allEntry.forEach((entry) => {
    const mode = {
        title: entry.split("/")[3] || entry,
        src: entry,
      },
      writeHtmlPath = resolve(__dirname, `../../${mode.title}.html`);

    // entryPage[mode.title] = `/${mode.title}.html`;
    entryPage[mode.title] = writeHtmlPath;
    // 模版匹配
    content = temp.replace(/{{(.*?)}}/gi, (match, p1) => {
      return mode[p1.trim()];
    });
    // 写入口文件
    fs.writeFileSync(writeHtmlPath, content, (err) => {
      if (err) throw err;
    });
  });
  // 如果打包的话读取配置分别打包还是一起打包
  if (command === "build") {
    Object.keys(entryPage).forEach((key) => {
      if (!buildSetting[key]) delete entryPage[key];
    });
  } else {
    printServerUrls(entryPage, port);
  }
  return entryPage;
};

export const printServerUrls = (options, port: string | number = 3366) => {
  console.log(
    colors.yellow(
      "********************页面入口信息打印开始********************"
    )
  );
  Object.values(options).forEach((val) => {
    const base = (val as string).split("/").pop();
    console.log(colors.cyan(`http://localhost:${port}/${base}`));
  });
  console.log(
    colors.yellow(
      "********************页面入口信息打印结束********************"
    )
  );
};
