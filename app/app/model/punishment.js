module.exports = app => {
  const { mongoose } = app;
  const { Schema } = mongoose;

  const PunishmentSchema = new Schema({
    username: { type: String },
    start: { type: Date },
    end: { type: Date },
    /*
      0: 惩罚中，
      1：惩罚完成
    */
    state: { type: Number }
  })

  return mongoose.model('Punishment', PunishmentSchema, 'punishment')
}