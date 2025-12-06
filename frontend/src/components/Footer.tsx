export default function Footer() {
  return (
    <footer className="w-full bg-white border-t py-6">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        
        <div className="text-center md:text-left">
          <h3 className="text-base font-semibold text-gray-800">Stack Converter</h3>
          <p className="text-gray-500 text-sm mt-1">
            A simple toolkit for everyday developer tasks.
          </p>
        </div>

        <p className="text-gray-400 text-sm mt-4 md:mt-0">
          © {new Date().getFullYear()} Stack Converter. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
