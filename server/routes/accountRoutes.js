const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/secret');

const User = require('../models/user');
const checkJWT = require('../middlewares/checkJwt');

router.post('/signup', async (req, res, next) => {
  const { name, email, password, isSeller } = req.body;
  let user = new User();
  user.name = name;
  user.email = email;
  user.password = password;
  user.isSeller = isSeller
  user.picture = user.gravatar();

  try {
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      res.json({
        success: false,
        message: 'Account with that email already exists'
      });
    }
    else {
      await user.save();
      const token = jwt.sign({ user }, secretKey, { expiresIn: '7d' });

      res.json({
        success: true,
        message: 'Signup Successful',
        token
      });
    }
  }
  catch (err) {
    next(err);
  }
});


router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const failed = {
      success: false,
      message: 'Authentication failed. User not found.'
    };

    if(!user) {
      res.json(failed);
    }
    else if (user) {
      const validPassword = user.comparePassword(password);
      if(!validPassword) {
        res.json(failed);
      }
      else {
        const token = jwt.sign({ user }, secretKey, { expiresIn: '7d' });
        res.json({
          success: true,
          message: "Login successful.",
          token
        });
      }
    }
  }
  catch(err) {
    throw err;
  }
});

router.route('/profile')
  .get(checkJWT, async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.decoded.user._id });
      res.json({
        success: true,
        message: 'Successful',
        user
      })
    }
    catch(err) {
      next(err);
    }
  })
  .post(checkJWT, async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.decoded.user._id });

      if(req.body.name) user.name = req.body.name;
      if(req.body.email) user.email = req.body.email;
      if(req.body.password) user.password = req.body.password;
      user.isSeller = req.body.isSeller;

      await user.save();
      res.json({
        success: true,
        message: 'User profile updated successfully'
      });
    }
    catch (err) {
      next(err);
    }
  });

module.exports = router;
