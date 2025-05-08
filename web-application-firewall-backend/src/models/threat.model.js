const mongoose = require("mongoose");
const { Schema } = mongoose;

const threatSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  ip: {
    type: String,
  },
  hostname: {
    type: String,
  },
  requestPath: {
    type: String,
  },
  requestMethod: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'], 
    default: 'GET' 
  },
  threatType: {
    type: String,
  },
  geoLocation: {
    type: String,
  },
  severity: {
    type: String,
    enum: ["LOW", "HIGH", "MEDIUM"],
    default: "LOW",
    uppercase: true
  },
  requestBody: {
    type: Object
  },
  params: { 
      type: Object
  },
  query: {
      type: Object
  },
  status: { 
    type: String,
    enum: ["blocked", "allowed"],
    default: "blocked" 
  }
}, { timestamps: true });

const Threats = mongoose.model('Threats', threatSchema);
module.exports = Threats;