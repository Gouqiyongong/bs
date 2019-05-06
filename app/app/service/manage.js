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
    let { id, username } = ctx.request.body;
    if(!id || !username) {
      return {
        status: 0,
        des: '参数错误'
      }
    }

    try {
      if(type === 'del') {
        username = JSON.parse(username);
        for(let i = 0; i < username.length; i++) {
          await ctx.model.Room.update({ id }, { $pull: { manager: username[i] } })
        }
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

  async get2ManageAbout() {
    const { ctx } = this;
    const { power } = ctx.userinfo;
    if(power !== '0') {
      return {
        status: 0,
        des: '权限不足'
      }
    }

    try {
      let data = {};
      data.manage2 = (await ctx.model.User.find({ power: '1' })).map(item => item.username);
      data.canManage2 = (await ctx.model.User.find({ power: '2' })).map(item => item.username)
      return {
        status: 1,
        data
      }
    }
    catch(err) {
      return {
        status: 0,
        des: err
      }
    }
  }

  async deleteAndAndManage2(type) {
    const { ctx } = this;
    const { power } = ctx.userinfo;
    if(power !== '0') {
      return {
        status: 0,
        des: '权限不足'
      }
    }
    let { username } = ctx.request.body;
    if(!username) {
      return {
        status: 0,
        des: '参数错误'
      }
    }

    try {
      if(type === 'del') {
        username = JSON.parse(username);
        for(let i = 0; i < username.length; i++) {
          await ctx.model.User.update({ username: username[i] }, { power: '2' })
        }
      }
      if(type === 'and') {
        await ctx.model.User.update({ username }, { power: '1' })
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

  async orderList() {
    const { ctx } = this;
    const { power } = ctx.userinfo;
    if(power !== '0' && power !== '1') {
      return {
        status: 0,
        des: '权限不足'
      }
    }
    const { place, floor, clas } = ctx.request.body;
    if(!place || !floor || !clas) {
      return {
        status: 0,
        des: '参数错误'
      }
    }
    try {
      const room = await ctx.model.Room.find({ place, floor });
      let data = [];
      const date = new Date(),
        dateString = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
      for(let i = 0; i < room.length; i++) {
        let order = await ctx.model.Order.findOne({ room_id: room[i].id, time: new Date(dateString) });
        if(order && order.order && clas === 'all') {
          order.order.forEach(item => {
            if(item.state === 1) {
              data.push({
                room: room[i].id,
                size: room[i].size,
                ...item.order
              })
            }
          })
        } else {
          if(order.order[clas - 1] && order.order[clas - 1].state === 1) {
            data.push({
              room: room[i].id,
              size: room[i].size,
              ...order.order[clas - 1].order
            })
          }
        }
      }
      data.sort((a, b) => a.room < b.room)
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

  async chart() {
    const { ctx } = this;
    const { power } = ctx.userinfo;
    if(power !== '0' && power !== '1') {
      return {
        status: 0,
        des: '权限不足'
      }
    }

    const { start, end } = ctx.query;
    if(!start || !end) {
      return {
        status: 0,
        des: '参数错误'
      }
    }

    try {
      const data = {};
      const order = await ctx.model.Order.find({ time: { $gte: new Date(start), $lt: new Date(end) } })
      let line_1 = new Array(12).fill(0);
      order.forEach(item => {
        item.order && item.order.forEach((or, index) => {
          if(or.state === 1) {
            line_1[index] ? line_1[index]++ : line_1[index] = 1;
          }
        })
      })
      line_1 = line_1.map((item, index) => {
        return {
          year: (index + 1) + '节',
          sales: item
        }
      })
      data.chart1 = line_1;
      return {
        status: 1,
        data
      }
    } catch(err) {
      return {
        status: 1,
        des: 'err'
      }
    }
  }
}

module.exports = OrderService;