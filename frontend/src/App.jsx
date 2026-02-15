import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleBaseRoutes from './utils/RoleBaseRoutes';
import Unauthorized from './pages/Unauthorized';
import Profile from './pages/Profile';
import Leaves from './pages/Leaves';
import Payroll from './pages/Payroll';
import Salary from './pages/Salary';
import Settings from './pages/Settings';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="bg-mesh-container">
          <div className="bg-mesh"></div>
          <div className="bg-grid"></div>
          <div className="bg-noise"></div>
        </div>
        <Routes>
          <Route path="/" element={<Navigate to="/admin-dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/admin-dashboard" element={
            <RoleBaseRoutes requiredRole={["admin"]}>
              <AdminDashboard />
            </RoleBaseRoutes>
          } />
          <Route path="/employee-dashboard" element={
            <RoleBaseRoutes requiredRole={["admin", "employee"]}>
              <EmployeeDashboard />
            </RoleBaseRoutes>
          } />
          <Route path="/profile" element={
            <RoleBaseRoutes requiredRole={["admin", "employee"]}>
              <Profile />
            </RoleBaseRoutes>
          } />
          <Route path="/leaves" element={
            <RoleBaseRoutes requiredRole={["admin", "employee"]}>
              <Leaves />
            </RoleBaseRoutes>
          } />
          <Route path="/payroll" element={
            <RoleBaseRoutes requiredRole={["admin"]}>
              <Payroll />
            </RoleBaseRoutes>
          } />
          <Route path="/salary" element={
            <RoleBaseRoutes requiredRole={["admin", "employee"]}>
              <Salary />
            </RoleBaseRoutes>
          } />
          <Route path="/settings" element={
            <RoleBaseRoutes requiredRole={["admin", "employee", "hr"]}>
              <Settings />
            </RoleBaseRoutes>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
