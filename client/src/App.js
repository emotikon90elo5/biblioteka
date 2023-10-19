import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./conponents/components/Nav.js";
import Cookie from "./conponents/components/cookie";
function App() {
  return (
    <>
      <Cookie />
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Nav />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
