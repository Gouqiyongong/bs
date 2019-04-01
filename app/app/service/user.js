const Service = require('egg').Service;

class UserService extends Service {
  async login() {
    const { ctx } = this;
    const { body } = ctx.request;
    let { username, password } = body;
    password = encodeURI(password);
    let result =  await ctx.model.User.findOne({ username });
    if(!result) {
      return {
        status: 0,
        des: '账号不存在'
      }
    }
    if(result.password !== password) {
      return {
        status: 0,
        des: '账号或密码错误'
      }
    }

    // 设置token
    ctx.helper.setToken(body, ctx);
    return {
      status: 1,
      des: '登陆成功'
    }
  }
  async add() {
    const { ctx } = this;
    const user = await ctx.model.User.create({
      username: ctx.query.username || "aaa",
      password: ctx.query.password || "bbbb"
  });
  // user.save();
    // ctx.model.User.find({"title":"111"}) 表示在数据库中查找title 为111的对应数据
  }

  async userList() {
    const { ctx } = this;
        return await ctx.model.User.find();
  }
}
module.exports = UserService;