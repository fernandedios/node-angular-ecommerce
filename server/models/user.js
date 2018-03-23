const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto'); // builtin js library

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  name: String,
  password: String,
  picture: String,
  isSeller: { type: Boolean, default: false },
  address: {
    add1: String,
    add2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  created: { type: Date, default: Date.now }
});

// middleware
// do NOT use fat arrow functions, changes 'this'
UserSchema.pre('save', function(next) {
  let user = this;

  // don't do anything if password is not changed
  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, null, null, (err, hash) => {
    if (err) return next();

    user.password = hash;
    next();
  });
});

// custom methods
UserSchema.methods.comparePassword = function(password) {
  // this.password is the stored password hash in db
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.gravatar = (size) => {
  const url = 'https://gravatar.com/avatar/';
  if (!this.size) size = 200;
  if (!this.email) return `${url}?s=${size}&d=retro`;

  const md5 = crypto.createHash('md5')
    .update(this.email)
    .digest('hex');

  return `${url}${md5}?s=${size}&d=retro`;
};

module.exports = mongoose.model('User', UserSchema);
