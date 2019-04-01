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
  }
}