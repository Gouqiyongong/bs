'use strict';

const Controller = require('egg').Controller;

class ManageController extends Controller {
  async roomManageList() {
    const { ctx } = this;
    const data = await ctx.service.manage.roomManageList();
    ctx.body = data;
  }
  
  async userList() {
    const { ctx } = this;
    const data = await ctx.service.manage.userList();
    ctx.body = data;
  }

  async deleteManage() {
    const { ctx } = this;
    const data = await ctx.service.manage.deleteAndAndManage('del');
    ctx.body = data;
  }

  async addManage() {
    const { ctx } = this;
    const data = await ctx.service.manage.deleteAndAndManage('and');
    ctx.body = data;
  }
}

module.exports = ManageController;
