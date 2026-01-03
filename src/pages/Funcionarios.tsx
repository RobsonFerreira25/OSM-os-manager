import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CargoNivelLabels, EspecialidadeLabels, Especialidade, Funcionario, CargoNivel } from '@/types';
import { Plus, Search, Edit, Trash2, User, MoreHorizontal, Loader2 } from 'lucide-react';
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
import { toast } from 'sonner';

const especialidadesLista: Especialidade[] = [
  'eletrica',
  'hidraulica',
  'servicos_gerais',
  'pintura',
  'alvenaria',
  'refrigeracao',
  'outra',
];

export default function Funcionarios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFunc, setEditingFunc] = useState<Funcionario | null>(null);
  const [deletingFunc, setDeletingFunc] = useState<Funcionario | null>(null);
  const [selectedSpecs, setSelectedSpecs] = useState<Especialidade[]>([]);
  const [cargo, setCargo] = useState<CargoNivel | ''>('');
  const [status, setStatus] = useState<'ativo' | 'inativo'>('ativo');
  const [dataAdmissao, setDataAdmissao] = useState('');

  const queryClient = useQueryClient();

  // Fetch Employees
  const { data: funcionarios = [], isLoading } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;

      return (data as any[]).map(f => ({
        id: f.id,
        nome: f.nome,
        cpf: f.cpf,
        matricula: f.matricula,
        cargo: f.cargo,
        especialidades: f.especialidades || [],
        status: f.status,
        email: f.email,
        telefone: f.telefone,
        dataAdmissao: f.data_admissao,
        createdAt: f.created_at,
        updatedAt: f.updated_at,
      })) as Funcionario[];
    },
  });

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingFunc) {
        const { error } = await supabase
          .from('funcionarios')
          .update(payload)
          .eq('id', editingFunc.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('funcionarios').insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
      toast.success(editingFunc ? 'Funcionário atualizado!' : 'Funcionário cadastrado!');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error('Erro ao salvar funcionário', { description: error.message });
    },
  });

  const resetForm = () => {
    setEditingFunc(null);
    setSelectedSpecs([]);
    setCargo('');
    setStatus('ativo');
    setDataAdmissao('');
  };

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('funcionarios').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
      toast.success('Funcionário excluído!');
      setDeletingFunc(null);
    },
    onError: (error: any) => {
      toast.error('Erro ao excluir', { description: error.message });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!cargo) {
      toast.error('Cargo é obrigatório');
      return;
    }

    if (selectedSpecs.length === 0) {
      toast.error('Selecione pelo menos uma especialidade');
      return;
    }

    const formData = new FormData(e.currentTarget);

    const payload = {
      nome: formData.get('nome'),
      cpf: formData.get('cpf'),
      matricula: formData.get('matricula'),
      cargo: cargo,
      email: formData.get('email'),
      telefone: formData.get('telefone'),
      status: status,
      especialidades: selectedSpecs,
      data_admissao: dataAdmissao || null,
    };

    saveMutation.mutate(payload);
  };

  const handleEdit = (f: Funcionario) => {
    setEditingFunc(f);
    setSelectedSpecs(f.especialidades);
    setCargo(f.cargo);
    setStatus(f.status);
    setDataAdmissao(f.dataAdmissao || '');
    setIsDialogOpen(true);
  };

  const toggleSpec = (spec: Especialidade) => {
    setSelectedSpecs(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const filteredFuncionarios = funcionarios.filter(
    (f) =>
      f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.matricula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout
      title="Funcionários"
      subtitle="Gerencie os funcionários da empresa"
    >
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou matrícula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto gap-2">
              <Plus className="w-4 h-4" />
              Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFunc ? 'Editar Funcionário' : 'Cadastrar Novo Funcionário'}</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input name="nome" id="nome" defaultValue={editingFunc?.nome} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input name="cpf" id="cpf" defaultValue={editingFunc?.cpf} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matricula">Matrícula *</Label>
                  <Input name="matricula" id="matricula" defaultValue={editingFunc?.matricula} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo *</Label>
                  <Select value={cargo} onValueChange={(v) => setCargo(v as CargoNivel)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CargoNivelLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input name="email" id="email" type="email" defaultValue={editingFunc?.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input name="telefone" id="telefone" defaultValue={editingFunc?.telefone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data_admissao">Data de Admissão</Label>
                  <Input
                    type="date"
                    id="data_admissao"
                    value={dataAdmissao}
                    onChange={(e) => setDataAdmissao(e.target.value)}
                  />
                </div>
                {editingFunc && (
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={(v) => setStatus(v as 'ativo' | 'inativo')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Especialidades *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {especialidadesLista.map((esp) => (
                    <div key={esp} className="flex items-center space-x-2">
                      <Checkbox
                        id={esp}
                        checked={selectedSpecs.includes(esp)}
                        onCheckedChange={() => toggleSpec(esp)}
                      />
                      <label htmlFor={esp} className="text-sm font-medium leading-none cursor-pointer">
                        {EspecialidadeLabels[esp]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingFunc ? 'Salvar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="table-container overflow-x-auto rounded-xl border border-border/50"
      >
        <div className="min-w-[800px] md:min-w-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px] md:w-auto">Funcionário</TableHead>
                  <TableHead className="hidden sm:table-cell">Matrícula</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="hidden md:table-cell">Especialidades</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFuncionarios.map((funcionario) => (
                  <TableRow key={funcionario.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{funcionario.nome}</p>
                          <p className="text-sm text-muted-foreground">{funcionario.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm hidden sm:table-cell">{funcionario.matricula}</TableCell>
                    <TableCell>{CargoNivelLabels[funcionario.cargo as keyof typeof CargoNivelLabels]}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {funcionario.especialidades.slice(0, 2).map((esp) => (
                          <Badge key={esp} variant="secondary" className="text-xs">
                            {EspecialidadeLabels[esp as keyof typeof EspecialidadeLabels]}
                          </Badge>
                        ))}
                        {funcionario.especialidades.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{funcionario.especialidades.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('status-badge', funcionario.status === 'ativo' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')}>
                        {funcionario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(funcionario)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeletingFunc(funcionario)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </motion.div>

      <AlertDialog open={!!deletingFunc} onOpenChange={(open) => !open && setDeletingFunc(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Funcionário?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{deletingFunc?.nome}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingFunc && deleteMutation.mutate(deletingFunc.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
