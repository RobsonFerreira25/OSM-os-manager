import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EspecialidadeLabels, StatusOSLabels } from "@/types";

interface ServiceOrderPrintProps {
    os: any;
}

export function ServiceOrderPrint({ os }: ServiceOrderPrintProps) {
    const dataAbertura = os.data_abertura || os.dataAbertura;
    const dataConclusao = os.data_real_conclusao || os.dataRealConclusao;
    const empresa = os.empresa || {};
    const funcionarios = os.funcionarios?.map((f: any) => f.funcionario || f) || [];
    const tipoServico = os.tipo_servico || os.tipoServico;

    return (
        <div id="print-area" className="hidden print:block p-4 bg-white text-black font-sans text-[10pt] leading-tight">
            <div className="border-2 border-black p-2 mb-4">
                {/* Header */}
                <div className="flex border-b-2 border-black pb-2 items-center">
                    <div className="w-1/4 flex items-center">
                        <span className="text-2xl font-bold italic">bracta</span>
                    </div>
                    <div className="w-2/4 text-center">
                        <h1 className="text-xl font-bold uppercase">Ordem de Serviço</h1>
                    </div>
                    <div className="w-1/4 text-right border-l-2 border-black pl-2">
                        <div className="text-[8pt] uppercase">Nº Formulário</div>
                        <div className="font-bold text-lg">{os.numero}</div>
                    </div>
                </div>

                {/* Subheader Address */}
                <div className="bg-gray-200 text-center py-1 border-b-2 border-black text-[7pt] font-semibold">
                    bracta - Av. Paulista, 568 - 1º andar - Bela Vista - São Paulo / SP - CEP: 01310-000  C.N.P.J. 03.525.119/0001-76
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-4 border-b-2 border-black">
                    <div className="border-r-2 border-black p-1">
                        <div className="text-[7pt] uppercase text-gray-600">Nº Chamado</div>
                        <div className="h-4">{os.numero}</div>
                    </div>
                    <div className="col-span-1 border-r-2 border-black p-1">
                        <div className="text-[7pt] uppercase text-gray-600">Cliente</div>
                        <div className="h-4 font-bold">{empresa.nome_fantasia || empresa.nome}</div>
                    </div>
                    <div className="border-r-2 border-black p-1">
                        <div className="text-[7pt] uppercase text-gray-600">Cidade</div>
                        <div className="h-4">{empresa.endereco?.cidade}</div>
                    </div>
                    <div className="p-1">
                        <div className="text-[7pt] uppercase text-gray-600">Estado</div>
                        <div className="h-4">{empresa.endereco?.estado || empresa.uf}</div>
                    </div>
                </div>

                <div className="grid grid-cols-4 border-b-2 border-black">
                    <div className="col-span-2 border-r-2 border-black p-1">
                        <div className="text-[7pt] uppercase text-gray-600">Endereço</div>
                        <div className="h-4">
                            {empresa.endereco ? `${empresa.endereco.logradouro}, ${empresa.endereco.numero}${empresa.endereco.complemento ? ` - ${empresa.endereco.complemento}` : ''} - ${empresa.endereco.bairro}` : ''}
                        </div>
                    </div>
                    <div className="border-r-2 border-black p-1">
                        <div className="text-[7pt] uppercase text-gray-600">Contato</div>
                        <div className="h-4">{empresa.contato_responsavel?.nome}</div>
                    </div>
                    <div className="p-1">
                        <div className="text-[7pt] uppercase text-gray-600">Telefone</div>
                        <div className="h-4">{empresa.contato_responsavel?.telefone}</div>
                    </div>
                </div>

                {/* Attendance Times */}
                <div className="grid grid-cols-2 border-b-2 border-black">
                    <div className="grid grid-cols-3 border-r-2 border-black divide-x-2 divide-black">
                        <div className="bg-gray-200 flex items-center justify-center text-[8pt] font-bold text-center px-1">
                            Início de Atendimento
                        </div>
                        <div className="p-1">
                            <div className="text-[6pt] text-gray-600">Data - dd/mm/aa</div>
                            <div className="text-sm">{dataAbertura ? format(new Date(dataAbertura), "dd/MM/yy") : ""}</div>
                        </div>
                        <div className="p-1">
                            <div className="text-[6pt] text-gray-600">Hora - hh:mm</div>
                            <div className="text-sm">{dataAbertura ? format(new Date(dataAbertura), "HH:mm") : ""}</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 divide-x-2 divide-black">
                        <div className="bg-gray-200 flex items-center justify-center text-[8pt] font-bold text-center px-1">
                            Fim de Atendimento
                        </div>
                        <div className="p-1">
                            <div className="text-[6pt] text-gray-600">Data - dd/mm/aa</div>
                            <div className="text-sm">{dataConclusao ? format(new Date(dataConclusao), "dd/MM/yy") : ""}</div>
                        </div>
                        <div className="p-1">
                            <div className="text-[6pt] text-gray-600">Hora - hh:mm</div>
                            <div className="text-sm">{dataConclusao ? format(new Date(dataConclusao), "HH:mm") : ""}</div>
                        </div>
                    </div>
                </div>

                {/* Lunch / Displacement */}
                <div className="grid grid-cols-2 border-b-2 border-black">
                    <div className="grid grid-cols-3 border-r-2 border-black divide-x-2 divide-black">
                        <div className="bg-gray-200 flex items-center justify-center text-[8pt] font-bold text-center px-1">
                            Almoço
                        </div>
                        <div className="p-1">
                            <div className="text-[6pt] text-gray-600">Saída - hh:mm</div>
                            <div className="h-3 text-sm"></div>
                        </div>
                        <div className="p-1">
                            <div className="text-[6pt] text-gray-600">Retorno - hh:mm</div>
                            <div className="h-3 text-sm"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x-2 divide-black">
                        <div className="bg-gray-200 flex items-center justify-center text-[8pt] font-bold text-center px-1">
                            Deslocamento
                        </div>
                        <div className="p-1">
                            <div className="text-[6pt] text-gray-600">Tempo gasto até o cliente - hh:mm</div>
                            <div className="h-3 text-sm"></div>
                        </div>
                    </div>
                </div>

                {/* Type of Attendance / Equipment */}
                <div className="grid grid-cols-2 border-b-2 border-black min-h-[60px]">
                    <div className="grid grid-cols-4 border-r-2 border-black">
                        <div className="bg-gray-200 flex items-center justify-center text-[8pt] font-bold text-center px-1 border-r-2 border-black">
                            Tipo de Atendimento
                        </div>
                        <div className="col-span-3 p-1 text-[7pt] grid grid-cols-2 gap-x-2">
                            <div className="flex items-center gap-1"><div className="w-3 h-3 border border-black"></div> Contratual</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 border border-black"></div> Extra-contratual</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 border border-black"></div> Projeto</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 border border-black"></div> Sem custo</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 border border-black"></div> Outros _________________</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4">
                        <div className="bg-gray-200 flex items-center justify-center text-[8pt] font-bold text-center px-1 border-r-2 border-black">
                            Tipo de Equipamento
                        </div>
                        <div className="col-span-3 p-1 text-[7pt] grid grid-cols-2 gap-x-2">
                            <div className="flex items-center gap-1"><div className="w-3 h-3 border border-black"></div> Desktop</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 border border-black"></div> Monitor</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 border border-black"></div> Notebook</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 border border-black"></div> Servidor</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 border border-black"></div> Impressora</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 border border-black"></div> Outros _________________</div>
                        </div>
                    </div>
                </div>

                {/* Sections */}
                <div className="border-b-2 border-black grayscale text-center bg-gray-200 font-bold uppercase py-0.5 text-[8pt]">
                    Defeito informado no chamado
                </div>
                <div className="min-h-[60px] p-2 text-sm border-b-2 border-black">
                    {os.descricao}
                </div>

                <div className="border-b-2 border-black grayscale text-center bg-gray-200 font-bold uppercase py-0.5 text-[8pt]">
                    Defeito constatado
                </div>
                <div className="min-h-[60px] p-2 text-sm border-b-2 border-black">
                    {/* Placeholder for konstanted defect */}
                </div>

                <div className="border-b-2 border-black grayscale text-center bg-gray-200 font-bold uppercase py-0.5 text-[8pt]">
                    Resolução
                </div>
                <div className="min-h-[80px] p-2 text-sm border-b-2 border-black whitespace-pre-wrap">
                    {os.observacoes_fechamento || os.observacoesFechamento}
                </div>

                <div className="border-b-2 border-black grayscale text-center bg-gray-200 font-bold uppercase py-0.5 text-[8pt]">
                    Status do Chamado
                </div>
                <div className="flex justify-around p-2 border-b-2 border-black text-[7pt]">
                    <div className="flex items-center gap-1"><div className={`w-3 h-3 border border-black ${os.status === 'concluida' ? 'bg-black' : ''}`}></div> Concluído</div>
                    <div className="flex items-center gap-1"><div className={`w-3 h-3 border border-black ${os.status === 'pendente' ? 'bg-black' : ''}`}></div> Pendente bracta</div>
                    <div className="flex items-center gap-1"><div className={`w-3 h-3 border border-black`}></div> Pendente cliente</div>
                    <div className="flex items-center gap-1"><div className={`w-3 h-3 border border-black ${os.status === 'reagendada' ? 'bg-black' : ''}`}></div> Reagendado</div>
                    <div className="flex items-center gap-1"><div className={`w-3 h-3 border border-black ${os.status === 'cancelada' ? 'bg-black' : ''}`}></div> Cancelado</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 border border-black"></div> Outros</div>
                </div>

                <div className="border-b-2 border-black grayscale text-center bg-gray-200 font-bold uppercase py-0.5 text-[8pt]">
                    Observação
                </div>
                <div className="min-h-[60px] p-2 text-sm border-b-2 border-black">
                    {os.observacoes}
                </div>

                {/* Acceptance */}
                <div className="border-b-2 border-black grayscale text-center bg-gray-200 font-bold uppercase py-0.5 text-[8pt]">
                    Aceite do Atendimento
                </div>
                <div className="grid grid-cols-2 divide-x-2 divide-black h-32">
                    <div className="flex flex-col justify-end p-4 text-center">
                        <div className="border-t border-black pt-1 uppercase text-[7pt]">Assinatura e Carimbo</div>
                        <div className="text-left mt-2 text-[7pt]">Nome: _________________________________________</div>
                        <div className="text-left mt-1 text-[7pt]">Identificação: _________________________________</div>
                    </div>
                    <div className="flex flex-col justify-end p-4 text-center">
                        <div className="border-t border-black pt-1 uppercase text-[7pt]">Assinatura e Carimbo</div>
                        <div className="text-left mt-2 text-[7pt]">Nome: {funcionarios.map((f: any) => f.nome).join(", ")}</div>
                        <div className="text-left mt-1 text-[7pt]">Identificação: _________________________________</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 divide-x-2 divide-black text-center font-bold text-[8pt]">
                    <div className="bg-gray-100 py-1 uppercase border-t-2 border-black">Cliente</div>
                    <div className="bg-gray-100 py-1 uppercase border-t-2 border-black">Analista</div>
                </div>
            </div>

            <div className="text-right text-[6pt] text-gray-500 mt-1">
                Gerado por OSM system em {format(new Date(), "dd/MM/yyyy HH:mm")}
            </div>
        </div>
    );
}
