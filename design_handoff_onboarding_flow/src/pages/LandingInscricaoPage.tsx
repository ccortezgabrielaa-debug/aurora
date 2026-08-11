import { useState } from 'react';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import styles from './LandingInscricaoPage.module.css';

const BRAND = 'niya';
const HANDLE = '@niyaswim';
const ACCENT = 'var(--au-rose)';

const BENEFITS = [
  { icon: '✦', title: 'Cupom exclusivo', text: 'Um código só seu para dividir com a audiência e acompanhar cada venda em tempo real.' },
  { icon: '◈', title: 'Crédito em peças', text: 'A cada venda e conteúdo aprovado você acumula crédito para resgatar em produtos Niya.' },
  { icon: '★', title: 'Níveis que evoluem', text: 'De Base a Top: quanto mais consistente, maior a sua porcentagem e seus benefícios.' },
];

const STEPS = [
  { n: '1', title: 'Inscreva-se', text: 'Preencha o formulário com seu @ e o tamanho da sua audiência.' },
  { n: '2', title: 'Seja aprovada', text: 'Analisamos o fit do seu perfil com a marca e liberamos seu acesso.' },
  { n: '3', title: 'Poste e ganhe', text: `Use seu cupom, marque ${HANDLE} e veja o crédito entrar sozinho.` },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LandingInscricaoPage() {
  const [nome, setNome] = useState('');
  const [handle, setHandle] = useState('');
  const [seg, setSeg] = useState('');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);
  const [doneName, setDoneName] = useState('');

  const nomeOk = nome.trim().length >= 2;
  const handleOk = handle.trim().replace('@', '').length >= 2;
  const segOk = /\d{2,}/.test(seg.trim());
  const emailOk = emailRegex.test(email.trim());
  const allOk = nomeOk && handleOk && segOk && emailOk;

  function submit() {
    if (!allOk) {
      setTouched(true);
      return;
    }
    setDone(true);
    setDoneName(nome.trim().split(' ')[0]);
  }

  const fields = [
    { key: 'nome', label: 'Nome completo', ph: 'Seu nome', value: nome, set: setNome, ok: nomeOk, err: 'Informe seu nome.' },
    { key: 'handle', label: '@ do Instagram/TikTok', ph: '@seuperfil', value: handle, set: setHandle, ok: handleOk, err: 'Informe seu @.' },
    { key: 'seg', label: 'Nº de seguidores', ph: 'ex: 24000', value: seg, set: setSeg, ok: segOk, err: 'Informe um número válido.' },
    { key: 'email', label: 'E-mail', ph: 'voce@email.com', value: email, set: setEmail, ok: emailOk, err: 'E-mail inválido.' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <div className={styles.brand}>{BRAND}</div>
          <a href="#form" className={styles.navCta}>
            Quero me inscrever
          </a>
        </nav>

        <div className={styles.hero}>
          <div>
            <div className={styles.kicker}>Programa de embaixadoras</div>
            <h1 className={styles.heroTitle}>E se o seu próximo Niya fosse por nossa conta?</h1>
            <p className={styles.heroText}>
              Compartilhe a marca, gere vendas e acumule créditos para trocar pelas peças que você quer. Quanto mais
              você movimenta, mais você desbloqueia.
            </p>
            <div className={styles.heroCtas}>
              <a href="#form" className={styles.ctaPrimary}>
                Quero ser embaixadora
              </a>
              <a href="#como" className={styles.ctaSecondary}>
                Como funciona
              </a>
            </div>
            <div className={styles.heroStats}>
              <div>
                <div className={styles.statValue}>até 30%</div>
                <div className={styles.statLabel}>de crédito por venda</div>
              </div>
              <div>
                <div className={styles.statValue}>90 dias</div>
                <div className={styles.statLabel}>para resgatar</div>
              </div>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img
              src="/hero-embaixadoras.jpg"
              alt="Três embaixadoras Niya sorrindo lado a lado, com pele radiante e maquiagem natural"
              className={styles.heroImg}
            />
          </div>
        </div>

        <div className={styles.benefits}>
          {BENEFITS.map((b) => (
            <div key={b.title} className={styles.benefitCard}>
              <div className={styles.benefitIcon}>{b.icon}</div>
              <div className={styles.benefitTitle}>{b.title}</div>
              <div className={styles.benefitText}>{b.text}</div>
            </div>
          ))}
        </div>

        <div id="como" className={styles.how}>
          <div className={styles.howKicker}>Como funciona</div>
          <h2 className={styles.howTitle}>Três passos até o primeiro crédito</h2>
          <div className={styles.steps}>
            {STEPS.map((s) => (
              <div key={s.n} className={styles.step}>
                <div className={styles.stepNum} style={{ color: ACCENT }}>
                  {s.n}
                </div>
                <div className={styles.stepTitle}>{s.title}</div>
                <div className={styles.stepText}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div id="form" className={styles.formSection}>
          <div className={styles.formImage}>
            <MediaPlaceholder label="Foto editorial vertical" radius={0} />
          </div>
          <div className={styles.formPane}>
            {done ? (
              <div className={styles.doneWrap}>
                <div className={styles.doneCheck}>✓</div>
                <div className={styles.doneTitle}>Inscrição enviada!</div>
                <div className={styles.doneText}>
                  Recebemos sua candidatura, {doneName}. Nosso time analisa o perfil e responde em até 3 dias úteis
                  pelo e-mail informado.
                </div>
              </div>
            ) : (
              <>
                <div className={styles.formKicker}>Candidatura</div>
                <h2 className={styles.formTitle}>Entre para o time {BRAND}</h2>
                <p className={styles.formSubtitle}>Leva menos de um minuto.</p>
                <div className={styles.fields}>
                  {fields.map((f) => (
                    <div key={f.key}>
                      <label className={styles.fieldLabel} htmlFor={`field-${f.key}`}>
                        {f.label}
                      </label>
                      <input
                        id={`field-${f.key}`}
                        className={styles.fieldInput}
                        data-invalid={(touched && !f.ok) || undefined}
                        placeholder={f.ph}
                        value={f.value}
                        onChange={(e) => f.set(e.target.value)}
                      />
                      {touched && !f.ok && <div className={styles.fieldError}>{f.err}</div>}
                    </div>
                  ))}
                  <button type="button" className={styles.submitBtn} onClick={submit}>
                    Enviar candidatura
                  </button>
                  <p className={styles.consent}>
                    Ao enviar você concorda em compartilhar métricas públicas do seu perfil para análise de fit.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.footer}>{BRAND} · programa de embaixadoras · feito com Aurora</div>
      </div>
    </div>
  );
}
