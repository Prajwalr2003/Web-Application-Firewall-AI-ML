import { BiSolidInjection } from "react-icons/bi";
import { GiSpiderWeb } from "react-icons/gi";
import { FaFilePrescription } from "react-icons/fa";
import { MdOutlineLoop } from "react-icons/md";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { Badge, Table } from "flowbite-react";
import { GiSkullCrossedBones } from "react-icons/gi";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJs, defaults } from "chart.js/auto";
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader.component";

defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;

const ActiveThreat = () => {
  const [activeThreats, setActiveThreats] = useState([]);
  const [isLoading, setLoading] = useState(false);

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
    fetchThreats();
  }, []);

  const threatCounts = {};
  activeThreats.forEach((threat) => {
    const threatType = threat.threatType?.toUpperCase();
    threatCounts[threatType] = (threatCounts[threatType] || 0) + 1;
  });

  let SQL = [0, 0, 0];
  let XSS = [0, 0, 0];
  let PHISHING = [0, 0, 0];
  activeThreats.forEach((threat) => {
    const threatType = threat.threatType;
    const severity = threat.severity;
    if (threatType == "xss") {
      if (severity == "LOW") {
        XSS[0] = XSS[0] + 1;
      } else if (severity == "MEDIUM") {
        XSS[1] = XSS[1] + 1;
      } else {
        XSS[2] = XSS[2] + 1;
      }
    } else if (threatType.toUpperCase() == "SQL INJECTION") {
      if (severity == "LOW") {
        SQL[0] = SQL[0] + 1;
      } else if (severity == "MEDIUM") {
        SQL[1] = SQL[1] + 1;
      } else {
        SQL[2] = SQL[2] + 1;
      }
    } else {
      if (severity == "LOW") {
        PHISHING[0] = PHISHING[0] + 1;
      } else if (severity == "MEDIUM") {
        PHISHING[1] = PHISHING[1] + 1;
      } else {
        PHISHING[2] = PHISHING[2] + 1;
      }
    }
  });

  return (
    <>
      {isLoading && <Loader />}
      {/* Different Attacks Number  */}
      <div className="flex justify-center flex-wrap gap-4 pt-8">
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <BiSolidInjection size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">
              {threatCounts["SQL INJECTION"] || 0}
            </p>
            <p className="text-slate-600">SQL injection active threats</p>
          </div>
        </div>
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <GiSpiderWeb size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">
              {threatCounts["PHISHING"] || 0}
            </p>
            <p className="text-slate-600">Phishing active threats</p>
          </div>
        </div>
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <FaFilePrescription size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">{threatCounts["XSS"] || 0}</p>
            <p className="text-slate-600">XSS active threats</p>
          </div>
        </div>
        <div className="flex gap-10 shadow-lg p-6 border">
          <div>
            <MdOutlineLoop size={50} />
          </div>
          <div>
            <p className="text-3xl font-bold">
              {threatCounts["BRUTE FORCE"] || 0}
            </p>
            <p className="text-slate-600">Brute force active threats</p>
          </div>
        </div>
      </div>

      {/* Different Attack Visualization  */}
      <div className="p-8">
        <div className="flex justify-center shadow-lg border p-5">
          {threatCounts["SQL INJECTION"] > 0 && (
            <div>
              <div className="w-[300px] h-[300px] mx-auto">
                <Doughnut
                  data={{
                    labels: ["Low", "Medium", "Critical"],
                    datasets: [
                      {
                        data: [SQL[0], SQL[1], SQL[2]],
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
          )}
          {threatCounts["XSS"] > 0 && (
            <div>
              <div className="w-[300px] h-[300px] mx-auto">
                <Doughnut
                  data={{
                    labels: ["Low", "Medium", "Critical"],
                    datasets: [
                      {
                        data: [XSS[0], XSS[1], XSS[2]],
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
          )}
          {threatCounts["PHISHING"] > 0 && (
            <div>
              <div className="w-[300px] h-[300px] mx-auto">
                <Doughnut
                  data={{
                    labels: ["Low", "Medium", "Critical"],
                    datasets: [
                      {
                        data: [PHISHING[0], PHISHING[1], PHISHING[2]],
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
                          text: "PHISHING",
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
          )}
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
            {[...new Set(activeThreats.map((data) => data.threatType))]?.map(
              (threatType, index) => (
                <Badge key={index} color="failure">
                  {threatType?.toUpperCase()}
                </Badge>
              )
            )}
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
                <Table.HeadCell>Body</Table.HeadCell>
                <Table.HeadCell>Params</Table.HeadCell>
                <Table.HeadCell>Query</Table.HeadCell>
                <Table.HeadCell>Geo-Location</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {[...activeThreats].reverse().map((data, index) => {
                  return (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={index}
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {data.ip}
                      </Table.Cell>
                      <Table.Cell>{data.hostname}</Table.Cell>
                      <Table.Cell>
                        {decodeURIComponent(data.requestPath)}
                      </Table.Cell>
                      <Table.Cell>{data.requestMethod}</Table.Cell>
                      <Table.Cell>
                        {new Date(data.createdAt).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell>{data.threatType.toUpperCase()}</Table.Cell>
                      <Table.Cell>{data.severity}</Table.Cell>
                      <Table.Cell>
                        {data.requestBody
                          ? JSON.stringify(data.requestBody, null, 2)
                          : "null"}
                      </Table.Cell>
                      <Table.Cell>
                        {data.requestParams
                          ? JSON.stringify(data.params, null, 2)
                          : "null"}
                      </Table.Cell>
                      <Table.Cell>
                        {data.requestQuery
                          ? JSON.stringify(data.query, null, 2)
                          : "null"}
                      </Table.Cell>
                      <Table.Cell>{data.geoLocation}</Table.Cell>
                      <Table.Cell>
                        <div className="w-16">
                          {data.status === false ? (
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

export default ActiveThreat;
