const Item = require('../models/item');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');

// Display list of all items.
exports.item_list = asyncHandler(async (req, res, next) => {
  const items = await Item.find({}, 'name category')
    .populate('category')
    .sort('category')
    .exec();
  res.render('item_list', { title: 'Item List', item_list: items });
});

// Display details of a single item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id)
    .populate('category')
    .exec();

  if (item === null) {
    const err = new Error('Item not found.');
    err.status = 404;
    return next(err);
  }

  res.render('item_detail', { title: 'Item Detail', item: item });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  res.send('placeholder');
});

exports.item_create_post = asyncHandler(async (req, res, next) => {
  res.send('placeholder');
});

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  res.send('placeholder');
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  res.send('placeholder');
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
  res.send('placeholder');
});

exports.item_update_post = asyncHandler(async (req, res, next) => {
  res.send('placeholder');
});
