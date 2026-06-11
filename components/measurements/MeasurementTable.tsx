import { Table, ActionIcon, Group, Text } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { MeasurementRecord } from '@/store/useMeasurementStore';

interface MeasurementTableProps {
  records: MeasurementRecord[];
  onEdit: (record: MeasurementRecord) => void;
  onDelete: (id: string) => void;
}

export function MeasurementTable({ records, onEdit, onDelete }: MeasurementTableProps) {
  const t = useTranslations('measurements');

  if (records.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-xl" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <Text c="dimmed" size="sm">{t('noData')}</Text>
      </div>
    );
  }

  const sortedRecords = [...records].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <Table verticalSpacing="sm" horizontalSpacing="md" style={{ minWidth: 600 }}>
        <Table.Thead style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <Table.Tr>
            <Table.Th style={{ color: '#af8786', fontFamily: 'var(--font-jetbrains)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('name')}</Table.Th>
            <Table.Th style={{ color: '#af8786', fontFamily: 'var(--font-jetbrains)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('value')}</Table.Th>
            <Table.Th style={{ color: '#af8786', fontFamily: 'var(--font-jetbrains)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('date')}</Table.Th>
            <Table.Th style={{ color: '#af8786', fontFamily: 'var(--font-jetbrains)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>{t('actions')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedRecords.map((record) => (
            <Table.Tr key={record.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <Table.Td>
                <Text fw={500} style={{ color: 'var(--color-on-bg)' }}>{record.name}</Text>
              </Table.Td>
              <Table.Td>
                <Text fw={700} style={{ fontFamily: 'var(--font-jetbrains)', color: 'var(--color-primary)' }}>
                  {record.value} <span className="text-xs text-gray-500 font-normal">{record.unit}</span>
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">
                  {new Date(record.createdAt).toLocaleDateString()}
                </Text>
              </Table.Td>
              <Table.Td>
                <Group gap="xs" justify="flex-end">
                  <ActionIcon variant="subtle" color="gray" onClick={() => onEdit(record)}>
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" onClick={() => onDelete(record.id)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}
