import { ImEyeBlocked } from "react-icons/im";
import { FaSkullCrossbones } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { MdSupervisorAccount } from "react-icons/md";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { Badge, Table } from "flowbite-react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { Chart as ChartJs, defaults } from "chart.js/auto";
import { Bar, Doughnut } from "react-chartjs-2";
import { useEffect, useRef } from "react";

defaults.responsive = true;
defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const Dashboard = () => {
  return (
    <>
      {/* Action BOX  */}
      <div className="flex justify-center flex-wrap gap-4 pt-8">
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <ImEyeBlocked size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">1</p>
            <p className="text-slate-600">Total blocked IP's</p>
          </div>
        </div>
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <FaSkullCrossbones size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">2</p>
            <p className="text-slate-600">Total active threats</p>
          </div>
        </div>
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <IoPersonSharp size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">0</p>
            <p className="text-slate-600">Total online users</p>
          </div>
        </div>
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <MdSupervisorAccount size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">5</p>
            <p className="text-slate-600">Total visitors count</p>
          </div>
        </div>
      </div>

      {/* Recent Activities  */}
      <div className="p-8">
        <div className="flex flex-col justify-center shadow-lg border p-5">
          <div className="flex gap-3 justify-start">
            <RxCounterClockwiseClock size={30} />
            <p className="text-xl font-bold uppercase">Recent Activities</p>
          </div>
          <div className="flex flex-wrap gap-5 py-4">
            <Badge color="success">Allowed</Badge>
            <Badge color="failure">Blocked</Badge>
          </div>
          <div className="overflow-x-auto mt-3">
            <Table hoverable>
              <Table.Head className="text-sm">
                <Table.HeadCell>IP</Table.HeadCell>
                <Table.HeadCell>Resolved Hostname</Table.HeadCell>
                <Table.HeadCell>URL Path</Table.HeadCell>
                <Table.HeadCell>Last Visit</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    192.168.149.36
                  </Table.Cell>
                  <Table.Cell>crawl-66-249-64-128.googlebot.com</Table.Cell>
                  <Table.Cell>/login</Table.Cell>
                  <Table.Cell>2024-12-18 12:02:18</Table.Cell>
                  <Table.Cell>Allowed</Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    192.168.121.32
                  </Table.Cell>
                  <Table.Cell>hacker123.ransombot.com</Table.Cell>
                  <Table.Cell>/user/products</Table.Cell>
                  <Table.Cell>2024-12-18 12:02:18</Table.Cell>
                  <Table.Cell>Blocked</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>

      {/* Attack History */}
      <div className="px-8">
        <div className="flex flex-col justify-center shadow-lg border p-5">
          <div className="flex gap-3 justify-start">
            <FaLocationCrosshairs size={30} />
            <p className="text-xl font-bold uppercase">Attack History</p>
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
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    192.168.149.36
                  </Table.Cell>
                  <Table.Cell>crawl-66-249-64-128.googlebot.com</Table.Cell>
                  <Table.Cell>/login</Table.Cell>
                  <Table.Cell>POST</Table.Cell>
                  <Table.Cell>2024-12-18 12:02:18</Table.Cell>
                  <Table.Cell>SQL Injection</Table.Cell>
                  <Table.Cell>High</Table.Cell>
                  <Table.Cell>India</Table.Cell>
                  <Table.Cell>Blocked</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>

      {/* Chart  */}
      <div className="p-8">
        <div className="flex flex-col justify-center shadow-lg border p-5">
          <div className="w-[500px] h-[350px] mx-auto">
            <Doughnut
              data={{
                labels: ["SQL Injection", "DDOS", "XSS", "BRUTE FORCE"],
                datasets: [
                  {
                    data: [200, 300, 400, 150],
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
                      text: "Attack History",
                    },
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Location Wise Attack Distribution  */}
      <div className="px-8 pb-8">
        <div className="flex flex-col justify-center shadow-lg border p-5">
          <div className="w-[800px] h-[500px] mx-auto">
            <Bar
              data={{
                labels: ["India", "USA", "Pakistan", "China"],
                datasets: [
                  {
                    label: "Number of Attacks", // Dataset label
                    data: [4, 1, 2, 10], // Attack counts for each country
                    backgroundColor: [
                      "rgba(75, 192, 192, 0.6)", // India
                      "rgba(54, 162, 235, 0.6)", // USA
                      "rgba(255, 206, 86, 0.6)", // Pakistan
                      "rgba(255, 99, 132, 0.6)", // China
                    ],
                    borderColor: [
                      "rgba(75, 192, 192, 1)", // India border
                      "rgba(54, 162, 235, 1)", // USA border
                      "rgba(255, 206, 86, 1)", // Pakistan border
                      "rgba(255, 99, 132, 1)", // China border
                    ],
                    borderWidth: 1, // Border width for bars
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: "Mostly Attacking Countries", // Chart title
                    font: {
                      size: 18, // Title font size
                    },
                  },
                  legend: {
                    display: true, // Display the dataset legend
                    position: "top",
                  },
                  tooltip: {
                    enabled: true, // Enable tooltips
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Countries", // X-axis label
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Number of Attacks", // Y-axis label
                    },
                    beginAtZero: true, // Ensure the Y-axis starts from zero
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
