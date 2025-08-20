import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  const handleToggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleCloseMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {" "}
      <Header
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={handleToggleMobileSidebar}
      />
      <hr className="container  my-6 border-gray-300 dark:border-neutral-700" />
      <div className="container flex flex-col lg:flex-row gap-8 relative">
        <Sidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobileSidebar={handleCloseMobileSidebar}
        />

        {/* Main content */}
        <div className="w-full min-w-0 pb-5 overflow-hidden">
          <Outlet />
          <Footer />
        </div>
      </div>{" "}
    </>
  );
};

export default Layout;
