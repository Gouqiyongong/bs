module.exports = app => {
  const { mongoose } = app;
  const { Schema } = mongoose;

  const RoomSchema = new Schema({
    id: { type: String },
    place: { type: String },
    area: { type: String },
    floor: { type: String },
    roomnumber: { type: String },
    size: { type: Number },
    // 教室位置  一个数组  表示坐标
    sign: { type: Array },
    manager: { type: Array }
  })

  return mongoose.model('Room', RoomSchema, 'room')
}