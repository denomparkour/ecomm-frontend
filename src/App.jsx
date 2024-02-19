import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  Link,
  useParams,
} from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Product from "./pages/Product";
import NotFound from "./pages/404";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Categories />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products/:category/:page" element={<Products />} />
          <Route path="/products/:page" element={<Products />} />
          <Route path="/products" element={<Products />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
