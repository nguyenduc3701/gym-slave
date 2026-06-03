'use client';

import { useState } from 'react';
import {
  Grid,
  Text,
  TextInput,
  Select,
  NumberInput,
  Badge,
  Group,
  Stack,
  Progress,
  ActionIcon,
  Stepper,
  Button,
  Modal,
} from '@mantine/core';
import {
  IconBarbell,
  IconPlus,
  IconTrash,
  IconCheck,
  IconSearch,
  IconChevronRight,
  IconDownload,
} from '@tabler/icons-react';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { StatDisplay } from '@/components/ui/StatDisplay';

const muscleGroups = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
  'Legs', 'Glutes', 'Core', 'Cardio',
];

const exerciseLibrary = [
  { name: 'Bench Press', group: 'Chest' },
  { name: 'Squat', group: 'Legs' },
  { name: 'Deadlift', group: 'Back' },
  { name: 'Overhead Press', group: 'Shoulders' },
  { name: 'Pull-Up', group: 'Back' },
  { name: 'Dumbbell Curl', group: 'Biceps' },
  { name: 'Tricep Dips', group: 'Triceps' },
  { name: 'Plank', group: 'Core' },
];

interface WorkoutSet {
  reps: number;
  weight: number;
  done: boolean;
}

interface ExerciseEntry {
  id: number;
  name: string;
  group: string;
  sets: WorkoutSet[];
}

