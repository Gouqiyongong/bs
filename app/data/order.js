const room = require('./room.js');

function order() {
  let order = [];
  room.forEach(item => {
    for(let i = 16; i <= 30; i++) {
      let a = {};
      a.room_id = item.place + item.roomnumber;
      a.time = new Date(`2019/4/${i}`);
      a.order = new Array(12);
      for(let j = 0; j < 12; j++) {
        a.order[j] = {
          state: j % 4
        }
      }
      order.push(a);
    }
  })
  return order;
}

module.exports = order;
