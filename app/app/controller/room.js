'use strict';

const Controller = require('egg').Controller;

class RoomController extends Controller {
  async category() {
    const { ctx } = this;
    const data = await ctx.service.room.category();
    ctx.body = data;
  }

  async roomList() {
    const { ctx } = this;
    const data = await ctx.service.room.roomList();
    ctx.body = data;
  }

  async roomPower() {
    const { ctx } = this;
    const data = await ctx.service.room.roomPower();
    ctx.body = data;
  }

  async order() {
    const { ctx } = this;
    const data = await ctx.service.room.order();
    ctx.body = data;
  }
}

module.exports = RoomController;
