'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  async list() {
    const { ctx } = this;
    const data = await ctx.service.order.list();
    ctx.body = data;
  }

  async failOrder() {
    const { ctx } = this;
    const data = await ctx.service.order.failOrder();
    ctx.body = data;
  }
}

module.exports = OrderController;
