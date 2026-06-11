import { useState } from 'react';
import { NumberInput, Select, Button, Group, Autocomplete } from '@mantine/core';
import { useTranslations } from 'next-intl';

interface MeasurementFormProps {
  initialData?: { name: string; value: number; unit: string };
  onSubmit: (data: { name: string; value: number; unit: 'cm' | 'inch' | 'kg' | 'lbs' }) => void;
  onCancel: () => void;
}

export function MeasurementForm({ initialData, onSubmit, onCancel }: MeasurementFormProps) {
  const t = useTranslations('measurements');
  const [name, setName] = useState(initialData?.name || '');
  const [value, setValue] = useState<number | string>(initialData?.value || '');
  const [unit, setUnit] = useState<string>(initialData?.unit || 'cm');

  const suggestions = [
    t('suggestions.chest'),
    t('suggestions.waist'),
    t('suggestions.hips'),
    t('suggestions.biceps'),
    t('suggestions.thighs'),
    t('suggestions.calves'),
    t('suggestions.weight'),
    t('suggestions.shoulders'),
    t('suggestions.neck'),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && value !== '') {
      onSubmit({
        name,
        value: Number(value),
        unit: unit as 'cm' | 'inch' | 'kg' | 'lbs',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Autocomplete
        label={t('name')}
        placeholder={t('name')}
        data={suggestions}
        value={name}
        onChange={setName}
        required
        styles={{
          input: {
            backgroundColor: '#111',
            borderColor: 'rgba(255,255,255,0.08)',
            color: 'var(--color-on-bg)',
            fontFamily: 'var(--font-hanken)',
          },
          label: { fontFamily: 'var(--font-jetbrains)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#af8786' },
          dropdown: { backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.08)' },
          option: { color: 'var(--color-on-bg)', '&[data-selected]': { background: 'linear-gradient(135deg, var(--preset-gradient-from), var(--preset-gradient-to))' } },
        }}
      />
      <Group grow>
        <NumberInput
          label={t('value')}
          placeholder="0"
          value={value}
          onChange={setValue}
          min={0}
          required
          hideControls
          styles={{
            input: {
              backgroundColor: '#111',
              borderColor: 'rgba(255,255,255,0.08)',
              color: 'var(--color-on-bg)',
              fontFamily: 'var(--font-hanken)',
            },
            label: { fontFamily: 'var(--font-jetbrains)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#af8786' },
          }}
        />
        <Select
          label={t('unit')}
          data={[
            { value: 'cm', label: 'cm' },
            { value: 'inch', label: 'inch' },
            { value: 'kg', label: 'kg' },
            { value: 'lbs', label: 'lbs' },
          ]}
          value={unit}
          onChange={(val) => setUnit(val || 'cm')}
          required
          styles={{
            input: {
              backgroundColor: '#111',
              borderColor: 'rgba(255,255,255,0.08)',
              color: 'var(--color-on-bg)',
              fontFamily: 'var(--font-hanken)',
            },
            label: { fontFamily: 'var(--font-jetbrains)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#af8786' },
            dropdown: { backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.08)' },
            option: { color: 'var(--color-on-bg)', '&[data-selected]': { background: 'linear-gradient(135deg, var(--preset-gradient-from), var(--preset-gradient-to))' } },
          }}
        />
      </Group>
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onCancel} style={{ backgroundColor: 'transparent', borderColor: 'var(--color-outline-variant)', color: 'var(--color-on-bg)' }}>
          {t('cancel')}
        </Button>
        <Button type="submit" style={{ background: 'linear-gradient(135deg, var(--preset-gradient-from), var(--preset-gradient-to))', color: '#fff', border: 'none' }}>
          {t('save')}
        </Button>
      </Group>
    </form>
  );
}
