import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./features/auth/login";
import Register from "./features/auth/register";
import Home from "./components/features/home";
import Cart from "./components/features/cart";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
