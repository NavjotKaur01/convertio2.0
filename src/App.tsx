import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Header from "./components/header";
import Footer from "./components/footer";
import ImageConverter from "./pages/converter";
import Download from "./pages/download";

function App() {
  return (
    <>
      <div className="flex min-h-screen flex-col justify-between">
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/image-converter" element={<ImageConverter />} />
            <Route path="/heif-jpg-converter" element={<ImageConverter />} />
            <Route path="/heif-converter" element={<ImageConverter />} />
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
