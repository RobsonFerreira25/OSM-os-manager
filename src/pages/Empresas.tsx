import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Building2,
  MoreHorizontal,
  MapPin,
  Phone,
  Loader2,
} from 'lucide-react';
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
import { Empresa } from '@/types';

export default function Empresas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Empresa | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<Empresa | null>(null);
  const queryClient = useQueryClient();

  // Fetch Companies from Supabase
  const { data: empresas = [], isLoading } = useQuery({
    queryKey: ['empresas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('nome_fantasia', { ascending: true });

      if (error) throw error;

      return (data as any[]).map((e) => ({
        id: e.id,
        razaoSocial: e.razao_social,
        nomeFantasia: e.nome_fantasia,
        cnpj: e.cnpj,
        tipo: e.tipo,
        matrizId: e.matriz_id,
        endereco: e.endereco,
        contatoResponsavel: e.contato_responsavel,
        status: e.status,
        createdAt: e.created_at,
        updatedAt: e.updated_at,
      })) as Empresa[];
    },
  });

  // Create/Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (company: any) => {
      if (editingCompany) {
        const { error } = await supabase
          .from('empresas')
          .update(company)
          .eq('id', editingCompany.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('empresas').insert([company]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast.success(editingCompany ? 'Empresa atualizada!' : 'Empresa cadastrada!');
      setIsDialogOpen(false);
      setEditingCompany(null);
    },
    onError: (error: any) => {
      toast.error('Erro ao salvar empresa', { description: error.message });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('empresas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast.success('Empresa excluída com sucesso!');
      setDeletingCompany(null);
    },
    onError: (error: any) => {
      toast.error('Erro ao excluir empresa', { description: error.message });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      razao_social: formData.get('razaoSocial'),
      nome_fantasia: formData.get('nomeFantasia'),
      cnpj: formData.get('cnpj'),
      tipo: formData.get('tipo'),
      endereco: {
        logradouro: formData.get('logradouro'),
        numero: formData.get('numero'),
        complemento: formData.get('complemento'),
        bairro: formData.get('bairro'),
        cidade: formData.get('cidade'),
        estado: formData.get('estado'),
        cep: formData.get('cep'),
      },
      contato_responsavel: {
        nome: formData.get('contatoNome'),
        cargo: formData.get('contatoCargo'),
        email: formData.get('contatoEmail'),
        telefone: formData.get('contatoTelefone'),
      },
      status: formData.get('status') || 'ativo',
    };

    saveMutation.mutate(payload);
  };

  const handleEdit = (empresa: Empresa) => {
    setEditingCompany(empresa);
    setIsDialogOpen(true);
  };

  const filteredEmpresas = empresas.filter(
    (e) =>
      e.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.cnpj.includes(searchTerm)
  );

  return (
    <MainLayout
      title="Empresas"
      subtitle="Gerencie empresas e filiais"
    >
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingCompany(null);
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCompany ? 'Editar Empresa' : 'Cadastrar Nova Empresa'}</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="razaoSocial">Razão Social *</Label>
                  <Input name="razaoSocial" id="razaoSocial" defaultValue={editingCompany?.razaoSocial} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomeFantasia">Nome Fantasia *</Label>
                  <Input name="nomeFantasia" id="nomeFantasia" defaultValue={editingCompany?.nomeFantasia} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input name="cnpj" id="cnpj" defaultValue={editingCompany?.cnpj} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select name="tipo" defaultValue={editingCompany?.tipo || "matriz"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matriz">Matriz</SelectItem>
                      <SelectItem value="filial">Filial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editingCompany && (
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={editingCompany.status}>
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

              <div className="space-y-4">
                <h4 className="font-medium">Endereço</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="logradouro">Logradouro *</Label>
                    <Input name="logradouro" id="logradouro" defaultValue={editingCompany?.endereco.logradouro} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número *</Label>
                    <Input name="numero" id="numero" defaultValue={editingCompany?.endereco.numero} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input name="complemento" id="complemento" defaultValue={editingCompany?.endereco.complemento} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro *</Label>
                    <Input name="bairro" id="bairro" defaultValue={editingCompany?.endereco.bairro} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input name="cidade" id="cidade" defaultValue={editingCompany?.endereco.cidade} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado *</Label>
                    <Input name="estado" id="estado" defaultValue={editingCompany?.endereco.estado} maxLength={2} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP *</Label>
                    <Input name="cep" id="cep" defaultValue={editingCompany?.endereco.cep} required />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Contato Responsável</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contatoNome">Nome *</Label>
                    <Input name="contatoNome" id="contatoNome" defaultValue={editingCompany?.contatoResponsavel.nome} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contatoCargo">Cargo</Label>
                    <Input name="contatoCargo" id="contatoCargo" defaultValue={editingCompany?.contatoResponsavel.cargo} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contatoEmail">E-mail *</Label>
                    <Input name="contatoEmail" id="contatoEmail" type="email" defaultValue={editingCompany?.contatoResponsavel.email} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contatoTelefone">Telefone *</Label>
                    <Input name="contatoTelefone" id="contatoTelefone" defaultValue={editingCompany?.contatoResponsavel.telefone} required />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingCompany ? 'Salvar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Carregando empresas...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmpresas.map((empresa, index) => (
            <motion.div
              key={empresa.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-card rounded-xl border border-border/50 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{empresa.nomeFantasia}</h3>
                    <p className="text-sm text-muted-foreground font-mono">{empresa.cnpj}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(empresa)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => setDeletingCompany(empresa)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">
                    {empresa.endereco.logradouro}, {empresa.endereco.numero}
                    {empresa.endereco.complemento && ` - ${empresa.endereco.complemento}`}<br />
                    {empresa.endereco.cidade} - {empresa.endereco.estado}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{empresa.contatoResponsavel.telefone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                <Badge className={cn('status-badge', empresa.tipo === 'matriz' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground')}>
                  {empresa.tipo === 'matriz' ? 'Matriz' : 'Filial'}
                </Badge>
                <Badge className={cn('status-badge', empresa.status === 'ativo' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')}>
                  {empresa.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deletingCompany} onOpenChange={(open) => !open && setDeletingCompany(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Empresa?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a empresa <strong>{deletingCompany?.nomeFantasia}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingCompany && deleteMutation.mutate(deletingCompany.id)}
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
