import { useState } from "react";
import Seo from "../components/Seo";

export default function JsonXmlTool() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"json-xml" | "xml-json">("json-xml");

  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null);
  const [downloadFilename, setDownloadFilename] = useState("");

  const isPasteMode = !file;

  // ─────────────────────────────────────────────
  // Convert
  // ─────────────────────────────────────────────
  const handleConvert = () => {
    setError("");
    setOutput("");
    setDownloadBlob(null);

    if (!inputText && !file) {
      setError("Please paste content or upload a file.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else {
      formData.append(
        "file",
        new File([inputText], "input.txt", { type: "text/plain" })
      );
    }

    const endpoint =
      mode === "json-xml"
        ? `${API_BASE}/api/json-xml/json-to-xml`
        : `${API_BASE}/api/json-xml/xml-to-json`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);
    xhr.responseType = "blob";

    xhr.onload = () => {
      setLoading(false);

      if (xhr.status !== 200) {
        setError("Conversion failed. Check input format.");
        return;
      }

      const blob = xhr.response;
      setDownloadBlob(blob);

      const cd = xhr.getResponseHeader("Content-Disposition");
      setDownloadFilename(parseFilename(cd) || "converted.txt");

      if (isPasteMode) {
        blob.text().then(setOutput);
      }
    };

    xhr.onerror = () => {
      setLoading(false);
      setError("Network error");
    };

    xhr.send(formData);
  };

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────
  const parseFilename = (cd: string | null) => {
    if (!cd) return null;
    let m = cd.match(/filename\*=UTF-8''([^;]+)/);
    if (m) return decodeURIComponent(m[1]);
    m = cd.match(/filename="([^"]+)"/);
    if (m) return m[1];
    return null;
  };

  const handleDownload = () => {
    if (!downloadBlob) return;
    const url = URL.createObjectURL(downloadBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const resetAll = () => {
    setInputText("");
    setFile(null);
    setOutput("");
    setDownloadBlob(null);
    setDownloadFilename("");
    setError("");
  };

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  return (
    <>
      <Seo
        title="JSON ⇆ XML Converter — Stack Converter"
        description="Convert JSON to XML or XML to JSON instantly. Paste input or upload files."
        keywords="json xml converter, xml to json, json to xml"
      />

      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-8 space-y-7">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">
            JSON ⇆ XML Converter
          </h1>
          <p className="text-gray-600">
            Paste JSON/XML or upload a file to convert.
          </p>
        </div>

        {/* Info Section — UNCHANGED */}
        <div className="border rounded-lg bg-gray-50 p-4">
          <details>
            <summary className="cursor-pointer font-medium text-gray-800">
              ℹ️ How JSON ⇆ XML conversion works (Attributes & Text)
            </summary>

            <div className="mt-3 text-sm text-gray-700 space-y-3 leading-relaxed">
              <p>
                JSON and XML use different data models. XML supports{" "}
                <b>attributes</b> and <b>text values</b>, while JSON does not.
                To ensure accurate and reversible conversion, Stack Converter
                follows a widely used mapping convention.
              </p>

              <div>
                <p className="font-medium text-gray-800 mb-1">
                  Conversion Rules
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <code className="bg-gray-200 px-1 rounded">@attribute</code>{" "}
                    → XML attribute
                  </li>
                  <li>
                    <code className="bg-gray-200 px-1 rounded">#text</code> →
                    XML element text
                  </li>
                  <li>Nested objects → Nested XML elements</li>
                </ul>
              </div>

              <div>
                <p className="font-medium text-gray-800 mb-1">Example</p>
                <pre className="bg-gray-900 text-green-300 p-3 rounded text-xs overflow-x-auto">
{`JSON:
{
  "product": {
    "@id": "100",
    "@available": "true",
    "name": {
      "@lang": "en",
      "#text": "Laptop"
    }
  }
}

XML:
<product id="100" available="true">
  <name lang="en">Laptop</name>
</product>`}
                </pre>
              </div>

              <p className="text-gray-600">
                This approach is compatible with common libraries and tools
                (Jackson XML, JSON.org, xml-js) and guarantees no data loss
                during conversion.
              </p>
            </div>
          </details>
        </div>

        {/* Mode */}
        <div className="flex gap-3">
          <button
            onClick={() => setMode("json-xml")}
            className={`px-4 py-2 rounded-lg border ${
              mode === "json-xml"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            JSON → XML
          </button>
          <button
            onClick={() => setMode("xml-json")}
            className={`px-4 py-2 rounded-lg border ${
              mode === "xml-json"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            XML → JSON
          </button>
        </div>

        {/* Input */}
        <div>
          <label className="block font-medium mb-2">Input</label>
          <textarea
            className="w-full min-h-[260px] border rounded-xl p-4 resize-y"
            placeholder={
              mode === "json-xml" ? "Paste JSON here..." : "Paste XML here..."
            }
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setFile(null);
            }}
          />
        </div>

        {/* Upload */}
        <div
          className="border rounded-xl p-4 bg-gray-50 text-center cursor-pointer"
          onClick={() => document.getElementById("upload")?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setFile(e.dataTransfer.files[0]);
            setInputText("");
          }}
        >
          <input
            id="upload"
            type="file"
            className="hidden"
            accept=".json,.xml,.txt"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setInputText("");
            }}
          />

          {!file ? (
            <>
              <p className="font-medium">Upload JSON / XML file</p>
              <p className="text-sm text-gray-500">Click or drag & drop</p>
            </>
          ) : (
            <div className="flex justify-center items-center gap-3">
              <span className="font-medium truncate max-w-xs">
                {file.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="text-red-600 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {error && <p className="text-red-600">{error}</p>}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleConvert}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {loading ? "Converting..." : "Convert"}
          </button>
          <button
            onClick={resetAll}
            className="px-6 py-3 bg-gray-200 rounded-lg"
          >
            Reset
          </button>
        </div>

        {/* Result */}
        {isPasteMode && output && (
          <div>
            <label className="block font-medium mb-2">Result</label>
            <textarea
              readOnly
              className="w-full min-h-[260px] border rounded-xl p-4 resize-y bg-gray-50"
              value={output}
            />
            <div className="flex gap-4 mt-3">
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Download */}
        {downloadBlob && (
          <div>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Download {downloadFilename}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
