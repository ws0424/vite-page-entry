import { glob } from "glob";
import { resolve } from "path";

const fs = require("fs");
const colors = require("colors");
const camelCase = require("lodash/camelCase");
const dayjs = require("dayjs");

export const readEntrySetting = () => {
  try {
    const data = fs.readFileSync(resolve(__dirname, "../entry-setting.json"));
    return JSON.parse(data.toString());
  } catch (error) {
    return {};
  }
};

// 打包日志添加
export const writeLogger = (dirName: string, logName: string, data) => {
  const baseUrl = resolve(__dirname, "../../logs", dirName);
  fs.readdir(baseUrl, (err, files) => {
    if (err) {
      fs.mkdirSync(baseUrl, {
        recursive: true,
      });
    }
    fs.writeFile(
      resolve(baseUrl, `${dayjs().format("YYYY-MM-DD")}.logs`),
      `${dayjs().format("YYYY-MM-DD HH-mm-ss")}${logName}:${JSON.stringify(
        data
      )}\n\r`,
      {
        flag: "a+",
      },
      (err) => {
        if (err) console.log("日志写入失败", err);
        console.log("日志写入成功:", data);
      }
    );
  });
};

export const rollupInput = (
  command: "build" | "serve",
  port: number | string
) => {
  // 读取入口文件配置
  const entrySetting = readEntrySetting();
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
        title: camelCase(entry.split("/")[3]) || entry,
        src: entry,
      },
      writeHtmlPath = resolve(__dirname, `../../${mode.title}.html`);

    entryPage[mode.title] = writeHtmlPath;
    // 如果出现了新的入口文件且没有在配置项内则写入该配置并且将其设置为true(也就是说默认将其统一打包)
    if (!entrySetting.hasOwnProperty(mode.title)) {
      entrySetting[mode.title] = true;
    }
    // 模版匹配
    content = temp.replace(/{{(.*?)}}/gi, (match, p1) => {
      return mode[p1.trim()];
    });
    // 写入口文件
    fs.writeFileSync(writeHtmlPath, content, (err) => {
      if (err) throw err;
    });
  });
  // 写入配置文件
  fs.writeFileSync(
    resolve(__dirname, "../entry-setting.json"),
    JSON.stringify(entrySetting)
  );

  // console.log(dayjs().format("YYYY-MM-DD"), "########");

  // 如果打包的话读取配置分别打包还是一起打包
  if (command === "build") {
    Object.keys(entryPage).forEach((key) => {
      if (!entrySetting[key]) delete entryPage[key];
    });
    writeLogger("build-info", "rollupInput", entryPage);
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
