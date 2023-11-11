const Item = require('../models/item');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');

exports.item_list = asyncHandler(async (req, res, next) => {
  res.send('placeholder');
});

exports.item_detail = asyncHandler(async (req, res, next) => {
  res.send('placehold');
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
