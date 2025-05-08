import { ImEyeBlocked } from "react-icons/im";
import { FaSkullCrossbones } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { MdSupervisorAccount } from "react-icons/md";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { Badge, Table } from "flowbite-react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { Chart as ChartJs, defaults } from "chart.js/auto";
import { Bar, Doughnut } from "react-chartjs-2";
import { useEffect, useRef, useState } from "react";
import Loader from "../components/Loader.component";
import axios from "axios"; // Import axios

const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;

defaults.responsive = true;
defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const Dashboard = () => {
  let [traffic, setTraffic] = useState([]);
  const [activeThreats, setActiveThreats] = useState([]);
  let [isLoading, setLoading] = useState(false);
  const [blockedCount, setBlockedCount] = useState(0);
  const [allowedCount, setAllowedCount] = useState(0);
  const [countryAttackCounts, setCountryAttackCounts] = useState({});

  async function fetchTrafficLogs() {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BACKEND_URL}/waf/api/v1/traffic-logs/fetch`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setLoading(false);
      setTraffic(res.data.data);
    } catch (error) {
      setLoading(false);
      console.log("Error while fetching traffic logs", error);
    }
  }

  async function fetchThreats() {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/waf/api/v1/threats/fetch`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log(res.data.data);
      setLoading(false);
      setActiveThreats(res.data.data);
    } catch (error) {
      setLoading(false);
      console.log("Error while fetching threats", error);
    }
  }

  useEffect(() => {
    fetchTrafficLogs();
    fetchThreats();
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

  useEffect(() => {
    const counts = {};
    activeThreats.forEach((threat) => {
      const country = threat.geoLocation;
      counts[country] = (counts[country] || 0) + 1;
    });
    setCountryAttackCounts(counts);
  }, [activeThreats]);

  const recentTrafficLogs = [...traffic].reverse().slice(0, 5);
  const recentThreats = [...activeThreats].reverse().slice(0, 5);

  const threatCounts = {};
  activeThreats.forEach((threat) => {
    const threatType = threat.threatType?.toUpperCase();
    threatCounts[threatType] = (threatCounts[threatType] || 0) + 1;
  });

  const countryLabels = Object.keys(countryAttackCounts);
  const countryData = Object.values(countryAttackCounts);

  return (
    <>
      {isLoading && <Loader />}
      {/* Action BOX  */}
      <div className="flex justify-center flex-wrap gap-4 pt-8">
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <ImEyeBlocked size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">{blockedCount}</p>
            <p className="text-slate-600">Total blocked IP's</p>
          </div>
        </div>
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <FaSkullCrossbones size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">{allowedCount}</p>
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
            <p className="text-3xl font-bold">0</p>
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
                {recentTrafficLogs.map((log) => (
                  <Table.Row
                    key={log._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {log.ip}
                    </Table.Cell>
                    <Table.Cell>{log.hostname}</Table.Cell>
                    <Table.Cell>{decodeURIComponent(log.path)}</Table.Cell>
                    <Table.Cell>
                      {new Date(log.dateTime).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="w-16">
                        {log.isBlocked === false ? (
                          <Badge color="success">Allowed</Badge>
                        ) : (
                          <Badge color="failure">Blocked</Badge>
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
                {recentTrafficLogs.length === 0 && (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell colSpan={5} className="text-center py-4">
                      No recent activities found.
                    </Table.Cell>
                  </Table.Row>
                )}
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
            {Object.keys(threatCounts).map((threatType) => (
              <Badge key={threatType} color="failure">
                {threatType}
              </Badge>
            ))}
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
                <Table.HeadCell>Status</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {recentThreats.map((threat) => (
                  <Table.Row
                    key={threat._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {threat.ip}
                    </Table.Cell>
                    <Table.Cell>{threat.hostname}</Table.Cell>
                    <Table.Cell>
                      {decodeURIComponent(threat.requestPath)}
                    </Table.Cell>
                    <Table.Cell>{threat.requestMethod}</Table.Cell>
                    <Table.Cell>
                      {new Date(threat.createdAt).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell>{threat.threatType.toUpperCase()}</Table.Cell>
                    <Table.Cell>{threat.severity}</Table.Cell>
                    <Table.Cell>{threat.geoLocation}</Table.Cell>
                    <Table.Cell>
                      <div className="w-16">
                        {threat.status === false ? (
                          <Badge color="success">Allowed</Badge>
                        ) : (
                          <Badge color="failure">Blocked</Badge>
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
                {recentThreats.length === 0 && (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell colSpan={10} className="text-center py-4">
                      No recent attacks found.
                    </Table.Cell>
                  </Table.Row>
                )}
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
                labels: ["SQL Injection", "PHISHING", "XSS", "BRUTE FORCE"],

                datasets: [
                  {
                    data: [
                      threatCounts["SQL INJECTION"],

                      threatCounts["PHISHING"],

                      threatCounts["XSS"],

                      threatCounts["BRUTE FORCE"],
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
                labels: countryLabels,
                datasets: [
                  {
                    label: "Number of Attacks", // Dataset label
                    data: countryData, // Attack counts for each country
                    backgroundColor: [
                      "rgba(75, 192, 192, 0.6)",
                      "rgba(54, 162, 235, 0.6)",
                      "rgba(255, 206, 86, 0.6)",
                      "rgba(255, 99, 132, 0.6)",
                      "rgba(153, 102, 255, 0.6)",
                      "rgba(255, 159, 64, 0.6)",
                    ],
                    borderColor: [
                      "rgba(75, 192, 192, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                      "rgba(255, 99, 132, 1)",
                      "rgba(153, 102, 255, 1)",
                      "rgba(255, 159, 64, 1)",
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
                    text: "Attack Distribution by Country", // Updated chart title
                    font: {
                      size: 18, // Title font size
                    },
                  },
                  legend: {
                    display: false, // Hide the legend as there's only one dataset
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
