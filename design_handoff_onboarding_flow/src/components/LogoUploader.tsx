import { useId, useRef } from 'react';
import styles from './LogoUploader.module.css';

type LogoUploaderProps = {
  previewUrl: string | null;
  onFile: (file: File | null) => void;
  label?: string;
};

export function LogoUploader({ previewUrl, onFile, label = 'Adicionar logo' }: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.circle}
        data-filled={previewUrl ? true : undefined}
        onClick={() => inputRef.current?.click()}
        aria-describedby={inputId}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Logo da marca" className={styles.img} />
        ) : (
          <span className={styles.placeholder}>{label}</span>
        )}
      </button>
      <span id={inputId} className="visually-hidden">
        Selecione uma imagem para o logo da marca
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="visually-hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
