import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SidebarLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    // 🔒 Lock viewport scroll
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`bg-gray-900 text-gray-200 shadow-xl transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        h-screen sticky top-0 flex flex-col`}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          {!collapsed && (
            <h1 className="text-lg font-semibold whitespace-nowrap">
              Stack Converter
            </h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-700 transition"
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M8 5l8 7-8 7" strokeWidth="2" />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M16 5l-8 7 8 7" strokeWidth="2" />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <SidebarLink to="/" label="Home" collapsed={collapsed} icon={HomeIcon} end />
          <SidebarLink to="/excel-csv" label="Excel ⇆ CSV" collapsed={collapsed} icon={GridIcon} />
          <SidebarLink to="/json-xml" label="JSON ⇆ XML" collapsed={collapsed} icon={ArrowIcon} />
          <SidebarLink to="/base64-file" label="Base64 File Tool" collapsed={collapsed} icon={FileIcon} />
          <SidebarLink to="/base64" label="Base64 Text Tool" collapsed={collapsed} icon={SwapIcon} />
          <SidebarLink to="/url" label="URL Tool" collapsed={collapsed} icon={LinkIcon} />
          <SidebarLink to="/qr" label="QR Generator" collapsed={collapsed} icon={QrIcon} />
          <SidebarLink to="/hash" label="Hash Generator" collapsed={collapsed} icon={HashIcon} />
          <SidebarLink to="/timestamp" label="Timestamp Converter" collapsed={collapsed} icon={ClockIcon} />
        </nav>

        {/* Bottom About */}
        <div className="border-t border-gray-700 p-3">
          <SidebarLink to="/about" label="About" collapsed={collapsed} icon={InfoIcon} />
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex flex-col flex-1 h-screen">
        {/* Sticky Header */}
        <Header />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default SidebarLayout;

/* =====================================================
   Reusable Sidebar Link
===================================================== */

function SidebarLink({
  to,
  label,
  icon: Icon,
  collapsed,
  end = false,
}: {
  to: string;
  label: string;
  icon: React.FC<any>;
  collapsed: boolean;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition
        ${isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800/50"}`
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}

/* =====================================================
   Icons
===================================================== */

const HomeIcon = (p: any) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M3 12l9-9 9 9v8a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4H9v4a2 2 0 01-2 2H3z" strokeWidth="2" />
  </svg>
);

const ArrowIcon = (p: any) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M17 7l-5-5-5 5m5-5v18" strokeWidth="2" />
  </svg>
);

const SwapIcon = (p: any) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M7 7h10M7 17h10M3 12h18" strokeWidth="2" />
  </svg>
);

const FileIcon = (p: any) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M4 4h16v16H4z M8 8h8M8 12h8M8 16h5" strokeWidth="2" />
  </svg>
);

const GridIcon = (p: any) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M4 4h16v16H4z M8 8l8 8M16 8l-8 8" strokeWidth="2" />
  </svg>
);

const LinkIcon = (p: any) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M13.828 10.172a4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656m5.656-5.656a4 4 0 015.656 0l3 3a4 4 0 11-5.656 5.656" strokeWidth="2" />
  </svg>
);

const QrIcon = (p: any) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h3v3h-3z" strokeWidth="2" />
  </svg>
);

const HashIcon = (p: any) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeWidth="2" />
  </svg>
);

const ClockIcon = (p: any) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" />
  </svg>
);

const InfoIcon = (p: any) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round">
    <path d="M13 16h-1v-4h-1m1-4h.01" strokeWidth="2" />
  </svg>
);
