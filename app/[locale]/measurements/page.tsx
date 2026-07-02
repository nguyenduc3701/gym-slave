'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Text, Group, Button, Modal, Select, ActionIcon } from '@mantine/core';
import { IconPlus, IconDownload } from '@tabler/icons-react';
import { useMeasurementStore, MeasurementRecord } from '@/store/useMeasurementStore';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { MeasurementForm } from '@/components/measurements/MeasurementForm';
import { MeasurementTable } from '@/components/measurements/MeasurementTable';
import { MeasurementChart } from '@/components/measurements/MeasurementChart';

export default function MeasurementsPage() {
  const t = useTranslations('measurements');
  const { records, addRecord, updateRecord, deleteRecord } = useMeasurementStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MeasurementRecord | null>(null);
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  
  const uniqueNames = useMemo(() => Array.from(new Set(records.map(r => r.name))), [records]);
  const [selectedChartName, setSelectedChartName] = useState<string | null>(uniqueNames[0] || null);

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: MeasurementRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleSubmit = (data: { name: string; unit: 'cm' | 'inch' | 'kg' | 'lbs' | 'mm'; maxValue?: number; normalValue: number }) => {
    if (editingRecord) {
      updateRecord(editingRecord.id, data);
    } else {
      addRecord(data);
      if (!selectedChartName) setSelectedChartName(data.name);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setDeleteRecordId(id);
  };

  const handleExport = () => {
    let content = `BODY MEASUREMENTS REPORT\n`;
    content += `Date: ${new Date().toLocaleDateString()}\n`;
    content += `Total Records: ${records.length}\n`;
    content += `---------------------------\n\n`;

    // Group by name
    const grouped: Record<string, MeasurementRecord[]> = {};
    records.forEach(r => {
      if (!grouped[r.name]) grouped[r.name] = [];
      grouped[r.name].push(r);
    });

    for (const [name, list] of Object.entries(grouped)) {
      content += `[ ${name.toUpperCase()} ]\n`;
      const sorted = list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      sorted.forEach((item, index) => {
        content += `  ${index + 1}. ${new Date(item.createdAt).toLocaleDateString()}: ${item.normalValue} ${item.unit}`;
        if (item.maxValue !== undefined) {
          content += ` (Max: ${item.maxValue} ${item.unit})`;
        }
        content += '\n';
      });
      content += '\n';
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `measurements_report_${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="label-caps" style={{ color: 'var(--color-primary)' }}>{t('subtitle')}</p>
          <Text
            style={{
              fontFamily: 'var(--font-anybody)',
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            {t('title')}
          </Text>
        </div>
        <Group>
          {records.length > 0 && (
            <Button
              variant="outline"
              color="gray"
              leftSection={<IconDownload size={16} />}
              onClick={handleExport}
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--color-on-bg)' }}
            >
              {t('export')}
            </Button>
          )}
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleOpenAdd}
            style={{ background: 'linear-gradient(135deg, var(--preset-gradient-from), var(--preset-gradient-to))', color: '#fff', border: 'none' }}
          >
            {t('addMeasurement')}
          </Button>
        </Group>
      </div>

      {/* Chart Section */}
      {records.length > 0 && (
        <DashboardCard>
          <div className="flex items-center justify-between mb-6">
            <p className="label-caps">{t('chartTitle')}</p>
            <Select
              placeholder={t('selectMeasurement')}
              data={uniqueNames.map(name => ({ value: name, label: name }))}
              value={selectedChartName}
              onChange={setSelectedChartName}
              styles={{
                input: {
                  backgroundColor: '#111',
                  borderColor: 'rgba(255,255,255,0.08)',
                  color: 'var(--color-on-bg)',
                  minWidth: '200px'
                },
                dropdown: { backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.08)' },
                option: { color: 'var(--color-on-bg)', '&[data-selected]': { background: 'linear-gradient(135deg, var(--preset-gradient-from), var(--preset-gradient-to))' } },
              }}
            />
          </div>
          {selectedChartName && (
            <MeasurementChart records={records} selectedName={selectedChartName} />
          )}
        </DashboardCard>
      )}

      {/* Table Section */}
      <DashboardCard>
        <MeasurementTable records={records} onEdit={handleOpenEdit} onDelete={handleDelete} />
      </DashboardCard>

      {/* Form Modal */}
      <Modal
        opened={isModalOpen}
        onClose={handleCloseModal}
        title={<Text fw={700} style={{ fontFamily: 'var(--font-anybody)' }}>{editingRecord ? t('edit') : t('addMeasurement')}</Text>}
        centered
        overlayProps={{ blur: 3, backgroundOpacity: 0.5 }}
        styles={{
          content: { backgroundColor: '#1a1a1a', color: 'var(--color-on-bg)', border: '1px solid var(--color-outline-variant)' },
          header: { backgroundColor: '#1a1a1a' },
        }}
      >
        <MeasurementForm 
          initialData={editingRecord ? { name: editingRecord.name, unit: editingRecord.unit, maxValue: editingRecord.maxValue, normalValue: editingRecord.normalValue } : undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteRecordId !== null}
        onClose={() => setDeleteRecordId(null)}
        title={<Text fw={700} style={{ fontFamily: 'var(--font-anybody)' }}>{t('deleteConfirmTitle')}</Text>}
        centered
        overlayProps={{ blur: 3, backgroundOpacity: 0.5 }}
        styles={{
          content: { backgroundColor: '#1a1a1a', color: 'var(--color-on-bg)', border: '1px solid var(--color-outline-variant)' },
          header: { backgroundColor: '#1a1a1a' },
        }}
      >
        <Text size="sm" mb="lg">
          {t('deleteConfirmDesc')}
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setDeleteRecordId(null)} style={{ backgroundColor: 'transparent', borderColor: 'var(--color-outline-variant)', color: 'var(--color-on-bg)' }}>
            {t('cancel')}
          </Button>
          <Button onClick={() => {
            if (deleteRecordId) {
              deleteRecord(deleteRecordId);
              setDeleteRecordId(null);
            }
          }} style={{ background: 'var(--color-error, #fa5252)', color: '#fff', border: 'none' }}>
            {t('confirmDelete')}
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
