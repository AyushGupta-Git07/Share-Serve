import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { DonationDetailModal } from './components/DonationDetailModal';
import { Home } from './pages/Home';
import { CreateDonation } from './pages/CreateDonation';
import { BrowseDonations } from './pages/BrowseDonations';
import { DiscoverNGOs } from './pages/DiscoverNGOs';
import { DonorDashboard } from './pages/DonorDashboard';
import { NGODashboard } from './pages/NGODashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { SignIn } from './pages/SignIn';

export function App() {
  return (
    <Router>
      <AppProvider>
        <div className="min-h-screen flex flex-col bg-cream text-charcoal">
          {/* Main Navigation */}
          <Navbar />

          {/* Routed Views */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/donate" element={<CreateDonation />} />
              <Route path="/donations" element={<BrowseDonations />} />
              <Route path="/ngos" element={<DiscoverNGOs />} />
              <Route path="/dashboard" element={<DonorDashboard />} />
              <Route path="/ngo-dashboard" element={<NGODashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Modals & Notifications */}
          <DonationDetailModal />
          <Toast />

          {/* Footer */}
          <Footer />
        </div>
      </AppProvider>
    </Router>
  );
}

export default App;
