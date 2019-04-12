module.exports = app => {
  const { mongoose } = app;
  const { Schema } = mongoose;

  const OrderSchema = new Schema({
    id: { type: String },
    time: { type: Date },
    order: [
      {
        order: {
          username: String,
          time: Date
        },
        sign: {
          time: Date
        }
      }
    ]
  })

  return mongoose.model('Order', OrderSchema, 'order')
}