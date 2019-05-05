module.exports = {
  setToken(data, ctx) {
    const jwt = require('jsonwebtoken');
    const MAX_TIME = 1000 * 60 * 60 * 24 * 10;
    const curretTime = Date.now();
    const token = jwt.sign(
      {
        username: data.username,
        exp: curretTime + MAX_TIME
      },
      ctx.app.config.keys,
      // {
      //   expiresIn: MAX_TIME/1000 + 's'
      // }
    );

    ctx.cookies.set('token', token, {
      maxAge: MAX_TIME,
      httpOnly: false,
      signed:false
    });

    ctx.app.redis.set(data.username, token);
  },
  punishment: async function (ctx, type) {
    const nowDate = new Date();
    const nowYear = nowDate.getFullYear(), 
          nowMonth = nowDate.getMonth() + 1,
          nowDay = nowDate.getDate();
    const nowYMDString = nowYear + '/' + nowMonth + '/' + nowDay;
    const oldDate = new Date(nowDate.getTime() - 1000 * 60 * 60 * 24 * 30);
    let aMonthAgoYMDString = oldDate.getFullYear() + '/' + (oldDate.getMonth() + 1) + '/' + oldDate.getDate();
    try {
      let username, failOrder, failLength;
      let hasOrder = await ctx.model.Order.find({
        time: new Date(nowYMDString)
      });
      if(hasOrder.length) {
        hasOrder = hasOrder.filter(item => item.order && item.order[type].state === 1);
      }
      if(hasOrder.length) {
        username = '';
        failLength = 0;
        for(let i = 0; i < hasOrder.length; i++) {
          if(hasOrder[i].order[type].sign) {
            hasOrder[i].order[type].sign.state = 2;
          }
          else {
            hasOrder[i].order[type].sign = {};
            hasOrder[i].order[type].sign.state = 2;
          }
          await ctx.model.Order.update({ _id: hasOrder[i]._id }, hasOrder[i]);
          username = hasOrder[i].order[type].order && hasOrder[i].order[type].order.username;
          if(username) {
            failOrder = await ctx.model.Order.find({
              time: { $gte: new Date(aMonthAgoYMDString), $lt: new Date(nowYMDString) },
              order: { $elemMatch: { 'order.username': username } }
            });
            if(failOrder.length) {
              if(failOrder.length >= 2) {
                await ctx.model.Punishment.create({
                  username,
                  start: new Date(),
                  end: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
                  state: 0
                });
              }
              else {
                failOrder.forEach(item => {
                  item.order.forEach(a => {
                    if(a.order && a.order.username === username) {
                      failLength++;
                    }
                  })
                });
                if(failLength >= 2) {
                  await ctx.model.Punishment.create({
                    username,
                    start: new Date(),
                    end: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
                    state: 0
                  });
                }
              }
            }
          }
        }
      }

    } catch(err) {
      console.log('this is a punishment schedule error--------------------')
      console.log(err)
      console.log('this is a punishment schedule error--------------------')

    }
  }
}