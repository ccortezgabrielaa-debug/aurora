import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { useOnboarding } from '../context/OnboardingContext';
import styles from './OnboardingDonePage.module.css';

export function OnboardingDonePage() {
  const navigate = useNavigate();
  const { state, reset } = useOnboarding();

  const firstName = state.name.trim().split(' ')[0] || 'tudo';
  const brandInitial = (state.brand.trim()[0] || 'A').toUpperCase();

  return (
    <Screen>
      <div className={styles.step}>
        <div className={styles.intro}>
          <div className={styles.checkCircle} aria-hidden="true">
            ✓
          </div>
          <h1 className={styles.title}>Tudo pronto, {firstName}!</h1>
          <p className={styles.subtitle}>
            Seu workspace está no ar. É por aqui que você acompanha suas embaixadoras.
          </p>
        </div>

        <div className={styles.workspaceCard}>
          <div className={styles.workspaceLogoSquare} style={{ background: state.color }}>
            {state.logoUrl ? (
              <img src={state.logoUrl} alt="" className={styles.workspaceLogoImg} />
            ) : (
              brandInitial
            )}
          </div>
          <div>
            <div className={styles.workspaceName}>{state.brand}</div>
            <div className={styles.workspaceStatus}>Workspace ativo</div>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>0</div>
            <div className={styles.statLabel}>Embaixadoras</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>R$ 0</div>
            <div className={styles.statLabel}>GMV via cupom</div>
          </div>
        </div>

        <div className={styles.spacer} />

        <button type="button" className={styles.primaryBtn} onClick={() => navigate('/dashboard')}>
          Ir para o painel
        </button>
        <div className={styles.restartLink}>
          <button
            type="button"
            onClick={() => {
              reset();
              navigate('/onboarding/signup');
            }}
          >
            Rever o fluxo
          </button>
        </div>
      </div>
    </Screen>
  );
}
