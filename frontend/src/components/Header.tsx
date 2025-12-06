import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/base64": "Base64 Encode/Decode",
  "/url": "URL Encode/Decode",
  "/qr": "QR Generator",
  "/hash": "Hash Generator",
  "/timestamp": "Timestamp Converter",
  "/excel-csv": "File Converter",
  "/base64-file": "File Converter"
};

export default function Header() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || "Stack Converter";

  return (
    <header className="w-full bg-white shadow-sm border-b py-3 px-6 sticky top-0 z-50">
      <h1 className="text-xl font-semibold text-gray-800">
        {title}
      </h1>
    </header>
  );
}
