import { Link, NavLink } from "react-router-dom";
import {
  PanelRightClose,
  PanelRightOpen
} from "lucide-react";

import crimsonenergy from "../assets/crimsonenergy.svg";
import Tooltip from "../components/ui/Tooltip";
import { sidebarConfig } from "../configs/sidebarConfig";
import { useContext } from "react";
import { MainContext } from "../context/MainContext";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const {userDetails} = useContext(MainContext)
  const role = userDetails.roles[0].toLowerCase()
  return (
    <aside
      className={`
      relative
      h-[calc(100vh-2rem)]
      ml-3
      my-4
      ${collapsed ? "w-20" : "w-56"}
      bg-surface-light
      border border-border-light
      text-text-primary
      rounded-2xl
      shadow-sidebar
      transition-all duration-300
      flex flex-col
      justify-between
      py-4
      `}
    >

      {/* Logo */}
      <div className="flex flex-col items-center gap-8">

        <Link to="/dashboard"><img src={crimsonenergy} className="h-14 w-14" /></Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
          absolute
          top-18
          -right-4
          w-8 h-8
          flex items-center justify-center
          rounded-full
          bg-white
          border border-border-light
          text-text-secondary
          hover:text-brand
          shadow-card
          hover:shadow-cardHover
          transition-all duration-300
          cursor-pointer
          "
        >
          {collapsed ? <PanelRightOpen size={16}/> : <PanelRightClose size={16}/>}
        </button>

        {/* Navigation */}
        <nav className="flex flex-col gap-6 mt-10 px-3">
          {sidebarConfig.filter(item => item.roles.includes(role)).map((item) => {
            const Icon = item.icon;

            return (
              <Tooltip key={item.label} text={collapsed ? item.label : ""}>

                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex
                    ${collapsed ? "justify-center" : "gap-3 px-3"}
                    items-center
                    py-2.5
                    rounded-lg
                    transition-all
                    duration-200
                    group
                    ${
                      isActive
                        ? collapsed ? "text-brand" : "bg-brand-soft text-brand"
                        : "hover:bg-gray-100 text-text-secondary"
                    }
                  `}
                >
                  <div
                    className="
                    flex items-center justify-center
                    w-9 h-9
                    rounded-lg
                    bg-gray-100
                    group-hover:bg-brand-soft
                    transition-all
                    "
                  >
                    <Icon size={20} />
                  </div>

                  {!collapsed && (
                    <span className="text-sm font-medium tracking-wide transition-opacity duration-200">
                      {item.label}
                    </span>
                  )}

                </NavLink>

              </Tooltip>
            );
          })}

        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;