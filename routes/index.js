const passport = require('passport');

const router = require('express').Router();

router.use('/', require('./swagger'));
router.use('/products', require('./productRoutes'));
router.use('/users', require('./userRoutes'));

// router.get('/', (req, res) => {
    //#swagger.tags=['Hello World'] res.send('Hello World'); });

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;
