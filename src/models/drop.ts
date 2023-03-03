import mongoose from 'mongoose';
import SteamAccount from './steamAccount';

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

dropSchema.pre('save', async function updateAccount() {
  const steamAccountId = this.steam_account_id;
  const dropPrice = this.price;

  await SteamAccount.findByIdAndUpdate(steamAccountId, {
    $inc: { money_revenue: dropPrice },
  });
});

export default mongoose.model('Drops', dropSchema);
