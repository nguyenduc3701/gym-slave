'use client';

import { useState } from 'react';
import {
  Grid,
  Text,
  TextInput,
  Badge,
  Stack,
  Tabs,
  Progress,
  Divider,
} from '@mantine/core';
import { IconSearch, IconPlus, IconApple, IconMeat, IconBread, IconDroplet } from '@tabler/icons-react';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { StatDisplay } from '@/components/ui/StatDisplay';

const foodDatabase = [
  { id: 1, name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'protein' },
  { id: 2, name: 'Brown Rice (100g)', calories: 216, protein: 5, carbs: 45, fat: 1.8, category: 'carbs' },
  { id: 3, name: 'Whole Eggs (1 large)', calories: 78, protein: 6, carbs: 0.6, fat: 5, category: 'protein' },
  { id: 4, name: 'Oats (100g)', calories: 389, protein: 17, carbs: 66, fat: 7, category: 'carbs' },
  { id: 5, name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13, category: 'protein' },
  { id: 6, name: 'Banana (1 medium)', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, category: 'carbs' },
  { id: 7, name: 'Greek Yogurt (100g)', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, category: 'protein' },
  { id: 8, name: 'Avocado (100g)', calories: 160, protein: 2, carbs: 9, fat: 15, category: 'fat' },
];

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;

export default function NutritionPage() {
  const [search, setSearch] = useState('');
  const [activeMeal, setActiveMeal] = useState<string>('Breakfast');

  const filtered = foodDatabase.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  const totals = {
    calories: 1840,
    protein: 132,
    carbs: 210,
    fat: 58,
    target: { calories: 2500, protein: 180, carbs: 280, fat: 75 },
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div>
        <p className="label-caps" style={{ color: 'var(--color-primary)' }}>Nutrition Tracker</p>
        <Text
          style={{
            fontFamily: 'var(--font-anybody)',
            fontSize: '28px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          Today&apos;s Food Log
        </Text>
      </div>

      {/* Daily Summary */}
      <DashboardCard>
        <div className="flex items-center justify-between mb-4">
          <p className="label-caps">Daily Summary</p>
          <Badge size="xs" color="fireRed" variant="light"
            style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px' }}>
            JUNE 2
          </Badge>
        </div>
        <Grid gutter="xl">
          {[
            { label: 'Calories', val: totals.calories, target: totals.target.calories, unit: 'kcal', color: 'var(--color-primary)' },
            { label: 'Protein', val: totals.protein, target: totals.target.protein, unit: 'g', color: 'var(--color-primary)' },
            { label: 'Carbs', val: totals.carbs, target: totals.target.carbs, unit: 'g', color: 'var(--color-secondary)' },
            { label: 'Fat', val: totals.fat, target: totals.target.fat, unit: 'g', color: '#6cd7d8' },
          ].map((m) => (
            <Grid.Col key={m.label} span={{ base: 6, md: 3 }}>
              <StatDisplay value={m.val} unit={m.unit} label={m.label} size="md" />
              <Progress
                value={(m.val / m.target) * 100}
                size={4}
                radius="xl"
                color={m.color}
                mt={8}
                mb={4}
                style={{ background: '#2e2e2e' }}
              />
              <Text size="xs" c="dimmed" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                {m.target - m.val} {m.unit} remaining
              </Text>
            </Grid.Col>
          ))}
        </Grid>
      </DashboardCard>

      <Grid gutter="md">
        {/* Food Search */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <DashboardCard>
            <p className="label-caps mb-3">Food Database</p>
            <TextInput
              placeholder="Search food..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              mb="sm"
              styles={{
                input: {
                  backgroundColor: '#111',
                  borderColor: 'rgba(255,255,255,0.08)',
                  color: 'var(--color-on-bg)',
                },
              }}
            />

            <Tabs
              value={activeMeal}
              onChange={(val) => setActiveMeal(val ?? 'Breakfast')}
              mb="sm"
              styles={{
                tab: {
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '10px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#af8786',
                  '&[data-active]': { color: 'var(--color-primary)', borderColor: 'var(--color-primary)' },
                },
              }}
            >
              <Tabs.List>
                {mealTypes.map((m) => (
                  <Tabs.Tab key={m} value={m}>{m}</Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>

            <Stack gap={4}>
              {filtered.map((food) => (
                <div
                  key={food.id}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/[0.04] transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,0,60,0.08)' }}
                  >
                    {food.category === 'protein' ? (
                      <IconMeat size={15} color="var(--color-primary)" />
                    ) : food.category === 'carbs' ? (
                      <IconBread size={15} color="var(--color-secondary)" />
                    ) : (
                      <IconDroplet size={15} color="#6cd7d8" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Text size="xs" fw={500} truncate>{food.name}</Text>
                    <Text size="xs" c="dimmed" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                      P:{food.protein}g C:{food.carbs}g F:{food.fat}g
                    </Text>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Text size="xs" fw={600} style={{ fontFamily: 'var(--font-jetbrains)', color: 'var(--color-on-surface-variant)' }}>
                      {food.calories}
                    </Text>
                    <Text size="xs" c="dimmed">kcal</Text>
                  </div>
                  <GradientButton size="compact-xs" px={8}>
                    <IconPlus size={12} />
                  </GradientButton>
                </div>
              ))}
            </Stack>
          </DashboardCard>
        </Grid.Col>

        {/* Meal Summary by Type */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <DashboardCard style={{ height: '100%' }}>
            <p className="label-caps mb-4">Meal Breakdown</p>
            <Stack gap="md">
              {mealTypes.map((meal, i) => {
                const mockCal = [420, 650, 520, 250][i];
                const mockProtein = [35, 48, 38, 11][i];
                return (
                  <div key={meal}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: 'linear-gradient(135deg, var(--preset-gradient-from), var(--preset-gradient-to))' }}
                        />
                        <Text size="sm" fw={600} style={{ fontFamily: 'var(--font-anybody)' }}>
                          {meal}
                        </Text>
                      </div>
                      <Text size="xs" style={{ fontFamily: 'var(--font-jetbrains)', color: 'var(--color-on-surface-variant)' }}>
                        {mockCal} kcal
                      </Text>
                    </div>
                    <div className="flex gap-4 mb-2">
                      <Text size="xs" c="dimmed">Protein: <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-jetbrains)' }}>{mockProtein}g</span></Text>
                    </div>
                    <Progress
                      value={(mockCal / 750) * 100}
                      size={4}
                      radius="xl"
                      style={{ background: '#2e2e2e' }}
                    />
                    {i < mealTypes.length - 1 && (
                      <Divider mt="md" color="rgba(255,255,255,0.04)" />
                    )}
                  </div>
                );
              })}
            </Stack>

            <div className="mt-6 p-4 rounded-xl" style={{ background: '#111', border: '1px solid rgba(255,0,60,0.15)' }}>
              <div className="flex items-center gap-2 mb-2">
                <IconApple size={16} color="var(--color-primary)" />
                <p className="label-caps" style={{ color: 'var(--color-primary)' }}>Daily Tip</p>
              </div>
              <Text size="xs" c="dimmed" lh={1.6}>
                You&apos;re hitting{' '}
                <span style={{ color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>73%</span> of your protein
                goal. Add a protein shake post-workout to hit your target.
              </Text>
            </div>
          </DashboardCard>
        </Grid.Col>
      </Grid>
    </div>
  );
}
