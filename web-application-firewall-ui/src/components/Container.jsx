import { useState } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/Auth";

const Container = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return (
    <>
      {isLoggedIn && (
        <div className="bg-slate-900 text-white p-2 w-60 min-h-screen px-4 pt-16 fixed z-30">
          <Sidebar></Sidebar>
        </div>
      )}
      <div className={`flex ${isLoggedIn ? "justify-end" : "justify-center"}`}>
        <div className="w-[85%] h-full pt-16">{children}</div>
      </div>
    </>
  );
};

export default Container;
