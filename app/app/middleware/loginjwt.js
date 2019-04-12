const jwt = require('jsonwebtoken');
module.exports = (options, app) => {
  return async function loginjwt(ctx, next) {
    let token = ctx.cookies.get('token', {signed: false});
    let result;
    if(token) {
      try {
        const current = Math.floor(Date.now() / 1000)
        result = jwt.verify(token, app.config.keys);
        let { exp } = result;
        if(current > exp) {
          ctx.redirect('/login');
          return;
        }
      } catch(e) {
        ctx.redirect('/login');
        return;
      }

      if(result) {
        const { username } = result;
        const redisToken = await app.redis.get(username);
        if(token === redisToken) {
          let userinfo =  await ctx.model.User.findOne({ username });
          if(userinfo) {
            ctx.userinfo = userinfo;
            await next();
            return
          }
        }
      }
    }
    ctx.redirect('/login');
  }
}