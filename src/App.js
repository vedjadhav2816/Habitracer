import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Upgrade from "./pages/Upgrade";
import PaymentSuccess from "./pages/PaymentSuccess";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
          <Route path="/analytics" element={<Analytics />} />
        <Route path="/upgrade" element={<Upgrade />} />
        <Route path="/payment-success" element={<PaymentSuccess />} /> 
      </Routes>
    </Router>
  );
}

export default App;