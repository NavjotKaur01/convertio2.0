import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Header from "./components/header";
import Footer from "./components/footer";
import ImageConverter from "./pages/converter";
import Download from "./pages/download";
import { Helmet } from "react-helmet";
const RouteSpecificMeta = ({ title, description, children }: any) => (
  <>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
    {children}
  </>
);

function App() {
  return (
    <>
      <div className="flex min-h-screen flex-col justify-between">
        <div>
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <RouteSpecificMeta title="Home" description="Learn more home.">
                  <Home />
                </RouteSpecificMeta>
              }
            />
            <Route path="/:converterType" element={<ImageConverter />} />
            <Route path="/:converterType/download" element={<Download />} />
            <Route path="/download" element={<Download />} />
            <Route path={"/:pageName/download"} element={<Download />} />
            <Route path={"/:search"} element={<ImageConverter />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default App;
