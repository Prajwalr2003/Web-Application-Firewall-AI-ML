import React, { useEffect, useState } from "react";
import { FaServer } from "react-icons/fa6";
import { IoServer } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { Badge, Table, TextInput } from "flowbite-react";
import { RxCounterClockwiseClock } from "react-icons/rx";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;

const TrafficLogs = () => {
  let [traffic, setTraffic] = useState([]);
  const [blockedCount, setBlockedCount] = useState(0);
  const [allowedCount, setAllowedCount] = useState(0);

  async function fetchTrafficLogs() {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/waf/api/v1/traffic-logs/fetch`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setTraffic(res.data.data);
    } catch (error) {
      console.log("Error while fetching traffic logs", error);
    }
  }

  useEffect(() => {
    fetchTrafficLogs();
  }, []);

  useEffect(() => {
    let blocked = 0;
    let allowed = 0;
    traffic.forEach((log) => {
      if (log.isBlocked) {
        blocked++;
      } else {
        allowed++;
      }
    });
    setBlockedCount(blocked);
    setAllowedCount(allowed);
  }, [traffic]);

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className="flex justify-center flex-wrap gap-4 pt-8">
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <FaServer size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">{traffic.length}</p>
            <p className="text-slate-600">Total Number of IP's</p>
          </div>
        </div>
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <IoServer size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">{allowedCount}</p>
            <p className="text-slate-600">Total Number of Active IP's</p>
          </div>
        </div>
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <ImCross size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">{blockedCount}</p>
            <p className="text-slate-600">Total Number of Blocked IP's</p>
          </div>
        </div>
      </div>
      <div className="p-8">
        <div className="pb-6">
          <TextInput
            id="search"
            type="search"
            placeholder="Filter logs based on any attributes mentioned in the table"
            shadow
            className="w-[90%] mx-auto"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex flex-col justify-center shadow-lg border p-5">
          <div className="flex gap-3 justify-start">
            <RxCounterClockwiseClock size={30} />
            <p className="text-xl font-bold uppercase">Traffic Logs</p>
          </div>
          <div className="overflow-x-auto mt-3">
            <Table hoverable>
              <Table.Head className="text-sm">
                <Table.HeadCell>IP</Table.HeadCell>
                <Table.HeadCell>Resolved Hostname</Table.HeadCell>
                <Table.HeadCell>URL Path</Table.HeadCell>
                <Table.HeadCell>Last Visit</Table.HeadCell>
                <Table.HeadCell>Request Method</Table.HeadCell>
                <Table.HeadCell>Country</Table.HeadCell>
                <Table.HeadCell>User Agent</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {[...traffic].reverse().map((data, index) => {
                  return (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={index}
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {data.ip}
                      </Table.Cell>
                      <Table.Cell>{data.hostname}</Table.Cell>
                      <Table.Cell>{decodeURIComponent(data.path)}</Table.Cell>
                      <Table.Cell>
                        {new Date(data.dateTime).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell>{data.requestMethod}</Table.Cell>
                      <Table.Cell>{data.country}</Table.Cell>
                      <Table.Cell>{data.userAgent}</Table.Cell>
                      <Table.Cell>
                        <div className="w-16">
                          {data.isBlocked === false ? (
                            <Badge color="success">Allowed</Badge>
                          ) : (
                            <Badge color="failure">Blocked</Badge>
                          )}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrafficLogs;
