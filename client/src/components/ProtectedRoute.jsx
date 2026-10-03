import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Loader from "./Loader";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loader label="Checking your session" />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}