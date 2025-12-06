import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SidebarLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-gray-200 py-6 px-4 shadow-xl transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Top Section with Title + Toggle */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h1 className="text-xl font-semibold whitespace-nowrap">
              Stack Converter
            </h1>
          )}

          {/* Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-700 transition"
          >
            {collapsed ? (
              // Expand >>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 5l8 7-8 7"
                />
              </svg>
            ) : (
              // Collapse <<
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 5l-8 7 8 7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Sidebar Menu */}
        <ul className="space-y-2">
          {/* Home */}
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition 
                ${isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800/50"}`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l9-9 9 9v8a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4H9v4a2 2 0 01-2 2H3z"
                />
              </svg>

              {!collapsed && "Home"}
            </NavLink>
          </li>

          {/* Excel <> csv */}
          <li>
            <NavLink
              to="/excel-csv"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition 
                ${isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800/50"}`
              }
            >
              <svg
                className="h-5 w-5"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4h16v16H4z M8 8l8 8M16 8l-8 8"
                />
              </svg>
              {!collapsed && "Excel ↔ CSV"}
            </NavLink>
          </li>

          {/* Base 64 File */}
          <li>
            <NavLink
              to="/base64-file"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition 
                ${isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800/50"}`
              }
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeWidth="2" d="M4 4h16v16H4z M8 8h8M8 12h8M8 16h5" />
              </svg>

              {!collapsed && "Base64 File Tool"}
            </NavLink>
          </li>

          {/* Base64 Tools */}
          <li>
            <NavLink
              to="/base64"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition 
                ${isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800/50"}`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m-4 4l4-4m0 0L3 8m4 4h14"
                />
              </svg>

              {!collapsed && "Base64 Text Tool"}
            </NavLink>
          </li>

          {/* URL Tools */}
          <li>
            <NavLink
              to="/url"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition 
                ${isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800/50"}`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656m5.656-5.656a4 4 0 015.656 0l3 3a4 4 0 11-5.656 5.656"
                />
              </svg>

              {!collapsed && "URL Tool"}
            </NavLink>
          </li>

          {/* QR Generator */}
          <li>
            <NavLink
              to="/qr"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition 
                ${isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800/50"}`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h6v6H3V3zm12 0h6v6h-6V3zM3 15h6v6H3v-6zm12 6v-3h3m-6-3h6"
                />
              </svg>

              {!collapsed && "QR Generator"}
            </NavLink>
          </li>

          {/* Hash Generator */}
          <li>
            <NavLink
              to="/hash"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition 
                ${isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800/50"}`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 9h18M3 15h18M9 3v18M15 3v18"
                />
              </svg>

              {!collapsed && "Hash Generator"}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/timestamp"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition 
                ${isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800/50"}`
              }
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              {!collapsed && "Timestamp Converter"}
            </NavLink>
          </li>
        </ul>

        {/* ABOUT SECTION AT BOTTOM */}
        <div className="mt-auto pt-6 border-t border-gray-700">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition
              ${isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800/50"}`
            }
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M13 16h-1v-4h-1m1-4h.01"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {!collapsed && "About"}
          </NavLink>
        </div>
      </aside>

      {/* MAIN AREA — Header + Content + Footer */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* Header stays fixed at top */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>

        {/* Footer always at bottom */}
        <Footer />
      </div>
    </div>
  );
};

export default SidebarLayout;
