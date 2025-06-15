
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

const Auth = () => {
  const navigate = useNavigate();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [redirected, setRedirected] = useState(false);

  // Redireciona imediatamente se já estiver autenticado ao montar a tela
  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsCheckingSession(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.info("Auth page: Verificando sessão na montagem.", session);
      if (mounted && session && !redirected) {
        setRedirected(true);
        console.info("Auth page: Sessão encontrada, redirecionando agora (/).");
        navigate("/", { replace: true });
      }
      setIsCheckingSession(false);
    })();

    // Listener para capturar login feito em outra aba, etc
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.info("Auth page: Evento de autenticação: ", event, session);
      if (session && mounted && !redirected) {
        setRedirected(true);
        console.info("Auth page: Sessão encontrada no evento, redirecionando agora (/).");
        navigate("/", { replace: true });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, redirected]);

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-2 text-gray-800">
          <span className="animate-spin inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mb-2" />
          Checando autenticação...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Lava Car</CardTitle>
          <CardDescription>
            Entre na sua conta ou crie uma nova
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

