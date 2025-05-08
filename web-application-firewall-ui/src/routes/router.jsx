import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Dashboard from "../pages/Dashboard";
import ActiveThreat from "../pages/ActiveThreat";
import TrafficLogs from "../pages/TrafficLogs";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import IPManagement from "../pages/IPManagement";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/dashboard", element: <Dashboard /> },
      {
        path: "/active-threats",
        element: <ActiveThreat />,
      },
      {
        path: "/traffic-logs",
        element: <TrafficLogs />,
      },
      {
        path: "/ip-management",
        element: <IPManagement />,
      },
      {
        path: "/settings",
        element: <Profile />,
      },
    ],
  },
]);

export default router;
