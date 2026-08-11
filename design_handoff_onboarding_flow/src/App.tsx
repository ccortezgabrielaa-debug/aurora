import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OnboardingProvider } from './context/OnboardingContext';
import { ContentQueueProvider } from './context/ContentQueueContext';
import { CreditProvider } from './context/CreditContext';
import { RequireRole } from './components/RequireRole';
import { LoginPage } from './pages/LoginPage';
import { OnboardingSignupPage } from './pages/OnboardingSignupPage';
import { OnboardingWorkspacePage } from './pages/OnboardingWorkspacePage';
import { OnboardingDonePage } from './pages/OnboardingDonePage';
import { DashboardPage } from './pages/DashboardPage';
import { EmbaixadorasListPage } from './pages/EmbaixadorasListPage';
import { EmbaixadorasProfilePage } from './pages/EmbaixadorasProfilePage';
import { EmbaixadoraNewPage } from './pages/EmbaixadoraNewPage';
import { CuponsVendasPage } from './pages/CuponsVendasPage';
import { NovaVendaPage } from './pages/NovaVendaPage';
import { ConteudoQueuePage } from './pages/ConteudoQueuePage';
import { ConteudoReviewPage } from './pages/ConteudoReviewPage';
import { CreditoOverviewPage } from './pages/CreditoOverviewPage';
import { CreditoDetailPage } from './pages/CreditoDetailPage';
import { RegrasPage } from './pages/RegrasPage';
import { SocialListeningFeedPage } from './pages/SocialListeningFeedPage';
import { SocialListeningDetailPage } from './pages/SocialListeningDetailPage';
import { PortalHomePage } from './pages/PortalHomePage';
import { PortalVendasPage } from './pages/PortalVendasPage';
import { PortalConteudoPage } from './pages/PortalConteudoPage';
import { PortalCreditoPage } from './pages/PortalCreditoPage';
import { LandingInscricaoPage } from './pages/LandingInscricaoPage';

function BrandAdminArea() {
  return (
    <RequireRole role="brand_admin">
      <Outlet />
    </RequireRole>
  );
}

function AmbassadorArea() {
  return (
    <RequireRole role="ambassador">
      <Outlet />
    </RequireRole>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OnboardingProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboarding" element={<Navigate to="/onboarding/signup" replace />} />
            <Route path="/onboarding/signup" element={<OnboardingSignupPage />} />
            <Route path="/onboarding/workspace" element={<OnboardingWorkspacePage />} />
            <Route path="/onboarding/done" element={<OnboardingDonePage />} />

            <Route element={<BrandAdminArea />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/embaixadoras" element={<EmbaixadorasListPage />} />
              <Route path="/embaixadoras/nova" element={<EmbaixadoraNewPage />} />
              <Route path="/embaixadoras/:id" element={<EmbaixadorasProfilePage />} />
              <Route path="/cupons-e-vendas" element={<CuponsVendasPage />} />
              <Route path="/cupons-e-vendas/nova" element={<NovaVendaPage />} />
              <Route element={<ContentQueueProvider><Outlet /></ContentQueueProvider>}>
                <Route path="/conteudo" element={<ConteudoQueuePage />} />
                <Route path="/conteudo/:idx" element={<ConteudoReviewPage />} />
              </Route>
              <Route element={<CreditProvider><Outlet /></CreditProvider>}>
                <Route path="/credito" element={<CreditoOverviewPage />} />
                <Route path="/credito/:idx" element={<CreditoDetailPage />} />
              </Route>
              <Route path="/regras" element={<RegrasPage />} />
              <Route path="/social-listening" element={<SocialListeningFeedPage />} />
              <Route path="/social-listening/:idx" element={<SocialListeningDetailPage />} />
            </Route>

            <Route element={<AmbassadorArea />}>
              <Route path="/portal" element={<PortalHomePage />} />
              <Route path="/portal/vendas" element={<PortalVendasPage />} />
              <Route path="/portal/conteudo" element={<PortalConteudoPage />} />
              <Route path="/portal/credito" element={<PortalCreditoPage />} />
            </Route>

            <Route path="/inscricao" element={<LandingInscricaoPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </OnboardingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
