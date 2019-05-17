module.exports = app => {
  const { mongoose } = app;
  const { Schema } = mongoose;

  const OrderSchema = new Schema({
    room_id: { type: String },
    time: { type: Date },
    order: [
      {
        /*
          教室该节课状态：
          0： 有课,
          1： 已经预定，
          2： 空置，学生可预订
          3： 空置，教师可预订
        */
        state: { type: Number },
        // 被取消预订
        oldOrder: { type: Array },
        // 预订
        order: {
          username: String,
          time: Date,
          usedevice: Boolean,
          people: Number,
          des: String
        },
        // 签到
        sign: {
          /*
            签到状态：
              1：已经签到
              2：签到过期
              不存在：未签到
          */
          state: Number,
          username: String,
          time: Date
        }
      }
    ]
  })

  return mongoose.model('Order', OrderSchema, 'order')
}