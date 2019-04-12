const user = require('./data/user.js');
module.exports = app => {
  app.beforeStart(async () => {
    const ctx = app.createAnonymousContext();
    // user.forEach(a => {
    //   ctx.model.User.create(a);
    // })
  })
}