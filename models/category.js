const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String },
  description: { type: String },
});

CategorySchema.virtual('url').get(function () {
  return `/somethin/somethin/${this._id}`;
});

module.exports = mongoose.model('Category', CategorySchema);
