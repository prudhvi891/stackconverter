import { useEffect } from "react";

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  children?: React.ReactNode;
}

export default function Seo({ title, description, keywords, children }: SeoProps) {
  useEffect(() => {
    // Title
    if (title) {
      document.title = title;
    }

    // Description
    if (description) {
      let meta = document.querySelector("meta[name='description']");
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }

    // Keywords
    if (keywords) {
      let meta = document.querySelector("meta[name='keywords']");
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "keywords");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", keywords);
    }
  }, [title, description, keywords]);

  return <>{children}</>;
}
