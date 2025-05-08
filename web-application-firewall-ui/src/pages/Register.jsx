import { Button, Checkbox, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import extractErrorMessage from "../utils/extractHandler";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;

const Register = () => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.target);
    const adminName = formData.get("adminName");
    const companyName = formData.get("companyName");
    const domain = formData.get("domain");
    const email = formData.get("email");
    const password = formData.get("password");
    const registerData = {
      adminName,
      companyName,
      email,
      password,
      domain,
    };

    try {
      const res = await axios.post(
        `${BACKEND_URL}/waf/api/v1/user/register`,
        registerData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 201) {
        showToast("User Registered Successfully", "success");
        navigate("/login");
      } else {
        showToast("User Registration Failed, Try Again", "error");
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(
        err.response?.data || "An error occurred"
      );
      showToast(errorMessage, "error");
      console.error("Error during registration:", errorMessage);
    }

    setIsLoading(false);
  };

  return (
    <>
      <form
        className="flex justify-center items-center min-h-screen"
        onSubmit={handleRegister}
      >
        <div className="p-10 rounded-lg w-[500px] shadow-lg border-2">
          <div className="flex mb-6">
            <img
              src="../temp/logo.png"
              className="h-6 sm:h-9"
              alt="Firewall Logo"
            />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white text-blue-800">
              SHIELD
            </span>
          </div>
          <h2 className="text-4xl font-bold">Sign up</h2>
          <div className="mt-6">
            <div className="mb-2 block">
              <Label htmlFor="name" value="Admin name" />
            </div>
            <TextInput
              id="name"
              name="adminName"
              type="text"
              placeholder="firstname surname"
              required
              shadow
            />
          </div>
          <div className="mt-6">
            <div className="mb-2 block">
              <Label htmlFor="company" value="Company name" />
            </div>
            <TextInput
              id="company"
              name="companyName"
              type="text"
              placeholder="@company name"
              required
              shadow
            />
          </div>
          <div className="mt-6">
            <div className="mb-2 block">
              <Label htmlFor="domain" value="Domain name" />
            </div>
            <TextInput
              id="domain"
              name="domain"
              type="text"
              placeholder="eg. https://www.google.com"
              required
              shadow
            />
          </div>
          <div className="mt-4">
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder="your@gmail.com"
              required
              shadow
            />
          </div>
          <div className="mt-4">
            <div className="mb-2 block">
              <Label htmlFor="password" value="Password" />
            </div>
            <TextInput
              id="password"
              name="password"
              placeholder="Enter password"
              type="password"
              required
              shadow
            />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <Checkbox id="remember" />
            <Label htmlFor="remember">Remember me</Label>
          </div>
          <div className="mt-6">
            {!isLoading ? (
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            ) : (
              <Button type="submit" color="dark" className="w-full">
                <Spinner color="info" className="" />
              </Button>
            )}
          </div>
          <div className="flex mx-auto justify-center items-center mt-5">
            <div className="border-b w-[40%]"></div>
            <p className="text-md mt-4 mx-3 mb-4">OR</p>
            <div className="border-b w-[40%]"></div>
          </div>
          <span className="flex justify-center my-4">
            <p className="mx-2 p-1">Already have an account?</p>
            <Link
              to="/login"
              className="text-blue-700 text-bold cursor-pointer hover:bg-gray-200 p-1 rounded-sm"
            >
              Sign in
            </Link>
          </span>
        </div>
      </form>
    </>
  );
};

export default Register;
