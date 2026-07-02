import { useState } from 'react';
import { NumberInput, Select, Button, Group, Autocomplete } from '@mantine/core';
import { useTranslations } from 'next-intl';

interface MeasurementFormProps {
  initialData?: { name: string; unit: string; maxValue?: number; normalValue?: number };
  onSubmit: (data: { name: string; unit: 'cm' | 'inch' | 'kg' | 'lbs' | 'mm'; maxValue?: number; normalValue: number }) => void;
  onCancel: () => void;
}

export function MeasurementForm({ initialData, onSubmit, onCancel }: MeasurementFormProps) {
  const t = useTranslations('measurements');
  const [name, setName] = useState(initialData?.name || '');
  const [unit, setUnit] = useState<string>(initialData?.unit || 'mm');
  const [maxValue, setMaxValue] = useState<number | string>(initialData?.maxValue !== undefined ? initialData.maxValue : '');
  const [normalValue, setNormalValue] = useState<number | string>(initialData?.normalValue !== undefined ? initialData.normalValue : '');

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
    if (name && normalValue !== '') {
      onSubmit({
        name,
        unit: unit as 'cm' | 'inch' | 'kg' | 'lbs' | 'mm',
        normalValue: Number(normalValue),
        maxValue: maxValue !== '' ? Number(maxValue) : undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Group align="flex-end" wrap="nowrap" gap="sm">
        <Autocomplete
          label={t('name')}
          placeholder={t('name')}
          data={suggestions}
          value={name}
          onChange={setName}
          required
          style={{ flex: 1 }}
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
        <Select
          label={t('unit')}
          data={[
            { value: 'mm', label: 'mm' },
            { value: 'cm', label: 'cm' },
            { value: 'inch', label: 'inch' },
            { value: 'kg', label: 'kg' },
            { value: 'lbs', label: 'lbs' },
          ]}
          value={unit}
          onChange={(val) => setUnit(val || 'mm')}
          required
          style={{ width: '100px' }}
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
      <Group grow align="flex-end" gap="sm">
        <NumberInput
          label={t('normalValue')}
          placeholder="0"
          value={normalValue}
          onChange={setNormalValue}
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
        <NumberInput
          label={t('maxValue')}
          placeholder="e.g. 100"
          value={maxValue}
          onChange={setMaxValue}
          min={0}
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
