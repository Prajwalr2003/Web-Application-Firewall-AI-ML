const mongoose = require('mongoose');

const trafficLogsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  ip: {
    type: String,
    required: true
  },
  hostname: {
    type: String
  },
  path: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  requestMethod: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']
  },
  country: {
    type: String
  },
  userAgent: {
    type: String
  },
  isBlocked:{
    type: Boolean
  }
}, { timestamps: true, autoIndex: false });

module.exports = mongoose.model('TrafficLogs', trafficLogsSchema);