import { useState } from "react";
import Seo from "../components/Seo";

export default function UrlTools() {
  const [mode, setMode] = useState("encode");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleAction = async () => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    setError("");
    setResult("");

    if (!input.trim()) {
      setError("Input cannot be empty.");
      return;
    }

    const url =
      mode === "encode"
        ? `${API_BASE}/api/url/encode?input=${encodeURIComponent(
            input
          )}`
        : `${API_BASE}/api/url/decode?input=${encodeURIComponent(
            input
          )}`;

    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      if (data.error) setError(data.error);
      else setResult(mode === "encode" ? data.encoded : data.decoded);
    } catch (e) {
      setError("Invalid URL or server error.");
    }
  };

  return (
    <>
      <Seo
        title="URL Encoder & Decoder — Safe URL Conversion Tool | Stack Converter"
        description="Encode or decode any URL safely. Useful for developers working with HTTP parameters, redirects, APIs, and web integrations."
        keywords="url encoder, url decoder, urlencode, urldecode, encode url online, decode url online"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Tool",
            name: "URL Encode/Decode Tool",
            url: "https://stackconverter.com/url",
            featureList: ["Encode URL", "Decode URL"],
          }),
        }}
      />

      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          URL {mode === "encode" ? "Encoder" : "Decoder"}
        </h2>

        {/* Toggle */}
        <button
          onClick={() => {
            setMode(mode === "encode" ? "decode" : "encode");
            setInput("");
            setResult("");
            setError("");
          }}
          className="px-5 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-md mb-6"
        >
          Switch to {mode === "encode" ? "Decode" : "Encode"}
        </button>

        {/* Input section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Input
          </label>

          <textarea
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
            placeholder={
              mode === "encode"
                ? "Enter text to URL encode..."
                : "Enter encoded URL text to decode..."
            }
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleAction}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition-all"
        >
          {mode === "encode" ? "Encode" : "Decode"}
        </button>

        {/* Error message */}
        {error && (
          <p className="mt-4 text-red-600 font-semibold bg-red-50 border border-red-200 p-3 rounded-lg">
            {error}
          </p>
        )}

        {/* Result section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Result
          </label>

          <textarea
            className="w-full p-4 border border-gray-300 rounded-xl bg-gray-100"
            rows={4}
            readOnly
            value={result}
          />
        </div>
      </div>
    </>
  );
}
