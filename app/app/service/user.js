const Service = require('egg').Service;

class UserService extends Service {
  async add() {
    const { ctx } = this;
    const user = new ctx.model.User({
      username:"aaa",
      password:"bbbb"
  })
  user.save();
    // ctx.model.User.find({"title":"111"}) 表示在数据库中查找title 为111的对应数据
  }

  async userList() {
    const { ctx } = this;
        return await ctx.model.User.find();
  }
}
module.exports = UserService;