'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Text, Grid, Button, Modal, NumberInput, ActionIcon, Stack, Group, SegmentedControl, TextInput } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import { IconTrash, IconCheck, IconChartLine, IconList, IconBarbell, IconSearch } from '@tabler/icons-react';
import { useUserStore } from '@/store/useUserStore';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { StatDisplay } from '@/components/ui/StatDisplay';

export default function RecordsPage() {
  const t = useTranslations('records');
  const { profile, addWeightLog, clearWeightLogs, updateProfile } = useUserStore();
  
  const unit = profile.weightUnit || 'kg';

  // Extract unique exercises from customSchedule
  const currentExercises = Array.from(
    new Set(
      (profile.customSchedule || []).flatMap((d: any) =>
        (d.exercises || []).map((ex: any) => ex.name)
      )
    )
  ).sort();

  const [weightInputs, setWeightInputs] = useState<Record<string, number | string>>({});
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpdateWeight = (exercise: string) => {
    const w = Number(weightInputs[exercise]);
    if (w > 0) {
      const today = new Date().toISOString().split('T')[0];
      addWeightLog(exercise, w, today);
      setWeightInputs({ ...weightInputs, [exercise]: '' });
    }
  };

  const handleClearAll = () => {
    clearWeightLogs();
    setConfirmClearOpen(false);
  };

  const handleUnitChange = (newUnit: 'kg' | 'lbs') => {
    const currentUnit = profile.weightUnit || 'kg';
    if (newUnit === currentUnit) return;

    // Convert logs
    const currentLogs = profile.weightLogs || {};
    const updatedLogs: Record<string, any[]> = {};
    const conversionFactor = 2.20462;

    Object.keys(currentLogs).forEach(exercise => {
      updatedLogs[exercise] = currentLogs[exercise].map(log => ({
        date: log.date,
        weight: newUnit === 'lbs'
          ? Math.round(log.weight * conversionFactor * 10) / 10
          : Math.round(log.weight / conversionFactor * 10) / 10
      }));
    });

    updateProfile({
      weightUnit: newUnit,
      weightLogs: updatedLogs
    });
  };

  const exerciseLogs = selectedExercise ? (profile.weightLogs?.[selectedExercise] || []) : [];

  const chartData = exerciseLogs.map(log => ({
    date: log.date,
    weight: log.weight
  }));

  // Filter exercises by search query
  const filteredExercises = currentExercises.filter(ex =>
    ex.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="label-caps" style={{ color: '#ff003c' }}>{t('subtitle')}</p>
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
        <div className="flex items-center gap-3 w-full sm:w-auto self-stretch sm:self-auto justify-between sm:justify-end">
          {/* Unit selector */}
          <SegmentedControl
            value={unit}
            onChange={(val: any) => handleUnitChange(val)}
            data={[
              { label: 'KG', value: 'kg' },
              { label: 'LBS', value: 'lbs' },
            ]}
            color="red"
            styles={{
              root: { backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '3px' },
              label: { color: '#ffdad8', fontSize: '11px', fontFamily: 'var(--font-jetbrains)', fontWeight: 'bold' }
            }}
          />

          {currentExercises.length > 0 && (
            <Button
              variant="outline"
              color="red"
              leftSection={<IconTrash size={16} />}
              onClick={() => setConfirmClearOpen(true)}
              styles={{
                root: {
                  borderColor: 'rgba(255,0,60,0.25)',
                  color: '#ffdad8',
                  backgroundColor: 'transparent',
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#ff003c',
                    backgroundColor: 'rgba(255,0,60,0.05)',
                    boxShadow: '0 0 15px rgba(255,0,60,0.2)'
                  }
                }
              }}
            >
              {t('clearHistory')}
            </Button>
          )}
        </div>
      </div>

      {currentExercises.length === 0 ? (
        <DashboardCard>
          <div className="py-16 text-center text-[#5f3e3e]">
            <IconBarbell size={48} stroke={1} className="mx-auto mb-4 opacity-50" />
            <Text c="dimmed">{t('noData')}</Text>
          </div>
        </DashboardCard>
      ) : (
        <Stack gap="md">
          {/* Search box */}
          <TextInput
            placeholder={t('searchPlaceholder') || "Search exercises..."}
            leftSection={<IconSearch size={16} className="text-[#af8786]" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            styles={{
              input: {
                backgroundColor: '#1a1a1a',
                borderColor: 'rgba(255,255,255,0.06)',
                color: '#ffdad8',
                height: '46px',
                borderRadius: '12px',
                fontFamily: 'var(--font-hanken)',
                fontSize: '14px',
                '&:focus': {
                  borderColor: '#fe6b00',
                }
              }
            }}
            className="w-full"
          />

          {filteredExercises.length === 0 ? (
            <DashboardCard>
              <div className="py-12 text-center text-[#5f3e3e]">
                <IconBarbell size={40} stroke={1} className="mx-auto mb-3 opacity-40" />
                <Text size="sm" c="dimmed">Không tìm thấy bài tập nào</Text>
              </div>
            </DashboardCard>
          ) : (
            <Grid gutter="md">
              {filteredExercises.map((exercise) => {
                const logs = profile.weightLogs?.[exercise] || [];
                const currentWeight = logs.length > 0 ? logs[logs.length - 1].weight : 0;

                return (
                  <Grid.Col key={exercise} span={{ base: 12, md: 6, lg: 6 }}>
                    <DashboardCard style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <div className="flex justify-between items-start mb-4 flex-1">
                        <div>
                          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setSelectedExercise(exercise)}>
                            <Text fw={750} style={{ fontFamily: 'var(--font-anybody)', fontSize: '18px' }} className="group-hover:text-[#ff003c] transition-colors">
                              {exercise}
                            </Text>
                            <IconChartLine size={16} className="text-[#5f3e3e] group-hover:text-[#ff003c] transition-colors" />
                          </div>
                          <Text size="xs" c="dimmed" mt={4} className="label-caps">
                            {currentWeight > 0 ? (
                              <>
                                {t('currentWeight')}: <span style={{ color: '#fe6b00', fontWeight: 800, fontFamily: 'var(--font-jetbrains)' }}>{currentWeight} {unit}</span>
                              </>
                            ) : (
                              t('noData')
                            )}
                          </Text>
                        </div>
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/[0.04] cursor-pointer hover:bg-white/10 hover:border-white/10 transition-colors" 
                          onClick={() => setSelectedExercise(exercise)}
                        >
                          <IconBarbell size={20} color={currentWeight > 0 ? "#fe6b00" : "#5f3e3e"} />
                        </div>
                      </div>

                      <div className="flex items-end gap-2 mt-auto pt-4 border-t border-white/[0.06]">
                        <NumberInput
                          value={weightInputs[exercise] || ''}
                          onChange={(val) => setWeightInputs({ ...weightInputs, [exercise]: val })}
                          placeholder="e.g. 50"
                          min={0}
                          suffix={` ${unit}`}
                          hideControls
                          style={{ flex: 1 }}
                          styles={{
                            input: {
                              backgroundColor: '#111',
                              borderColor: 'rgba(255,255,255,0.08)',
                              color: '#ffdad8',
                              fontFamily: 'var(--font-jetbrains)'
                            }
                          }}
                        />
                        <ActionIcon
                          size={36}
                          variant="filled"
                          onClick={() => handleUpdateWeight(exercise)}
                          disabled={!weightInputs[exercise]}
                          style={{ 
                            background: weightInputs[exercise] 
                              ? 'linear-gradient(135deg, #ff003c, #fe6b00)' 
                              : '#222',
                            border: 'none',
                            transition: 'all 0.2s ease'
                          }}
                          styles={{
                            root: {
                              '&:hover': {
                                filter: weightInputs[exercise] ? 'brightness(1.15)' : 'none',
                                boxShadow: weightInputs[exercise] ? '0 0 15px rgba(255, 0, 60, 0.4)' : 'none',
                              }
                            }
                          }}
                        >
                          <IconCheck size={18} color="white" />
                        </ActionIcon>
                      </div>
                    </DashboardCard>
                  </Grid.Col>
                );
              })}
            </Grid>
          )}
        </Stack>
      )}

      {/* History Modal */}
      <Modal
        opened={selectedExercise !== null}
        onClose={() => setSelectedExercise(null)}
        title={<Text fw={800} style={{ fontFamily: 'var(--font-anybody)', fontSize: '18px' }} className="gradient-text">{t('weightHistory', { exercise: selectedExercise })}</Text>}
        size="lg"
        centered
        overlayProps={{ blur: 10, backgroundOpacity: 0.8 }}
        styles={{
          content: { backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', color: '#ffdad8', borderRadius: '16px' },
          header: { backgroundColor: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '16px 20px' },
          title: { color: '#fff' }
        }}
      >
        <div className="flex justify-end mb-6">
          <SegmentedControl
            value={viewMode}
            onChange={(val: any) => setViewMode(val)}
            data={[
              { label: <div className="flex items-center gap-1.5"><IconChartLine size={14}/> {t('chartView')}</div>, value: 'chart' },
              { label: <div className="flex items-center gap-1.5"><IconList size={14}/> {t('listView')}</div>, value: 'list' },
            ]}
            color="fireRed"
            styles={{
              root: { backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px' },
              label: { color: '#ffdad8', fontSize: '11px', fontFamily: 'var(--font-jetbrains)', textTransform: 'uppercase', letterSpacing: '0.05em' }
            }}
          />
        </div>

        {exerciseLogs.length === 0 ? (
          <div className="py-16 text-center text-[#5f3e3e]">
            <IconBarbell size={48} stroke={1} className="mx-auto mb-4 opacity-50" />
            <Text className="label-caps" style={{ color: '#5f3e3e' }}>{t('emptyList')}</Text>
          </div>
        ) : (
          <div className="min-h-[300px]">
            {viewMode === 'chart' ? (
              <div className="h-[300px] w-full mt-4">
                <LineChart
                  h={300}
                  data={chartData}
                  dataKey="date"
                  series={[{ name: 'weight', color: 'fireRed.5', label: `${t('weight')} (${unit})` }]}
                  curveType="monotone"
                  withDots
                  dotProps={{ r: 4, strokeWidth: 2 }}
                  gridAxis="xy"
                  textColor="#ffdad8"
                  tooltipAnimationDuration={200}
                  gridColor="rgba(255, 255, 255, 0.06)"
                />
              </div>
            ) : (
              <Stack gap="sm">
                {exerciseLogs.slice().reverse().map((log, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-[#111] border border-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#fe6b00]" />
                      <Text style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '13px' }} c="dimmed">{log.date}</Text>
                    </div>
                    <StatDisplay value={log.weight} unit={unit} size="sm" gradient />
                  </div>
                ))}
              </Stack>
            )}
          </div>
        )}
      </Modal>

      {/* Clear Confirmation Modal */}
      <Modal
        opened={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        title={<Text fw="bold" style={{ fontFamily: 'var(--font-anybody)', fontSize: '18px' }} className="gradient-text">{t('clearHistoryConfirmTitle')}</Text>}
        centered
        overlayProps={{ blur: 10, backgroundOpacity: 0.8 }}
        styles={{
          content: { backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', color: '#ffdad8', borderRadius: '16px' },
          header: { backgroundColor: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '16px 20px' }
        }}
      >
        <Text size="sm" mb="xl" color="#ffb3b2">{t('clearHistoryConfirmDesc')}</Text>
        <Group justify="flex-end">
          <Button 
            variant="default" 
            onClick={() => setConfirmClearOpen(false)} 
            style={{ 
              backgroundColor: 'transparent', 
              borderColor: 'rgba(255,255,255,0.1)', 
              color: '#ffdad8',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {t('cancel')}
          </Button>
          <Button 
            color="red" 
            onClick={handleClearAll}
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {t('confirmDelete')}
          </Button>
        </Group>
      </Modal>
    </div>
  );
}


