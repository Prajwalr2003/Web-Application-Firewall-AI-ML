const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Threat = require("../models/threat.model");

const fetchThreats = asyncHandler( async (req, res) => {
  try{
    let threats = await Threat.find({userId: req?.user._id});
    res.status(200).json(new ApiResponse(200, threats, "Fetched all threats succesffully"));
  }catch(err){
    console.log("Error while fetching all threats", err);
    res.status(500).json(new ApiError(500, "Internal Server Error", err));
  }
});

module.exports = {
  fetchThreats
}