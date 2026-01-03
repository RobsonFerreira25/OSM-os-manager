import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ServiceOrderPrintProps {
    os: any;
}

export function ServiceOrderPrint({ os }: ServiceOrderPrintProps) {
    const dataAbertura = os.data_abertura || os.dataAbertura;
    const dataPrevista = os.data_prevista_conclusao || os.dataPrevistaConclusao;
    const empresa = os.empresa || {};
    const solicitante = empresa.contato_responsavel?.nome || "Não informado";

    return (
        <div id="print-area" className="hidden print:block p-8 bg-white text-black font-sans text-[10pt] leading-snug">
            <div className="border-2 border-black">
                {/* Header Title */}
                <div className="border-b-2 border-black py-4 text-center relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
                        <span className="text-2xl font-black tracking-tighter italic">BEXP</span>
                    </div>
                    <h1 className="text-2xl font-bold uppercase underline">Ordem de Serviço</h1>
                </div>

                {/* Date and Requester */}
                <div className="grid grid-cols-2 divide-x-2 divide-black border-b-2 border-black">
                    <div className="p-3">
                        <span className="font-bold">Data:</span> {dataAbertura ? format(new Date(dataAbertura), "dd/MM/yyyy") : ""}
                    </div>
                    <div className="p-3">
                        <span className="font-bold">Solicitante:</span> {solicitante}
                    </div>
                </div>

                {/* Service Description Title */}
                <div className="bg-gray-200 border-b-2 border-black py-1.5 text-center font-bold uppercase text-[11pt]">
                    Descrição do serviço
                </div>

                {/* Service Description Content */}
                <div className="min-h-[250px] p-4 text-[10pt] border-b-2 border-black whitespace-pre-wrap">
                    {os.descricao}
                </div>

                {/* Security Communication */}
                <div className="p-3 border-b-2 border-black flex items-center gap-8">
                    <span className="font-bold">A área da segurança foi comunicada?</span>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 border border-black rounded-full"></div>
                            <span>Sim</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 border border-black rounded-full"></div>
                            <span>N/A</span>
                        </div>
                    </div>
                </div>

                {/* Programming and Authorization */}
                <div className="grid grid-cols-2 divide-x-2 divide-black border-b-2 border-black">
                    <div className="p-3">
                        <span className="font-bold">Programado para:</span> &nbsp;&nbsp;&nbsp; {dataPrevista ? format(new Date(dataPrevista), "dd / MM / yyyy") : "__ / __ / ____"}
                    </div>
                    <div className="p-3">
                        <span className="font-bold">Autorizado por:</span>
                    </div>
                </div>

                {/* Post-Service Section Header */}
                <div className="bg-gray-200 border-b-2 border-black py-3 px-4 text-center font-bold uppercase text-[9pt] leading-tight">
                    APÓS O SERVIÇO, FAZER A CONFERÊNCIA E PREENCHER TODOS<br />
                    OS CAMPOS ABAIXO PARA LIBERAÇÃO DE PAGAMENTO
                </div>

                {/* Post-Service Checklist */}
                <div className="divide-y divide-black border-b-2 border-black">
                    <div className="p-3 flex justify-between items-center">
                        <span>Serviço finalizado?</span>
                        <div className="flex gap-6 pr-4">
                            <div className="flex items-center gap-2"><div className="w-4 h-4 border border-black rounded-full"></div> ( ) Sim</div>
                            <div className="flex items-center gap-2"><div className="w-4 h-4 border border-black rounded-full"></div> ( ) Não</div>
                        </div>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                        <div className="max-w-[70%]">
                            Área limpa, sem resíduos? Prestador de serviço retirou os resíduos de sua responsabilidade?
                        </div>
                        <div className="flex gap-6 pr-4">
                            <div className="flex items-center gap-2"><div className="w-4 h-4 border border-black rounded-full"></div> ( ) Sim</div>
                            <div className="flex items-center gap-2"><div className="w-4 h-4 border border-black rounded-full"></div> ( ) Não</div>
                        </div>
                    </div>
                    <div className="p-3 space-y-3">
                        <div className="flex justify-between items-center">
                            <span>Alguma pendência?</span>
                            <div className="flex gap-6 pr-4">
                                <div className="flex items-center gap-2"><div className="w-4 h-4 border border-black rounded-full"></div> ( ) Sim</div>
                                <div className="flex items-center gap-2"><div className="w-4 h-4 border border-black rounded-full"></div> ( ) Não</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-end gap-2 text-sm">
                                Qual? ____________________________________________________________________
                            </div>
                            <div className="border-b border-gray-400 h-4"></div>
                            <div className="border-b border-gray-400 h-4"></div>
                        </div>
                    </div>
                </div>

                {/* Footer Credits */}
                <div className="grid grid-cols-2 divide-x-2 divide-black">
                    <div className="p-3 h-16 flex flex-col justify-between">
                        <div className="text-[9pt]">Quem conferiu? Nome: ___________________________________</div>
                        <div className="border-t border-black w-3/4 self-center mt-4"></div>
                    </div>
                    <div className="p-3 h-16 flex flex-col justify-between">
                        <div className="text-[9pt]">Visto:</div>
                        <div className="border-t border-black w-3/4 self-center mt-4"></div>
                    </div>
                </div>
            </div>

            <div className="text-right text-[7pt] text-gray-500 mt-2 font-mono italic">
                BEXP OSM SYSTEM - {os.numero} - {format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}
            </div>
        </div>
    );
}
