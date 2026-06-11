import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { MeasurementRecord } from '@/store/useMeasurementStore';
import { useTranslations } from 'next-intl';

interface MeasurementChartProps {
  records: MeasurementRecord[];
  selectedName: string;
}

export function MeasurementChart({ records, selectedName }: MeasurementChartProps) {
  const t = useTranslations('measurements');

  const data = records
    .filter((r) => r.name === selectedName)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((r) => ({
      date: new Date(r.createdAt).toLocaleDateString(),
      value: r.value,
      unit: r.unit,
    }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed rounded-xl" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <p className="text-gray-500 text-sm">{t('noData')}</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#666" 
            fontSize={11} 
            tickMargin={10}
            fontFamily="var(--font-jetbrains)"
          />
          <YAxis 
            stroke="#666" 
            fontSize={11} 
            fontFamily="var(--font-jetbrains)"
            tickFormatter={(val) => `${val}`}
          />
          <RechartsTooltip 
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid var(--color-outline-variant)', borderRadius: '8px', color: 'var(--color-on-bg)' }}
            itemStyle={{ color: 'var(--color-primary)', fontFamily: 'var(--font-jetbrains)', fontWeight: 'bold' }}
            labelStyle={{ color: '#af8786', marginBottom: '4px' }}
            formatter={(value: number, name: string, props: { payload: { unit: string } }) => [`${value} ${props.payload.unit}`, selectedName]}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="var(--color-primary)" 
            strokeWidth={3}
            dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: 'var(--color-primary)', stroke: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
