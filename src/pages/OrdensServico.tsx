import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Eye, Edit, Trash2, MoreHorizontal, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ServiceOrderForm } from '@/components/forms/ServiceOrderForm';
import { ServiceOrderDetails } from '@/components/details/ServiceOrderDetails';
import { OrdemServico, EspecialidadeLabels, StatusOSLabels } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function OrdensServico() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewingOS, setViewingOS] = useState<OrdemServico | null>(null);
  const [editingOS, setEditingOS] = useState<OrdemServico | null>(null);
  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingOS, setDeletingOS] = useState<OrdemServico | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOS = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('ordens_servico')
        .select(`
          *,
          empresa:empresas(id, nome_fantasia, endereco, contato_responsavel),
          funcionarios:ordens_servico_funcionarios(
            funcionario:funcionarios(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = (data as any[]).map((os) => ({
        ...os,
        empresa: os.empresa,
        funcionarios: os.funcionarios?.map((f: any) => f.funcionario) || [],
        tipoServico: os.tipo_servico,
        dataAbertura: os.data_abertura,
        dataPrevistaConclusao: os.data_prevista_conclusao,
        dataRealConclusao: os.data_real_conclusao,
        observacoesFechamento: os.observacoes_fechamento,
      }));

      setOrdensServico(formattedData as OrdemServico[]);
    } catch (error: any) {
      toast.error('Erro ao buscar ordens de serviço', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOS();
  }, []);

  const handleDelete = async () => {
    if (!deletingOS) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('ordens_servico')
        .delete()
        .eq('id', deletingOS.id);

      if (error) throw error;

      toast.success('OS excluída com sucesso!');
      setOrdensServico(prev => prev.filter(os => os.id !== deletingOS.id));
      setDeletingOS(null);
    } catch (error: any) {
      toast.error('Erro ao excluir OS', { description: error.message });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredOS = ordensServico.filter((os) => {
    const matchesSearch =
      os.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      os.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (os.empresa as any)?.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || os.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout
      title="Ordens de Serviço"
      subtitle="Gerencie e acompanhe as solicitações de serviço"
    >
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número, descrição ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              {Object.entries(StatusOSLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="flex-1 sm:flex-initial gap-2" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            <span className="whitespace-nowrap">Nova OS</span>
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="table-container overflow-x-auto rounded-xl border border-border/50"
      >
        <div className="min-w-[800px] md:min-w-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] md:w-auto">Número / Empresa</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead className="hidden sm:table-cell">Abertura</TableHead>
                <TableHead className="hidden lg:table-cell">Conclusão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Prioridade</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-muted-foreground">Carregando ordens de serviço...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredOS.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <p className="text-muted-foreground">Nenhuma ordem de serviço encontrada.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOS.map((os) => (
                  <TableRow key={os.id}>
                    <TableCell>
                      <div>
                        <p className="font-bold text-primary">{os.numero}</p>
                        <p className="text-sm text-muted-foreground">
                          {(os.empresa as any)?.nome_fantasia || 'Empresa não identificada'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="font-medium truncate">{EspecialidadeLabels[os.tipoServico]}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {os.descricao}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm hidden sm:table-cell">
                      {format(new Date(os.dataAbertura), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="text-sm hidden lg:table-cell">
                      {os.dataRealConclusao ? format(new Date(os.dataRealConclusao), 'dd/MM/yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('status-badge', `status-${os.status}`)}>
                        {StatusOSLabels[os.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-2 h-2 rounded-full', `bg-priority-${os.prioridade}`)} />
                        <span className="text-sm capitalize">{os.prioridade}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewingOS(os)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditingOS(os)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeletingOS(os)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* CREATE DIALOG */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Ordem de Serviço</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para criar uma nova solicitação de serviço
            </DialogDescription>
          </DialogHeader>
          <ServiceOrderForm
            onCancel={() => setIsCreateDialogOpen(false)}
            onSubmit={() => {
              setIsCreateDialogOpen(false);
              fetchOS();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* VIEW DIALOG */}
      <Dialog open={!!viewingOS} onOpenChange={(open) => !open && setViewingOS(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da OS: {viewingOS?.numero}</DialogTitle>
          </DialogHeader>
          {viewingOS && (
            <ServiceOrderDetails
              os={viewingOS}
              onUpdate={() => {
                fetchOS();
                setViewingOS(null); // Close to show fresh data in table
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={!!editingOS} onOpenChange={(open) => !open && setEditingOS(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar OS: {editingOS?.numero}</DialogTitle>
            <DialogDescription>
              Altere os dados necessários da ordem de serviço
            </DialogDescription>
          </DialogHeader>
          {editingOS && (
            <ServiceOrderForm
              initialData={editingOS}
              onCancel={() => setEditingOS(null)}
              onSubmit={() => {
                setEditingOS(null);
                fetchOS();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE ALERT */}
      <AlertDialog open={!!deletingOS} onOpenChange={(open) => !open && setDeletingOS(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Ordem de Serviço?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a OS <strong>{deletingOS?.numero}</strong>? Esta ação removerá permanentemente o registro.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
