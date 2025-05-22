
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-6">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-gray-800 mb-6">Página não encontrada</p>
        <p className="text-gray-600 mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Button asChild>
          <Link to="/">
            Voltar para o Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
