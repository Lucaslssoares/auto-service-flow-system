
/**
 * Componente Error Boundary para capturar erros de renderização
 * Implementa fallback UI quando ocorrem erros não tratados
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error Boundary para capturar e tratar erros de renderização
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log do erro para monitoramento em produção
    console.error('Error Boundary capturou um erro:', error, errorInfo);
    
    // Em produção, enviar para serviço de monitoramento
    if (import.meta.env.PROD) {
      // TODO: Integrar com serviço de logging (ex: Sentry)
      console.error('Erro em produção:', { error, errorInfo });
    }
  }

  /**
   * Recarrega a página para tentar recuperar do erro
   */
  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Renderizar UI customizada de fallback se fornecida
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI padrão de erro
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">Oops! Algo deu errado</CardTitle>
              <CardDescription>
                Ocorreu um erro inesperado na aplicação. Tente recarregar a página.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Button onClick={this.handleReload} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Recarregar Página
              </Button>
              
              {!import.meta.env.PROD && this.state.error && (
                <details className="text-left text-sm text-gray-600 bg-gray-100 p-3 rounded">
                  <summary className="cursor-pointer font-medium">
                    Detalhes do erro (desenvolvimento)
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook para tratamento de erros assíncronos
 */
export const useErrorHandler = () => {
  const handleError = (error: Error, context?: string) => {
    console.error(`Erro ${context ? `em ${context}` : 'capturado'}:`, error);
    
    // Em produção, enviar para serviço de monitoramento
    if (import.meta.env.PROD) {
      // TODO: Integrar com serviço de logging
      console.error('Erro async em produção:', { error, context });
    }
  };

  return { handleError };
};
