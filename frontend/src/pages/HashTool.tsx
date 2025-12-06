import { useState } from "react";
import Seo from "../components/Seo";

export default function HashTool() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState("sha256");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const generateHash = async () => {
    setError("");
    setResult("");

    if (!input.trim()) {
      setError("Input cannot be empty.");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/hash/generate?input=${encodeURIComponent(
          input
        )}&algorithm=${algorithm}`
      );

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.hash);
      }
    } catch (err) {
      setError("Failed to generate hash. Server error.");
    }
  };

  return (
    <>
      <Seo
        title="Hash Generator — MD5, SHA-1, SHA-256, SHA-512 | Stack Converter"
        description="Generate secure hash values for strings using MD5, SHA-1, SHA-256, and SHA-512 instantly. Great for developers and cryptography tasks."
        keywords="hash generator, md5 hash, sha256 hash, sha512 hash, online hash tool"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Tool",
            name: "Hash Generator",
            url: "https://stackconverter.com/hash",
            featureList: ["MD5", "SHA-1", "SHA-256", "SHA-512"],
          }),
        }}
      />

      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Hash Generator
        </h2>

        {/* Algorithm Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Algorithm
          </label>

          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="md5">MD5</option>
            <option value="sha1">SHA-1</option>
            <option value="sha256">SHA-256</option>
            <option value="sha384">SHA-384</option>
            <option value="sha512">SHA-512</option>
          </select>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Input
          </label>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 
                     focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Enter text to hash..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Action Button */}
        <button
          onClick={generateHash}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow 
                   hover:bg-blue-700 transition-all"
        >
          Generate Hash
        </button>

        {/* Error */}
        {error && (
          <p className="mt-4 text-red-600 font-semibold bg-red-50 border border-red-200 p-3 rounded-lg">
            {error}
          </p>
        )}

        {/* Result */}
        {result && (
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
        )}
      </div>
    </>
  );
}
