import { useState } from "react";
import Seo from "../components/Seo";

export default function QrGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(300);
  const [darkColor, setDarkColor] = useState("#000000"); // HEX defaults
  const [lightColor, setLightColor] = useState("#FFFFFF");
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const generateQr = async () => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    setError("");
    setQrImage(null);

    if (!text.trim()) {
      setError("Input text cannot be empty.");
      return;
    }

    const url = `${API_BASE}/api/qr/image?text=${encodeURIComponent(
      text
    )}&size=${size}&darkColorHex=${encodeURIComponent(
      darkColor
    )}&lightColorHex=${encodeURIComponent(lightColor)}`;

    try {
      const res = await fetch(url);

      if (!res.ok) throw new Error("Server error");

      const blob = await res.blob();
      const imgUrl = URL.createObjectURL(blob);
      setQrImage(imgUrl);
    } catch (err) {
      setError("Failed to generate QR. Please check your input or server.");
    }
  };

  return (
    <>
      <Seo
        title="QR Code Generator — Create Custom QR Codes | Stack Converter"
        description="Generate QR codes instantly with custom colors, sizes, and formats. Supports PNG output and mobile scanning."
        keywords="qr generator, qr code generator, custom qr code, qr png online"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Tool",
            name: "QR Code Generator",
            url: "https://stackconverter.com/qr",
            featureList: ["Generate QR Code", "Custom Colors", "PNG Output"],
          }),
        }}
      />

      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          QR Code Generator
        </h2>

        {/* Text Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text / URL
          </label>
          <input
            type="text"
            placeholder="Enter text or URL..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Grid Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size (px)
            </label>
            <input
              type="number"
              min="100"
              max="1000"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Dark Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foreground Color (HEX)
            </label>

            <div className="flex items-center gap-3">
              <input
                type="color"
                value={darkColor}
                onChange={(e) => setDarkColor(e.target.value)}
                className="w-12 h-12 rounded-lg border cursor-pointer"
              />
              <input
                type="text"
                value={darkColor}
                onChange={(e) => setDarkColor(e.target.value)}
                maxLength={7}
                className="border w-full p-2 rounded-lg bg-gray-50 
              focus:ring-2 focus:ring-blue-500"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Light Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color (HEX)
            </label>

            <div className="flex items-center gap-3">
              <input
                type="color"
                value={lightColor}
                onChange={(e) => setLightColor(e.target.value)}
                className="w-12 h-12 rounded-lg border cursor-pointer"
              />
              <input
                type="text"
                value={lightColor}
                onChange={(e) => setLightColor(e.target.value)}
                maxLength={7}
                className="border w-full p-2 rounded-lg bg-gray-50 
              focus:ring-2 focus:ring-blue-500"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateQr}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow 
        hover:bg-blue-700 transition-all"
        >
          Generate QR Code
        </button>

        {/* Error */}
        {error && (
          <p className="mt-4 text-red-600 font-semibold bg-red-50 border border-red-200 p-3 rounded-lg">
            {error}
          </p>
        )}

        {/* QR Preview */}
        {qrImage && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <img
              src={qrImage}
              alt="qr"
              className="rounded-xl shadow-lg border"
              style={{ width: `${size}px`, height: `${size}px` }}
            />

            <a
              href={qrImage}
              download="qrcode.png"
              className="px-6 py-2.5 bg-gray-900 text-white rounded-xl shadow 
            hover:bg-gray-800 transition-all"
            >
              Download PNG
            </a>
          </div>
        )}
      </div>
    </>
  );
}
