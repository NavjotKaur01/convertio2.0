import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import "tw-elements-react/dist/css/tw-elements-react.min.css";
import Header from "./components/header";
import Footer from "./components/footer";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
