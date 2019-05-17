/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1553691195402_9051';

  // add your middleware config here
  config.middleware = ['compress', 'loginjwt'];


  // add your user config here
  const userConfig = {
    loginjwt: {
      enable: true,
      ignore: ['/login', '/api/login']
    },
    // myAppName: 'egg',
    view: {
      defaultViewEngine: 'nunjucks',
      mapping: {
        '.tpl': 'nunjucks',
      },
    },
    security: {
      // 关闭csrf防范，**NOTICE** 有一定安全风险
      csrf: {
        enable: false,
        ignoreJSON: true
      }
    },
    mongoose: {
      url: 'mongodb://127.0.0.1:27017/bs',
      option: {}
    },
    redis: {
      client: {
        port: 6379, // Redis port 
        host: '127.0.0.1', // Redis host 
        password: 123456,
        db: 0,
      },
    },
    jwt: {
      secret: "123456"
    },
    compress: {
      threshold:2048,
    }      
  };

  return {
    ...config,
    ...userConfig,
  };
};