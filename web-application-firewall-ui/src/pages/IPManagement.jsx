import React, { useState } from "react";
import { FaFire, FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import { TextInput, Textarea, Select, Button, Table } from "flowbite-react";
import { motion } from "framer-motion";
import { HiPlus, HiX } from "react-icons/hi";

const IPManagement = () => {
  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
  };
  let IPList = [
    {
      type: "Host",
      address: "192.168.1.10",
      name: "Server A",
      description: "Web Server",
    },
    {
      type: "Network",
      address: "192.168.2.0/24",
      name: "LAN B",
      description: "Local Network B",
    },
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const handleDialogue = () => {
    setOpen(!open);
  };
  return (
    <div className="p-8">
      <div className="flex flex-col justify-center shadow-lg border p-5">
        <div className="flex gap-3 justify-start">
          <FaFire size={30} />
          <p className="text-xl font-bold uppercase">IP Address Management</p>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 md:mb-6 pt-4">
          <Button
            onClick={handleDialogue}
            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 transition-colors"
          >
            <FaPlus className="mr-2 h-4 w-4" /> Add IP Address
          </Button>
          <TextInput
            type="text"
            placeholder="Search IPs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-auto"
          />
        </div>
        <div className="mt-3 text-2xl">
          <Table hoverable>
            <Table.Head className="text-sm">
              <Table.HeadCell>Sr. No.</Table.HeadCell>
              <Table.HeadCell>Type</Table.HeadCell>
              <Table.HeadCell>Address</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y text-sm">
              {IPList.map((data, index) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{data.type}</Table.Cell>
                    <Table.Cell>{data.address}</Table.Cell>
                    <Table.Cell>{data.name}</Table.Cell>
                    <Table.Cell>{data.description}</Table.Cell>
                    <Table.Cell>
                      <div className="flex justify-left gap-3">
                        <Button
                          size="icon"
                          onClick={() => handleEdit(ip)}
                          className="bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-gray-200 transition-colors p-2"
                        >
                          <FaPencilAlt className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          onClick={() => confirmDelete(ip.id)}
                          className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-colors p-2"
                        >
                          <FaTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      </div>
      {/* Dialogue Box  */}
      {open && (
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
              onClick={handleDialogue}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <HiX size={20} />
            </button>

            <div className="space-y-6 p-6 bg-gray-900 rounded-lg border border-gray-700 shadow-2xl">
              <h2 className="text-xl font-semibold text-gray-100">
                Add IP Address
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
                  <Select id="type">
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
                    placeholder="e.g., Web Server"
                    className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-400 min-h-[80px] text-sm"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button color="gray" onClick={handleDialogue}>
                  Cancel
                </Button>
                <Button color="blue" icon={HiPlus}>
                  Add
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default IPManagement;
