// Tipos base do sistema de Gestão de Ordens de Serviço

export type StatusOS = 'aberta' | 'em_andamento' | 'pausada' | 'concluida' | 'cancelada';

export type Especialidade = 'eletrica' | 'hidraulica' | 'servicos_gerais' | 'pintura' | 'alvenaria' | 'refrigeracao' | 'outra';

export type CargoNivel = 'lider' | 'oficial' | 'auxiliar' | 'tecnico' | 'gerente';

export interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
  matricula: string;
  cargo: CargoNivel;
  especialidades: Especialidade[];
  status: 'ativo' | 'inativo';
  email?: string;
  telefone?: string;
  dataAdmissao: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cargo {
  id: string;
  nome: string;
  nivel: CargoNivel;
  permissoes: Permissao[];
  descricao?: string;
}

export interface Permissao {
  id: string;
  nome: string;
  codigo: string;
  descricao: string;
}

export interface Empresa {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  tipo: 'matriz' | 'filial';
  matrizId?: string;
  endereco: Endereco;
  contatoResponsavel: Contato;
  status: 'ativo' | 'inativo';
  createdAt: string;
  updatedAt: string;
}

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Contato {
  nome: string;
  email: string;
  telefone: string;
  cargo?: string;
}

export interface OrdemServico {
  id: string;
  numero: string;
  empresaId: string;
  empresa?: Empresa;
  filialId?: string;
  filial?: Empresa;
  tipoServico: Especialidade;
  descricao: string;
  funcionariosIds: string[];
  funcionarios?: Funcionario[];
  status: StatusOS;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  dataAbertura: string;
  dataPrevistaConclusao?: string;
  dataRealConclusao?: string;
  observacoes?: string;
  observacoesFechamento?: string;
  historico: HistoricoOS[];
  createdAt: string;
  updatedAt: string;
}

export interface HistoricoOS {
  id: string;
  osId: string;
  statusAnterior?: StatusOS;
  statusNovo: StatusOS;
  observacao?: string;
  usuarioId: string;
  dataAlteracao: string;
}

// Labels para exibição
export const StatusOSLabels: Record<StatusOS, string> = {
  aberta: 'Aberta',
  em_andamento: 'Em Andamento',
  pausada: 'Pausada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

export const EspecialidadeLabels: Record<Especialidade, string> = {
  eletrica: 'Elétrica',
  hidraulica: 'Hidráulica',
  servicos_gerais: 'Serviços Gerais',
  pintura: 'Pintura',
  alvenaria: 'Alvenaria',
  refrigeracao: 'Refrigeração',
  outra: 'Outra',
};

export const CargoNivelLabels: Record<CargoNivel, string> = {
  lider: 'Líder',
  oficial: 'Oficial',
  auxiliar: 'Auxiliar',
  tecnico: 'Técnico',
  gerente: 'Gerente',
};

export const PrioridadeLabels: Record<string, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  urgente: 'Urgente',
};
