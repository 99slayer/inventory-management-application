const Category = require('../models/category');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');

// Display list of all categories.
exports.category_list = asyncHandler(async (req, res, next) => {
  const [categories, items] = await Promise.all([
    Category.find({}, 'name')
      .sort({ name: 1 })
      .exec(),
    Item.find({})
      .populate('category')
      .exec()
  ])
  res.render(
    'category_list',
    {
      title: 'Category List',
      category_list: categories,
      item_list: items,
    }
  );
});

// Display details of a single category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);

  if (category === null) {
    const err = new Error('Category not found.');
    err.status = 404;
    return next(err);
  }

  res.render('category_detail', {
    title: 'Category Detail',
    category: category,
    category_items: categoryItems,
  });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.send('placeholder');
});

exports.category_create_post = asyncHandler(async (req, res, next) => {
  res.send('placeholder');
});

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send('placeholder');
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send('placeholder');
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send('placeholder');
});

exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send('placeholder');
});
