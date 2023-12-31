const Item = require('../models/item');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const multer = require('multer');

const storage = multer.memoryStorage();
const MB = 1048576;
const upload = multer({
  storage: storage,
  limits: { fileSize: MB * 6 }
});

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
  const categories = await Category.find().exec();

  if (categories.length === 0) {
    const err = new Error('Items cannot be created if there are no existing categories.');
    err.status = 404;
    return next(err);
  }

  res.render('item_form', { title: 'Create Item', categories: categories });
});

const isPositive = (n) => {
  if (n < 0) {
    return false;
  } else {
    return true;
  }
};

exports.item_create_post = [
  upload.single('file-upload'),

  // Validate and sanitize.
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Item name must be between 2 and 50 characters.')
    // File validation work around.
    .custom((value, { req }) => {
      if (req.file === undefined) {
        return true
      }

      const types = ['image/png', 'image/jpeg', 'image/jpg'];
      const extensions = ['png', 'jpeg', 'jpg'];
      const getExtension = (fileName) => {
        return fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2)
      };

      if (!(extensions.includes(getExtension(req.file.originalname)))) {
        throw Error(`file ${req.file.originalname} has an invalid file extension.`);
      }

      if (!(types.includes(req.file.mimetype))) {
        throw Error(`file ${req.file.originalname} has an invalid mimetype.`);
      }

      if (req.file.size > MB * 2) {
        throw Error(`file ${req.file.originalname} is too big.`);
      }

      return true;
    })
    .escape(),
  body('category')
    .escape(),
  body('price')
    .trim()
    .isNumeric()
    .custom(isPositive)
    .withMessage('Price must be a positive value.')
    .escape(),
  body('small')
    .trim()
    .isNumeric()
    .custom(isPositive)
    .withMessage('Small: Cannot have negative product in stock.')
    .escape(),
  body('medium')
    .trim()
    .isNumeric()
    .custom(isPositive)
    .withMessage('Medium: Cannot have negative product in stock.')
    .escape(),
  body('large')
    .trim()
    .isNumeric()
    .custom(isPositive)
    .withMessage('Large: Cannot have negative product in stock.')
    .escape(),
  body('extraLarge')
    .trim()
    .isNumeric()
    .custom(isPositive)
    .withMessage('ExtraLarge: Cannot have negative product in stock.')
    .escape(),
  body('description')
    .trim()
    .isLength({ min: 0, max: 400 })
    .withMessage('Item description cannot exceed 400 characters.')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const price = Number.parseFloat(req.body.price).toFixed(2);
    const category = await Category.findOne({ name: req.body.category }).exec();
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: category,
      price: price,
      sizes_in_stock: {
        n: 0,
        s: req.body.small,
        m: req.body.medium,
        l: req.body.large,
        xl: req.body.extraLarge,
      },
      image_file: (undefined === req.file ? null : req.file.buffer),
    });

    if (!errors.isEmpty()) {
      // Invalid data.
      const categories = await Category.find().exec();

      res.render('item_form', {
        title: 'Create Item',
        item: item,
        categories: categories,
        errors: errors.array(),
      })
      return;
    } else {
      // Valid data.
      const itemExists = await Item.findOne({ name: req.body.name }).exec();
      if (itemExists) {
        res.redirect(itemExists.url);
      } else {
        await item.save();
        res.redirect(item.url);
      }
    }
  }),
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();

  if (item === null) {
    // No results.
    res.redirect('/inventory/items');
  }

  res.render('item_delete', {
    title: 'Delete Item',
    item: item,
  });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndDelete(req.body.itemid);
  res.redirect('/inventory/items');
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, categories] = await Promise.all([
    Item.findById(req.params.id).populate('category').exec(),
    Category.find({}, 'name').exec(),
  ]);

  if (item === null) {
    const err = new Error('Item not found.');
    err.status = 404;
    return next(err);
  }

  res.render('item_form', {
    title: 'Update Item',
    item: item,
    categories: categories,
  });
});

exports.item_update_post = [
  upload.single('file-upload'),

  // Validate and sanitize.
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Item name must be between 2 and 50 characters.')
    // File validation work around.
    .custom((value, { req }) => {
      if (req.file === undefined) {
        return true
      }

      const types = ['image/png', 'image/jpeg', 'image/jpg'];
      const extensions = ['png', 'jpeg', 'jpg'];
      const getExtension = (fileName) => {
        return fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2)
      };

      // Validates file extension.
      if (!(extensions.includes(getExtension(req.file.originalname)))) {
        throw Error(`file ${req.file.originalname} has an invalid file extension.`);
      }

      // Validates file mimetype.
      if (!(types.includes(req.file.mimetype))) {
        throw Error(`file ${req.file.originalname} has an invalid mimetype.`);
      }

      // Validates file size.
      if (req.file.size > MB * 2) {
        throw Error(`file ${req.file.originalname} is too big.`);
      }

      return true;
    })
    .escape(),
  body('category')
    .escape(),
  body('price')
    .trim()
    .isNumeric()
    .custom(isPositive)
    .withMessage('Price must be a positive value.')
    .escape(),
  body('small')
    .trim()
    .isNumeric()
    .custom(isPositive)
    .withMessage('Small: Cannot have negative product in stock.')
    .escape(),
  body('medium')
    .trim()
    .isNumeric()
    .custom(isPositive)
    .withMessage('Medium: Cannot have negative product in stock.')
    .escape(),
  body('large')
    .trim()
    .isNumeric()
    .custom(isPositive)
    .withMessage('Large: Cannot have negative product in stock.')
    .escape(),
  body('extraLarge')
    .trim()
    .isNumeric()
    .custom(isPositive)
    .withMessage('ExtraLarge: Cannot have negative product in stock.')
    .escape(),
  body('description')
    .trim()
    .isLength({ min: 0, max: 400 })
    .withMessage('Item description cannot exceed 400 characters.')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const price = Number.parseFloat(req.body.price).toFixed(2);
    const category = await Category.findOne({ name: req.body.category }).exec();
    const oldImgBuffer = await Item.findById(req.params.id, 'image_file').exec();

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: category,
      price: price,
      sizes_in_stock: {
        n: 0,
        s: req.body.small,
        m: req.body.medium,
        l: req.body.large,
        xl: req.body.extraLarge,
      },
      // First checks for new file, then nofile value, and then old image.
      image_file: (req.file !== undefined ? req.file.buffer : (req.body.nofile ? null : (oldImgBuffer !== null ? oldImgBuffer : null))),
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // Invalid data.
      const categories = await Category.find().exec();

      res.render('item_form', {
        title: 'Update Item',
        item: item,
        categories: categories,
        errors: errors,
      })
    } else {
      // Valid data.
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(updatedItem.url);
    }
  }),
];
