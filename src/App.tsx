import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Header from "./components/header";
import Footer from "./components/footer";
import ImageConverter from "./pages/imageConverter";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image-converter" element={<ImageConverter />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
