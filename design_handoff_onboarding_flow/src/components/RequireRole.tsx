import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoadingScreen() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100svh',
        background: 'var(--au-cream-deep)',
        color: 'var(--au-taupe)',
        font: '600 13px var(--au-font-text)',
      }}
    >
      Carregando…
    </div>
  );
}

/** Route guard: requires a signed-in session with a profile of the given role. */
export function RequireRole({ role, children }: { role: 'brand_admin' | 'ambassador'; children: ReactNode }) {
  const { session, profile, loading, profileLoaded } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!session) return <Navigate to="/login" replace />;
  if (!profileLoaded) return <LoadingScreen />;
  if (!profile) {
    // Signed in but onboarding was never finished (no brand/profile row yet).
    return <Navigate to="/onboarding/signup" replace />;
  }
  if (profile.role !== role) {
    return <Navigate to={profile.role === 'brand_admin' ? '/dashboard' : '/portal'} replace />;
  }
  return <>{children}</>;
}
