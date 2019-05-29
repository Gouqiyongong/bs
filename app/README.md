# bs

gqy bs

## QuickStart

<!-- add docs here for user -->
项目依赖Node平台，以及MongoDB和Redis数据库，请提前搭建环境
see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
// 如果此步骤失败，请增加：npm i egg-view-nunjucks egg-redis --dev
$ npm run build
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org