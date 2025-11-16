import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import AddItems from "./components/AddItems";
import List from "./components/List";
import Order from "./components/Order";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<AddItems />} />
        <Route path="/list" element={<List />} />
        <Route path="/orders" element={<Order />} />
      </Routes>
    </>
  );
}

export default App;
