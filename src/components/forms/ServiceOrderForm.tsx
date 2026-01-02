import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { EspecialidadeLabels, PrioridadeLabels, StatusOSLabels } from "@/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    empresaId: z.string().min(1, "Selecione uma empresa"),
    tipoServico: z.string().min(1, "Selecione o tipo de serviço"),
    prioridade: z.string().min(1, "Selecione a prioridade"),
    status: z.string().optional(),
    dataPrevista: z.string().optional(),
    funcionariosIds: z.array(z.string()).min(1, "Selecione pelo menos um funcionário"),
    descricao: z.string().min(5, "Descrição muito curta"),
    observacoes: z.string().optional(),
    observacoesFechamento: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ServiceOrderFormProps {
    initialData?: any;
    onSubmit?: (data: any) => void;
    onCancel: () => void;
}

export function ServiceOrderForm({ initialData, onSubmit, onCancel }: ServiceOrderFormProps) {
    const [loading, setLoading] = useState(false);
    const [empresas, setEmpresas] = useState<any[]>([]);
    const [funcionarios, setFuncionarios] = useState<any[]>([]);
    const [fetchingData, setFetchingData] = useState(true);

    const isEditing = !!initialData;

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
        watch
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            funcionariosIds: initialData?.funcionarios?.map((f: any) => f.id) || [],
            status: initialData?.status || 'aberta',
        }
    });

    // Watch status to show/hide closing remarks if needed
    const currentStatus = watch("status");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empresasRes, funcionariosRes] = await Promise.all([
                    supabase.from('empresas').select('id, nome_fantasia').eq('status', 'ativo'),
                    supabase.from('funcionarios').select('id, nome, matricula').eq('status', 'ativo'),
                ]);

                if (empresasRes.error) throw empresasRes.error;
                if (funcionariosRes.error) throw funcionariosRes.error;

                setEmpresas(empresasRes.data || []);
                setFuncionarios(funcionariosRes.data || []);

                if (initialData) {
                    reset({
                        empresaId: initialData.empresa_id || initialData.empresaId,
                        tipoServico: initialData.tipo_servico || initialData.tipoServico,
                        prioridade: initialData.prioridade,
                        status: initialData.status,
                        dataPrevista: (initialData.data_prevista_conclusao || initialData.dataPrevistaConclusao)?.split('T')[0],
                        funcionariosIds: initialData.funcionarios?.map((f: any) => f.id) || [],
                        descricao: initialData.descricao,
                        observacoes: initialData.observacoes,
                        observacoesFechamento: initialData.observacoes_fechamento || initialData.observacoesFechamento,
                    });
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                toast.error("Erro ao carregar dados para o formulário");
            } finally {
                setFetchingData(false);
            }
        };

        fetchData();
    }, [initialData, reset]);

    const handleFormSubmit = async (values: FormValues) => {
        setLoading(true);
        try {
            let osData;

            if (isEditing) {
                // UPDATE OS
                const { data, error } = await supabase
                    .from('ordens_servico')
                    .update({
                        empresa_id: values.empresaId,
                        tipo_servico: values.tipoServico,
                        prioridade: values.prioridade,
                        status: values.status,
                        descricao: values.descricao,
                        data_prevista_conclusao: values.dataPrevista ? new Date(values.dataPrevista).toISOString() : null,
                        observacoes: values.observacoes,
                        observacoes_fechamento: values.observacoesFechamento,
                        data_real_conclusao: values.status === 'concluida' ? new Date().toISOString() : null,
                    })
                    .eq('id', initialData.id)
                    .select()
                    .single();

                if (error) throw error;
                osData = data;

                // Update Funcionarios links (Delete all and re-insert for simplicity)
                await supabase
                    .from('ordens_servico_funcionarios')
                    .delete()
                    .eq('os_id', initialData.id);

            } else {
                // CREATE NEW OS
                const numero = `OS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

                const { data, error } = await supabase
                    .from('ordens_servico')
                    .insert({
                        numero,
                        empresa_id: values.empresaId,
                        tipo_servico: values.tipoServico,
                        prioridade: values.prioridade,
                        status: 'aberta', // Default for new OS
                        descricao: values.descricao,
                        data_prevista_conclusao: values.dataPrevista ? new Date(values.dataPrevista).toISOString() : null,
                        observacoes: values.observacoes,
                    })
                    .select()
                    .single();

                if (error) throw error;
                osData = data;
            }

            // Insert Funcionarios links
            if (values.funcionariosIds.length > 0) {
                const funcLinks = values.funcionariosIds.map(fid => ({
                    os_id: osData.id,
                    funcionario_id: fid
                }));
                const { error: funcError } = await supabase
                    .from('ordens_servico_funcionarios')
                    .insert(funcLinks);

                if (funcError) throw funcError;
            }

            toast.success(isEditing ? `OS ${osData.numero} atualizada!` : `OS ${osData.numero} criada!`);
            if (onSubmit) onSubmit(osData);
            onCancel();
        } catch (error: any) {
            console.error("Erro ao salvar OS:", error);
            toast.error(error.message || "Erro ao salvar ordem de serviço");
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <form className="space-y-6 mt-4" onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="empresa">Empresa *</Label>
                    <Select
                        value={watch("empresaId")}
                        onValueChange={(val) => setValue("empresaId", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione a empresa" />
                        </SelectTrigger>
                        <SelectContent>
                            {empresas.map((empresa) => (
                                <SelectItem key={empresa.id} value={empresa.id}>
                                    {empresa.nome_fantasia}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.empresaId && <p className="text-xs text-destructive">{errors.empresaId.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tipoServico">Tipo de Serviço *</Label>
                    <Select
                        value={watch("tipoServico")}
                        onValueChange={(val) => setValue("tipoServico", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(EspecialidadeLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.tipoServico && <p className="text-xs text-destructive">{errors.tipoServico.message}</p>}
                </div>

                {isEditing && (
                    <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select
                            value={watch("status")}
                            onValueChange={(val) => setValue("status", val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Alterar status" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(StatusOSLabels).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="prioridade">Prioridade *</Label>
                    <Select
                        value={watch("prioridade")}
                        onValueChange={(val) => setValue("prioridade", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(PrioridadeLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="dataPrevista">Data Prevista de Conclusão</Label>
                    <Input id="dataPrevista" type="date" {...register("dataPrevista")} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="funcionarios">Funcionários Designados *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-4 border rounded-md bg-muted/20">
                    {funcionarios.map((funcionario) => (
                        <div key={funcionario.id} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id={`func-${funcionario.id}`}
                                value={funcionario.id}
                                checked={watch("funcionariosIds")?.includes(funcionario.id)}
                                onChange={(e) => {
                                    const current = watch("funcionariosIds") || [];
                                    if (e.target.checked) {
                                        setValue("funcionariosIds", [...current, funcionario.id]);
                                    } else {
                                        setValue("funcionariosIds", current.filter(id => id !== funcionario.id));
                                    }
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor={`func-${funcionario.id}`} className="text-sm cursor-pointer truncate">
                                {funcionario.nome}
                            </Label>
                        </div>
                    ))}
                </div>
                {errors.funcionariosIds && <p className="text-xs text-destructive">{errors.funcionariosIds.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="descricao">Descrição Detalhada *</Label>
                <Textarea
                    id="descricao"
                    placeholder="Descreva o serviço a ser realizado..."
                    rows={4}
                    {...register("descricao")}
                />
                {errors.descricao && <p className="text-xs text-destructive">{errors.descricao.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="observacoes">Observações Internas (Privado)</Label>
                <Textarea
                    id="observacoes"
                    placeholder="Observações de backoffice..."
                    rows={2}
                    {...register("observacoes")}
                />
            </div>

            {(isEditing || currentStatus === 'concluida') && (
                <div className="space-y-2">
                    <Label htmlFor="observacoesFechamento">Observações de Fechamento (Cliente)</Label>
                    <Textarea
                        id="observacoesFechamento"
                        placeholder="Caso a OS esteja sendo finalizada, descreva o que foi feito..."
                        rows={2}
                        {...register("observacoesFechamento")}
                    />
                </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isEditing ? "Salvar Alterações" : "Abrir OS"}
                </Button>
            </div>
        </form>
    );
}
