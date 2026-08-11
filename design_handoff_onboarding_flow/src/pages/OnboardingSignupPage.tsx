import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { StepDots } from '../components/StepDots';
import { useOnboarding } from '../context/OnboardingContext';
import { supabase } from '../lib/supabase';
import styles from './OnboardingStep.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function friendlyAuthError(message: string): string {
  if (message.toLowerCase().includes('already registered')) return 'Este e-mail já está cadastrado. Tente entrar.';
  if (message.toLowerCase().includes('password')) return 'Senha inválida — use pelo menos 6 caracteres.';
  return 'Não foi possível criar a conta: ' + message;
}

export function OnboardingSignupPage() {
  const navigate = useNavigate();
  const { state, setName, setEmail, setPass } = useOnboarding();
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const nameOk = state.name.trim().length > 0;
  const emailOk = EMAIL_RE.test(state.email.trim());
  const passOk = state.pass.length >= 6;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!(nameOk && emailOk && passOk)) {
      setShowErrors(true);
      return;
    }
    setAuthError(null);
    setNeedsConfirmation(false);
    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email: state.email.trim(),
      password: state.pass,
      options: { data: { full_name: state.name.trim() } },
    });
    setSubmitting(false);
    if (error) {
      setAuthError(friendlyAuthError(error.message));
      return;
    }
    if (!data.session) {
      setNeedsConfirmation(true);
      return;
    }
    navigate('/onboarding/workspace');
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
              data-invalid={showErrors && !emailOk}
              type="email"
              placeholder="voce@marca.com"
              value={state.email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {showErrors && !emailOk && <span className={styles.fieldError}>Informe um e-mail válido.</span>}
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

        {authError && <p className={styles.fieldError}>{authError}</p>}
        {needsConfirmation && (
          <p style={{ font: '600 12px var(--au-font-text)', color: 'var(--au-success)', marginTop: 12 }}>
            Conta criada! Confirme seu e-mail ({state.email.trim()}) e depois entre pelo login para continuar o
            workspace.
          </p>
        )}

        <div className={styles.spacer} />

        <button type="submit" className={styles.primaryBtn} disabled={submitting}>
          {submitting ? 'Criando conta…' : 'Continuar'}
        </button>
      </form>
    </Screen>
  );
}
