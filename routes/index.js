const router = require('express').Router();

router.use('/', require('./swagger'));
router.use('/products', require('./productRoutes'));
router.use('/users', require('./userRoutes'));

router.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = router;
