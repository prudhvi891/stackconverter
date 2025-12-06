import { createBrowserRouter } from "react-router-dom";
import SidebarLayout from "./layouts/SidebarLayout";
import Base64 from "./pages/Base64";
import UrlTool from "./pages/UrlTool";
import QrTool from "./pages/QrTool";
import Home from "./pages/Home";
import HashTool from "./pages/HashTool";
import TimestampTool from "./pages/TimestampTool";
import ExcelCsvTool from "./pages/ExcelCsvTool";
import Base64FileTool from "./pages/Base64FileTool";
import About from "./pages/About";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SidebarLayout />,
    children: [
      { path: "", element: <Home /> },         // 👈 Home Page
      { path: "base64", element: <Base64 /> },
      { path: "url", element: <UrlTool /> },
      { path: "qr", element: <QrTool /> },
      { path: "hash", element: <HashTool /> },
      { path: "timestamp", element: <TimestampTool /> },
      { path: "excel-csv", element: <ExcelCsvTool /> },
      { path: "base64-file", element: <Base64FileTool /> },
      { path: "/about", element: <About /> }
    ],
  },
]);

export default router;
