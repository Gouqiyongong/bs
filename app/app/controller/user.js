'use strict';

const Controller = require('egg').Controller;

class User extends Controller {
  async userLogin() {
    const { ctx } = this;
    const { body: { username, password } = {} } = ctx.request;
    if(!username || !password) {
      ctx.body = {
        status: 1,
        des: '用户名和密码不能为空'
      }
      return;
    }
    ctx.body = await ctx.service.user.login();
  }
  async add() {
    const { ctx } = this;
    ctx.body = await ctx.service.user.add();
  }
  
  async userList() {
    const { ctx } = this;
    
    ctx.body = await ctx.service.user.userList();
  }
}

module.exports = User;