import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  name: { type: String, required: true },
  refresh_token: { type: String },
  OAuth_id: { type: String, required: true },
});

export default mongoose.model('Users', usersSchema);
