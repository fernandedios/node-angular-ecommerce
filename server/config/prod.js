module.exports = {
  database: process.env.MONGO_URL,
  port: process.env.PORT || 3000,
  secretKey: process.env.SECRET_KEY
};
