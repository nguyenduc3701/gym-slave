'use client';

import { Text } from '@mantine/core';
import { IconPalette, IconCheck } from '@tabler/icons-react';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { useUserStore } from '@/store/useUserStore';
import { COLOR_PRESETS, type ThemePresetKey } from '@/styles/presets';

export default function SettingsPage() {
  const { profile, updateProfile } = useUserStore();
  const activePreset = profile.themePreset ?? 'default';

  return (
    <div className="space-y-6 max-w-[800px] mx-auto">
      <div>
        <p className="label-caps" style={{ color: 'var(--color-primary)' }}>Cấu hình</p>
        <Text style={{ fontFamily: 'var(--font-anybody)', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Cài Đặt
        </Text>
      </div>

      {/* ── THEME PRESET ── */}
      <DashboardCard>
        <div className="flex items-center gap-2 mb-2">
          <IconPalette size={16} color="var(--color-primary)" />
          <p className="label-caps">Giao Diện / Bộ Màu</p>
        </div>
        <Text size="xs" c="dimmed" mb="lg">
          Chọn phối màu phù hợp với phong cách luyện tập của bạn. Thay đổi có hiệu lực ngay lập tức.
        </Text>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COLOR_PRESETS.map((preset) => {
            const isActive = activePreset === preset.key;
            return (
              <button
                key={preset.key}
                onClick={() => updateProfile({ themePreset: preset.key as ThemePresetKey })}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    borderRadius: '14px',
                    padding: '14px 16px',
                    border: isActive
                      ? `2px solid ${preset.gradient[0]}`
                      : '2px solid rgba(255,255,255,0.07)',
                    background: isActive
                      ? `linear-gradient(135deg, ${preset.gradient[0]}18, ${preset.gradient[1]}10)`
                      : 'rgba(255,255,255,0.03)',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  className="hover:border-white/20"
                >
                  {/* Gradient Strip */}
                  <div
                    style={{
                      height: '5px',
                      borderRadius: '4px',
                      background: `linear-gradient(90deg, ${preset.gradient[0]}, ${preset.gradient[1]})`,
                      marginBottom: '12px',
                    }}
                  />

                  {/* Label + check */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p
                        style={{
                          fontFamily: 'var(--font-jetbrains)',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: isActive ? preset.gradient[0] : 'var(--color-on-surface-variant)',
                          margin: 0,
                          marginBottom: '4px',
                        }}
                      >
                        {preset.label}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-hanken)',
                          fontSize: '12px',
                          color: 'var(--color-outline)',
                          margin: 0,
                        }}
                      >
                        {preset.description}
                      </p>
                    </div>
                    {isActive && (
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${preset.gradient[0]}, ${preset.gradient[1]})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <IconCheck size={13} color="#fff" stroke={3} />
                      </div>
                    )}
                  </div>

                  {/* Color Dots */}
                  <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                    {[preset.gradient[0], preset.gradient[1], preset.cssVars.onBg].map((c, i) => (
                      <div
                        key={i}
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          backgroundColor: c,
                          opacity: i === 2 ? 0.5 : 1,
                          border: '1.5px solid rgba(255,255,255,0.15)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </DashboardCard>
    </div>
  );
}