export default function WorkoutPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [workoutName, setWorkoutName] = useState('');
  const [search, setSearch] = useState('');
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [exerciseToDelete, setExerciseToDelete] = useState<number | null>(null);

  const filteredExercises = exerciseLibrary.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.group.toLowerCase().includes(search.toLowerCase())
  );

  const addExercise = (ex: (typeof exerciseLibrary)[0]) => {
    setExercises((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: ex.name,
        group: ex.group,
        sets: [{ reps: 10, weight: 60, done: false }],
      },
    ]);
  };

  const addSet = (exId: number) => {
    setExercises((prev) =>
      prev.map((e) =>
        e.id === exId
          ? { ...e, sets: [...e.sets, { reps: 10, weight: 60, done: false }] }
          : e
      )
    );
  };

  const toggleSet = (exId: number, setIdx: number) => {
    setExercises((prev) =>
      prev.map((e) =>
        e.id === exId
          ? {
              ...e,
              sets: e.sets.map((s, i) => (i === setIdx ? { ...s, done: !s.done } : s)),
            }
          : e
      )
    );
  };

  const removeExercise = (id: number) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  };

  const totalSets = exercises.reduce((acc, e) => acc + e.sets.length, 0);
  const doneSets = exercises.reduce((acc, e) => acc + e.sets.filter((s) => s.done).length, 0);
  const progress = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;

  const handleExport = () => {
    let content = `Workout: ${workoutName || 'Unnamed Workout'}\n`;
    content += `Date: ${new Date().toLocaleDateString()}\n`;
    content += `Total Sets: ${totalSets} | Completed: ${doneSets}\n`;
    content += `---------------------------\n\n`;

    exercises.forEach((ex, i) => {
      content += `${i + 1}. ${ex.name} (${ex.group})\n`;
      ex.sets.forEach((set, j) => {
        const status = set.done ? '[x]' : '[ ]';
        content += `   Set ${j + 1}: ${set.weight}kg x ${set.reps} reps ${status}\n`;
      });
      content += '\n';
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workoutName || 'workout_schedule'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="label-caps" style={{ color: '#ff003c' }}>Phase 1</p>
          <Text
            style={{
              fontFamily: 'var(--font-anybody)',
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            Log Your Workout
          </Text>
        </div>
        {exercises.length > 0 && (
          <Group>
            <Button
              variant="outline"
              color="gray"
              leftSection={<IconDownload size={16} />}
              onClick={handleExport}
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#ffdad8' }}
            >
              Export (.txt)
            </Button>
            <GradientButton leftSection={<IconCheck size={16} />} onClick={() => setActiveStep(2)}>
              Finish Workout
            </GradientButton>
          </Group>
        )}
      </div>

      {/* Progress if workout started */}
      {exercises.length > 0 && (
        <DashboardCard>
          <div className="flex items-center justify-between mb-3">
            <p className="label-caps">Session Progress</p>
            <StatDisplay value={progress} unit="%" size="sm" gradient />
          </div>
          <Progress value={progress} size={8} radius="xl" style={{ background: '#2e2e2e' }} />
          <div className="flex justify-between mt-2">
            <Text size="xs" c="dimmed">{doneSets} sets completed</Text>
            <Text size="xs" c="dimmed">{totalSets - doneSets} remaining</Text>
          </div>
        </DashboardCard>
      )}

      <Grid gutter="md">
        {/* Step 1 — Workout setup */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <DashboardCard>
            <p className="label-caps mb-3">Workout Details</p>
            <Stack gap="sm">
              <TextInput
                label="Workout Name"
                placeholder="e.g. Push Day — Week 4"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                styles={{
                  input: {
                    backgroundColor: '#111',
                    borderColor: 'rgba(255,255,255,0.08)',
                    color: '#ffdad8',
                    fontFamily: 'var(--font-hanken)',
                  },
                  label: { fontFamily: 'var(--font-jetbrains)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#af8786' },
                }}
              />
              <Select
                label="Primary Focus"
                placeholder="Select muscle group"
                data={muscleGroups}
                styles={{
                  input: {
                    backgroundColor: '#111',
                    borderColor: 'rgba(255,255,255,0.08)',
                    color: '#ffdad8',
                  },
                  label: { fontFamily: 'var(--font-jetbrains)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#af8786' },
                  dropdown: { backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.08)' },
                  option: { color: '#ffdad8', '&[data-selected]': { background: 'linear-gradient(135deg,#ff003c,#fe6b00)' } },
                }}
              />
            </Stack>

            <div className="mt-5">
              <p className="label-caps mb-3">Quick Stats</p>
              <Grid gutter="sm">
                <Grid.Col span={6}>
                  <div className="text-center p-3 rounded-xl" style={{ background: '#111' }}>
                    <StatDisplay value={exercises.length} size="sm" />
                    <p className="label-caps" style={{ fontSize: '9px', marginTop: '4px' }}>Exercises</p>
                  </div>
                </Grid.Col>
                <Grid.Col span={6}>
                  <div className="text-center p-3 rounded-xl" style={{ background: '#111' }}>
                    <StatDisplay value={totalSets} size="sm" />
                    <p className="label-caps" style={{ fontSize: '9px', marginTop: '4px' }}>Sets</p>
                  </div>
                </Grid.Col>
              </Grid>
            </div>
          </DashboardCard>
        </Grid.Col>

        {/* Step 2 — Exercise library */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <DashboardCard style={{ marginBottom: '16px' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="label-caps">Exercise Library</p>
              <Badge size="xs" variant="light" color="fireRed"
                style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px' }}>
                {exerciseLibrary.length} exercises
              </Badge>
            </div>
            <TextInput
              placeholder="Search exercises..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              mb="sm"
              styles={{
                input: {
                  backgroundColor: '#111',
                  borderColor: 'rgba(255,255,255,0.08)',
                  color: '#ffdad8',
                },
              }}
            />
            <div className="grid grid-cols-1 gap-1">
              {filteredExercises.map((ex) => (
                <button
                  key={ex.name}
                  onClick={() => addExercise(ex)}
                  className="flex items-center justify-between p-3 rounded-xl text-left transition-colors hover:bg-white/[0.05] cursor-pointer w-full"
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.04)', color: 'inherit' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(255,0,60,0.1)' }}>
                      <IconBarbell size={16} color="#ff003c" />
                    </div>
                    <div>
                      <Text size="sm" fw={500}>{ex.name}</Text>
                      <p className="label-caps" style={{ fontSize: '9px', marginTop: '1px' }}>{ex.group}</p>
                    </div>
                  </div>
                  <IconPlus size={14} color="#fe6b00" />
                </button>
              ))}
            </div>
          </DashboardCard>

          {/* Active exercises */}
          {exercises.length > 0 && (
            <DashboardCard>
              <p className="label-caps mb-3">Active Exercises</p>
              <Stack gap="md">
                {exercises.map((ex) => (
                  <div key={ex.id} className="p-4 rounded-xl" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <Text fw={700} style={{ fontFamily: 'var(--font-anybody)' }}>{ex.name}</Text>
                        <p className="label-caps" style={{ fontSize: '9px', color: '#fe6b00' }}>{ex.group}</p>
                      </div>
                      <ActionIcon variant="subtle" color="red" size="sm" onClick={() => setExerciseToDelete(ex.id)}>
                        <IconTrash size={14} />
                      </ActionIcon>
                    </div>

                    <div className="space-y-2">
                      {ex.sets.map((set, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Text size="xs" className="label-caps w-8" style={{ color: '#5f3e3e' }}>
                            S{i + 1}
                          </Text>
                          <NumberInput
                            value={set.weight}
                            size="xs"
                            min={0}
                            suffix=" kg"
                            style={{ width: '90px' }}
                            styles={{ input: { backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.08)', color: '#ffdad8', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' } }}
                          />
                          <Text size="xs" c="dimmed">×</Text>
                          <NumberInput
                            value={set.reps}
                            size="xs"
                            min={0}
                            suffix=" reps"
                            style={{ width: '90px' }}
                            styles={{ input: { backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.08)', color: '#ffdad8', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' } }}
                          />
                          <ActionIcon
                            size="sm"
                            radius="xl"
                            variant={set.done ? 'filled' : 'subtle'}
                            color={set.done ? 'teal' : 'gray'}
                            onClick={() => toggleSet(ex.id, i)}
                          >
                            <IconCheck size={12} />
                          </ActionIcon>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => addSet(ex.id)}
                      className="flex items-center gap-1 mt-3 text-xs cursor-pointer"
                      style={{ color: '#fe6b00', background: 'none', border: 'none', padding: 0, fontFamily: 'var(--font-jetbrains)', letterSpacing: '0.06em', textTransform: 'uppercase' }}
                    >
                      <IconPlus size={12} />
                      Add Set
                    </button>
                  </div>
                ))}
              </Stack>
            </DashboardCard>
          )}
        </Grid.Col>
      </Grid>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={exerciseToDelete !== null}
        onClose={() => setExerciseToDelete(null)}
        title="Xác nhận xoá"
        centered
        overlayProps={{ blur: 3, backgroundOpacity: 0.5 }}
        styles={{
          content: { backgroundColor: '#1a1a1a', color: '#ffdad8', border: '1px solid #4e2a2a' },
          header: { backgroundColor: '#1a1a1a' },
          title: { fontWeight: 'bold' }
        }}
      >
        <Text size="sm" mb="lg">Bạn có chắc chắn muốn xoá bài tập này khỏi danh sách không?</Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setExerciseToDelete(null)} style={{ backgroundColor: 'transparent', borderColor: '#4e2a2a', color: '#ffdad8' }}>Hủy</Button>
          <Button color="red" onClick={() => {
            if (exerciseToDelete !== null) {
              removeExercise(exerciseToDelete);
              setExerciseToDelete(null);
            }
          }}>Xoá</Button>
        </Group>
      </Modal>
    </div>
  );
}
