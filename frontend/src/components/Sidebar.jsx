import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-5 fixed">
      <h1 className="text-2xl font-bold mb-10">Dev Utilities</h1>

      <nav className="flex flex-col gap-4">
        <Link className="hover:bg-gray-700 p-2 rounded" to="/">Home</Link>
        <Link className="hover:bg-gray-700 p-2 rounded" to="/base64">Base64 Tools</Link>
        <Link className="hover:bg-gray-700 p-2 rounded" to="/url">URL Encoder</Link>
        <Link className="hover:bg-gray-700 p-2 rounded" to="/qr">QR Generator</Link>
      </nav>
    </div>
  );
}
