const Service = require('egg').Service;

class OrderService extends Service {
  async list() {
    const { ctx } = this;
    const { username } = ctx.userinfo;
    let data = [];

    try {
      const order = await ctx.model.Order.find({
        order: { $elemMatch:{ 'order.username': username } }
      })
      const oldOrder = await ctx.model.Order.find({
        order: { $elemMatch: { oldOrder: {$elemMatch: {$eq: username}} } }
      })
      order.forEach(item => {
        item.order.forEach((orderItem, index) => {
          if(orderItem.order && orderItem.order.username === username) {
            data.push({
              place: item.room_id,
              time: item.time,
              class: index,
              state: orderItem.sign && orderItem.sign.state ? (
                orderItem.sign.state === 1 ? 1 : 2
              ) : 0
            });
          }
        })
      });

      oldOrder.forEach(item => {
        item.order.forEach((orderItem, index) => {
          if(orderItem.oldOrder && orderItem.oldOrder.indexOf(username) > -1) {
            data.push({
              place: item.room_id,
              time: item.time,
              class: index,
              state: 3
            });
          }
        })
      });
      data.sort((a, b) => {
        return new Date(a.time).getTime() > new Date(b.time).getTime();
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
  async failOrder() {
    const { ctx } = this;
    const { room_id, time, value } = ctx.request.body;
    if(!room_id || !time || !value) {
      return {
        status: 0,
        des: '参数错误'
      }
    }
    try {
      const order = await ctx.model.Order.findOne({ room_id, time });
      order.order[value].order = null;
      order.order[value].state = 2;
      console.log('===========================================')
      console.log(order);
      console.log('===========================================')
      await ctx.model.Order.updateOne({ room_id, time }, order);
      return {
        status: 1,
        des: '成功'
      }
    } catch(err) {
      return {
        status: 0,
        des: err
      }
    }
  }
}

module.exports = OrderService;