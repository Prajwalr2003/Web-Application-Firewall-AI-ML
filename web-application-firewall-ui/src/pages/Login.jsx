import React, { useRef, useState } from "react";
import { Button, Checkbox, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth";
import { useToast } from "../context/ToastContext";

const Login = () => {
  const { loginUser, isLoggedIn, setError, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  let email = useRef();
  let password = useRef();

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    let loginData = {
      email: email.current.value,
      password: password.current.value,
    };
    try {
      const response = await loginUser(loginData);

      // Check if response indicates success
      console.log(response);
      if (response?.data?.success === true) {
        showToast(response?.data?.message || "Login Successful", "success");
        setIsLoading(false);
        navigate("/dashboard");
      } else {
        showToast(
          response?.data?.message || "Invalid Email or Password",
          "error"
        );
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        showToast(error.response.data.message, "error");
      } else {
        showToast("An unexpected error occurred. Please try again.", "error");
      }
      setError("An unexpected error occurred. Please try again.", "error");
      console.error("Login Failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        className="flex justify-center items-center min-h-screen"
        onSubmit={handleLogin}
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
          <h2 className="text-4xl font-bold">Sign in</h2>

          {/* Email Input */}
          <div className="mt-6">
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder="your@gmail.com"
              ref={email}
              required
              shadow
            />
          </div>

          {/* Password Input */}
          <div className="mt-4">
            <div className="mb-2 block">
              <Label htmlFor="password" value="Password" />
            </div>
            <TextInput
              id="password"
              name="password"
              placeholder="Enter password"
              type="password"
              ref={password}
              required
              shadow
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 mt-6">
            <Checkbox id="remember" />
            <Label htmlFor="remember">Remember me</Label>
          </div>

          {/* Submit Button or Loading Button */}
          <div className="mt-6">
            {!isLoading ? (
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            ) : (
              <Button type="submit" color="dark" className="w-full">
                <Spinner color="info" className="" />
              </Button>
            )}
          </div>

          {/* Forgot Password */}
          <Link to="#">
            <p className="text-center text-sm mt-5">Forgot your password?</p>
            <div className="border-b w-[170px] mx-auto mt-1"></div>
          </Link>

          {/* OR Section */}
          <div className="flex mx-auto justify-center items-center mt-3">
            <div className="border-b w-[40%]"></div>
            <p className="text-md mt-4 mx-3 mb-4">OR</p>
            <div className="border-b w-[40%]"></div>
          </div>

          {/* Sign Up Link */}
          <span className="flex justify-center my-4">
            <p className="mx-2 p-1">Don't have an account?</p>
            <Link
              to="/register"
              className="text-blue-700 text-bold cursor-pointer hover:bg-gray-200 p-1 rounded-sm"
            >
              Sign up
            </Link>
          </span>
        </div>
      </form>
    </>
  );
};

export default Login;
