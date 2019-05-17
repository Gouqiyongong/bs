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
  router.get('/api/getUserInfo', controller.user.getUserInfo);
  router.get('/api/failLogin', controller.user.failLogin);
  
  router.get('/api/room/category', controller.room.category);
  router.get('/api/room/roomList', controller.room.roomList);
  router.get('/api/room/roomPower', controller.room.roomPower);
  router.post('/api/room/order', controller.room.order);
  router.post('/api/room/sign', controller.room.sign);
  router.get('/api/room/recommend', controller.room.recommend);

  router.get('/api/order/list', controller.order.list);
  router.post('/api/order/failOrder', controller.order.failOrder);

  router.get('/api/manage/roomManageList', controller.manage.roomManageList);
  router.get('/api/manage/userList', controller.manage.userList);
  router.get('/api/manage/get2ManageAbout', controller.manage.get2ManageAbout);
  router.post('/api/manage/deleteManage', controller.manage.deleteManage);
  router.post('/api/manage/addManage', controller.manage.addManage);
  router.post('/api/manage/deleteManage2', controller.manage.deleteManage2);
  router.post('/api/manage/addManage2', controller.manage.addManage2);
  router.post('/api/manage/orderList', controller.manage.orderList);
  router.get('/api/manage/chart', controller.manage.chart);
  
  router.get('*', controller.home.index);
};
