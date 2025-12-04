import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import CustomerLogin from "./pages/CustomerLogin.jsx";
import BankerLogin from "./pages/BankerLogin.jsx";
import Signup from "./pages/Signup.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import BankerDashboard from "./pages/BankerDashboard.jsx";

function Layout({ children }) {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Simple Banking System</h1>
        <nav>
          <Link to="/signup">Sign up</Link>
          <Link to="/login/customer">Customer Login</Link>
          <Link to="/login/banker">Banker Login</Link>
          <button onClick={logout}>Logout</button>
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const currentRole = localStorage.getItem("role");
  if (!token || (role && currentRole !== role)) {
    return <Navigate to={role === "BANKER" ? "/login/banker" : "/login/customer"} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login/customer" element={<CustomerLogin />} />
        <Route path="/login/banker" element={<BankerLogin />} />
        <Route
          path="/customer/transactions"
          element={
            <ProtectedRoute role="CUSTOMER">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/banker/accounts"
          element={
            <ProtectedRoute role="BANKER">
              <BankerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}


