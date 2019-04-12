'use strict';

const Controller = require('egg').Controller;

class User extends Controller {
  async userLogin() {
    const { ctx } = this;
    let body = ctx.request.body;
    const { username, password } = body;
    console.log('22222222222222222222222222222222222222222222')
    console.log(body)
    if(!username || !password) {
      ctx.body = {
        status: 0,
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