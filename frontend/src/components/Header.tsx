import { useLocation } from "react-router-dom";

const pageMeta: Record<string, { section: string; title: string }> = {
  "/": { section: "Dashboard", title: "Overview" },
  "/excel-csv": { section: "File Tools", title: "Excel ↔ CSV" },
  "/json-xml": { section: "File Tools", title: "JSON ↔ XML" },
  "/base64-file": { section: "File Tools", title: "Base64 File Tool" },
  "/base64": { section: "Text Tools", title: "Base64 Text Tool" },
  "/url": { section: "Text Tools", title: "URL Encode / Decode" },
  "/qr": { section: "Generators", title: "QR Generator" },
  "/hash": { section: "Generators", title: "Hash Generator" },
  "/timestamp": { section: "Converters", title: "Timestamp Converter" },
  "/about": { section: "Dashboard", title: "About" }
};

export default function Header() {
  const { pathname } = useLocation();
  const meta = pageMeta[pathname];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="h-14 px-6 flex items-center">
        <div className="flex items-center text-sm text-gray-600">
          {meta ? (
            <>
              <span className="font-medium text-gray-500">
                {meta.section}
              </span>
              <span className="mx-2 text-gray-400">›</span>
              <span className="font-semibold text-gray-800">
                {meta.title}
              </span>
            </>
          ) : (
            <span className="font-semibold text-gray-800">
              Stack Converter
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
