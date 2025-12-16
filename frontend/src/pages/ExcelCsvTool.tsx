import { useState, useEffect } from "react";
import type { DragEvent } from "react";
import Seo from "../components/Seo";

export default function ExcelCsvTool() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"excel-to-csv" | "csv-to-excel">(
    "excel-to-csv"
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // ───────────────────────────────────────────────
  // Progress animation while loading
  // ───────────────────────────────────────────────
  useEffect(() => {
    let interval: any;

    if (loading) {
      setProgress(0);

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) return prev + 5; // smooth filling
          return prev;
        });
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

  const handleConvert = async () => {
    if (!file) {
      setError("Please upload a file.");
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const endpoint =
      mode === "excel-to-csv"
        ? `${API_BASE}/api/convert/excel-to-csv`
        : `${API_BASE}/api/convert/csv-to-excel`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Conversion failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download =
        mode === "excel-to-csv" ? "converted.csv" : "converted.xlsx";
      link.click();
    } catch (err) {
      setError("Failed to convert file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Excel to CSV Converter — Convert XLSX ↔ CSV | Stack Converter"
        description="Upload Excel files and convert them to CSV, or convert CSV files back to Excel. Supports fast processing and large files."
        keywords="excel to csv, csv to excel, xlsx converter, csv converter online"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Tool",
            name: "Excel CSV Converter",
            url: "https://stackconverter.com/excel-csv",
            featureList: ["Excel to CSV", "CSV to Excel"],
          }),
        }}
      />

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow space-y-8">
        <h2 className="text-3xl font-semibold text-gray-900">
          Excel ⇆ CSV Converter
        </h2>

        <p className="text-gray-600">
          Convert Excel (.xlsx) files to CSV or convert CSV files back to Excel
          format.
        </p>

        {/* ─────────────────────────────────────────────── */}
        {/* Drag & Drop Upload */}
        {/* ─────────────────────────────────────────────── */}

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
            accept=".csv,.xlsx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          {!file ? (
            <label htmlFor="fileInput" className="block cursor-pointer">
              <p className="text-lg text-gray-700 mb-2">
                Drag & drop a file here, or{" "}
                <span className="text-blue-600">browse</span>
              </p>
              <p className="text-sm text-gray-500">Supported: .xlsx, .csv</p>
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

        {/* ─────────────────────────────────────────────── */}
        {/* Conversion Type */}
        {/* ─────────────────────────────────────────────── */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Choose Conversion
          </label>
          <select
            className="w-full border rounded-lg p-3"
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
          >
            <option value="excel-to-csv">Excel → CSV</option>
            <option value="csv-to-excel">CSV → Excel</option>
          </select>
        </div>

        {/* Error */}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* ─────────────────────────────────────────────── */}
        {/* Progress Bar */}
        {/* ─────────────────────────────────────────────── */}

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
          {loading ? "Converting..." : "Convert"}
        </button>
      </div>
    </>
  );
}
