import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { EspecialidadeLabels, StatusOSLabels, StatusOS } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { User, Loader2, CheckCircle2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ServiceOrderPrint } from "./ServiceOrderPrint";

interface ServiceOrderDetailsProps {
    os: any;
    onUpdate?: () => void;
}

export function ServiceOrderDetails({ os, onUpdate }: ServiceOrderDetailsProps) {
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState<StatusOS>(os.status);
    const [loading, setLoading] = useState(false);

    const status = os.status;
    const prioridade = os.prioridade;
    const empresaNome = os.empresa?.nome_fantasia || "Empresa não informada";
    const tipoServico = os.tipo_servico || os.tipoServico;
    const descricao = os.descricao;
    const dataAbertura = os.data_abertura || os.dataAbertura;
    const dataPrevista = os.data_prevista_conclusao || os.dataPrevistaConclusao;
    const observacoes = os.observacoes;
    const observacoesFechamento = os.observacoes_os || os.observacoes_fechamento || os.observacoesFechamento;

    const funcionarios = os.funcionarios?.map((f: any) => f.funcionario || f) || [];

    const handleUpdateStatus = async () => {
        if (newStatus === status) {
            setIsUpdatingStatus(false);
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('ordens_servico')
                .update({
                    status: newStatus,
                    data_real_conclusao: newStatus === 'concluida' ? new Date().toISOString() : null
                })
                .eq('id', os.id);

            if (error) throw error;

            toast.success(`Status da OS ${os.numero} atualizado para ${StatusOSLabels[newStatus]}`);
            setIsUpdatingStatus(false);
            if (onUpdate) onUpdate();
        } catch (error: any) {
            console.error("Erro ao atualizar status:", error);
            toast.error("Erro ao atualizar status da OS");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
                {isUpdatingStatus ? (
                    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg border animate-in fade-in slide-in-from-top-1">
                        <Select value={newStatus} onValueChange={(val) => setNewStatus(val as StatusOS)}>
                            <SelectTrigger className="w-[180px] h-9">
                                <SelectValue placeholder="Novo Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(StatusOSLabels).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button size="sm" onClick={handleUpdateStatus} disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                            Salvar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsUpdatingStatus(false)} disabled={loading}>
                            Cancelar
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-2 items-center">
                        <StatusBadge type="status" value={status} />
                        <StatusBadge type="prioridade" value={prioridade} />
                        <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 h-8 text-[10px] uppercase tracking-wider font-bold"
                            onClick={() => setIsUpdatingStatus(true)}
                        >
                            Alterar Status
                        </Button>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Empresa</h4>
                    <p className="font-medium">{empresaNome}</p>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Tipo de Serviço</h4>
                    <p className="font-medium">{EspecialidadeLabels[tipoServico as keyof typeof EspecialidadeLabels] || tipoServico}</p>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Descrição</h4>
                    <p className="text-sm leading-relaxed">{descricao}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Data Abertura</h4>
                        <p className="font-medium">
                            {dataAbertura ? format(new Date(dataAbertura), "dd/MM/yyyy 'às' HH:mm", {
                                locale: ptBR,
                            }) : '-'}
                        </p>
                    </div>
                    {dataPrevista && (
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Previsão</h4>
                            <p className="font-medium">
                                {format(new Date(dataPrevista), "dd/MM/yyyy", {
                                    locale: ptBR,
                                })}
                            </p>
                        </div>
                    )}
                    {(os.data_real_conclusao || os.dataRealConclusao) && (
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Data Conclusão</h4>
                            <p className="font-medium">
                                {format(new Date(os.data_real_conclusao || os.dataRealConclusao), "dd/MM/yyyy 'às' HH:mm", {
                                    locale: ptBR,
                                })}
                            </p>
                        </div>
                    )}
                </div>

                <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Funcionários Designados
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {funcionarios.length > 0 ? (
                            funcionarios.map((func: any, index: number) => (
                                <div key={index} className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-md border border-transparent hover:border-border transition-colors">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">
                                        {func.nome}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground italic">Nenhum funcionário designado</p>
                        )}
                    </div>
                </div>

                {observacoes && (
                    <div className="bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900/50">
                        <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest mb-1">Observações Internas</h4>
                        <p className="text-sm">{observacoes}</p>
                    </div>
                )}

                {observacoesFechamento && (
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                        <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-1">
                            Resumo do Fechamento
                        </h4>
                        <p className="text-sm">{observacoesFechamento}</p>
                    </div>
                )}
            </div>

            <div className="flex gap-2 pt-6 mt-6 border-t">
                {status !== 'concluida' && status !== 'cancelada' && (
                    <Button className="flex-1 shadow-lg shadow-primary/20" onClick={() => setIsUpdatingStatus(true)}>
                        Atualizar Status
                    </Button>
                )}
                <Button variant="outline" className="flex-1 hover:bg-muted" onClick={() => window.print()}>
                    Imprimir PDF
                </Button>
            </div>

            <ServiceOrderPrint os={os} />
        </div>
    );
}
