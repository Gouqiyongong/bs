const Service = require('egg').Service;

class RoomService extends Service {
  async category() {
    const { ctx } = this;
    const data = [];
    try {
      const place = await ctx.model.Room.find().distinct('place') || [];
      for(let i = 0; i < place.length; i++) {
        let floor = await ctx.model.Room.find({ place: place[i] }).distinct('floor') || [];
        data.push({
          name: place[i],
          value: place[i],
          parent: 0
        });
        floor.forEach(item => {
          data.push({
            name: item + '楼',
            value: item + '楼',
            parent: place[i]
          })
        })
      }
    } catch(err) {
      console.log('room category error')
      console.log(err)
      console.log('room category error')
      return {
        status: 0,
        des: err
      };
    }
    return {
      status: 1,
      data
    };
  }
  async roomList() {
    const { ctx } = this;
    const { query } = ctx;
    const { place, floor, time } = query;
    if(!place || !floor || !time) {
      return {
        status: 0,
        des: '查询参数错误'
      }
    }
    try {
      const room = await ctx.model.Room.find({ place, floor });
      let maxX = room[0] && room[0].sign[0] || 0,
          maxY = room[0] && room[0].sign[1] || 0;
      room.forEach(item => {
        maxX = maxX > item.sign[0] ? maxX : item.sign[0];
        maxY = maxY > item.sign[1] ? maxY : item.sign[1];
      });
      let data = new Array(maxX + 5);
      for(let i = 0; i < maxX + 5; i++) {
        let a = [];
        a.length = maxY + 5;
        data[i] = a;
      }
      
      for(let i = 0; i < room.length; i++) {
        const { sign, id, size } = room[i];
        let d = {
          size,
          data: await ctx.model.Order.findOne({ room_id: id, time: new Date(time) })
        };
        let [x, y] = sign;
        data[x][y] = d;
      }
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
  async roomPower() {
    const { ctx } = this;
    const { query } = ctx;
    if(!query.room_id) {
      return {
        status: 0,
        des: '查询参数错误'
      }
    }
    const { userinfo: { username } } = ctx;
    try {
      const d = await ctx.model.Room.findOne({ id: query.room_id, manager: { $elemMatch:{$eq: username} } })
      if(d) {
        return {
          status: 1
        }
      }
    } catch(err) {
      return {
        status: 0,
        des: err
      }
    }
    return {
      status: 0,
      des: '没有权限'
    }
  }
  async order() {
    const { ctx } = this;
    const { room_id, time, des, value, people, usedevice } = ctx.request.body;
    const errObj = {
      status: 1,
      des: '请求参数错误'
    }
    if(!room_id || !time || !des || !value || !people || usedevice === undefined) {
      return errObj
    }
    const { username, power, manager } = ctx.userinfo;
    const date = new Date();
    const nowString = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    if(new Date(time).getTime() - new Date(nowString).getTime() < 1000 * 60 * 60 *24) {
      return {
        status: 0,
        des: '必须提前一天预订'
      }
    }
    try {
      const punishment = await ctx.model.Punishment.findOne({ username, end: { $gte: new Date() } });
      if(punishment) {
        const end = new Date(punishment.end)
        return {
          status: 0,
          des: '您被禁止预订教室，惩罚时间到' + end.getFullYear() + '/' + (end.getMonth() + 1) + '/' + end.getDate()
        }
      }
      const order = await ctx.model.Order.findOne({
        room_id,
        time
      });
      if(!order) {
        return errObj
      }
      const { state } = order.order[value];
      console.log('')
      if(state === 0) {
        return {
          status: 0,
          des: '不可预订'
        }
      }
      if(state !== 2 && power === 3) {
        return {
          status: 0,
          des: '权限不足'
        }
      } 
      if(state === 1 && power === 2) {
        const d = await ctx.model.Room.findOne({ id: room_id, manager: { $elemMatch:{$eq: username} } })
        if(!d) {
          return {
            status: 0,
            des: '权限不足'
          }
        }
      }
      let oneOrder = order.order[value];
      if(state === 1) {
        if(oneOrder.oldOrder && oneOrder.oldOrder.indexOf(username) > -1) {
          oneOrder.oldOrder = oneOrder.oldOrder ? oneOrder.oldOrder.push(oneOrder.order.username) : [].push(oneOrder.order.username);
        }
      }
      if(oneOrder && oneOrder.order && oneOrder.order.username === username) {
        return {
          status: 0,
          des: '不能重复预订'
        }
      }
      oneOrder.state = 1;
      oneOrder.order = {
        username,
        time: new Date(),
        des,
        people,
        usedevice
      }
      await ctx.model.Order.updateOne(
        {
          room_id,
          time
        },
        order
      )
      return {
        status: 1
      }
    } catch (err) {
      return {
        status: 0,
        des: err
      }
    }
  }
  async sign() {
    const { ctx } = this;
    const { id, source } = ctx.request.body;
    const { username } = ctx.userinfo;
    if (source !== 'QRCode' || !id) {
      return {
        status: 0,
        des: '参数错误'
      }
    }
    const date = new Date();
    const nowYear = date.getFullYear(),
      nowMonth = date.getMonth() + 1,
      nowDay = date.getDate(),
      nowString = nowYear + '/' + nowMonth + '/' + nowDay;
    const START_TIME = new Date(nowString + ' ' + '7:30').getTime(),
      ONE_TIME = new Date(nowString + ' ' + '8:44').getTime(),
      TWO_TIME = new Date(nowString + ' ' + '9:34').getTime(),
      THREE_TIME = new Date(nowString + ' ' + '10:34').getTime(),
      FORE_TIME = new Date(nowString + ' ' + '11:24').getTime(),
      FIVE_TIME = new Date(nowString + ' ' + '12:14').getTime(),
      SIX_TIME = new Date(nowString + ' ' + '14: 44').getTime(),
      SEVEN_TIME = new Date(nowString + ' ' + '15:34').getTime(),
      EIGHT_TIME = new Date(nowString + ' ' + '16:34').getTime(),
      NINE_TIME = new Date(nowString + ' ' + '17:24').getTime(),
      TEN_TIME = new Date(nowString + ' ' + '19:44').getTime(),
      ELEVEN_TIME = new Date(nowString + ' ' + '20:34').getTime(),
      TWELVE_TIME = new Date(nowString + ' ' + '21: 24').getTime(),
      NOW_TIMW = date.getTime();
    let index;
    if(START_TIME <= NOW_TIMW && NOW_TIMW < ONE_TIME) index = 0;
    else if(NOW_TIMW <= TWO_TIME) index = 1;
    else if(NOW_TIMW <= THREE_TIME) index = 2;
    else if(NOW_TIMW <= FORE_TIME) index = 3;
    else if(NOW_TIMW <= FIVE_TIME) index = 4;
    else if(NOW_TIMW <= SIX_TIME) index = 5;
    else if(NOW_TIMW <= SEVEN_TIME) index = 6;
    else if(NOW_TIMW <= EIGHT_TIME) index = 7;
    else if(NOW_TIMW <= NINE_TIME) index = 8;
    else if(NOW_TIMW <= TEN_TIME) index = 9;
    else if(NOW_TIMW <= ELEVEN_TIME) index = 10;
    else if(NOW_TIMW <= TWELVE_TIME) index = 11;
    else index = -1;
    if(index === -1) {
      return {
        status: 0,
        des: '不在签到时间'
      }
    }
    try {
      const order = await ctx.model.Order.findOne({ room_id: id, time: new Date(nowString) })
      if(order) {
        if(order.order[index] && order.order[index].state === 1) {
          if(order.order[index].sign && order.order[index].sign.state === 1) {
            return {
              status: 0,
              des: '不能重复签到'
            }
          }
          order.order[index].sign = {
            state: 1,
            username,
            time: date
          }
          await ctx.model.Order.updateOne({ room_id: id, time: new Date(nowString) }, order);
          return {
            status: 1,
            data: {
              id,
              username,
              time: date
            }
          }
        }
        else {
          return {
            status: 0,
            des: '尚未预订'
          }
        }
      }
    } catch(err) {
      return {
        status: 0,
        des: 'err'
      }
    }
  }

  async recommend() {
    const { ctx } = this;
    const { username } = ctx.userinfo;
    const errObj = {
      status: 0,
      des: ''
    }
    try {
      let order = await ctx.model.Order.find({
        order: { $elemMatch:{ 'order.username': username } }
      });
      if(!order || !order.length) {
        
        return errObj;
      }
      let roomList = [];
      for(let i = 0; i < order.length; i++) {
        let room = await ctx.model.Room.findOne({ id: order[i].room_id });
        roomList.push(room);
      }
      let maxObj = ctx.helper.getMax(roomList);
      maxObj.floor = maxObj.floor === 1 ? 2 : maxObj.floor;
      maxObj.floor = maxObj.floor === 5 ? 4 : maxObj.floor;
      const recommendRoom = await ctx.model.Room.findOne({
        area: maxObj.area,
        floor: { $gte: maxObj.floor - 1, $lte: maxObj.floor + 1 },
        place: maxObj.place,
        size: { $gte: maxObj.size - 10, $lte: maxObj.size + 10 }
      });
      if(!recommendRoom) {
        return errObj;
      }
      const date = new Date();
      const lastDate = new Date(new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()).getTime() + 1000 * 60 * 60 * 24);
      const recommendOrder = await ctx.model.Order.findOne({ room_id: recommendRoom.id, time: lastDate })
      if(!recommendOrder) {
        return errObj;
      }
      return {
        status: 1,
        data: {
          size: recommendRoom.size,
          id: recommendRoom.id,
          time: lastDate,
          order: recommendOrder
        }
      };
    } catch (err) {
      return {
        status: 0,
        des: err
      }
    }
  }
}
module.exports = RoomService;