import React from "react";
import { FaServer } from "react-icons/fa6";
import { IoServer } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { Badge, Table } from "flowbite-react";
import { RxCounterClockwiseClock } from "react-icons/rx";

const TrafficLogs = () => {
  const traffic = [
    {
      sourceIp: "192.168.149.36",
      host: "crawl-66-249-64-128.googlebot.com",
      url: "/login",
      lastVisit: "2024-12-18 12:02:18",
      statusCode: 200,
      action: "Allowed",
      requestMethod: "GET",
      country: "USA",
    },
    {
      sourceIp: "192.168.121.32",
      host: "hacker123.ransombot.com",
      url: "/user/products",
      lastVisit: "2024-12-18 12:02:18",
      statusCode: 403,
      action: "Blocked",
      requestMethod: "POST",
      country: "Russia",
    },
    {
      sourceIp: "192.168.0.25",
      host: "crawl-34-65-21-99.googlebot.com",
      url: "/search",
      lastVisit: "2024-12-18 12:03:45",
      statusCode: 200,
      action: "Allowed",
      requestMethod: "GET",
      country: "India",
    },
    {
      sourceIp: "192.168.178.10",
      host: "malicious-bot.attacker.com",
      url: "/admin",
      lastVisit: "2024-12-18 11:58:30",
      statusCode: 403,
      action: "Blocked",
      requestMethod: "POST",
      country: "China",
    },
    {
      sourceIp: "10.0.0.15",
      host: "unknown-hostname",
      url: "/products/view",
      lastVisit: "2024-12-18 11:55:12",
      statusCode: 200,
      action: "Allowed",
      requestMethod: "GET",
      country: "Canada",
    },
  ];

  return (
    <>
      <div className="flex justify-center flex-wrap gap-4 pt-8">
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <FaServer size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">0</p>
            <p className="text-slate-600">Total Number of IP's</p>
          </div>
        </div>
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <IoServer size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">0</p>
            <p className="text-slate-600">Total Number of Active IP's</p>
          </div>
        </div>
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <ImCross size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">0</p>
            <p className="text-slate-600">Total Number of Blocked IP's</p>
          </div>
        </div>
      </div>
      <div className="p-8">
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
                <Table.HeadCell>Status Code</Table.HeadCell>
                <Table.HeadCell>Request Method</Table.HeadCell>
                <Table.HeadCell>Country</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {traffic.map((data, index) => {
                  return (
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {data.sourceIp}
                      </Table.Cell>
                      <Table.Cell>{data.host}</Table.Cell>
                      <Table.Cell>{data.url}</Table.Cell>
                      <Table.Cell>{data.lastVisit}</Table.Cell>
                      <Table.Cell>{data.statusCode}</Table.Cell>
                      <Table.Cell>{data.requestMethod}</Table.Cell>
                      <Table.Cell>{data.country}</Table.Cell>
                      <Table.Cell>{data.action}</Table.Cell>
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
