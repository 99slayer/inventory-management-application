const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Use n value if the item does not have multiple sizes.
const SizeStockSchema = new Schema({
  n: { type: Number },
  s: { type: Number },
  m: { type: Number },
  l: { type: Number },
  xl: { type: Number },
});

const ItemSchema = new Schema({
  name: { type: String },
  description: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  price: { type: Schema.Types.Decimal128 },
  sizes_in_stock: {
    type: SizeStockSchema,
    default: {}
  },
  image_file: { type: Buffer },
});

ItemSchema.virtual('url').get(function () {
  return `/inventory/item/${this._id}`;
});

ItemSchema.virtual('convertedBuffer').get(function () {
  if (this.image_file === null) {
    return null;
  } else {
    return `data:image/jpeg;base64,${this.image_file.toString('base64')}`;
  };
});

module.exports = mongoose.model('Item', ItemSchema);
