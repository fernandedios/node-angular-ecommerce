const router = require('express').Router();
const Category = require('../models/category');

router.route('/categories')
    .get(async (req, res, next) => {
        try {
            const categories = await Category.find({});
            res.json({
                success: true,
                message: "Success",
                categories
            });
        }
        catch (err) {
            res.next(err);
        }
    })
    .post((req, res, next) => {
        let category = new Category();
        category.name = req.body.category;
        category.save();
        res.json({
            ssuccess: true,
            message: 'Successful'
        });
    });

    module.exports = router;
    