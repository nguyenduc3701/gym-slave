'use client';

import { Grid, Text, Badge, RingProgress, Timeline } from '@mantine/core';
import { IconTrendingUp, IconBarbell, IconFlame, IconStar, IconCheck } from '@tabler/icons-react';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { StatDisplay } from '@/components/ui/StatDisplay';

const weeklyVolume = [
  { week: 'W1', volume: 8400, workouts: 3 },
  { week: 'W2', volume: 9200, workouts: 4 },
  { week: 'W3', volume: 10100, workouts: 4 },
  { week: 'W4', volume: 11500, workouts: 5 },
  { week: 'W5', volume: 9800, workouts: 3 },
  { week: 'W6', volume: 12400, workouts: 5 },
];

const personalBests = [
  { exercise: 'Bench Press', weight: 100, unit: 'kg', date: '2026-05-28' },
  { exercise: 'Squat', weight: 130, unit: 'kg', date: '2026-05-20' },
  { exercise: 'Deadlift', weight: 160, unit: 'kg', date: '2026-06-01' },
  { exercise: 'OHP', weight: 70, unit: 'kg', date: '2026-05-15' },
];

const achievements = [
  { title: '5-Day Streak', desc: 'Worked out 5 days in a row', earned: true },
  { title: 'Protein King', desc: 'Hit protein goal 7 days in a row', earned: true },
  { title: 'Century Club', desc: 'Bench pressed 100kg', earned: true },
  { title: 'Iron Will', desc: 'Complete 50 workouts', earned: false },
];

