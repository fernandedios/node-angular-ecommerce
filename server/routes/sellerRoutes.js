const router = require('express').Router();
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

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

module.exports = router;
