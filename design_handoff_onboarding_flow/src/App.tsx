import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { OnboardingProvider } from './context/OnboardingContext';
import { LoginPage } from './pages/LoginPage';
import { OnboardingSignupPage } from './pages/OnboardingSignupPage';
import { OnboardingWorkspacePage } from './pages/OnboardingWorkspacePage';
import { OnboardingDonePage } from './pages/OnboardingDonePage';
import { DashboardPage } from './pages/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <OnboardingProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<Navigate to="/onboarding/signup" replace />} />
          <Route path="/onboarding/signup" element={<OnboardingSignupPage />} />
          <Route path="/onboarding/workspace" element={<OnboardingWorkspacePage />} />
          <Route path="/onboarding/done" element={<OnboardingDonePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </OnboardingProvider>
    </BrowserRouter>
  );
}
