import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
import { AuthProvider } from "./context/AuthContext"; 
import ProtectedRoute from "./components/ProtectedRoute"; 
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 
import Notes from "./pages/Notes"; 
import Support from "./pages/Support"; 
import AITools from "./pages/AITools"; 
 
export default function App() { 
  return ( 
    <AuthProvider> 
      <BrowserRouter> 
        <Routes> 
          <Route path="/" element={<Navigate to="/notes" replace />} /> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} /> 
          <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} /> 
          <Route path="/ai" element={<ProtectedRoute><AITools /></ProtectedRoute>} /> 
          <Route path="/support" element={<Support />} /> 
        </Routes> 
      </BrowserRouter> 
    </AuthProvider> 
  ); 
} 