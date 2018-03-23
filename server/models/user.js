const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

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
UserSchema.pre('save', (next) => {
  let user = this;

  // don't do anything if password is not changed
  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, null, null, (err, hash) => {
    if (err) return next();

    user.password = hash;
    next();
  });
});

// custom method
UserSchema.methods.comparePassword = (password) => {
  // this.password is the stored password hash in db
  return bcrypt.compareSync(password, this.password);
};
