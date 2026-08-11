import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { StepDots } from '../components/StepDots';
import { useOnboarding } from '../context/OnboardingContext';
import styles from './OnboardingStep.module.css';

export function OnboardingSignupPage() {
  const navigate = useNavigate();
  const { state, setName, setEmail, setPass } = useOnboarding();
  const [showErrors, setShowErrors] = useState(false);

  const nameOk = state.name.trim().length > 0;
  const passOk = state.pass.length >= 6;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (nameOk && passOk) {
      navigate('/onboarding/workspace');
    } else {
      setShowErrors(true);
    }
  }

  return (
    <Screen>
      <form className={styles.step} onSubmit={handleSubmit} noValidate>
        <div className={styles.topRow}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate('/login')}
            aria-label="Voltar para o login"
          >
            ‹
          </button>
          <StepDots total={2} current={1} />
          <div className={styles.backBtnSpacer} />
        </div>

        <div className={styles.header}>
          <div className={styles.kicker}>Passo 1 de 2</div>
          <h1 className={styles.title}>Crie sua conta</h1>
          <p className={styles.subtitle}>Só o essencial para começar. Leva um minuto.</p>
        </div>

        <div className={styles.fields}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Seu nome</span>
            <input
              className={styles.input}
              data-invalid={showErrors && !nameOk}
              placeholder="Ex: Marina Duarte"
              value={state.name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>E-mail</span>
            <input
              className={styles.input}
              type="email"
              placeholder="voce@marca.com"
              value={state.email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Senha</span>
            <input
              className={styles.input}
              data-invalid={showErrors && !passOk}
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={state.pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="new-password"
            />
            {showErrors && !passOk && (
              <span className={styles.fieldError}>A senha precisa de pelo menos 6 caracteres.</span>
            )}
          </label>
        </div>

        <div className={styles.spacer} />

        <button type="submit" className={styles.primaryBtn}>
          Continuar
        </button>
      </form>
    </Screen>
  );
}
