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

  router.get('/api/room/category', controller.room.category);
  router.get('/api/room/roomList', controller.room.roomList);

  router.get('*', controller.home.index);
};
