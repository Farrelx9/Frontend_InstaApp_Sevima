import { useAuth } from "../contexts/AuthContext";
import Forbidden from "./Forbidden";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <Forbidden />;
  }

  return children;
}
