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
    sign: { type: Array },
    manager: { type: Array }
  })

  return mongoose.model('Room', RoomSchema, 'room')
}