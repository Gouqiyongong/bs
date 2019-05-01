const Subscription = require('egg').Subscription;

class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      cron: '0 35 16 * * ?',
      type: 'worker'
      //interval: '10m', // 1 分钟间隔
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    await this.ctx.helper.punishment(this.ctx, 7);
  }
}

module.exports = UpdateCache;