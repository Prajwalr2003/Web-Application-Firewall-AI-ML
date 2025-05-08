import React, { useEffect, useRef, useState } from "react";
import { FaFire, FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import { TextInput, Button, Table, Badge } from "flowbite-react";
import axios from "axios";
import UpdateDialogue from "../components/UpdateDialogue";
import Loader from "../components/Loader.component";
import AddIPDialogue from "../components/AddIPDialogue";
import { useToast } from "../context/ToastContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;

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

  let [IPList, setIPList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchIPList = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/waf/api/v1/ip/get-ip-list`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setIPList(res.data.data);
      console.log(res.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      console.log("IP fetching failed");
    }
  };

  useEffect(() => {
    fetchIPList();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [action, setAction] = useState(false);
  const [open, setOpen] = useState(false);
  const [dataToUpdate, setDataToUpdate] = useState([]);

  const handleEdit = (data) => {
    setAction(true);
    setDataToUpdate(data);
  };

  const handleDialogue = () => {
    setOpen(!open);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `${BACKEND_URL}/waf/api/v1/ip/delete/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setLoading(false);
      fetchIPList();
      showToast("IP Deleted Successfully", "success");
    } catch (error) {
      console.log(error, "IP deletion failed");
      showToast("IP Deletion Failed", "error");
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
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
                <Table.HeadCell>Time</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y text-sm">
                {[...IPList].reverse().map((data, index) => {
                  return (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={index}
                    >
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>{data.ipType}</Table.Cell>
                      <Table.Cell>{data.address}</Table.Cell>
                      <Table.Cell>{data.name}</Table.Cell>
                      <Table.Cell>{data.description}</Table.Cell>
                      <Table.Cell>
                        {new Date(data.updatedAt).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="w-16">
                          {data.status === false ? (
                            <Badge color="success">Allowed</Badge>
                          ) : (
                            <Badge color="failure">Blocked</Badge>
                          )}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex justify-left gap-3">
                          <Button
                            size="icon"
                            onClick={() => handleEdit(data)}
                            className="bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-gray-200 transition-colors p-2"
                          >
                            <FaPencilAlt className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            onClick={() => handleDelete(data._id)}
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
        {open && (
          <AddIPDialogue
            open={open}
            setOpen={setOpen}
            fetchIPList={fetchIPList}
            loading={loading}
            setLoading={setLoading}
          />
        )}
        {action && (
          <UpdateDialogue
            action={action}
            setAction={setAction}
            fetchIPList={fetchIPList}
            data={dataToUpdate}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>
    </>
  );
};

export default IPManagement;
