import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, KeyRound, Mail, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Get requested path or default to home
    const from = location.state?.from?.pathname || '/';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error('Erro ao entrar', {
                    description: error.message === 'Invalid login credentials'
                        ? 'Email ou senha incorretos.'
                        : error.message,
                });
                return;
            }

            toast.success('Login realizado com sucesso!');
            navigate(from, { replace: true });
        } catch (error) {
            toast.error('Ocorreu um erro inesperado.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <KeyRound className="text-primary-foreground w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">ServiceHub</span>
                    </div>
                </div>

                <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/80">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Boas-vindas</CardTitle>
                        <CardDescription className="text-center">
                            Entre com suas credenciais para acessar o sistema
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">E-mail</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="exemplo@bexp.com.br"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Senha</Label>
                                    <Button variant="link" className="px-0 font-normal text-xs" type="button">
                                        Esqueceu a senha?
                                    </Button>
                                </div>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full h-11 gap-2 text-base font-semibold"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        Entrar no Sistema
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Ainda não tem acesso? Contate o administrador do sistema.
                </p>
            </motion.div>
        </div>
    );
}
