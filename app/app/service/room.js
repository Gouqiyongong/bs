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
}
module.exports = RoomService;