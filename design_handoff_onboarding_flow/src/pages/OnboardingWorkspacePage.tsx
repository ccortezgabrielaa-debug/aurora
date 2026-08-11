import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { StepDots } from '../components/StepDots';
import { LogoUploader } from '../components/LogoUploader';
import { ColorSwatchPicker } from '../components/ColorSwatchPicker';
import { useOnboarding } from '../context/OnboardingContext';
import styles from './OnboardingStep.module.css';

const BRAND_SWATCHES = ['#eab4bf', '#c98a94', '#b5c4b0', '#c9b79a', '#26211e'];

export function OnboardingWorkspacePage() {
  const navigate = useNavigate();
  const { state, setBrand, setColor, setLogoUrl } = useOnboarding();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

        <div className={styles.spacer} />

        <button type="submit" className={styles.primaryBtn}>
          Criar workspace
        </button>
      </form>
    </Screen>
  );
}
