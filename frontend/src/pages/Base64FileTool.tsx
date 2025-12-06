import { useState, useEffect } from "react";
import type { DragEvent } from "react";
import Seo from "../components/Seo";

export default function Base64FileTool() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Smooth progress bar animation
  useEffect(() => {
    let interval: any;

    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 5 : prev));
      }, 200);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }

    return () => clearInterval(interval);
  }, [loading]);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError("");
    }
  };

  const handleConvert = () => {
    if (!file) {
      setError("Please upload a file.");
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = new Blob([xhr.response], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download =
          mode === "encode" ? "encoded_base64.txt" : "decoded_output.txt";
        a.click();
      } else {
        setError("Failed to convert file");
      }

      setLoading(false);
    };

    xhr.onerror = () => {
      setError("Network error");
      setLoading(false);
    };

    xhr.open(
      "POST",
      mode === "encode"
        ? `${API_BASE}/api/base64/file/encode`
        : `${API_BASE}/api/base64/file/decode`
    );

    xhr.responseType = "blob";
    xhr.send(formData);
  };

  return (
    <>
      <Seo
        title="Base64 File Encoder & Decoder — Convert Files to Base64 | Stack Converter"
        description="Upload a file and convert it to Base64, or upload Base64 and decode it back to the original file. Supports text files and more."
        keywords="base64 file converter, file to base64, decode base64 file, base64 download"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Tool",
            name: "Base64 File Converter",
            url: "https://stackconverter.com/base64-file",
            featureList: ["File to Base64", "Base64 to File"],
          }),
        }}
      />

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow space-y-8">
        <h2 className="text-3xl font-semibold text-gray-900">
          Base64 File Converter
        </h2>
        <p className="text-gray-600">
          Upload a text file to convert it to Base64 or decode a Base64 text
          file back to normal text.
        </p>

        {/* Drag & Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition 
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        `}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept=".txt"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          {!file ? (
            <label htmlFor="fileInput" className="block cursor-pointer">
              <p className="text-lg text-gray-700 mb-2">
                Drag & drop a file here, or{" "}
                <span className="text-blue-600">browse</span>
              </p>
              <p className="text-sm text-gray-500">Supported: .txt</p>
            </label>
          ) : (
            <div>
              <p className="text-gray-700 text-lg font-medium">
                File Selected:
              </p>
              <p className="text-gray-900 font-semibold mt-1">{file.name}</p>
              <button
                className="mt-4 text-red-500 underline text-sm"
                onClick={() => setFile(null)}
              >
                Remove file
              </button>
            </div>
          )}
        </div>

        {/* Mode Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Choose Conversion
          </label>
          <select
            className="w-full border rounded-lg p-3"
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
          >
            <option value="encode">Normal Text → Base64</option>
            <option value="decode">Base64 → Normal Text</option>
          </select>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Progress Bar */}
        {loading && (
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? "Processing..." : "Convert"}
        </button>
      </div>
    </>
  );
}
