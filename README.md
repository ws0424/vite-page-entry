# vite 多入口模式配置,单独打包，配置打包，全部打包

```
vite-project
├─ .editorconfig
├─ .env.development
├─ .env.production
├─ .gitignore
├─ README.md
├─ package.json
├─ public
│  └─ favicon.ico
├─ src
│  ├─ components
│  │  └─ HelloWord.vue
│  ├─ packages
│  │  ├─ app
│  │  │  ├─ App.vue
│  │  │  └─ main.ts
│  │  ├─ app2
│  │  │  ├─ App.vue
│  │  │  └─ main.ts
│  │  └─ editor
│  │     ├─ App.vue
│  │     ├─ assets
│  │     │  └─ logo.png
│  │     ├─ main.ts
│  │     ├─ plugins
│  │     │  ├─ index.ts
│  │     │  └─ router
│  │     │     ├─ guard.ts
│  │     │     ├─ index.ts
│  │     │     └─ routes.ts
│  │     └─ views
│  │        └─ home.vue
│  └─ template
│     └─ index.html
├─ tsconfig.json
├─ tsconfig.node.json
├─ types
│  └─ env.d.ts
├─ vite
│  ├─ alias.ts
│  ├─ plugins
│  │  ├─ index.ts
│  │  └─ vue-jsx
│  │     └─ index.ts
│  ├─ setting
│  │  └─ buildSetting.ts
│  └─ utils
│     └─ index.ts
├─ vite.config.ts
└─ yarn.lock

```
