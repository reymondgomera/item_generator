const express = require('express');
const router = express.Router();
const pool = require('../db');
const itemsController = require('../controller/itemsController');

router.get('/', itemsController.item_create_get);
router.post('/', itemsController.item_create_post);
router.get('/categories', itemsController.item_categories_get);

module.exports = router;
