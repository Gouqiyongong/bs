'use strict';

const Controller = require('egg').Controller;

class User extends Controller {
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