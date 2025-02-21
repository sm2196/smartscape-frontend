"use client";

import React from "react";
import "./hk-emergencycontrol.module.css";
import {Sidebar} from "./components/sidebar-hk";
import EmergencyControl from "./hk-emergencycontrol";

const Page = () => {
  return (
    <div className="dashboardLayout">
      <Sidebar />
      <main className="mainContent">
        <EmergencyControl/>
        </main>
        </div>
  );
};

export default Page;
