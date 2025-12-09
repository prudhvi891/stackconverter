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

  const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>("");

  // ──────────────────────────────────────────
  // Progress bar animation
  // ──────────────────────────────────────────
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

  // ──────────────────────────────────────────
  // Drag & drop handler
  // ──────────────────────────────────────────
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError("");
    }
  };

  // ──────────────────────────────────────────
  // Parse filename from backend response
  // ──────────────────────────────────────────
  const parseFilenameFromContentDisposition = (cd: string | null) => {
    if (!cd) return null;

    // filename*=UTF-8''
    let match = cd.match(/filename\*=UTF-8''([^;]+)/);
    if (match) return decodeURIComponent(match[1]);

    // filename="something.ext"
    match = cd.match(/filename="([^"]+)"/);
    if (match) return match[1];

    // filename=something.ext
    match = cd.match(/filename=([^;]+)/);
    if (match) return match[1];

    return null;
  };

  // ──────────────────────────────────────────
  // Convert handler
  // ──────────────────────────────────────────
  const handleConvert = () => {
    if (!file) {
      setError("Please upload a file.");
      return;
    }

    setError("");
    setLoading(true);
    setDownloadBlob(null);
    setDownloadFilename("");

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    // Progress tracking
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onerror = () => {
      setError("Network error");
      setLoading(false);
    };

    xhr.onload = () => {
      setLoading(false);

      if (xhr.status === 200) {
        const blob = xhr.response as Blob;

        const cdHeader = xhr.getResponseHeader("Content-Disposition");
        const serverFilename = parseFilenameFromContentDisposition(cdHeader);

        setDownloadBlob(blob);
        setDownloadFilename(serverFilename || "download.txt");
      } else {
        setError("Failed to convert file");
      }
    };

    xhr.open(
      "POST",
      mode === "encode"
        ? `${API_BASE}/api/base64/file/encode`
        : `${API_BASE}/api/base64/file/decode`
    );

    // Return Blob from backend
    xhr.responseType = "blob";
    xhr.send(formData);
  };

  // ──────────────────────────────────────────
  // Download handler
  // ──────────────────────────────────────────
  const handleDownload = () => {
    if (!downloadBlob || !downloadFilename) return;

    const url = URL.createObjectURL(downloadBlob);
    const a = document.createElement("a");

    a.href = url;
    a.download = downloadFilename;
    a.click();

    URL.revokeObjectURL(url);
  };

  // ──────────────────────────────────────────
  // UI
  // ──────────────────────────────────────────
  return (
    <>
      <Seo
        title="Base64 File Encoder & Decoder — Convert Files to Base64 | Stack Converter"
        description="Convert any file into Base64 text or decode Base64 text back into the original file."
        keywords="base64 file converter, file to base64, decode base64 file, base64 converter"
      />

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow space-y-8">
        <h2 className="text-3xl font-semibold text-gray-900">
          Base64 File Converter
        </h2>

        {/* Drag & Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
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
            accept={mode === "encode" ? "*" : ".txt"}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          {!file ? (
            <label htmlFor="fileInput" className="cursor-pointer">
              <p className="text-lg text-gray-700 mb-2">
                Drag & drop a file here, or{" "}
                <span className="text-blue-600">browse</span>
              </p>
              <p className="text-sm text-gray-500">
                {mode === "encode"
                  ? "Supports ANY file type"
                  : "Upload Base64 .txt file"}
              </p>
            </label>
          ) : (
            <div>
              <p className="text-gray-700">File Selected:</p>
              <p className="font-semibold">{file.name}</p>
              <button
                className="text-red-500 underline text-sm mt-2"
                onClick={() => setFile(null)}
              >
                Remove file
              </button>
            </div>
          )}
        </div>

        {/* Mode Selection */}
        <div>
          <label className="text-sm font-medium">Choose Conversion</label>
          <select
            className="w-full border p-3 rounded-lg mt-1"
            value={mode}
            onChange={(e) => {
              setMode(e.target.value as any);
              setFile(null);
              setDownloadBlob(null);
            }}
          >
            <option value="encode">Any File → Base64 (.txt)</option>
            <option value="decode">Base64 (.txt) → Original File</option>
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
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Convert"}
        </button>

        {/* Download Button */}
        {downloadBlob && (
          <div className="pt-4">
            <button
              onClick={handleDownload}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Download {downloadFilename}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
