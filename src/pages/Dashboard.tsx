import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import {
  OSBySpecialtyChart,
  OSByMonthChart,
  OSByStatusChart,
} from '@/components/dashboard/Charts';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Building2,
  Loader2,
} from 'lucide-react';
import { isBefore, startOfMonth } from 'date-fns';

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [osRes, funcRes, empRes] = await Promise.all([
        supabase.from('ordens_servico').select('*'),
        supabase.from('funcionarios').select('status'),
        supabase.from('empresas').select('id'),
      ]);

      if (osRes.error) throw osRes.error;
      if (funcRes.error) throw funcRes.error;
      if (empRes.error) throw empRes.error;

      const os = osRes.data;
      const now = new Date();
      const firstDayOfMonth = startOfMonth(now);

      return {
        osAbertas: os.filter(o => o.status === 'aberta').length,
        osEmAndamento: os.filter(o => o.status === 'em_andamento').length,
        osConcluidas: os.filter(o => o.status === 'concluida' && new Date(o.updated_at) >= firstDayOfMonth).length,
        osAtrasadas: os.filter(o =>
          o.status !== 'concluida' &&
          o.status !== 'cancelada' &&
          o.data_prevista_conclusao &&
          isBefore(new Date(o.data_prevista_conclusao), now)
        ).length,
        totalFuncionariosAtivos: funcRes.data.filter(f => f.status === 'ativo').length,
        totalEmpresas: empRes.data.length,
      };
    },
  });

  return (
    <MainLayout
      title="Dashboard"
      subtitle="Visão geral do sistema de ordens de serviço"
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Carregando indicadores...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <StatCard
              title="OS Abertas"
              value={stats?.osAbertas || 0}
              subtitle="Aguardando início"
              icon={ClipboardList}
              variant="primary"
              delay={0}
            />
            <StatCard
              title="Em Andamento"
              value={stats?.osEmAndamento || 0}
              subtitle="Em execução"
              icon={Clock}
              variant="warning"
              delay={0.05}
            />
            <StatCard
              title="Concluídas"
              value={stats?.osConcluidas || 0}
              subtitle="Este mês"
              icon={CheckCircle2}
              variant="success"
              delay={0.1}
            />
            <StatCard
              title="Atrasadas"
              value={stats?.osAtrasadas || 0}
              subtitle="Atenção necessária"
              icon={AlertTriangle}
              delay={0.15}
            />
            <StatCard
              title="Funcionários"
              value={stats?.totalFuncionariosAtivos || 0}
              subtitle="Ativos"
              icon={Users}
              delay={0.2}
            />
            <StatCard
              title="Empresas"
              value={stats?.totalEmpresas || 0}
              subtitle="Cadastradas"
              icon={Building2}
              delay={0.25}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
            <OSBySpecialtyChart />
            <OSByMonthChart />
            <OSByStatusChart />
          </div>

          <RecentOrders />
        </>
      )}
    </MainLayout>
  );
}
