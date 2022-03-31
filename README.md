[![Tweet](https://img.shields.io/twitter/url/http/Hktalent3135773.svg?style=social)](https://twitter.com/intent/follow?screen_name=Hktalent3135773) [![Follow on Twitter](https://img.shields.io/twitter/follow/Hktalent3135773.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=Hktalent3135773) [![GitHub Followers](https://img.shields.io/github/followers/hktalent.svg?style=social&label=Follow)](https://github.com/hktalent/)
[![Top Langs](https://profile-counter.glitch.me/hktalent/count.svg)](https://51pwn.com)

# how build
## server
```
git clone https://github.com/hktalent/go4Hacker
cd go4Hacker
go build 
 ./go4Hacker serve -4 0.0.0.0 -domain 51pwn.com -lang zh-CN -http=":8080"
open http://0.0.0.0:8080
```

## install
``` bash
# install dependencies
npm i -g npm@latest
brew install yarn
yarn add node-sass
npm i -g electron-builder
npm install --save-dev @electron-forge/cli
npm install -g @vue/cli
# 检查、处理electron
npx electron-forge import
yarn install
```

## auto build
``` bash
export PYTHON_PATH=/usr/local/opt/python@3.9/libexec/bin/python
yarn build
ls -lah out/

# build electron app for production
# npm run build

# lint all JS/Vue component files in `app/src`
# npm run lint

# run webpack in production
# npm run pack

```

## how run
```
# serve with hot reload at localhost:9080
yarn run start
```

## vue
```bash
vue create app
cd app
npm install node-sass
npm install --save ag-grid-community ag-grid-vue vue-property-decorator
yarn build
yarn serve

```

# how run
```bash
yarn run dev
npm start
```


# reference
https://www.ag-grid.com/vue-data-grid/grid-interface/
https://www.electronjs.org/docs/latest/tutorial/installation
https://www.ag-grid.com/vue-data-grid/getting-started/
