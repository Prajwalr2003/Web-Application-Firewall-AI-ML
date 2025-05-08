const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const TrafficLogs = require("../models/trafficLogs.model");

const fetchTrafficLogs = asyncHandler( async (req, res) => {
  try{
    let trafficLogs = await TrafficLogs.find({userId: req?.user._id});
    res.status(200).json(new ApiResponse(200, trafficLogs, "Fetched all traffic logs succesffully"));
  }catch(err){
    console.log("Error while fetching traffic logs", err);
    res.status(500).json(new ApiError(500, "Internal Server Error", err));
  }
});

module.exports = {
  fetchTrafficLogs
}