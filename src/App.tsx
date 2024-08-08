import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Header from "./components/header";
import Footer from "./components/footer";
import ImageConverter from "./pages/converter";
import Download from "./pages/download";
import { Helmet } from "react-helmet";

// Centralized meta information
const getMetaInfo = (pathname: any) => {
  switch (pathname) {
    case "/heif-converter":
      return {
        title: "Heif Converter",
        description: "Learn more Heif Converter",
      };
    case "/heif-jpg-converter":
      return {
        title: "Heif Jpg Converter",
        description: "Learn more Heif Jpg Converter",
      };
    case "/image-converter":
      return {
        title: "Image Converter",
        description: "Learn more Image Converter",
      };
    default:
      return {
        title: "Home",
        description: "Learn more Home",
      };
  }
};

const RouteSpecificMeta = ({ children }: any) => {
  const location = useLocation();
  const { title, description } = getMetaInfo(location.pathname);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      {children}
    </>
  );
};

function App() {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <RouteSpecificMeta>
              <Home />
            </RouteSpecificMeta>
          }
        />
        <Route
          path="/:converterType"
          element={
            <RouteSpecificMeta>
              <ImageConverter />
            </RouteSpecificMeta>
          }
        />
        <Route
          path="/:converterType/download"
          element={
            <RouteSpecificMeta>
              <Download />
            </RouteSpecificMeta>
          }
        />
        <Route
          path="/download"
          element={
            <RouteSpecificMeta>
              <Download />
            </RouteSpecificMeta>
          }
        />
        <Route
          path="/:pageName/download"
          element={
            <RouteSpecificMeta>
              <Download />
            </RouteSpecificMeta>
          }
        />
        <Route
          path="/:search"
          element={
            <RouteSpecificMeta>
              <ImageConverter />
            </RouteSpecificMeta>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
