const Service = require('egg').Service;

class OrderService extends Service {
  async roomManageList() {
    const { ctx } = this;
    const { power } = ctx.userinfo;
    if(power !== '0') {
      return {
        status: 0,
        des: '权限不足'
      }
    }

    const { room_id } = ctx.query;
    if(!room_id) {
      return {
        status: 0,
        des: '请输入教室'
      }
    }
    try {
      const data = await ctx.model.Room.findOne({ id: room_id });
      if(!data) {
        return {
          status: 0,
          des: '请输入正确的教室'
        }
      }
      return {
        status: 1,
        data
      }
    } catch (err) {
      return {
        status: 0,
        des: err
      }
    }
  }
}

module.exports = OrderService;