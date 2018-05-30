module.exports = {
  database: process.env.MONGO_URL,
  port: process.env.PORT || 3000,
  secretKey: process.env.SECRET_KEY,
  awsAccessKeyID: process.env.AWS_ACCESS_ID,
  awsAccessSecretKey: process.env.AWS_SECRET_KEY
};
