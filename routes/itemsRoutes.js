const express = require('express');
const router = express.Router();
const itemsController = require('../controller/itemsController');

router.get('/', itemsController.item_view_get);
router.post('/', itemsController.item_create_post);
router.get('/create', itemsController.item_create_get);
router.get('/categories', itemsController.item_categories_get);
router.get('/:id', itemsController.item_details_get);
router.delete('/:id', itemsController.item_delete);
router.put('/quantity/:id', itemsController.item_quantity_put);
router.put('/price/:id', itemsController.item_price_put);
router.put('/description/:id', itemsController.item_description_put);

module.exports = router;
