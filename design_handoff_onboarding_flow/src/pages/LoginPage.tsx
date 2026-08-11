import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { AuroraMark } from '../components/AuroraMark';
import { SegmentedControl } from '../components/SegmentedControl';
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
  const copy = ROLE_COPY[role];
  const isMarca = role === 'marca';

  return (
    <Screen>
      <div className={styles.hero}>
        <img
          className={styles.heroImg}
          src="/hero-embaixadoras.jpg"
          alt="Embaixadoras aurora sorrindo com pele radiante"
        />
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

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            navigate(isMarca ? '/dashboard' : '/portal');
          }}
        >
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
          <button
            type="submit"
            className={styles.primaryBtn}
            style={{
              color: isMarca ? '#fff' : 'var(--au-ink)',
              background: isMarca ? 'var(--au-ink)' : 'var(--au-rose)',
            }}
          >
            Entrar como {copy.roleShort}
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
