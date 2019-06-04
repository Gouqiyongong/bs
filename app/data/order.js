const room = require('./room.js');

function order() {
  let order = [];
  room.forEach(item => {
    for(let i = 1; i <= 31; i++) {
      let a = {};
      a.room_id = item.place + item.roomnumber;
      a.time = new Date(`2019/6/${i}`);
      a.order = new Array(12);
      for(let j = 0; j < 12; j++) {
        a.order[j] = {
          state: j % 4
        }
        if(a.order[j].state === 1) {
          a.order[j].order = {};
          a.order[j].order.username = 'admin' + j % 9;
        }
      }
      order.push(a);
    }
  })
  return order;
}

module.exports = order;
