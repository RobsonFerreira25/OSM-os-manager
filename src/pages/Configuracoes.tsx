import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Building2, Users, Shield, Bell, Database } from 'lucide-react';

export default function Configuracoes() {
  return (
    <MainLayout title="Configurações" subtitle="Gerencie as configurações do sistema">
      <Tabs defaultValue="empresa" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="empresa" className="gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="cargos" className="gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Cargos</span>
          </TabsTrigger>
          <TabsTrigger value="permissoes" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Permissões</span>
          </TabsTrigger>
          <TabsTrigger value="sistema" className="gap-2">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Sistema</span>
          </TabsTrigger>
        </TabsList>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TabsContent value="empresa" className="space-y-6">
            <div className="form-section">
              <h3 className="form-section-title">Dados da Empresa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
                  <Input id="nomeEmpresa" defaultValue="OS Manager - Manutenção Predial" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpjEmpresa">CNPJ</Label>
                  <Input id="cnpjEmpresa" defaultValue="00.000.000/0001-00" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="enderecoEmpresa">Endereço</Label>
                  <Input
                    id="enderecoEmpresa"
                    defaultValue="Av. Principal, 1000 - Centro - São Paulo/SP"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button>Salvar Alterações</Button>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Logo da Empresa</h3>
              <p className="text-sm text-muted-foreground mb-4">
                A logo será exibida nos relatórios e documentos gerados pelo sistema.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  <Building2 className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <Button variant="outline">Carregar Imagem</Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG ou SVG. Máx. 2MB
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cargos" className="space-y-6">
            <div className="form-section">
              <h3 className="form-section-title">Gestão de Cargos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Defina os cargos disponíveis no sistema e suas permissões.
              </p>
              <div className="space-y-4">
                {['Gerente', 'Líder', 'Oficial', 'Técnico', 'Auxiliar'].map((cargo) => (
                  <div
                    key={cargo}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{cargo}</p>
                      <p className="text-sm text-muted-foreground">
                        Cargo de nível{' '}
                        {cargo === 'Gerente'
                          ? 'gerencial'
                          : cargo === 'Líder'
                          ? 'supervisão'
                          : 'operacional'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <Button>Adicionar Cargo</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="permissoes" className="space-y-6">
            <div className="form-section">
              <h3 className="form-section-title">Permissões por Cargo</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure as permissões de acesso para cada cargo.
              </p>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Ordens de Serviço</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Visualizar OS', desc: 'Permite visualizar ordens de serviço' },
                      { label: 'Criar OS', desc: 'Permite abrir novas ordens de serviço' },
                      { label: 'Editar OS', desc: 'Permite editar ordens existentes' },
                      { label: 'Fechar OS', desc: 'Permite fechar/concluir ordens' },
                      { label: 'Cancelar OS', desc: 'Permite cancelar ordens de serviço' },
                    ].map((perm) => (
                      <div
                        key={perm.label}
                        className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">{perm.label}</p>
                          <p className="text-xs text-muted-foreground">{perm.desc}</p>
                        </div>
                        <Switch />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sistema" className="space-y-6">
            <div className="form-section">
              <h3 className="form-section-title">Configurações do Sistema</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificações por E-mail</p>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações sobre novas OS e atualizações
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Numeração Automática de OS</p>
                    <p className="text-sm text-muted-foreground">
                      Gerar número sequencial automaticamente
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Modo Escuro</p>
                    <p className="text-sm text-muted-foreground">
                      Ativar tema escuro na interface
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Backup de Dados</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Faça backup dos dados do sistema regularmente.
              </p>
              <div className="flex gap-3">
                <Button variant="outline">Exportar Dados</Button>
                <Button variant="outline">Importar Dados</Button>
              </div>
            </div>
          </TabsContent>
        </motion.div>
      </Tabs>
    </MainLayout>
  );
}
