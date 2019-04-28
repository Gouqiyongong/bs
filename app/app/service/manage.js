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

  async userList() {
    const { ctx } = this;
    const { power } = ctx.userinfo;
    if(power !== '0') {
      return {
        status: 0,
        des: '权限不足'
      }
    }

    const { username } = ctx.query;
    if(!username) {
      return {
        status: 0,
        des: '请输入用户名'
      }
    }

    try {
      const reg = new RegExp(username, 'i');
      let data = await ctx.model.User.find({ username: reg, power: '2' });
      data = data.map(item => {
        return item.username;
      })
      return {
        status: 1,
        data
      }
    } catch(err) {
      return {
        status: 0,
        des: err
      }
    }
  }

  async deleteAndAndManage(type) {
    const { ctx } = this;
    const { power } = ctx.userinfo;
    if(power !== '0') {
      return {
        status: 0,
        des: '权限不足'
      }
    }
    const { id, username } = ctx.request.body;
    if(!id || !username) {
      return {
        status: 0,
        des: '参数错误'
      }
    }

    try {
      if(type === 'del') {
        await ctx.model.Room.update({ id }, { $pull: { manager: username } })
      }
      if(type === 'and') {
        await ctx.model.Room.update({ id }, { $addToSet: { manager: username } })
      }
      return {
        status: 1,
        data: 'success'
      }
    }
    catch(err) {
      return {
        status: 0,
        des: err
      }
    }
  }
}

module.exports = OrderService;