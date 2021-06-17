const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const pool = require('../db');

// init storage
const storage = multer.diskStorage({
    destination: './public/uploads/image/item',
    filename: (req, file, callback) => {
        callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// init upload
const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        isValidFileType(file, callback);
    },
}).single('item-image');

// validate file
const isValidFileType = (file, callback) => {
    // allowed extension
    const validFileType = /jpeg|jpg|png/;
    // test if extension and mimetype is valid
    const isExtNameValid = validFileType.test(path.extname(file.originalname).toLowerCase());
    const isMimeTypeValid = validFileType.test(file.mimetype);

    if (isExtNameValid && isMimeTypeValid) {
        // accept the file
        console.log('file accepted');
        return callback(null, true);
    } else callback('File is not valid, images Only.');
};

const imageOptimization = file => {
    const jpgFileType = /jpeg|jpg/;
    const pngFileType = /png/;

    /**
     *  After the image was uploaded, sharp compresses/optimied the image then rewrite it
        extension name for their appropriate optimatization/compression 
    */
    if (jpgFileType.test(path.extname(file.filename))) {
        // jpeg/jpg optimatization/compression using sharp
        sharp(file.path)
            .jpeg({ mozjpeg: true })
            .toBuffer((err, data, info) => {
                fs.writeFile(file.path, data, {}, err => {
                    if (err) throw err;
                    console.log(file.filename, 'is jpeg/jpg optimized...');
                });
            });
    }
    if (pngFileType.test(path.extname(file.filename))) {
        // png optimatization/compression using sharp
        sharp(file.path)
            .png({ palette: true })
            .toBuffer((err, data, info) => {
                fs.writeFile(file.path, data, {}, err => {
                    if (err) throw err;
                    console.log(file.filename, 'is png optimized...');
                });
            });
    }
};

const item_create_get = async (req, res) => {
    try {
        res.render('items/create_item', { title: 'Create Item' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error Occured..');
    }
};

const item_view_get = async (req, res) => {
    try {
        const query_response = await pool.query('SELECT * FROM item_list');
        res.render('items/items', { title: 'Items', items: query_response.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error Occured..');
    }
};

const item_create_post = async (req, res) => {
    try {
        upload(req, res, async err => {
            if (err) {
                res.send(err);
            } else {
                if (req.file == undefined) {
                    res.send('file is not selected..');
                } else {
                    try {
                        const { name, quantity, price, category, description } = req.body;
                        const sql = ` 
                        INSERT INTO public.items(item_name, item_quantity, item_price, category_id, item_desc, 
                        item_image, item_createdat, item_updatedat) VALUES($1, $2, $3, $4, $5, $6, CURRENT_DATE, CURRENT_DATE)`;
                        const data = [name, quantity, price, category, description, req.file.filename];
                        await pool.query(sql, data);

                        //optimized image
                        imageOptimization(req.file);

                        res.json({ message: 'Item added successfully!' });
                    } catch (err) {
                        console.error(err.message);
                    }
                }
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error Occured..');
    }
};

const item_categories_get = async (req, res) => {
    try {
        const query_response = await pool.query('SELECT * FROM categories');
        res.json(query_response.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error Occured..');
    }
};

const item_quantity_put = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const sql = 'UPDATE items SET item_quantity = $1, item_updatedat = CURRENT_DATE WHERE item_id = $2';
        const data = [quantity, id];
        await pool.query(sql, data);

        res.json({ message: "Item's quantity was updated succesfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error Occured..');
    }
};

const item_price_put = async (req, res) => {
    try {
        const { id } = req.params;
        const { price } = req.body;

        const sql = 'UPDATE items SET item_price = $1, item_updatedat = CURRENT_DATE WHERE item_id = $2';
        const data = [price, id];
        await pool.query(sql, data);

        res.json({ message: "Item's price was updated succesfully!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error Occured..');
    }
};

const item_description_put = async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const sql = 'UPDATE items SET item_desc = $1, item_updatedat = CURRENT_DATE WHERE item_id = $2';
        const data = [description, id];
        await pool.query(sql, data);

        res.json({ message: "Item's description was updated succesfully!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error Occured..');
    }
};

module.exports = {
    item_view_get,
    item_create_get,
    item_create_post,
    item_categories_get,
    item_quantity_put,
    item_price_put,
    item_description_put,
};
