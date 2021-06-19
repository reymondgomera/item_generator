const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));

app.get('/', async (req, res) => res.render('items/index', { title: 'Home' }));

app.get('/about', async (req, res) => res.render('items/about', { title: 'About' }));

app.use('/items', require('./routes/itemsRoutes'));
app.use((req, res) => res.status(404).render('items/404', { title: 'Page Not Found' }));

app.listen(PORT, () => console.log(`Server is now listening at ${PORT}`));
