import { useState } from "react";
import Sidebar from "./SideBar";
import Header from "./Header";

const BaseLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background-light font-sans overflow-hidden">

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex flex-col flex-1">

        <Header />

        <main className="flex-1 px-6 py-2 overflow-y-scroll ">
          {children}
        </main>

      </div>

    </div>
  );
};

export default BaseLayout;