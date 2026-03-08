import { useEffect, useRef, useState } from "react";
import { Menu, Sun, Moon, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { ThemeContext } from "../../context/ThemeContext";

const Header = () => {
//   const { theme, toggleTheme } = useContext(ThemeContext);

const theme = "light"
  const [time, setTime] = useState(new Date());
  const [openProfile, setOpenProfile] = useState(false);
  const dropdownRef = useRef();

  const navigate = useNavigate();

  const username = "Diksha";
  const designation = "HR Manager";

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

    // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formattedTime = time.toLocaleTimeString();

  const formattedDate = time.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  
  const handleLogout = () => {
    console.log("logout");

    // clear token etc
    localStorage.removeItem("token");

    navigate("/login");
  };


  return (
    <header className="h-20 px-6 flex items-center justify-between py-4">

      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="">
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            <span className="font-semibold text-gray-600 mr-2">{formattedDate} </span> <span>  {formattedTime} </span>
          </p>

          <p className="text-2xl font-semibold text-text-primary mt-2">
            {getGreeting()}, {username}!
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        
        {/* Theme Toggle */}
        <button
        //   onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Profile */}
        <div ref={dropdownRef} className="relative">

          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {username[0]}
            </div>

            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {username}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {designation}
              </p>
            </div>
          </button>

          {/* DROPDOWN */}
          {openProfile && (
            <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            rounded-xl shadow-lg overflow-hidden">

              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-4 py-2 text-sm
                hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                Profile Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600
                hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                Logout
              </button>

            </div>
          )}

        </div>


      </div>
    </header>
  );
};

export default Header;