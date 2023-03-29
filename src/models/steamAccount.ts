import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const defaultDate = new Date()
  .toLocaleString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  .replace(' ', 'T');

const steamAccounts = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  name: { type: String, required: true },
  steam_url: { type: String },
  money_revenue: { type: Number, required: true, default: 0 },
  last_drop_timestamp: {
    type: String,
    default: defaultDate,
  },
  creation_date: { type: Date, required: true, default: Date.now },
});

export default mongoose.model('SteamAccounts', steamAccounts);
