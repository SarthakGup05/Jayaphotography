import React from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import FloatingModal from "./FloatingModal";
import ReviewForm from "@/components/Reviewform";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Nav />
      <main className="flex-1 p-0">
        <Outlet />
      </main>
      <Footer />
         <FloatingModal buttonText="⭐ Leave a Review">
        <ReviewForm />
      </FloatingModal>
    </div>
  );
};

export default Layout;
