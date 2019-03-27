'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    return ctx.render('dist/index.tpl');
  }
}

module.exports = HomeController;
