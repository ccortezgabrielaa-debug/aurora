import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { StepDots } from '../components/StepDots';
import { LogoUploader } from '../components/LogoUploader';
import { ColorSwatchPicker } from '../components/ColorSwatchPicker';
import { useOnboarding } from '../context/OnboardingContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { fetchInstagramProfile, normalizeHandle, type InstagramProfileData } from '../lib/instagram';
import styles from './OnboardingStep.module.css';

const BRAND_SWATCHES = ['#eab4bf', '#c98a94', '#b5c4b0', '#c9b79a', '#26211e'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function OnboardingWorkspacePage() {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const { state, setBrand, setBillingEmail, setCnpj, setInstagramHandle, setColor, setLogoUrl } = useOnboarding();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [igLoading, setIgLoading] = useState(false);
  const [igNotice, setIgNotice] = useState<string | null>(null);
  const [igProfile, setIgProfile] = useState<InstagramProfileData | null>(null);

  if (!authLoading && !session) {
    return <Navigate to="/onboarding/signup" replace />;
  }

  async function handleFetchInstagram() {
    if (!state.instagramHandle.trim()) return;
    setIgLoading(true);
    setIgNotice(null);
    setIgProfile(null);
    try {
      const profile = await fetchInstagramProfile(state.instagramHandle);
      setIgProfile(profile);
      if (profile.profilePicUrl) setLogoUrl(profile.profilePicUrl);
    } catch (err) {
      setIgNotice(err instanceof Error ? err.message : 'Não foi possível buscar os dados do Instagram agora.');
    } finally {
      setIgLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    if (!state.brand.trim()) return;

    setSubmitting(true);
    setError(null);

    // Generated client-side (rather than left to the DB default + `.select()`-ing it back)
    // because a brand-new user has no profile yet, so no SELECT policy on `brands` can see
    // the row it just inserted — RLS still lets the INSERT through, but RETURNING it fails.
    const brandId = crypto.randomUUID();
    const { error: brandError } = await supabase.from('brands').insert({
      id: brandId,
      name: state.brand.trim(),
      billing_email: state.billingEmail.trim() || null,
      cnpj: state.cnpj.trim() || null,
      instagram_handle: state.instagramHandle.trim() ? normalizeHandle(state.instagramHandle) : null,
    });

    if (brandError) {
      setSubmitting(false);
      setError('Não foi possível criar o workspace: ' + brandError.message);
      return;
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: session.user.id,
      role: 'brand_admin',
      brand_id: brandId,
      full_name: state.name.trim() || null,
    });

    if (profileError) {
      setSubmitting(false);
      setError('Workspace criado, mas houve um erro ao vincular sua conta: ' + profileError.message);
      return;
    }

    // All-default row so Regras has something to load/edit from day one.
    await supabase.from('credit_rules').insert({ brand_id: brandId });

    setSubmitting(false);
    navigate('/onboarding/done');
  }

  return (
    <Screen>
      <form className={styles.step} onSubmit={handleSubmit}>
        <div className={styles.topRow}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate('/onboarding/signup')}
            aria-label="Voltar para a conta"
          >
            ‹
          </button>
          <StepDots total={2} current={2} />
          <div className={styles.backBtnSpacer} />
        </div>

        <div className={styles.header}>
          <div className={styles.kicker}>Passo 2 de 2</div>
          <h1 className={styles.title}>
            Crie o workspace
            <br />
            da sua marca
          </h1>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '22px 0 20px' }}>
          <LogoUploader
            previewUrl={state.logoUrl}
            onFile={(file) => {
              if (!file) {
                setLogoUrl(null);
                return;
              }
              setLogoUrl(URL.createObjectURL(file));
            }}
          />
        </div>

        <div className={styles.fields} style={{ gap: 18 }}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Nome da marca</span>
            <input
              className={`${styles.input} ${styles.inputEmphasis}`}
              placeholder="Ex: Aurora Studio"
              value={state.brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>E-mail da marca</span>
            <input
              className={styles.input}
              data-invalid={state.billingEmail.trim() !== '' && !EMAIL_RE.test(state.billingEmail.trim())}
              type="email"
              placeholder="contato@suamarca.com"
              value={state.billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>CNPJ</span>
            <input
              className={styles.input}
              placeholder="00.000.000/0000-00"
              value={state.cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              inputMode="numeric"
            />
          </label>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Instagram da marca</span>
            <div className={styles.inputRow}>
              <input
                className={styles.input}
                placeholder="@suamarca"
                value={state.instagramHandle}
                onChange={(e) => {
                  setInstagramHandle(e.target.value);
                  setIgProfile(null);
                  setIgNotice(null);
                }}
              />
              <button
                type="button"
                className={styles.fetchBtn}
                disabled={!state.instagramHandle.trim() || igLoading}
                onClick={handleFetchInstagram}
              >
                {igLoading ? 'Buscando…' : 'Buscar dados'}
              </button>
            </div>
            {igNotice && <p className={styles.igHint}>{igNotice}</p>}
            {igProfile && (
              <div className={styles.igPreview}>
                {igProfile.profilePicUrl && (
                  <img className={styles.igPreviewAvatar} src={igProfile.profilePicUrl} alt="" />
                )}
                <div>
                  <div className={styles.igPreviewName}>{igProfile.fullName ?? igProfile.handle}</div>
                  {igProfile.followers != null && (
                    <div className={styles.igPreviewMeta}>{igProfile.followers.toLocaleString('pt-BR')} seguidores</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel} style={{ marginBottom: 8 }}>
              Cor da marca
            </span>
            <ColorSwatchPicker
              ariaLabel="Cor da marca"
              swatches={BRAND_SWATCHES}
              value={state.color}
              onChange={setColor}
            />
          </div>
        </div>

        {error && <p className={styles.fieldError}>{error}</p>}

        <div className={styles.spacer} />

        <button type="submit" className={styles.primaryBtn} disabled={submitting}>
          {submitting ? 'Criando workspace…' : 'Criar workspace'}
        </button>
      </form>
    </Screen>
  );
}
