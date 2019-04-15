'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/login', controller.home.index);
  router.get('/api/addUser', controller.user.add);
  router.get('/api/list', controller.user.userList);

  router.post('/api/login', controller.user.userLogin);
  router.get('*', controller.home.index);
};
