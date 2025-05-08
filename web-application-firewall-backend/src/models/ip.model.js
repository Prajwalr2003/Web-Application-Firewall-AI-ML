const mongoose = require('mongoose');
const {Schema} = mongoose;

const IPSchema = new Schema({
  ipType: {
    type: String,
    enum: ["host", "network", "range"],
    required: true,
    lowercase: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
    index: true 
  }
}, {
  timestamps: true
})

const IP = mongoose.model('IP', IPSchema);
module.exports = IP;