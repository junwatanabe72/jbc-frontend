import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/auth/LoginPage';
import OwnerDashboard from './pages/dashboard/OwnerDashboard';
import MgmtDashboard from './pages/dashboard/MgmtDashboard';
import TenantDashboard from './pages/dashboard/TenantDashboard';
import BrokerDashboard from './pages/dashboard/BrokerDashboard';
import CalendarPage from './pages/calendar/CalendarPage';
import BookingPage from './pages/booking/BookingPage';
import BookingManagementPage from './pages/booking/BookingManagementPage';
import RequestPage from './pages/request/RequestPage';
import RequestManagementPage from './pages/request/RequestManagementPage';
import BuildingManagementPage from './pages/building/BuildingManagementPage';
import BillingPage from './pages/billing/BillingPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import VacancyPage from './pages/vacancy/VacancyPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  const getDashboardComponent = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'OWNER':
        return <OwnerDashboard />;
      case 'MGMT':
        return <MgmtDashboard />;
      case 'TENANT':
        return <TenantDashboard />;
      case 'BROKER':
        return <BrokerDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              {getDashboardComponent()}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'MGMT', 'TENANT']}>
              <CalendarPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/bookings" 
          element={
            <ProtectedRoute allowedRoles={['TENANT']}>
              <BookingPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/booking-management" 
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'MGMT']}>
              <BookingManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/requests" 
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'MGMT']}>
              <RequestManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/apply" 
          element={
            <ProtectedRoute allowedRoles={['TENANT']}>
              <RequestPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/building-management" 
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'MGMT']}>
              <BuildingManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/billing" 
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'MGMT']}>
              <BillingPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'MGMT']}>
              <AnalyticsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vacancies" 
          element={
            <ProtectedRoute allowedRoles={['BROKER']}>
              <VacancyPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
