import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import Catalog from './pages/Catalog';
import LibrarianDashboard from './pages/LibrarianDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Route guards
const ProtectedRoute: React.FC<{ children: React.ReactNode, allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-bold text-sm">Authenticating session parameters...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect unauthorized roles back to general student dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected General routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['Student', 'Librarian', 'Admin']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/catalog" element={
            <ProtectedRoute allowedRoles={['Student', 'Librarian', 'Admin']}>
              <Catalog />
            </ProtectedRoute>
          } />

          {/* Librarian dashboard */}
          <Route path="/librarian" element={
            <ProtectedRoute allowedRoles={['Librarian', 'Admin']}>
              <LibrarianDashboard />
            </ProtectedRoute>
          } />

          {/* Admin analytics */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
