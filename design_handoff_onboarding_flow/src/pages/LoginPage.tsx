import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { AuroraMark } from '../components/AuroraMark';
import { SegmentedControl } from '../components/SegmentedControl';
import { supabase } from '../lib/supabase';
import styles from './LoginPage.module.css';

type Role = 'marca' | 'embaixadora';

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'marca', label: 'Marca' },
  { value: 'embaixadora', label: 'Embaixadora' },
];

const ROLE_COPY: Record<
  Role,
  { tagline: string; roleShort: string; blurb: string; emailPh: string }
> = {
  marca: {
    tagline: 'painel da marca',
    roleShort: 'marca',
    blurb: 'Acesse o workspace da sua marca para gerenciar embaixadoras, cupons, crédito e conteúdo.',
    emailPh: 'voce@suamarca.com',
  },
  embaixadora: {
    tagline: 'portal da embaixadora',
    roleShort: 'embaixadora',
    blurb: 'Entre para ver seu cupom, vendas atribuídas, conteúdo, saldo de crédito e nível.',
    emailPh: 'seu@email.com',
  },
};

export function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('marca');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copy = ROLE_COPY[role];
  const isMarca = role === 'marca';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });
    if (signInError || !data.user) {
      setSubmitting(false);
      setError('E-mail ou senha incorretos.');
      return;
    }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
    setSubmitting(false);
    if (!profile) {
      setError('Conta sem workspace vinculado ainda — finalize o onboarding.');
      return;
    }
    navigate(profile.role === 'ambassador' ? '/portal' : '/dashboard');
  }

  return (
    <Screen>
      <div className={styles.hero}>
        <div className={styles.heroScrim} />
        <div className={styles.heroContent}>
          <div className={styles.wordmarkRow}>
            <AuroraMark size={26} color="#f4c3cc" />
            <div className={styles.wordmark}>
              aurora<span>.</span>
            </div>
          </div>
          <div className={styles.tagline}>{copy.tagline}</div>
        </div>
      </div>

      <div className={styles.sheet}>
        <SegmentedControl
          ariaLabel="Tipo de conta"
          options={ROLE_OPTIONS}
          value={role}
          onChange={(v) => {
            setRole(v);
            setEmail('');
            setPass('');
          }}
        />

        <p className={styles.blurb}>{copy.blurb}</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="email"
            placeholder={copy.emailPh}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Senha"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoComplete="current-password"
          />
          {error && (
            <span style={{ font: '600 12px var(--au-font-text)', color: '#c96a5e' }}>{error}</span>
          )}
          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={submitting}
            style={{
              color: isMarca ? '#fff' : 'var(--au-ink)',
              background: isMarca ? 'var(--au-ink)' : 'var(--au-rose)',
            }}
          >
            {submitting ? 'Entrando…' : `Entrar como ${copy.roleShort}`}
          </button>
          <button type="button" className={styles.googleBtn}>
            <span className={styles.googleG}>G</span> Continuar com Google
          </button>
        </form>

        <div className={styles.spacer} />

        <div className={styles.footer}>
          {isMarca ? (
            <>
              Nova por aqui? <Link to="/onboarding/signup">Criar workspace</Link>
            </>
          ) : (
            <>
              Recebeu um convite? <Link to="/inscricao">Inscreva-se</Link>
            </>
          )}
        </div>
      </div>
    </Screen>
  );
}
