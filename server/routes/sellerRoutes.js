const router = require('express').Router();
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const faker = require('faker');

const Product = require('../models/product');
const checkJWT = require('../middlewares/checkJwt');
const { awsAccessKeyID, awsAccessSecretKey, awsBucketName } = require('../config/secret');

const s3 = new aws.S3({ accessKeyId: awsAccessKeyID, secretAccessKey: awsAccessSecretKey });

const upload = multer({
    storage: multerS3({
        s3,
        bucket: awsBucketName,
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function(req, file, cb) {
            cb(null, Date.now().toString());
        }
    })
});

router.route('/products')
    .get(checkJWT, async (req, res, next) => {
        try {
            const products = await Product.find({ owner: req.decoded.user._id })
                .populate('owner')
                .populate('category')
                .exec();

            res.json({
                success: true,
                message: 'Products fetched successfully',
                products
            });
        }
        catch (err) {
            res.next(err);
        }
    })
    .post([checkJWT, upload.single('product_picture')], async (req, res, next) => {
        let product = new Product();
        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        product.image = req.file.location;

        try {
            await product.save();
            res.json({
                success: true,
                message: 'Successfully added the product'
            });
        }
        catch(err) {
            res.next(err);
        }
        
    });

// FOR TESTING ONLY
router.get('/faker/test', (req, res, next) => {
    for (let i = 0; i < 20; i++) {
        let product = new Product();
        product.category = '5b0e18ef68cd3807405b0611'
        product.owner = '5ab49af494f7bd0aa9655a0b';
        product.image = faker.image.food();
        product.title = faker.commerce.productName();
        product.description = faker.lorem.words();
        product.price = faker.commerce.price();
        product.save();
    }

    res.json({
        message: 'Successfully added 20'
    });
})

module.exports = router;
