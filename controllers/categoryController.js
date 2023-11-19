const Category = require('../models/category');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

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
  res.render('category_form', { title: 'Create Category' });
});

exports.category_create_post = [
  // Validate and sanitize the name field.
  body('name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Category name must be between 3 and 50 characters.')
    .escape(),
  body('description')
    .trim()
    .isLength({ min: 0, max: 400 })
    .withMessage('Category description cannot exceed 400 characters.')
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description
    });

    if (!errors.isEmpty()) {
      // Invalid data.
      res.render('category_form', {
        title: 'Create Category',
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Valid data.
      const categoryExists = await Category.findOne({ name: req.body.name }).exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, '').exec(),
  ]);

  if (category === null) {
    res.redirect('/inventory/categories');
  }

  res.render('category_delete', {
    title: 'Delete Category',
    category: category,
    items: items,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, '').exec(),
  ]);

  if (items.length > 0) {
    // Items are still linked to this category.
    res.render('category_delete', {
      title: 'Delete Category',
      category: category,
      items: items,
    });
    return;
  } else {
    // No items are linked to this category.
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect('/inventory/categories');
  }
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    const err = new Error('Category not found.');
    err.status = 404;
    return next(err);
  }

  res.render('category_form', {
    title: 'Update Category',
    category: category,
  })
});

exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send('placeholder');
});
