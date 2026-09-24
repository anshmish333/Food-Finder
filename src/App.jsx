import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"

import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Shops from "./pages/Shops"
import ShopDetails from "./pages/ShopDetails"
import MapView from "./pages/MapView"
import AddShop from "./pages/AddShop"
import Profile from "./pages/Profile"
import BudgetFinder from "./pages/BudgetFinder"
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/shop" element={<ShopDetails />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/add-shop" element={<AddShop />} />
        <Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
        <Route path="/budget" element={<BudgetFinder />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App