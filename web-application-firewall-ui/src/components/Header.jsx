import { Navbar } from "flowbite-react";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";

function Header() {
  const { isLoggedIn, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (link) => {
    navigate(link);
  };

  return (
    <Navbar className="shadow-lg fixed justify-between w-full z-40">
      <Navbar.Brand>
        <img
          src="../temp/logo.png"
          className="h-6 sm:h-9"
          alt="Firewall Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white text-blue-800">
          SHIELD
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        {isLoggedIn && (
          <Navbar.Link
            href="#"
            className="flex gap-1 justify-center items-center"
            onClick={logoutUser}
          >
            <IoMdLogOut size={20} />
            Logout
          </Navbar.Link>
        )}
        {!isLoggedIn && (
          <Navbar.Link
            href="#"
            className="flex gap-1 justify-center items-center"
            onClick={() => handleNavigation("/login")}
          >
            <IoMdLogIn size={20} />
            Login
          </Navbar.Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
