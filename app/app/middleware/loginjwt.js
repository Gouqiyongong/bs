const jwt = require('jsonwebtoken');
module.exports = (options, app) => {
  return async function loginjwt(ctx, next) {
    // 获取token
    let token = ctx.cookies.get('token', {signed: false});
    let result;
    if(token) {
      try {
        const current = Math.floor(Date.now() / 1000)
        // 解密token
        result = jwt.verify(token, app.config.keys);
        let { exp } = result;
        // 验证token是否过期
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
        // 从Redis获取该用户登录时存下的token信息
        const redisToken = await app.redis.get(username);
        // 验证token是否有效
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