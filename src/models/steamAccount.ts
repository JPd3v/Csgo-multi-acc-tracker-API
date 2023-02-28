import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const steamAccounts = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  name: { type: String, required: true },
  steam_url: { type: String },
  money_revenue: { type: Number, required: true, default: 0 },
  creation_date: { type: Date, required: true, default: Date.now },
});

export default mongoose.model('SteamAccounts', steamAccounts);
