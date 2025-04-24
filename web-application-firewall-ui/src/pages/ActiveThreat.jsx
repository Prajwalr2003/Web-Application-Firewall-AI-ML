import { BiSolidInjection } from "react-icons/bi";
import { GiSpiderWeb } from "react-icons/gi";
import { FaFilePrescription } from "react-icons/fa";
import { MdOutlineLoop } from "react-icons/md";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { Badge, Table } from "flowbite-react";
import { GiSkullCrossedBones } from "react-icons/gi";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJs, defaults } from "chart.js/auto";

defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const ActiveThreat = () => {
  const activeThreats = [
    {
      ip: "192.168.149.36",
      hostname: "crawl-66-249-64-128.googlebot.com",
      requestPath: "/login",
      requestMethod: "POST",
      dateTime: "2024-12-18 12:02:18",
      threatType: "SQL Injection",
      severity: "High",
      geoLocation: "India",
      action: "Blocked",
    },
    {
      ip: "192.168.121.32",
      hostname: "hacker123.ransombot.com",
      requestPath: "/user/products",
      requestMethod: "POST",
      dateTime: "2024-12-18 12:10:30",
      threatType: "XSS",
      severity: "Medium",
      geoLocation: "Russia",
      action: "Blocked",
    },
    {
      ip: "192.168.0.45",
      hostname: "unknown-bot.xyz",
      requestPath: "/search",
      requestMethod: "GET",
      dateTime: "2024-12-18 12:14:55",
      threatType: "DDOS",
      severity: "High",
      geoLocation: "USA",
      action: "Blocked",
    },
    {
      ip: "192.168.10.30",
      hostname: "malicious-user.com",
      requestPath: "/admin",
      requestMethod: "POST",
      dateTime: "2024-12-18 12:18:22",
      threatType: "SQL Injection",
      severity: "Critical",
      geoLocation: "China",
      action: "Blocked",
    },
    {
      ip: "10.0.0.25",
      hostname: "bot-attack.xyz",
      requestPath: "/login",
      requestMethod: "POST",
      dateTime: "2024-12-18 12:20:10",
      threatType: "XSS",
      severity: "Low",
      geoLocation: "Brazil",
      action: "Blocked",
    },
  ];

  return (
    <>
      {/* Different Attacks Number  */}
      <div className="flex justify-center flex-wrap gap-4 pt-8">
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <BiSolidInjection size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">0</p>
            <p className="text-slate-600">SQL injection active threats</p>
          </div>
        </div>
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <GiSpiderWeb size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">0</p>
            <p className="text-slate-600">DDOS active threats</p>
          </div>
        </div>
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <FaFilePrescription size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">0</p>
            <p className="text-slate-600">XSS active threats</p>
          </div>
        </div>
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <MdOutlineLoop size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">0</p>
            <p className="text-slate-600">Brute force active threats</p>
          </div>
        </div>
      </div>

      {/* Different Attack Visualization  */}
      <div className="p-8">
        <div className="flex justify-center shadow-lg border p-5">
          <div>
            <div className="w-[300px] h-[300px] mx-auto">
              <Doughnut
                data={{
                  labels: ["Low", "Medium", "Critical"],
                  datasets: [
                    {
                      data: [3, 2, 1],
                      backgroundColor: [
                        "rgba(54, 162, 235)",
                        "rgba(255, 206, 86)",
                        "rgba(255, 99, 132)",
                      ],
                      hoverBackgroundColor: [
                        "rgba(54, 162, 235, 0.8)",
                        "rgba(255, 206, 86, 0.8)",
                        "rgba(255, 99, 132, 0.8)",
                      ],
                    },
                  ],
                }}
                options={
                  ({
                    maintainAspectRatio: false,
                  },
                  {
                    plugins: {
                      title: {
                        text: "SQL Injection",
                      },
                    },
                  })
                }
              />
            </div>
          </div>
          <div>
            <div className="w-[300px] h-[300px] mx-auto">
              <Doughnut
                data={{
                  labels: ["Low", "Medium", "Critical"],
                  datasets: [
                    {
                      data: [10, 5, 2],
                      backgroundColor: [
                        "rgba(54, 162, 235)",
                        "rgba(255, 206, 86)",
                        "rgba(255, 99, 132)",
                      ],
                      hoverBackgroundColor: [
                        "rgba(54, 162, 235, 0.8)",
                        "rgba(255, 206, 86, 0.8)",
                        "rgba(255, 99, 132, 0.8)",
                      ],
                    },
                  ],
                }}
                options={
                  ({
                    maintainAspectRatio: false,
                  },
                  {
                    plugins: {
                      title: {
                        text: "XSS",
                      },
                    },
                  })
                }
              />
            </div>
          </div>
          <div>
            <div className="w-[300px] h-[300px] mx-auto">
              <Doughnut
                data={{
                  labels: ["Low", "Medium", "Critical"],
                  datasets: [
                    {
                      data: [3, 1, 2],
                      backgroundColor: [
                        "rgba(54, 162, 235)",
                        "rgba(255, 206, 86)",
                        "rgba(255, 99, 132)",
                      ],
                      hoverBackgroundColor: [
                        "rgba(54, 162, 235, 0.8)",
                        "rgba(255, 206, 86, 0.8)",
                        "rgba(255, 99, 132, 0.8)",
                      ],
                    },
                  ],
                }}
                options={
                  ({
                    maintainAspectRatio: false,
                  },
                  {
                    plugins: {
                      title: {
                        text: "DDOS",
                      },
                    },
                  })
                }
              />
            </div>
          </div>
          <div>
            <div className="w-[300px] h-[300px] mx-auto">
              <Doughnut
                data={{
                  labels: ["Low", "Medium", "Critical"],
                  datasets: [
                    {
                      data: [5, 8, 2],
                      backgroundColor: [
                        "rgba(54, 162, 235)",
                        "rgba(255, 206, 86)",
                        "rgba(255, 99, 132)",
                      ],
                      hoverBackgroundColor: [
                        "rgba(54, 162, 235, 0.8)",
                        "rgba(255, 206, 86, 0.8)",
                        "rgba(255, 99, 132, 0.8)",
                      ],
                    },
                  ],
                }}
                options={
                  ({
                    maintainAspectRatio: false,
                  },
                  {
                    plugins: {
                      title: {
                        text: "Brute Force",
                      },
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Threat Metrics  */}
      <div className="px-8">
        <div className="flex flex-col justify-center shadow-lg border p-5">
          <div className="flex gap-3 justify-start">
            <GiSkullCrossedBones size={30} color="red" />
            <p className="text-xl font-bold uppercase">Active Threats</p>
          </div>
          <div className="flex flex-wrap gap-5 py-4">
            <Badge color="failure">SQL Injection</Badge>
            <Badge color="failure">XSS</Badge>
            <Badge color="failure">DDOS</Badge>
          </div>
          <div className="overflow-x-auto mt-3">
            <Table hoverable>
              <Table.Head className="text-sm">
                <Table.HeadCell>IP</Table.HeadCell>
                <Table.HeadCell>Hostname</Table.HeadCell>
                <Table.HeadCell>Request Path</Table.HeadCell>
                <Table.HeadCell>Request Method</Table.HeadCell>
                <Table.HeadCell>Date/Time</Table.HeadCell>
                <Table.HeadCell>Threat Type</Table.HeadCell>
                <Table.HeadCell>Severity</Table.HeadCell>
                <Table.HeadCell>Geo-Location</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {activeThreats.map((data, index) => {
                  return (
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {data.ip}
                      </Table.Cell>
                      <Table.Cell>{data.hostname}</Table.Cell>
                      <Table.Cell>{data.requestPath}</Table.Cell>
                      <Table.Cell>{data.requestMethod}</Table.Cell>
                      <Table.Cell>{data.dateTime}</Table.Cell>
                      <Table.Cell>{data.threatType}</Table.Cell>
                      <Table.Cell>{data.severity}</Table.Cell>
                      <Table.Cell>{data.geoLocation}</Table.Cell>
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

export default ActiveThreat;
