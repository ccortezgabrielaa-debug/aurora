import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { BackHeader } from '../components/BackHeader';
import { createAmbassadorAccount } from '../lib/functions';
import styles from './EmbaixadoraNewPage.module.css';

const LEVELS: { value: 'nano' | 'micro' | 'macro'; label: string }[] = [
  { value: 'nano', label: 'Nano' },
  { value: 'micro', label: 'Micro' },
  { value: 'macro', label: 'Macro' },
];

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function EmbaixadoraNewPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [level, setLevel] = useState<'nano' | 'micro' | 'macro'>('nano');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ email: string; password: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Preencha nome e e-mail.');
      return;
    }
    setError(null);
    setSubmitting(true);
    const password = generatePassword();
    const result = await createAmbassadorAccount({
      name: name.trim(),
      handle: handle.trim() || undefined,
      level,
      email: email.trim(),
      password,
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDone({ email: result.email, password });
  }

  if (done) {
    return (
      <Screen>
        <BackHeader onBack={() => navigate('/embaixadoras')} title="Embaixadora criada" />
        <div className={styles.body}>
          <div className={styles.doneWrap}>
            <div className={styles.doneTitle}>✓ {name} agora tem acesso ao portal</div>
            <div className={styles.doneCard}>
              <div className={styles.doneLabel}>E-mail de login</div>
              <div className={styles.doneValue}>{done.email}</div>
            </div>
            <div className={styles.doneCard}>
              <div className={styles.doneLabel}>Senha temporária</div>
              <div className={styles.doneValue}>{done.password}</div>
            </div>
            <p style={{ font: '500 12.5px var(--au-font-text)', color: 'var(--au-taupe-soft)', marginTop: 14 }}>
              Compartilhe essas credenciais com a embaixadora — ela pode entrar pelo login escolhendo
              "Embaixadora".
            </p>
          </div>
        </div>
        <div className={styles.footer}>
          <button type="button" className={styles.submitBtn} onClick={() => navigate('/embaixadoras')}>
            Concluir
          </button>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <BackHeader onBack={() => navigate(-1)} title="Nova embaixadora" />
      <form className={styles.body} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="nea-name">
            Nome
          </label>
          <input id="nea-name" className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Marina Duarte" />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="nea-handle">
            @ do Instagram
          </label>
          <input id="nea-handle" className={styles.input} value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@marinaduarte" />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="nea-email">
            E-mail
          </label>
          <input
            id="nea-email"
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="marina@email.com"
          />
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Tier</span>
          <div className={styles.levelRow}>
            {LEVELS.map((l) => (
              <button
                key={l.value}
                type="button"
                className={styles.levelChip}
                data-active={l.value === level || undefined}
                onClick={() => setLevel(l.value)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submitBtn} disabled={submitting}>
          {submitting ? 'Criando…' : 'Criar embaixadora'}
        </button>
      </form>
    </Screen>
  );
}
