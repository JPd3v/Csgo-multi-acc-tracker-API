import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const itemsSchema = new Schema({
  item_name: { type: String, required: true },
  collection_name: { type: String, required: true },
  item_data: [
    {
      quality: {
        type: String,
      },

      price: {
        type: Number,
        required: true,
      },
    },
  ],
});

export default mongoose.model('Items', itemsSchema);