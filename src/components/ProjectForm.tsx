import { useState } from 'react';
import styles from './ProjectForm.module.css';

interface ProjectFormProps {
  initialName?: string;
  initialColor?: string;
  onSubmit: (name: string, color: string) => void;
  onCancel: () => void;
  submitLabel: string;
  disabled?: boolean;
}

export default function ProjectForm({
  initialName = '',
  initialColor = '#3498db',
  onSubmit,
  onCancel,
  submitLabel,
  disabled = false,
}: ProjectFormProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(name, color);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom du projet"
        className={styles.input}
        required
        disabled={disabled}
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className={styles.colorPicker}
        disabled={disabled}
      />
      <button type="submit" className={styles.submit} disabled={disabled}>
        {submitLabel}
      </button>
      <button type="button" onClick={onCancel} className={styles.cancel} disabled={disabled}>
        Annuler
      </button>
    </form>
  );
}