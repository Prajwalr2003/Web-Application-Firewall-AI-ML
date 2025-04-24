const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    adminName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'Admin name must be at least 5 characters'],
      maxlength: [20, 'Admin name cannot exceed 20 characters'],
      index: true
    },
    companyName: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      minlength: [3, 'Company name must be at least 3 characters'],
      maxlength: [30, 'Company name cannot exceed 30 characters'],
      index: true
    },
    gender: {
      type: String, 
      lowercase: true,
      enum: ["male", "female", "others"]
    },
    phone: {
      type: String,
      unique: true,
      trim: true,
      match: [
        /^\d{10}$/,
        'Phone number must be a valid 10-digit number'
      ],
    },
    userImage: {
      type: String
    },
    password: {
      type: String,
      required: true,
      minlength: [8, 'Password must be at least 8 characters']
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address'
      ],
      index: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      _id : this._id,
      email: this.email,
      adminName: this.adminName,
      companyName: this.companyName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      _id : this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

const User = mongoose.model('User', userSchema);
module.exports = User; 
