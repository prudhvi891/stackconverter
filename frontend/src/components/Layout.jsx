import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 p-10 w-full min-h-screen bg-gray-100">
        {children}
      </div>
    </div>
  );
}
