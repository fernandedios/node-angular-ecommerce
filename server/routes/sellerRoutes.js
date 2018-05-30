const router = require('express').Router;
const aws = require('aws');
const multer = require('multer');
const multerS3 = require('multer-s3');

const Product = require('../models/product');
const { awsAccessKeyID, awsAccessSecretKey } = require('../config/secret');

const s3 = new aws.S3({ accessKeyId: awsAccessKeyID, secretAccessKey: awsAccessSecretKey });


module.exports = router;