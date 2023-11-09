const express = require('express');
const router = express.Router();

// Require controller modules.
// CONTROLLERS

// CATEGORY ROUTES
// GET/POST request for creating category.
router.get('/category/create', category_controller.category_create_get);
router.post('/category/create', category_controller.category_create_post);

// GET/POST request to delete category.
router.get('/category/:id/delete', category_controller.category_delete_get);
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET/POST request to update category.
router.get('/category/:id/update', category_controller.category_update_get);
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one category.
router.get('/category/:id', category_controller.category_detail);

// GET request for a category list.
router.get('/categories', category_controller.category_list);

// ITEM ROUTES
// GET/POST request for creating item.
router.get('/item/create', item_controller.item_create_get);
router.post('/item/create', item_controller.item_create_post);

// GET/POST request to delete item.
router.get('/item/:id/delete', item_controller.item_delete_get);
router.post('/item/:id/delete', item_controller.item_delete_post);

// GET/POST request to update item.
router.get('/item/:id/update', item_controller.item_update_get);
router.post('/item/:id/update', item_controller.item_update_post);

// GET request for one item.
router.get('/item/:id', item_controller.item_detail);

// GET request for an item list.
router.get('/items', item_controller.item_list);