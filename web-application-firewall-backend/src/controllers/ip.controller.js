const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const IP = require("../models/ip.model");
const mongoose = require('mongoose');
const User = require("../models/user.model");

const addIP = asyncHandler( async (req, res) => {
  let {ipType, name, address, description, status} = req.body;

  let userId = req.user._id;

  if([ipType, name, address, description, status].some((field)=> {
    !field?.trim()
  })){
    return res.status(400).json(
      new ApiError(400, "All fields are required")
    )
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json(new ApiError(400, "User does not exist"));
    }
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Internal Server Error while checking user", error));
  }

  const allowedIPTypes = ["host", "network", "range"];

  if (!allowedIPTypes.includes(ipType)) {
    return res.status(400).json(
      new ApiError(400, `Invalid IP Type. Must be one of: ${allowedIPTypes.join(', ')}`)
    );
  }

  const isIPExist = await IP.findOne({ address: address, userId: userId});

  if (isIPExist) {
    return res.status(400).json(
      new ApiError(400, "This IP Address already exists for your account")
    );
  }

  try{
    const createdIP = await IP.create({
      ipType: ipType.toLowerCase(),
      name,
      address,
      description,
      status: status.toLowerCase()==="blocked",
      userId: userId
    });
    if(!createdIP){
      return res.status(500).json(
        new ApiError(500, "Internal Server Error")
      );
    }
    res.status(201).json(
      new ApiResponse(200, createdIP, "IP address added successfully")
    )

  }catch(error){
    if (error.code === 11000) {
      return res.status(409).json(new ApiError(409, `IP address "${address}" already exists`)); 
    }
    // Handle other database errors
    console.error("Error creating IP:", error);
    return res.status(500).json(new ApiError(500, "Failed to create IP address")); 
  }
});

const fetchIPList = asyncHandler( async (req, res) => {
  try {
    const userId = req.user._id; // Get the authenticated user's ID

    const ipList = await IP.find({ userId }); // Fetch IPs for the specific user

    if (!ipList || ipList.length === 0) {
      return res.status(200).json(
        new ApiResponse(200, [], "No IP addresses found for this user")
      );
    }

    res.status(200).json(
      new ApiResponse(200, ipList, "IP addresses retrieved successfully for this user")
    );

  } catch (error) {
    console.error("Error fetching IP list:", error);
    return res.status(500).json(
      new ApiError(500, "Failed to retrieve IP addresses")
    );
  }
});

const updateIP = asyncHandler(async (req, res)=> {
  const { _id, ipType, name, description, address, status } = req.body;

  if (!_id) {
    throw new ApiError(400, "IP ID (_id) is required for updating.");
  }

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new ApiError(400, "Invalid IP ID (_id) format.");
  }

  const existingIP = await IP.findById(_id);
  if (!existingIP) {
    throw new ApiError(404, "IP address not found.");
  }

  if (address && address !== existingIP.address) {
    const duplicateIP = await IP.findOne({ address });
    if (duplicateIP) {
      throw new ApiError(409, "IP address already exists.");
    }
  }

  const updateData = {};
  if (ipType) updateData.ipType = ipType.toLowerCase(); 
  if (name) updateData.name = name;    
  if (address) updateData.address = address;
  if (description) updateData.description = description;
  if (status !== undefined) updateData.status = status === "blocked"; 

  // Update the IP address
  const updatedIP = await IP.findByIdAndUpdate(
    _id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedIP) {
    throw new ApiError(500, "Failed to update IP address");
  }

  res.status(200).json(
    new ApiResponse(200, "IP address updated successfully", updatedIP)
  );
});

const deleteIP = asyncHandler(async (req, res)=> {
  let id = req?.params?.id;
  try {
    const deletedIP = await IP.deleteOne({_id:id});
    res.status(200).json(new ApiResponse(200, deletedIP, "IP Deleted Successfully"));
  } catch (error) {
    throw new ApiError(500, "IP Deleted Failed", error);
  }
});

module.exports = {
  addIP,
  fetchIPList,
  updateIP,
  deleteIP
}