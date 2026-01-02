import { motion } from 'framer-motion';
import { ArrowRight, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EspecialidadeLabels, StatusOSLabels } from '@/types';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function RecentOrders() {
  const { data: recentOrders = [], isLoading } = useQuery({
    queryKey: ['recent-os'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ordens_servico')
        .select(`
          *,
          empresa:empresas(nome_fantasia)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card rounded-xl border border-border/50 shadow-sm"
    >
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Ordens de Serviço Recentes</h3>
            <p className="text-sm text-muted-foreground">
              Últimas OS cadastradas no sistema
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/ordens-servico" className="gap-1">
              Ver todas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="divide-y divide-border/50">
        {isLoading ? (
          <div className="p-10 flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground text-center">Carregando ordens recentes...</p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            Nenhuma ordem de serviço recente encontrada.
          </div>
        ) : (
          recentOrders.map((os: any, index: number) => (
            <motion.div
              key={os.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-primary">
                      {os.numero}
                    </span>
                    <Badge className={cn('status-badge', `status-${os.status}`)}>
                      {StatusOSLabels[os.status as keyof typeof StatusOSLabels]}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground truncate mb-1">
                    {os.descricao}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(os.data_abertura), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                    <span className="truncate max-w-[150px]">{os.empresa?.nome_fantasia}</span>
                    <span className="px-2 py-0.5 bg-secondary rounded-full">
                      {EspecialidadeLabels[os.tipo_servico as keyof typeof EspecialidadeLabels]}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
