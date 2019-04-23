'use strict';

const Controller = require('egg').Controller;

class ManageController extends Controller {
  async roomManageList() {
    const { ctx } = this;
    const data = await ctx.service.manage.roomManageList();
    ctx.body = data;
  }
}

module.exports = ManageController;
