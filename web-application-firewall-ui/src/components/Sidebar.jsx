import { RiDashboard3Fill } from "react-icons/ri";
import { FaFire, FaTrafficLight } from "react-icons/fa";
import { BsFillFilterCircleFill } from "react-icons/bs";
import { IoEarthSharp, IoSettings } from "react-icons/io5";
import { FiCrosshair } from "react-icons/fi";
import { SiAuthy } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const handleNavigation = (link) => {
    navigate(link);
  };
  return (
    <>
      <div
        className="flex justify-start gap-2 items-center hover:bg-slate-700 p-2 cursor-pointer mt-4"
        onClick={() => handleNavigation("/dashboard")}
      >
        <RiDashboard3Fill size={30} />
        Dashboard
      </div>
      <div
        className="flex justify-start gap-2 items-center hover:bg-slate-700 p-2 cursor-pointer mt-3"
        onClick={() => handleNavigation("/active-threats")}
      >
        <FiCrosshair size={30} />
        Active Threats
      </div>
      <div
        className="flex justify-start gap-2 items-center hover:bg-slate-700 p-2 cursor-pointer mt-3"
        onClick={() => handleNavigation("/traffic-logs")}
      >
        <FaTrafficLight size={30} />
        Traffic Logs
      </div>
      <div
        className="flex justify-start gap-2 items-center hover:bg-slate-700 p-2 cursor-pointer mt-3"
        onClick={() => handleNavigation("/filter-logs")}
      >
        <BsFillFilterCircleFill size={30} />
        Filter Logs
      </div>
      <div
        className="flex justify-start gap-2 items-center hover:bg-slate-700 p-2 cursor-pointer mt-3"
        onClick={() => handleNavigation("/ip-management")}
      >
        <FaFire size={30} />
        IP Management
      </div>
      {/* <div
        className="flex justify-start gap-2 items-center hover:bg-slate-700 p-2 cursor-pointer mt-3"
        onClick={() => handleNavigation("/manage-authentication")}
      >
        <SiAuthy size={30} />
        Authentication
      </div> */}
      <div
        className="flex justify-start gap-2 items-center hover:bg-slate-700 p-2 cursor-pointer mt-3"
        onClick={() => handleNavigation("/settings")}
      >
        <IoSettings size={30} />
        Settings
      </div>
    </>
  );
};

export default Sidebar;
