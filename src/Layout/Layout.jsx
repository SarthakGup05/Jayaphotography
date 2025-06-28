import React from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Nav />
      <main className="flex-1 p-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
