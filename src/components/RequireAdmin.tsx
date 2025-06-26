import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner"; // falls du einen Lade-Indikator hast

interface RequireAdminProps {
  children: ReactNode;
}

const RequireAdmin = ({ children }: RequireAdminProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/unauthorized"); // oder "/"
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <LoadingSpinner />; // oder ein Placeholder
  }

  if (user.role !== "admin") {
    return <div className="text-center text-red-500 mt-10">Zugriff verweigert: Admin-Rechte erforderlich.</div>;
  }

  return <>{children}</>;
};

export default RequireAdmin;
