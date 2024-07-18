import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Header from "./components/header";
import Footer from "./components/footer";

function App() {
  const [count, setCount] = useState(0);

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
