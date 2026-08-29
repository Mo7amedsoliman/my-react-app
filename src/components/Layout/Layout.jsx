import React from "react";
import { Outlet } from "react-router";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";

export default function RootLayout() {
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="mx-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}
