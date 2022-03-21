# vite 多入口总结

> 基于 vite vue3 配置的多入口解决方案，支持单独打包，分批打包，全部打包

- 为什么我们要使用多入口开发？

答：在我开发编辑器的时候出现了一个问题，问题就是我们需要写**两套不太一样的代码**但是却使用**相同的组件**，甚至可以说在预览时使用**相同的配置**，在以往的方法里我们需要建立两个工程，在读 vite 的时候看见了一句话 **Vite 也支持多个 `.html` 作入口点的 [多页面应用模式](https://vitejs.cn/guide/build.html#multi-page-app)。**心想这不就是我想要的么，也是我目前认为最佳的解决办法

> 在此记录遇到的小问题及坑

- 使用官方给出的方案配置`build.rollupOptions.input`及建立目录

  - 痛点 1：需要输入较长的`url`才能访问如`localhost:3000/src/app/index.html`
  - 痛点 2：需要每次添加新的页面都需要建一个`html`文件
  - 痛点 3：无法单独打包，配置打包，每次打包都把文件打包在一起无法区分

##### 痛点 1 解决方案

> 根据痛点 1 的解决方案

根据官方给出的`指定替代根目录`来解决 ` "app": "vite serve src/packages/app/ --config ./vite.config.ts"`

##### 痛点 2 解决方案

> 根据痛点 2 的解决方案

由于 vite 执行的环境是 node 环境那么可以使用模版文件来解决,根据一下目录创建模版文件

```js
├─ src
│  └─ template
│     └─ index.html
```

模版文件内容

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ title }}</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="{{ src }}" type="module"></script>
  </body>
</html>
```

创建方法来读取模版信息，及编写模版信息，动态创建入口文件

```tsx
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

  return entryPage;
};
```

##### 痛点 3 解决

> 单独打包，配置打包，全部打包配置添加

根据以上动态创建入口文件的代码进行改造

```ts
rollupInput(){
  ....
 // 如果打包的话读取配置分别打包还是一起打包
  if (command === "build") {
    Object.keys(entryPage).forEach((key) => {
      if (!buildSetting[key]) delete entryPage[key];
    });
  } else {
    printServerUrls(entryPage, port);
  }
}
// 打印url
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
```

完整的 vite.config.ts

```ts
import { ConfigEnv, loadEnv, UserConfigExport } from "vite";
import { setupPlugins } from "./vite/plugins/index";
import alias from "./vite/alias";
import { rollupInput } from "./vite/utils";
export default ({ mode, command }: ConfigEnv): UserConfigExport => {
  const root = process.cwd(),
    env = loadEnv(mode, root),
    plugins = setupPlugins(),
    port = env.VITE_PORT ? Number(env.VITE_PORT) : 3366;

  return {
    base: "./",
    plugins,
    resolve: {
      alias,
    },
    server: {
      host: "0.0.0.0",
      port: port,
    },
    build: {
      target: "modules",
      rollupOptions: {
        input: rollupInput(command, port),
      },
    },
  };
};
```

#### 使用示例

- 如何配置打包

  - 项目首次运行时会写入`vite/entry-setting.json`打包配置文件，默认为`true`,当入口对应的`value`为`true`时将此入口打包

  ```js
  {"app":true,"editor":true} // 这样就代表app入口打包，editor入口打包打包出来的结果对应如下
  ├─ dist
  │  ├─ assets
  │  │  └─ app.ff0f0145.js
  │  ├─ app.html
  │  ├─ editor.html
  {"app":false,"editor":true} // 这样就代表app入口不打包，，editor入口打包打包出来的结果对应如下
  ├─ dist
  │  ├─ assets
  │  │  └─ editor.ff0f0145.js
  │  ├─ editor.html
  ```

  - 打包的时候会同时写入日志文件`/logs/build-info`对应今日日期方便查看`rollupInput`函数生成的配置
  - 注意：**`src/packages`下的入口目录必须含有`main.ts`,否则无效**

- 多入口的优点

  - 当我们共用一套组件`components`或者一套方法时，没必要两个工程中复制来复制去，如以下例子，我们两个入口都使用了`HelloWord.vue`这个组件，那么我们只需要引入使用即可,代码如下

    ```vue
    // src/packages/editor 入口下使用了该组件
    <template>
      我是editor-home <img src="../assets/logo.png" alt="" srcset="" />
      <HelloWordVue :msg="data.msg" />
    </template>

    <script lang="ts" setup>
    import HelloWordVue from "@/components/HelloWord.vue";
    import data from "@/data/config.json";
    </script>
    // src/packages/app 入口下也使用了该组件
    <template>
      我是app
      <HelloWordVue :msg="data.msg" />
      <router-view />
    </template>

    <script setup lang="ts">
    import HelloWordVue from "@/components/HelloWord.vue";
    import data from "@/data/config.json";
    </script>
    //
    可以看出我们两个组件都引用的同一个相同文件，如之前的例子，那么我们需要复制到另一个工程中，那么反过来想，这就一个共用组件如果10个20个岂不是很麻烦，如果该组件改了之后岂不是又要同步复制？
    ```

在这里感谢康师傅的代码

项目地址[https://github.com/ws0424/vite-page-entry.git]
