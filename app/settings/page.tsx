'use client';

import { Grid, Text, TextInput, Select, NumberInput, Switch, Divider, Stack } from '@mantine/core';
import { IconUser, IconTarget, IconBell, IconPalette } from '@tabler/icons-react';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { useUserStore } from '@/store/useUserStore';

const goalOptions = [
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'general', label: 'General Fitness' },
];

export default function SettingsPage() {
  const { profile, updateProfile } = useUserStore();

  return (
    <div className="space-y-6 max-w-[800px] mx-auto">
      <div>
        <p className="label-caps" style={{ color: '#ff003c' }}>Configuration</p>
        <Text style={{ fontFamily: 'var(--font-anybody)', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Settings
        </Text>
      </div>

      {/* Profile */}
      <DashboardCard>
        <div className="flex items-center gap-2 mb-4">
          <IconUser size={16} color="#ff003c" />
          <p className="label-caps">Profile</p>
        </div>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Name"
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              styles={{
                input: { backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.08)', color: '#ffdad8' },
                label: { fontFamily: 'var(--font-jetbrains)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#af8786' },
              }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              label="Goal"
              value={profile.goal}
              data={goalOptions}
              onChange={(val) => updateProfile({ goal: (val as typeof profile.goal) ?? profile.goal })}
              styles={{
                input: { backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.08)', color: '#ffdad8' },
                label: { fontFamily: 'var(--font-jetbrains)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#af8786' },
                dropdown: { backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.08)' },
              }}
            />
          </Grid.Col>
        </Grid>
      </DashboardCard>

      {/* Targets */}
      <DashboardCard>
        <div className="flex items-center gap-2 mb-4">
          <IconTarget size={16} color="#fe6b00" />
          <p className="label-caps">Daily Targets</p>
        </div>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <NumberInput
              label="Calorie Target"
              value={profile.dailyCalorieTarget}
              suffix=" kcal"
              min={1200}
              max={6000}
              step={50}
              onChange={(val) => updateProfile({ dailyCalorieTarget: Number(val) })}
              styles={{
                input: { backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.08)', color: '#ffdad8', fontFamily: 'var(--font-jetbrains)' },
                label: { fontFamily: 'var(--font-jetbrains)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#af8786' },
              }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <NumberInput
              label="Protein Target"
              value={profile.dailyProteinTarget}
              suffix=" g"
              min={50}
              max={400}
              step={5}
              onChange={(val) => updateProfile({ dailyProteinTarget: Number(val) })}
              styles={{
                input: { backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.08)', color: '#ffdad8', fontFamily: 'var(--font-jetbrains)' },
                label: { fontFamily: 'var(--font-jetbrains)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#af8786' },
              }}
            />
          </Grid.Col>
        </Grid>
      </DashboardCard>

      {/* Notifications */}
      <DashboardCard>
        <div className="flex items-center gap-2 mb-4">
          <IconBell size={16} color="#6cd7d8" />
          <p className="label-caps">Notifications</p>
        </div>
        <Stack gap="md">
          {[
            { label: 'Workout Reminders', desc: 'Get reminded to train at your scheduled time' },
            { label: 'Meal Logging', desc: 'Reminders to log your meals throughout the day' },
            { label: 'Weekly Summary', desc: 'Receive a weekly performance digest every Sunday' },
          ].map((item, i) => (
            <div key={item.label}>
              <div className="flex items-center justify-between">
                <div>
                  <Text size="sm" fw={500}>{item.label}</Text>
                  <Text size="xs" c="dimmed">{item.desc}</Text>
                </div>
                <Switch
                  defaultChecked={i < 2}
                  color="fireRed"
                />
              </div>
              {i < 2 && <Divider mt="md" color="rgba(255,255,255,0.04)" />}
            </div>
          ))}
        </Stack>
      </DashboardCard>

      <div className="flex justify-end">
        <GradientButton size="md">
          Save Changes
        </GradientButton>
      </div>
    </div>
  );
}
