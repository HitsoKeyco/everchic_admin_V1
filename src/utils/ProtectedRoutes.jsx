import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../page/HomePage";
import ContactPage from "../page/ContactPage";
import FinancePage from "../page/FinancePage";
import InventoryPage from "../page/InventoryPage";
import ProfilePage from "../page/ProfilePage";
import OrderPage from "../page/OrderPage";
import ConfigPage from "../page/ConfigPage";
import AddProductPage from "../page/AddProductPage";
import EditProductPage from "../page/EditProductPage";

const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/contacts" element={<ContactPage />} />
      <Route path="/orders" element={<OrderPage />} />
      <Route path="/finance" element={<FinancePage />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/add_product" element={<AddProductPage />} />
      <Route path="/edit_product/:id" element={<EditProductPage />} />      
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/config" element={<ConfigPage />} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes >
  )
}


export default ProtectedRoutes;