export default function ProgressPage() {
  const maxVolume = Math.max(...weeklyVolume.map((w) => w.volume));

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div>
        <p className="label-caps" style={{ color: '#ff003c' }}>Performance Tracker</p>
        <Text
          style={{
            fontFamily: 'var(--font-anybody)',
            fontSize: '28px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          Your Progress
        </Text>
      </div>

      {/* Top Stats */}
      <Grid gutter="md">
        {[
          { label: 'Total Workouts', value: '47', unit: 'sessions', icon: <IconBarbell size={20} color="#ff003c" /> },
          { label: 'Avg Calories/Day', value: '2,280', unit: 'kcal', icon: <IconFlame size={20} color="#fe6b00" /> },
          { label: 'Consistency', value: '82', unit: '%', icon: <IconTrendingUp size={20} color="#6cd7d8" /> },
          { label: 'Personal Bests', value: '12', unit: 'records', icon: <IconStar size={20} color="#ffb3b2" /> },
        ].map((stat) => (
          <Grid.Col key={stat.label} span={{ base: 6, lg: 3 }}>
            <DashboardCard>
              <div className="flex items-center justify-between mb-2">
                <p className="label-caps">{stat.label}</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {stat.icon}
                </div>
              </div>
              <StatDisplay value={stat.value} unit={stat.unit} size="md" gradient />
            </DashboardCard>
          </Grid.Col>
        ))}
      </Grid>

      <Grid gutter="md">
        {/* Volume Chart */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <DashboardCard>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="label-caps">Training Volume</p>
                <Text mt={2} style={{ fontFamily: 'var(--font-anybody)', fontWeight: 700, fontSize: '18px' }}>
                  Weekly Total (kg lifted)
                </Text>
              </div>
              <Badge size="xs" color="fireRed" variant="light"
                style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px' }}>
                6 WEEKS
              </Badge>
            </div>

            <div className="flex items-end gap-3 h-40">
              {weeklyVolume.map((w, i) => {
                const height = Math.round((w.volume / maxVolume) * 100);
                const isLatest = i === weeklyVolume.length - 1;
                return (
                  <div key={w.week} className="flex-1 flex flex-col items-center gap-2">
                    <Text size="xs" style={{ fontFamily: 'var(--font-jetbrains)', color: '#af8786', fontSize: '10px' }}>
                      {(w.volume / 1000).toFixed(1)}k
                    </Text>
                    <div className="w-full flex items-end" style={{ height: '100px' }}>
                      <div
                        className="w-full rounded-t-lg"
                        style={{
                          height: `${height}%`,
                          background: isLatest
                            ? 'linear-gradient(180deg, #ff003c, #fe6b00)'
                            : 'linear-gradient(180deg, rgba(255,0,60,0.5), rgba(254,107,0,0.3))',
                          boxShadow: isLatest ? '0 0 16px rgba(255,0,60,0.4)' : 'none',
                          transition: 'all 0.3s ease',
                        }}
                      />
                    </div>
                    <p className="label-caps" style={{ fontSize: '9px', color: isLatest ? '#ff003c' : '#5f3e3e' }}>
                      {w.week}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
              <Text size="xs" c="dimmed">
                Latest week:{' '}
                <span style={{ color: '#ffb3b2', fontFamily: 'var(--font-jetbrains)' }}>
                  12,400 kg — ↑ 26% vs last week
                </span>
              </Text>
            </div>
          </DashboardCard>
        </Grid.Col>

        {/* Consistency Ring */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <DashboardCard style={{ height: '100%' }}>
            <p className="label-caps mb-4">Monthly Consistency</p>
            <div className="flex justify-center">
              <RingProgress
                size={140}
                thickness={14}
                roundCaps
                sections={[
                  { value: 82, color: 'url(#grad)', tooltip: '82% consistent' },
                ]}
                label={
                  <div className="text-center">
                    <StatDisplay value="82" unit="%" size="sm" gradient />
                    <p className="label-caps" style={{ fontSize: '9px', marginTop: '2px' }}>CONSISTENCY</p>
                  </div>
                }
              />
            </div>
            <Grid gutter="sm" mt="md">
              <Grid.Col span={6}>
                <div className="text-center p-3 rounded-xl" style={{ background: '#111' }}>
                  <StatDisplay value="19" size="sm" gradient />
                  <p className="label-caps" style={{ fontSize: '9px', marginTop: '4px' }}>Days Trained</p>
                </div>
              </Grid.Col>
              <Grid.Col span={6}>
                <div className="text-center p-3 rounded-xl" style={{ background: '#111' }}>
                  <StatDisplay value="4" size="sm" />
                  <p className="label-caps" style={{ fontSize: '9px', marginTop: '4px' }}>Rest Days</p>
                </div>
              </Grid.Col>
            </Grid>
          </DashboardCard>
        </Grid.Col>
      </Grid>

      <Grid gutter="md">
        {/* Personal Bests */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DashboardCard>
            <div className="flex items-center justify-between mb-4">
              <p className="label-caps">Personal Records</p>
              <IconStar size={16} color="#ffb3b2" />
            </div>
            <div className="space-y-3">
              {personalBests.map((pb) => (
                <div
                  key={pb.exercise}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: '#111', border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(255,0,60,0.1)' }}>
                      <IconBarbell size={16} color="#ff003c" />
                    </div>
                    <div>
                      <Text size="sm" fw={600} style={{ fontFamily: 'var(--font-anybody)' }}>
                        {pb.exercise}
                      </Text>
                      <Text size="xs" c="dimmed" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                        {pb.date}
                      </Text>
                    </div>
                  </div>
                  <StatDisplay value={pb.weight} unit={pb.unit} size="sm" gradient />
                </div>
              ))}
            </div>
          </DashboardCard>
        </Grid.Col>

        {/* Achievements */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DashboardCard>
            <div className="flex items-center justify-between mb-4">
              <p className="label-caps">Achievements</p>
              <Badge size="xs" color="fireRed" variant="light"
                style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px' }}>
                3 / 4 EARNED
              </Badge>
            </div>
            <div className="space-y-3">
              {achievements.map((ach) => (
                <div
                  key={ach.title}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: ach.earned ? 'rgba(255,0,60,0.05)' : '#111',
                    border: `1px solid ${ach.earned ? 'rgba(255,0,60,0.2)' : 'rgba(255,255,255,0.04)'}`,
                    opacity: ach.earned ? 1 : 0.5,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: ach.earned
                        ? 'linear-gradient(135deg,#ff003c,#fe6b00)'
                        : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    {ach.earned ? (
                      <IconCheck size={16} color="white" />
                    ) : (
                      <IconStar size={16} color="#5f3e3e" />
                    )}
                  </div>
                  <div>
                    <Text size="sm" fw={600} style={{ fontFamily: 'var(--font-anybody)' }}>
                      {ach.title}
                    </Text>
                    <Text size="xs" c="dimmed">{ach.desc}</Text>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </Grid.Col>
      </Grid>
    </div>
  );
}
