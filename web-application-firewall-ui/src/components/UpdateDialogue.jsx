import React, { useRef, useState } from "react";
import { TextInput, Textarea, Select, Button, Spinner } from "flowbite-react";
import { motion } from "framer-motion";
import { HiPlus, HiX } from "react-icons/hi";
import axios from "axios";
import { useToast } from "../context/ToastContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;

const UpdateDialogue = ({
  action,
  setAction,
  data,
  fetchIPList,
  loading,
  setLoading,
}) => {
  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
  };

  let [_id, setId] = useState(data._id);
  let [ipType, setIPType] = useState(data.ipType);
  let [name, setName] = useState(data.name);
  let [description, setDescription] = useState(data.description);
  let [address, setAddress] = useState(data.address);
  let [status, setStatus] = useState(data.status ? "blocked" : "allowed");

  const handleAction = () => {
    setAction(!action);
  };

  const { showToast } = useToast();

  const updateIP = async () => {
    try {
      setLoading(true);
      let IPData = {
        _id,
        ipType,
        name,
        description,
        address,
        status,
      };
      console.log(IPData);
      const res = await axios.post(
        `${BACKEND_URL}/waf/api/v1/ip/update-ip`,
        IPData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log(res);
      setAction(false);
      setLoading(false);
      fetchIPList();
      showToast("IP Updated Successfully", "success");
    } catch (error) {
      console.log(error, "IP update failed");
      setLoading(false);
      if (error.response && error.response.status === 400) {
        if (error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          showToast("IP address already exists.", "error");
        }
      } else {
        showToast("Failed to add IP address.", "error");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <motion.div
        variants={dialogVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-md mx-4"
      >
        {/* Close Button */}
        <button
          onClick={handleAction}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <HiX size={20} />
        </button>

        <div className="space-y-6 p-6 bg-gray-900 rounded-lg border border-gray-700 shadow-2xl">
          <h2 className="text-xl font-semibold text-gray-100">
            Update IP Address
          </h2>
          <p className="text-gray-400 text-sm">
            Enter the details for the new IP address.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-300"
              >
                Type
              </label>
              <Select
                id="type"
                value={ipType}
                onChange={(e) => setIPType(e.target.value)}
              >
                <option value="host">Host</option>
                <option value="network">Network</option>
                <option value="range">Range</option>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-300"
              >
                Address
              </label>
              <TextInput
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., 192.168.1.10 or 192.168.1.0/24 or 10.0.0.1-10.0.0.50"
                className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-400 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Name
              </label>
              <TextInput
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Server A"
                className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-400 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300"
              >
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Web Server"
                className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-400 min-h-[80px] text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-300"
              >
                Status
              </label>
              <Select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="allowed">Allowed</option>
                <option value="blocked">Blocked</option>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button color="gray" onClick={handleAction}>
              Cancel
            </Button>
            {!loading ? (
              <Button color="blue" icon={HiPlus} onClick={updateIP}>
                Update
              </Button>
            ) : (
              <Button type="submit" color="dark">
                <Spinner color="info" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UpdateDialogue;
