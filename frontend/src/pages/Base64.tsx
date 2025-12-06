import { useState } from "react";
import Seo from "../components/Seo";

export default function Base64() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("encode");
  const [error, setError] = useState("");

  const handleAction = async () => {
    setError("");
    setResult("");

    if (!input.trim()) {
      setError("Input cannot be empty.");
      return;
    }

    const url =
      mode === "encode"
        ? `${API_BASE}/api/base64/encode?input=${encodeURIComponent(
            input
          )}`
        : `${API_BASE}/api/base64/decode?input=${encodeURIComponent(
            input
          )}`;

    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(mode === "encode" ? data.encoded : data.decoded);
      }
    } catch (err) {
      setError("Failed to process request. Invalid Base64 or server error.");
    }
  };

  return (
    <>
      <Seo
        title="Base64 Encoder & Decoder — Convert Text to Base64 | Stack Converter"
        description="Encode or decode Base64 text instantly. Safe, fast and accurate Base64 converter for developers."
        keywords="base64 encoder, base64 decoder, text to base64, base64 to text, online base64 converter"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Tool",
            name: "Base64 Text Encoder/Decoder",
            url: "https://stackconverter.com/base64",
            featureList: ["Encode to Base64", "Decode Base64"],
          }),
        }}
      />

      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Base64 {mode === "encode" ? "Encoder" : "Decoder"}
        </h2>

        {/* Mode Switch */}
        <div className="mb-6">
          <button
            onClick={() => {
              setMode(mode === "encode" ? "decode" : "encode");
              setInput("");
              setResult("");
              setError("");
            }}
            className="px-5 py-2.5 rounded-lg bg-gray-900 text-gray-100 hover:bg-gray-800 transition-all shadow-md"
          >
            Switch to {mode === "encode" ? "Decode" : "Encode"}
          </button>
        </div>

        {/* Input */}
        <label className="text-sm font-medium text-gray-700">Input</label>
        <textarea
          className="w-full mt-2 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
          rows={4}
          placeholder={
            mode === "encode"
              ? "Enter text to encode..."
              : "Enter Base64 string to decode..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Action Button */}
        <button
          onClick={handleAction}
          className="mt-5 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition-all"
        >
          {mode === "encode" ? "Encode" : "Decode"}
        </button>

        {/* Error */}
        {error && (
          <p className="mt-4 text-red-600 font-semibold bg-red-50 border border-red-200 p-3 rounded-lg">
            {error}
          </p>
        )}

        {/* Result */}
        <label className="text-sm font-medium text-gray-700 mt-6 block">
          Result
        </label>
        <textarea
          className="w-full mt-2 p-4 border border-gray-300 rounded-xl bg-gray-100"
          rows={4}
          value={result}
          readOnly
        />
      </div>
    </>
  );
}
