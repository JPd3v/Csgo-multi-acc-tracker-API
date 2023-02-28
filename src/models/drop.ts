import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const dropSchema = new Schema({
  name: { type: String, required: true },
  steam_account_id: {
    type: Schema.Types.ObjectId,
    ref: 'SteamAccounts',
    required: true,
  },
  quality: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  creation_date: { type: Date, required: true, default: Date.now },
});

export default mongoose.model('Drops', dropSchema);
