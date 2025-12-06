import Seo from "../components/Seo";

export default function About() {
  return (
    <>
      <Seo
        title="About Stack Converter — Developer Utility Platform"
        description="Learn about Stack Converter — a simple, fast, and reliable utility platform built for developers to convert Base64, CSV, QR, Hash, URLs, and timestamps."
        keywords="about stack converter, developer tools, conversion tools"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Stack Converter",
            url: "https://stackconverter.com/about",
            author: {
              "@type": "Person",
              name: "Prudhvi Poluri",
              sameAs: [
                "https://www.linkedin.com/in/prudhvipoluri/", // your LinkedIn
              ],
            },
          }),
        }}
      />

      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          About Stack Converter
        </h1>

        <p className="text-gray-600 leading-relaxed mb-6">
          Stack Converter is a collection of simple, fast, and reliable
          developer tools — all in one place. It was built with the goal of
          making everyday development tasks easier, whether you're converting
          Base64, generating hashes, transforming timestamps, converting files,
          or working with documents.
        </p>

        <div className="bg-white border rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Built & Maintained By
          </h2>

          <p className="text-gray-700 mb-4">
            Hi! I’m <span className="font-semibold">Prudhvi Poluri</span>, a
            software developer passionate about building practical tools that
            help other developers work faster and smarter.
          </p>

          <a
            href="https://www.linkedin.com/in/prudhvi89/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Connect with me on LinkedIn →
          </a>
        </div>

        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Why Stack Converter?
        </h2>

        <p className="text-gray-600 leading-relaxed">
          Over time, developers rely on many small utilities from different
          websites. Stack Converter puts all essential tools together in one
          clean, fast, and reliable interface — with more tools continuously
          being added.
        </p>
      </div>
    </>
  );
}
