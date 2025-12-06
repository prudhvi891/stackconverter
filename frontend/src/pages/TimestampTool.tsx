import { useEffect, useState } from "react";
import Seo from "../components/Seo";

export default function TimestampTool() {
  const [unixInput, setUnixInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [unixResult, setUnixResult] = useState("");
  const [dateResult, setDateResult] = useState("");
  const [liveUnix, setLiveUnix] = useState(Math.floor(Date.now() / 1000));
  const [error, setError] = useState("");

  // 🔄 Live UNIX clock updater
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUnix(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🧠 Human readable formatter
  const timeAgo = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  // 🟦 UNIX → Date
  const convertUnixToDate = () => {
    try {
      setError("");
      const unix = Number(unixInput);

      const dateObj = new Date(unix * 1000);

      setDateResult(
        JSON.stringify(
          {
            local: dateObj.toLocaleString(),
            utc: dateObj.toUTCString(),
            iso: dateObj.toISOString(),
            rfc: dateObj.toString(),
            human: timeAgo(dateObj),
          },
          null,
          2
        )
      );
    } catch {
      setError("Invalid UNIX timestamp.");
    }
  };

  // 🟩 Date → UNIX
  const convertDateToUnix = () => {
    try {
      setError("");
      const dateObj = new Date(dateInput);
      const unix = Math.floor(dateObj.getTime() / 1000);
      setUnixResult(unix.toString());
    } catch {
      setError("Invalid date format.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <Seo
        title="Timestamp Converter — Unix ↔ Human Date | Stack Converter"
        description="Convert Unix timestamps to human-readable date formats and back. Includes live Unix time display."
        keywords="timestamp converter, unix time converter, epoch converter, epoch to date"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Tool",
            name: "Timestamp Converter",
            url: "https://stackconverter.com/timestamp",
            featureList: ["Unix to date", "Date to Unix", "Live timestamp"],
          }),
        }}
      />

      <div className="max-w-3xl mx-auto space-y-10">
        {/* PAGE TITLE */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Timestamp Converter
        </h2>

        {error && <p className="text-red-600">{error}</p>}

        {/* 🔥 LIVE CLOCK SECTION */}
        <div className="border rounded-xl p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Current Time (Live)</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* UNIX TIME */}
            <div>
              <p className="text-sm font-medium text-gray-600">
                UNIX Timestamp
              </p>
              <p className="text-2xl font-mono mt-1">{liveUnix}</p>

              <button
                onClick={() => copyToClipboard(liveUnix.toString())}
                className="mt-2 px-3 py-1 bg-gray-800 text-white rounded text-sm"
              >
                Copy
              </button>
            </div>

            {/* HUMAN READABLE LOCAL TIME */}
            <div>
              <p className="text-sm font-medium text-gray-600">Local Time</p>
              <p className="text-xl font-mono mt-1">
                {new Date(liveUnix * 1000).toLocaleString()}
              </p>

              <button
                onClick={() =>
                  copyToClipboard(new Date(liveUnix * 1000).toLocaleString())
                }
                className="mt-2 px-3 py-1 bg-gray-800 text-white rounded text-sm"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* UNIX → DATE SECTION */}
        <div className="border rounded-xl p-6 space-y-3">
          <h3 className="text-lg font-semibold">UNIX → Date</h3>

          <input
            type="number"
            placeholder="Enter Unix timestamp (seconds)"
            className="w-full border rounded-lg p-3"
            value={unixInput}
            onChange={(e) => setUnixInput(e.target.value)}
          />

          <button
            onClick={convertUnixToDate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Convert
          </button>

          {dateResult && (
            <pre className="mt-3 p-3 bg-gray-100 rounded-lg whitespace-pre-wrap">
              {dateResult}
            </pre>
          )}

          {dateResult && (
            <button
              onClick={() => copyToClipboard(dateResult)}
              className="mt-3 px-3 py-1 bg-gray-800 text-white rounded text-sm"
            >
              Copy Result
            </button>
          )}
        </div>

        {/* DATE → UNIX SECTION */}
        <div className="border rounded-xl p-6 space-y-3">
          <h3 className="text-lg font-semibold">Date → UNIX</h3>

          <input
            type="text"
            placeholder="YYYY-MM-DD HH:mm:ss"
            className="w-full border rounded-lg p-3"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />

          <button
            onClick={convertDateToUnix}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Convert
          </button>

          {unixResult && (
            <div className="mt-3 p-3 bg-gray-100 rounded-lg font-mono">
              {unixResult}
            </div>
          )}

          {unixResult && (
            <button
              onClick={() => copyToClipboard(unixResult)}
              className="mt-3 px-3 py-1 bg-gray-800 text-white rounded text-sm"
            >
              Copy Result
            </button>
          )}
        </div>
      </div>
    </>
  );
}
