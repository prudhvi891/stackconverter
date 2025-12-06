import { Link } from "react-router-dom";
import Seo from "../components/Seo";

export default function Home() {
  return (
    <>
      <Seo
        title="Stack Converter — Free Developer Utilities (Base64, CSV, QR, Hash, Timestamp)"
        description="A fast and reliable collection of developer tools including Base64 encoder/decoder, CSV converter, QR generator, hash generator, timestamp converter, and more."
        keywords="developer tools, free online tools, base64 encoder, base64 decoder, csv converter, qr generator, hash generator, timestamp converter, excel csv online"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Stack Converter",
            url: "https://stackconverter.com",
            description:
              "A free suite of developer utilities: Base64 tools, CSV converter, QR generator, Hash generator, URL encoder, and Timestamp converter.",
          }),
        }}
      />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Welcome to Stack Converter
        </h1>

        <p className="text-gray-600 mb-10">
          A fast, simple, and reliable set of developer utilities — all in one
          place.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Excel <> csv Card */}
          <Link to="/excel-csv">
            <div className="border rounded-xl p-6 hover:shadow-md transition cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-800">
                Excel ↔ CSV Converter
              </h3>
              <p className="text-gray-600 mt-1">
                Convert Excel files to CSV and CSV files back to Excel.
              </p>
            </div>
          </Link>

          {/* Base64 File Card */}
          <Link to="/base64-file">
            <div className="border rounded-xl p-6 hover:shadow-md transition cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-800">
                Base64 File Encode/Decode
              </h3>
              <p className="text-gray-600 mt-1">
                Upload a text file and convert it to Base64 or decode Base64
                files.
              </p>
            </div>
          </Link>

          {/* Base64 Card */}
          <Link to="/base64">
            <div className="border rounded-xl p-6 hover:shadow-md transition cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-800">
                Base64 Text Encode/Decode
              </h3>
              <p className="text-gray-600 mt-1">
                Encode and decode Base64 strings easily.
              </p>
            </div>
          </Link>

          {/* URL Tools Card */}
          <Link to="/url">
            <div className="border rounded-xl p-6 hover:shadow-md transition cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-800">
                URL Encode/Decode
              </h3>
              <p className="text-gray-600 mt-1">
                Encode or decode any URL safely.
              </p>
            </div>
          </Link>

          {/* QR Generator Card */}
          <Link to="/qr">
            <div className="border rounded-xl p-6 hover:shadow-md transition cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-800">
                QR Generator
              </h3>
              <p className="text-gray-600 mt-1">
                Generate custom QR codes instantly.
              </p>
            </div>
          </Link>

          {/* Hash Generator Card */}
          <Link to="/hash">
            <div className="border rounded-xl p-6 hover:shadow-md transition cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-800">
                Hash Generator
              </h3>
              <p className="text-gray-600 mt-1">
                Generate MD5, SHA-1, SHA-256, SHA-512 hashes instantly.
              </p>
            </div>
          </Link>

          <Link to="/timestamp">
            <div className="border rounded-xl p-6 hover:shadow-md transition cursor-pointer">
              <h3 className="text-lg font-semibold">Timestamp Converter</h3>
              <p className="text-gray-600 mt-1">
                Convert Unix timestamps to readable dates and back.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
