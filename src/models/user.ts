import mongoose from 'mongoose';

const { Schema } = mongoose;

const usersSchema = new Schema({
  name: { type: String, required: true },
  refresh_token: { type: String },
  OAuth_id: { type: String, required: true },
});

usersSchema.methods.toJSON = function removeFromUserSchema() {
  const obj = this.toObject();
  delete obj.refresh_token;
  delete obj.__v;
  delete obj.OAuth_id;
  return obj;
};

export default mongoose.model('Users', usersSchema);
