export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 px-6 py-6 text-sm text-gray-500">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h3 className="text-base font-semibold text-gray-800">
            Stack Converter
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            A simple toolkit for everyday developer tasks.
          </p>
        </div>

        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Stack Converter. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
