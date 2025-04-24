import { Table, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { BsFillFilterCircleFill } from "react-icons/bs";

const FilterLogs = () => {
  const blockedReq = [
    {
      timestamp: "2024-12-18 15:32:45",
      sourceIP: "192.168.1.12",
      country: "India",
      threatType: "SQL Injection",
      severity: "Critical",
      requestDetails: "POST /login",
      responseAction: "IP Blacklisted",
      userAgent: "curl/7.68.0",
    },
    {
      timestamp: "2024-12-18 15:33:12",
      sourceIP: "203.120.12.45",
      country: "USA",
      threatType: "DDoS",
      severity: "High",
      requestDetails: "GET /dashboard",
      responseAction: "Request Blocked",
      userAgent: "Mozilla/5.0",
    },
    {
      timestamp: "2024-12-18 15:34:20",
      sourceIP: "185.24.32.78",
      country: "China",
      threatType: "Brute Force",
      severity: "Medium",
      requestDetails: "POST /admin",
      responseAction: "Request Blocked",
      userAgent: "Python-urllib/3.10",
    },
    {
      timestamp: "2024-12-18 15:35:10",
      sourceIP: "178.54.23.11",
      country: "Pakistan",
      threatType: "XSS",
      severity: "Critical",
      requestDetails: "GET /search?q=<script>",
      responseAction: "IP Blacklisted",
      userAgent: "Googlebot/2.1",
    },
    {
      timestamp: "2024-12-18 15:36:05",
      sourceIP: "203.120.14.23",
      country: "India",
      threatType: "SQL Injection",
      severity: "High",
      requestDetails: "POST /auth",
      responseAction: "Request Blocked",
      userAgent: "PostmanRuntime/7.29.0",
    },
    {
      timestamp: "2024-12-18 15:37:14",
      sourceIP: "154.123.45.67",
      country: "UK",
      threatType: "XSS",
      severity: "Low",
      requestDetails: "GET /profile",
      responseAction: "Request Blocked",
      userAgent: "Mozilla/5.0",
    },
    {
      timestamp: "2024-12-18 15:38:23",
      sourceIP: "192.0.2.1",
      country: "Canada",
      threatType: "Brute Force",
      severity: "High",
      requestDetails: "POST /login",
      responseAction: "Request Blocked",
      userAgent: "Mozilla/5.0",
    },
    {
      timestamp: "2024-12-18 15:39:45",
      sourceIP: "198.51.100.2",
      country: "Germany",
      threatType: "DDoS",
      severity: "Critical",
      requestDetails: "GET /api/data",
      responseAction: "IP Blacklisted",
      userAgent: "wget/1.21.1",
    },
    {
      timestamp: "2024-12-18 15:40:32",
      sourceIP: "203.120.16.89",
      country: "India",
      threatType: "SQL Injection",
      severity: "Medium",
      requestDetails: "POST /search",
      responseAction: "Request Blocked",
      userAgent: "curl/7.68.0",
    },
    {
      timestamp: "2024-12-18 15:41:50",
      sourceIP: "45.67.89.101",
      country: "Brazil",
      threatType: "Brute Force",
      severity: "Critical",
      requestDetails: "POST /admin",
      responseAction: "IP Blacklisted",
      userAgent: "Python-requests/2.26.0",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  console.log(searchQuery);

  return (
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
          <BsFillFilterCircleFill size={30} />
          <p className="text-xl font-bold uppercase">Filter Logs</p>
        </div>
        <div className="overflow-x-auto mt-3">
          <Table hoverable>
            <Table.Head className="text-sm">
              <Table.HeadCell>Timestamp</Table.HeadCell>
              <Table.HeadCell>Source IP</Table.HeadCell>
              <Table.HeadCell>Country</Table.HeadCell>
              <Table.HeadCell>Threat Type</Table.HeadCell>
              <Table.HeadCell>Severity</Table.HeadCell>
              <Table.HeadCell>Request Details</Table.HeadCell>
              <Table.HeadCell>Response Action</Table.HeadCell>
              <Table.HeadCell>User-Agent</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {blockedReq.map((data, index) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {data.timestamp}
                    </Table.Cell>
                    <Table.Cell>{data.sourceIP}</Table.Cell>
                    <Table.Cell>{data.country}</Table.Cell>
                    <Table.Cell>{data.threatType}</Table.Cell>
                    <Table.Cell>{data.severity}</Table.Cell>
                    <Table.Cell>{data.requestDetails}</Table.Cell>
                    <Table.Cell>{data.responseAction}</Table.Cell>
                    <Table.Cell>{data.userAgent}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default FilterLogs;
