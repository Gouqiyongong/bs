'use strict';

const Controller = require('egg').Controller;

class User extends Controller {
  async userLogin() {
    const { ctx } = this;
    let body = ctx.request.body;
    const { username, password } = body;
    if(!username || !password) {
      ctx.body = {
        status: 0,
        des: '用户名和密码不能为空'
      }
      return;
    }
    ctx.body = await ctx.service.user.login();
  }

  async getUserInfo() {
    const { ctx } = this;
    if(ctx.userinfo) {
      ctx.body = {
        status: 1,
        data: {
          username: ctx.userinfo.username,
          power: ctx.userinfo.power
        }
      };
      return;
    }
    ctx.redirect('/login')
  }

  async failLogin() {
    const { ctx } = this;
    const username = ctx.userinfo;
    ctx.app.redis.del(username);
    ctx.cookies.set('token', null);
    ctx.body = {
      status: 1,
      data: '退出成功'
    }
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