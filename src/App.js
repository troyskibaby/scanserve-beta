import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';  
import SignUpWizard from './components/SignUp';
import VerificationMessage from './components/VerificationMessage';
import VerifyEmail from './components/VerifyEmail';
import Login from "./components/login";
import "@fontsource/ubuntu";
import ForgotPassword from "./components/ForgotPassword"; 
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/dashboard";
import RegistrationResult from './components/RegistrationResult';
import RegisterBoiler from "./components/registerBoiler";
import BoilerLinkConfirmation from './components/BoilerLinkConfirmation';
import BoilerDashboard from './components/boilerDashboard';
import NewRoutineService from "./components/NewRoutineServcie";
import NewMaintenanceLog from "./components/NewMaintenanceLog";
import ViewBoilerDetails from './components/ViewBoilerDetails';
import AllBoilers from './components/AllBoilers.js';
import AllServiceActivity from './components/AllServiceActivity.js';
import RoutineServiceDetails from "./components/RoutineServiceDetails";
import MaintenanceLogDetails from './components/MaintenanceLogDetails.js';
import { AuthProvider } from "./components/AuthContext";
import QrLandingPage from './components/QRLandingPage.js';
import LogActivity from './components/LogActivity';
import GasSafetyReportWizard from './components/GasSafteyReportWizard';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/signup" element={<SignUpWizard />} />
            <Route path="/verifyemail" element={<VerificationMessage />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/registerBoiler/:qrCode" element={<RegisterBoiler />} />
            <Route path="/registerBoiler" element={<RegisterBoiler />} />
            <Route path="/registration-result" element={<RegistrationResult />} />
            <Route path="/boiler-link-confirmation" element={<BoilerLinkConfirmation />} />
            <Route path="/boilerDashboard/:qrCode" element={<BoilerDashboard />} />
            <Route path="/NewRoutineService" element={<NewRoutineService />} />
            <Route path="/newMaintenanceLog" element={<NewMaintenanceLog />} />
            <Route path="/ViewBoilerDetails/:qrCode" element={<ViewBoilerDetails />} />
            <Route path="/allBoilers" element={<AllBoilers />} />
            <Route path="/allServiceActivity/:qrCode" element={<AllServiceActivity />} />
            <Route path="/routineServiceDetails/:recordID" element={<RoutineServiceDetails />} />
            <Route path="/maintenanceLogDetails/:maintenanceID" element={<MaintenanceLogDetails />} />
            <Route path="/qr/:qrCode" element={<QrLandingPage />} />

            {/* ✅ Log options for boiler */}
            <Route path="/log-activity" element={<LogActivity />} />
            <Route path="/gas-safety-report" element={<GasSafetyReportWizard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
