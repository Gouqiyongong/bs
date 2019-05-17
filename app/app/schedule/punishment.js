const Subscription = require('egg').Subscription;

class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      // 使用cron语法写定点任务，此为每天8:45执行
      cron: '0 45 8 * * ?',
      type: 'worker'
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    await this.ctx.helper.punishment(this.ctx, 0);
  }
}

module.exports = UpdateCache;