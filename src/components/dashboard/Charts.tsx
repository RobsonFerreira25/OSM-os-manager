import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { EspecialidadeLabels, StatusOSLabels } from '@/types';
import { Loader2 } from 'lucide-react';

const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f43f5e', // rose
];

const STATUS_COLORS: Record<string, string> = {
  aberta: '#3b82f6',
  em_andamento: '#f59e0b',
  concluida: '#10b981',
  cancelada: '#64748b',
};

export function OSBySpecialtyChart() {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['os-by-specialty'],
    queryFn: async () => {
      const { data, error } = await supabase.from('ordens_servico').select('tipo_servico');
      if (error) throw error;

      const counts: Record<string, number> = {};
      data.forEach((os: any) => {
        counts[os.tipo_servico] = (counts[os.tipo_servico] || 0) + 1;
      });

      return Object.entries(counts).map(([name, value], index) => ({
        name: EspecialidadeLabels[name as keyof typeof EspecialidadeLabels] || name,
        value,
        color: COLORS[index % COLORS.length],
      }));
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-card rounded-xl border border-border/50 shadow-sm p-6"
    >
      <h3 className="text-lg font-semibold mb-4">OS por Especialidade</h3>
      <div className="h-[300px] flex items-center justify-center">
        {isLoading ? (
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        ) : chartData?.length === 0 ? (
          <p className="text-muted-foreground">Sem dados</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}

export function OSByMonthChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="bg-card rounded-xl border border-border/50 shadow-sm p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Evolução Mensal (Coming Soon)</h3>
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Integrando série temporal...
      </div>
    </motion.div>
  );
}

export function OSByStatusChart() {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['os-by-status'],
    queryFn: async () => {
      const { data, error } = await supabase.from('ordens_servico').select('status');
      if (error) throw error;

      const counts: Record<string, number> = {};
      data.forEach((os: any) => {
        counts[os.status] = (counts[os.status] || 0) + 1;
      });

      return Object.entries(counts).map(([name, value]) => ({
        name: StatusOSLabels[name as keyof typeof StatusOSLabels] || name,
        value,
        color: STATUS_COLORS[name] || '#64748b',
      }));
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="bg-card rounded-xl border border-border/50 shadow-sm p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Distribuição por Status</h3>
      <div className="h-[300px] flex items-center justify-center">
        {isLoading ? (
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        ) : chartData?.length === 0 ? (
          <p className="text-muted-foreground">Sem dados</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
