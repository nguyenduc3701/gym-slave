import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MeasurementRecord {
  id: string;
  name: string;
  unit: 'cm' | 'inch' | 'kg' | 'lbs' | 'mm';
  maxValue?: number;
  normalValue: number;
  createdAt: string;
  updatedAt: string;
}

interface MeasurementState {
  records: MeasurementRecord[];
  addRecord: (record: Omit<MeasurementRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecord: (id: string, record: Partial<Omit<MeasurementRecord, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteRecord: (id: string) => void;
  clearAll: () => void;
}

export const useMeasurementStore = create<MeasurementState>()(
  persist(
    (set) => ({
      records: [],
      addRecord: (record) => set((state) => {
        const now = new Date().toISOString();
        return {
          records: [
            ...state.records,
            {
              ...record,
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              createdAt: now,
              updatedAt: now,
            }
          ]
        };
      }),
      updateRecord: (id, updates) => set((state) => ({
        records: state.records.map(record => 
          record.id === id 
            ? { ...record, ...updates, updatedAt: new Date().toISOString() } 
            : record
        )
      })),
      deleteRecord: (id) => set((state) => ({
        records: state.records.filter(record => record.id !== id)
      })),
      clearAll: () => set({ records: [] }),
    }),
    {
      name: 'gym-slave-measurement-store',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0 && persistedState && Array.isArray(persistedState.records)) {
          return {
            ...persistedState,
            records: persistedState.records.map((r: any) => {
              const { value, ...rest } = r;
              return {
                ...rest,
                normalValue: r.normalValue !== undefined ? r.normalValue : (value !== undefined ? value : 0),
              };
            }),
          };
        }
        return persistedState;
      }
    }
  )
);
