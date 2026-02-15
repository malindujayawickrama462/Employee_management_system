/**
 * App.jsx - Main Application Entry Point
 * 
 * This file sets up the routing architecture, global providers, and 
 * identity-based access control (RBAC) via RoleBaseRoutes.
 */

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

/**
 * PrivateRoute Component
 * Simple wrapper to ensure a user is authenticated before accessing a page.
 */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Authority...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider handles logic for login, session persistence, and logout */}
      <AuthProvider>
        {/* Global Premium Background System */}
        <div className="bg-mesh-container">
          <div className="bg-mesh"></div>
          <div className="bg-grid"></div>
          <div className="bg-noise"></div>
        </div>

        {/* Route Definitions with Role-Based Access Control */}
        <Routes>
          {/* Default Redirect to Dashboard */}
          <Route path="/" element={<Navigate to="/admin-dashboard" />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes - Authorized by role */}
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
