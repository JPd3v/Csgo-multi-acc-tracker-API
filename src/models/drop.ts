import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const dropSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  name: { type: String, required: true },
  steam_account_id: {
    type: Schema.Types.ObjectId,
    ref: 'SteamAccounts',
    required: true,
  },
  quality: {
    type: String,
    enum: [
      'Factory New',
      'Minimal Wear',
      'Field-Tested',
      'Well-Worn',
      'Battle-Scarred',
    ],
  },
  price: {
    type: Number,
    required: true,
  },
  creation_date: { type: Date, required: true, default: Date.now },
});

export default mongoose.model('Drops', dropSchema);
